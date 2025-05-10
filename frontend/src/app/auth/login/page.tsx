'use client';

import WalletAuthCard from '@/features/auth/components/wallet-auth-card';
import { Box } from '@mui/material';

const LoginPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <WalletAuthCard />
    </Box>
  );
};

export default LoginPage;
