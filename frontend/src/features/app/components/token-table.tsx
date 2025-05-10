import { TableContainer, Paper, Table, TableHead, TableCell, TableBody, TableRow, Chip } from '@mui/material';
import { formatAddress } from '@/utils/format-address';
import { TokenDto } from '@/types/api';

interface TokenTableProps {
  tokens: TokenDto[];
  sx?: Record<string, any>;
}

export const TokenTable = ({ tokens, sx = {} }: TokenTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2, ...sx }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Symbol</TableCell>
            <TableCell align="center">Balance</TableCell>
            <TableCell align="center">Network</TableCell>
            <TableCell align="center">Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokens.length > 0 ? (
            tokens.map((token) => (
              <TableRow key={token.contractAddress}>
                <TableCell align="center">{token.name}</TableCell>
                <TableCell align="center">{token.symbol}</TableCell>
                <TableCell align="center">{token.balance}</TableCell>
                <TableCell align="center">
                  <Chip label={token.chainName} />
                </TableCell>
                <TableCell align="center">{formatAddress(token.contractAddress)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                sx={{
                  py: 8,
                  color: 'text.secondary',
                  fontSize: '1rem',
                }}
              >
                No Token Balances
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TokenTable;
