import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import useAuth from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { useLogoutWallet as useLogoutWalletApi } from '@/features/app/api/logout-wallet';
import { useRouter } from 'next/navigation';
import { paths } from '@/config/paths';

interface UseWalletLogoutOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useWalletLogout = (options: UseWalletLogoutOptions = {}) => {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = 'Wallet disconnected successfully',
    onSuccess,
    onError,
  } = options;

  const { disconnectAsync } = useDisconnect();
  const { clearSession, isAuthorized } = useAuth();
  const router = useRouter();

  const logoutWalletMutation = useLogoutWalletApi({
    mutationConfig: {
      onError: () => {
        console.error('Failed to logout from server');
      },
    },
  });

  const logout = useCallback(async () => {
    try {
      await disconnectAsync();

      if (isAuthorized) {
        await logoutWalletMutation.mutateAsync();

        clearSession();
      }

      if (showSuccessToast) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess();
      }

      router.push(paths.auth.login.getHref());

      return true;
    } catch (error) {
      console.error('Failed to logout:', error);

      clearSession();

      if (showErrorToast) {
        const message = error instanceof Error ? error.message : 'Failed to disconnect wallet';
        toast.error(message);
      }

      if (onError) {
        onError(error);
      }

      return false;
    }
  }, [
    disconnectAsync,
    clearSession,
    logoutWalletMutation,
    showSuccessToast,
    showErrorToast,
    successMessage,
    onSuccess,
    onError,
  ]);

  return {
    logout,
    isLoggingOut: logoutWalletMutation.isPending,
  };
};

export default useWalletLogout;
