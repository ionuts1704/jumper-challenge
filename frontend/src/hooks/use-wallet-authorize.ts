import { useState, useCallback, useRef } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import useAuth from '@/context/AuthContext';
import { useChainId } from 'wagmi';
import { useConnectWallet } from '@/features/app/api/connect-wallet';
import { useLoginWallet } from '@/features/app/api/login-wallet';
import { toast } from 'react-toastify';
import { useWalletSign } from '@/hooks/use-wallet-sign';
import { createSiweMessage } from '@/utils/create-siwe-message';

interface UseWalletAuthorizationOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

interface AuthorizationState {
  isAuthorizing: boolean;
  error: string | null;
}

export const useWalletAuthorize = (options: UseWalletAuthorizationOptions = {}) => {
  // Store options in a ref to avoid dependency changes
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [authState, setAuthState] = useState<AuthorizationState>({
    isAuthorizing: false,
    error: null,
  });

  const { address } = useAppKitAccount();
  const { updateSession, isAuthorized, isAuthenticated } = useAuth();
  const chainId = useChainId();
  const { signMessage, isSigning } = useWalletSign();
  const connectWallet = useConnectWallet();
  const loginWallet = useLoginWallet();

  const authorizeWallet = useCallback(async () => {
    if (!isAuthenticated) {
      const errorMsg = 'Wallet not connected';
      setAuthState((prev) => ({ ...prev, error: errorMsg }));

      const { showErrorToast = true, onError } = optionsRef.current;
      if (showErrorToast) toast.error(errorMsg);
      if (onError) {
        onError(new Error(errorMsg));
      }

      return false;
    }

    if (isAuthorized) {
      return true;
    }

    setAuthState({ isAuthorizing: true, error: null });

    try {
      // Step 1: Get nonce from server
      const { nonce } = await connectWallet.mutateAsync({
        data: { walletAddress: address! },
      });

      // Step 2: Create SIWE message and get signature
      const messageToSign = createSiweMessage({ address: address!, chainId, nonce });
      const signature = await signMessage(messageToSign);

      if (!signature) {
        throw new Error('Failed to sign message');
      }

      // Step 3: Authenticate with server
      await loginWallet.mutateAsync({
        data: { signature, message: messageToSign },
      });

      // Step 4: Update local session state
      updateSession();

      // Step 5: Handle success
      const {
        showSuccessToast = true,
        successMessage = 'Account created successfully',
        onSuccess,
      } = optionsRef.current;
      if (showSuccessToast) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (error) {
      console.error('Authorization failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to authorize wallet';

      setAuthState((prev) => ({ ...prev, error: message }));

      const { showErrorToast = true, onError } = optionsRef.current;
      if (showErrorToast) {
        toast.error(message);
      }

      if (onError) {
        onError(error);
      }

      return false;
    } finally {
      setAuthState((prev) => ({ ...prev, isAuthorizing: false }));
    }
  }, [address, chainId, signMessage, connectWallet, loginWallet, updateSession, isAuthenticated, isAuthorized]);

  const isProcessing = authState.isAuthorizing || isSigning || connectWallet.isPending || loginWallet.isPending;

  return {
    isAuthenticated,
    isAuthorized,
    isAuthorizing: isProcessing,
    authorizationError: authState.error,
    authorizeWallet,
  };
};

export default useWalletAuthorize;
