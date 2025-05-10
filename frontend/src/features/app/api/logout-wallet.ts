import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { ConnectWalletResponse } from '@/types/api';

export const logoutWallet = (): Promise<void> => {
  return api.post(`/auth/wallet/logout`);
};

export const useLogoutWallet = ({ mutationConfig }: any = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: logoutWallet,
  });
};
