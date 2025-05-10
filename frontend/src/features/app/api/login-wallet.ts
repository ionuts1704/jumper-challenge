import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { ConnectWalletResponse } from '@/types/api';

export const loginWalletDtoSchema = z.object({
  message: z.string().min(1, 'Required'),
  signature: z.string().min(1, 'Required'),
});

export type LoginWalletDto = z.infer<typeof loginWalletDtoSchema>;

export const loginWallet = ({ data }: { data: LoginWalletDto }): Promise<void> => {
  return api.post(`/auth/wallet/login`, data);
};

type UseLoginWalletOptions = {
  mutationConfig?: MutationConfig<typeof loginWallet>;
};

export const useLoginWallet = ({ mutationConfig }: UseLoginWalletOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: loginWallet,
  });
};
