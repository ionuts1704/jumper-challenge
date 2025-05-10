'use client';

import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { useAppKitAccount } from '@reown/appkit/react';
import { formatAddress } from '@/utils/format-address';
import LogoutIcon from '@mui/icons-material/Logout';
import useWalletLogout from '@/hooks/use-wallet-logout';
import useAuth from '@/context/AuthContext';

export const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { address } = useAppKitAccount();
  const { isAuthenticated } = useAuth();
  const { logout, isLoggingOut } = useWalletLogout();

  return (
    <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {isAuthenticated ? (
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              noWrap
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ERC-20 Token Explorer
            </Typography>
          ) : (
            <Skeleton variant="rectangular" animation="wave" width={210} />
          )}

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: '20px',
                  padding: isMobile ? '4px 8px' : '6px 16px',
                }}
              >
                <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ fontWeight: 500 }}>
                  {formatAddress(address || '')}
                </Typography>
              </Box>

              <Tooltip title="Disconnect Wallet" placement="bottom" arrow enterDelay={300} leaveDelay={200}>
                <IconButton
                  onClick={logout}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                  disabled={isLoggingOut}
                  sx={{
                    ml: 1,
                    borderRadius: '50%',
                    bgcolor: theme.palette.action.hover,
                    '&:hover': {
                      bgcolor: theme.palette.action.selected,
                    },
                  }}
                  aria-label="disconnect wallet"
                >
                  {isLoggingOut ? (
                    <CircularProgress size={isMobile ? 16 : 20} color="inherit" />
                  ) : (
                    <LogoutIcon fontSize={isMobile ? 'small' : 'medium'} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{
                  width: isMobile ? '60px' : '120px',
                  height: isMobile ? '18px' : '36px',
                  borderRadius: '20px',
                }}
              />
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                animation="wave"
                sx={{
                  width: isMobile ? '20px' : '40px',
                  height: isMobile ? '20px' : '40px',
                }}
              />
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
