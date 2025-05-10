import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { ConnectWalletResponse } from '@/types/api';

export const connectWalletDtoSchema = z.object({
  walletAddress: z.string().min(1, 'Required'),
});

export type ConnectWalletDto = z.infer<typeof connectWalletDtoSchema>;

export const connectWallet = ({ data }: { data: ConnectWalletDto }): Promise<ConnectWalletResponse> => {
  return api.post(`/auth/wallet/connect`, data);
};

type UseConnectWalletOptions = {
  mutationConfig?: MutationConfig<typeof connectWallet>;
};

export const useConnectWallet = ({ mutationConfig }: UseConnectWalletOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: connectWallet,
  });
};
