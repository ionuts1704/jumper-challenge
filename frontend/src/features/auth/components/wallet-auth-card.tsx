'use client';

import {
  Box,
  Typography,
  Button,
  useTheme,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import useWalletLogin from '@/hooks/use-wallet-login';

export const WalletAuthCard = () => {
  const theme = useTheme();
  const { isConnected, isConnecting, connectionError, connectWallet } = useWalletLogin();

  // Steps data
  const steps = [
    {
      number: 1,
      text: 'First, connect your wallet using the "Connect Wallet" button',
    },
    {
      number: 2,
      text: 'Then, authorize access to create a secure session for viewing your token balances',
    },
  ];

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
          <LoginIcon sx={{ fontSize: 32, color: '#fff' }} />
        </Box>

        <CardContent sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
            Connect Your Wallet
          </Typography>

          {/* Show error message if there was a connection error */}
          {connectionError && (
            <Alert severity="error" sx={{ mb: 2, mx: 'auto', maxWidth: 450 }}>
              {connectionError}
            </Alert>
          )}

          <Typography variant="body1" color="text.secondary" paragraph>
            Accessing your ERC-20 dashboard is a simple two-step process:
          </Typography>

          <Box sx={{ maxWidth: 450, mx: 'auto', my: 2 }}>
            {steps.map((step) => (
              <Box key={step.number} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    mt: 1,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    fontWeight: 'bold',
                  }}
                >
                  {step.number}
                </Box>
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                  {step.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>

        <CardActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            onClick={connectWallet}
            disabled={isConnected || isConnecting}
            variant="contained"
            size="large"
            startIcon={isConnecting ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 500,
              fontSize: '1rem',
              textTransform: 'none',
            }}
          >
            {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default WalletAuthCard;
