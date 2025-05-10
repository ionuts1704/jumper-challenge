'use client';

import WalletAuthzCard from '@/features/app/components/wallet-authz-card';
import TokensList from '@/features/app/components/tokens-list';
import useAuth from '@/context/AuthContext';
import { Box } from '@mui/material';

const AppPage = () => {
  const { isAuthorized, isAuthenticated } = useAuth();

  if (!isAuthorized) {
    if (isAuthenticated) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '90vh',
          }}
        >
          <WalletAuthzCard></WalletAuthzCard>
        </Box>
      );
    }
  } else {
    return <TokensList></TokensList>;
  }
};

export default AppPage;
