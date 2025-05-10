'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import theme from '@/theme';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { type Config, cookieToInitialState, WagmiProvider } from 'wagmi';
import { wagmiAdapter, projectId, networks } from '@/lib/wallet-adapter';
import { createAppKit } from '@reown/appkit/react';
import { AuthContextProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
  cookies: string | null;
};

// Set up metadata
const metadata = {
  name: 'next-reown-appkit',
  description: 'next-reown-appkit',
  url: 'https://github.com/0xonerb/next-reown-appkit-ssr', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: 'dark',
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export const AppProvider = ({ children, cookies }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <AppRouterCacheProvider>
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <AuthContextProvider cookies={cookies}>
                {process.env.DEV && <ReactQueryDevtools />}
                <ToastContainer
                  position="top-right"
                  autoClose={1500}
                  theme="dark"
                  hideProgressBar={false}
                  closeOnClick
                  pauseOnHover
                />
                {children}
              </AuthContextProvider>
              <CssBaseline />
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </AppRouterCacheProvider>
    </ErrorBoundary>
  );
};
