import { useCallback } from 'react';
import { useSignMessage } from 'wagmi';
import { useAppKitAccount } from '@reown/appkit/react';

interface UseWalletSignOptions {
  onError?: (error: unknown) => void;
}

export const useWalletSign = (options: UseWalletSignOptions = {}) => {
  const { onError } = options;
  const { address } = useAppKitAccount();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();

  const signMessage = useCallback(
    async (message: string): Promise<string | null> => {
      try {
        if (!address) {
          throw new Error('Wallet not connected');
        }

        const signature = await signMessageAsync({ message, account: address as any });
        return signature;
      } catch (error: any) {
        console.error('Failed to sign message:', error);

        // Handle specific error cases
        if (error.message?.includes('user rejected') || error.code === 4001) {
          const rejectionError = new Error(
            'Signature request was rejected. Please approve the signature in your wallet.'
          );

          if (onError) {
            onError(rejectionError);
          }

          throw rejectionError;
        }

        if (onError) {
          onError(error);
        }

        return null;
      }
    },
    [signMessageAsync, address, onError]
  );

  return {
    signMessage,
    isSigning,
  };
};

export default useWalletSign;
