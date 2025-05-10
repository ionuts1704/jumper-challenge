'use client';

import { Box, Typography, Button, useTheme, Card, CardContent, CardActions, CircularProgress } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useWalletAuthorize } from '@/hooks/use-wallet-authorize'; // Update the path as needed

export const WalletAuthzCard = () => {
  const theme = useTheme();
  const { isAuthorizing, authorizeWallet } = useWalletAuthorize({
    successMessage: 'Account created successfully',
    showSuccessToast: true,
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Card
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 4,
          mb: 6,
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          overflow: 'visible',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -28,
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            p: 2,
            bgcolor: theme.palette.primary.main,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: theme.shadows[2],
          }}
        >
          <VerifiedUserIcon sx={{ fontSize: 32, color: '#fff' }} />
        </Box>

        <CardContent sx={{ pt: 5, px: { xs: 2, sm: 4 }, textAlign: 'center' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
            Authorize Your Wallet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
            Authorize your connected wallet to access the ERC-20 table data. This creates a secure session that allows
            the application to retrieve your token balances across different networks through our APIs.
          </Typography>
        </CardContent>

        <CardActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            onClick={authorizeWallet}
            disabled={isAuthorizing}
            variant="contained"
            size="large"
            startIcon={isAuthorizing ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 500,
              fontSize: '1rem',
              textTransform: 'none',
            }}
          >
            {isAuthorizing ? 'Authorizing...' : 'Authorize Access'}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default WalletAuthzCard;
