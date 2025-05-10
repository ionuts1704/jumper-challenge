import { Grid, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { formatAddress } from '@/utils/format-address';
import { TokenDto } from '@/types/api';

interface TokenCardsProps {
  tokens: TokenDto[];
  spacing?: number;
  sx?: Record<string, any>;
}

export const TokenCards = ({ tokens, spacing = 2, sx = {} }: TokenCardsProps) => {
  return (
    <Grid container spacing={spacing} sx={{ ...sx }}>
      {tokens.length > 0 ? (
        tokens.map((token) => (
          <Grid item xs={12} key={token.contractAddress}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" component="div">
                    {token.name} ({token.symbol})
                  </Typography>
                  <Typography variant="body1">Balance: {token.balance}</Typography>
                  <Chip label={token.chainName} size="small" sx={{ alignSelf: 'flex-start' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatAddress(token.contractAddress)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                align="center"
                sx={{
                  py: 4,
                  color: 'text.secondary',
                  fontSize: '1rem',
                }}
              >
                No Token Balances
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default TokenCards;
