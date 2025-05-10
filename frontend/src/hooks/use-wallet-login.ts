import { useEffect, useCallback, useState } from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export interface UseWalletAuthOptions {
  redirectPath?: string;
  autoRedirect?: boolean;
  onError?: (error: unknown) => void;
}

export const useWalletLogin = (options: UseWalletAuthOptions = {}) => {
  const { redirectPath = '/app', autoRedirect = true, onError } = options;

  const router = useRouter();
  const { open } = useAppKit();
  const { isConnected, status } = useAppKitAccount();
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const isConnecting = status === 'connecting' || status === 'reconnecting';
  const isDisconnected = status === 'disconnected';

  useEffect(() => {
    if (isConnected && autoRedirect) {
      router.push(redirectPath);
    }
  }, [isConnected, autoRedirect, redirectPath, router]);

  // Reset error when successfully connected
  useEffect(() => {
    if (isConnected) {
      setConnectionError(null);
    }
  }, [isConnected]);

  const connectWallet = useCallback(async () => {
    if (isConnected || isConnecting) {
      return true;
    }

    setConnectionError(null);

    try {
      await open();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      setConnectionError(message);

      if (onError) {
        onError(error);
      } else {
        toast.error(message);
      }

      return false;
    }
  }, [open, isConnected, isConnecting, onError]);

  return {
    isConnected,
    isConnecting,
    isDisconnected,
    status, // Expose the raw status for more granular control
    connectionError,
    connectWallet,
  };
};

export default useWalletLogin;
