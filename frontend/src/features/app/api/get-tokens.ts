import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { TokenDto } from '@/types/api';

export const getTokens = (): Promise<TokenDto[]> => {
  return api.get(`/tokens/me`);
};

export const getTokensQueryKey = ['getTokens'] as const;

export const getTokensQueryOptions = () => {
  return queryOptions({
    queryKey: getTokensQueryKey,
    queryFn: getTokens,
  });
};

type UseGetTokensOptions = {
  config?: Omit<ReturnType<typeof getTokensQueryOptions>, 'queryKey' | 'queryFn'> & {
    onError?: (error: Error | unknown) => void;
    // Include other query options you want to override
    enabled?: boolean;
  };
};

export const useGetTokens = ({ config }: UseGetTokensOptions = {}) => {
  return useQuery({
    ...getTokensQueryOptions(),
    ...config,
  });
};
