'use client';

import { Box, Typography, CircularProgress, useTheme, useMediaQuery, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import useAuth from '@/context/AuthContext';
import { useGetTokens } from '@/features/app/api/get-tokens';
import CardsSkeleton from '@/components/ui/cards-skeleton';
import TableSkeleton from '@/components/ui/table-skeleton';
import TokenCards from '@/features/app/components/token-cards';
import TokenTable from '@/features/app/components/token-table';

export const TokensList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthorized } = useAuth();
  const {
    data: tokens = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetTokens({
    config: {
      enabled: isAuthorized,
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Failed to fetch tokens';
        toast.error(message);
      },
    },
  });

  const columns = ['Name', 'Symbol', 'Balance', 'Network', 'Address'];
  const columnWidths = ['120px', '80px', '100px', '90px', '140px'];
  const cardConfig = {
    elements: [
      { height: 32, width: '70%', variant: 'text' as const },
      { height: 24, width: '50%', variant: 'text' as const },
      { height: 24, width: '80px', variant: 'rounded' as const },
      { height: 20, width: '90%', variant: 'text' as const },
    ],
  };
  const isLoadingData = isLoading || isFetching;

  // Format token balance helper function
  const formatBalance = (balance: number | string): string => {
    if (typeof balance === 'string') return balance;

    if (balance < 0.000001) {
      return balance.toExponential(6);
    } else {
      return balance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: 1200,
        mx: 'auto',
        width: '100%',
      }}
    >
      <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          Your Token Balances
        </Typography>

        <Button
          onClick={() => refetch()}
          startIcon={isFetching ? <CircularProgress size={16} /> : <RefreshIcon />}
          variant="outlined"
          size="small"
          disabled={isFetching}
        >
          Refresh
        </Button>
      </Box>

      {isLoadingData ? (
        isMobile ? (
          <CardsSkeleton cardCount={3} cardConfig={cardConfig} />
        ) : (
          <TableSkeleton columns={columns} rowCount={5} columnWidths={columnWidths} />
        )
      ) : isMobile ? (
        <TokenCards tokens={tokens} />
      ) : (
        <TokenTable tokens={tokens} />
      )}
    </Box>
  );
};

export default TokensList;
