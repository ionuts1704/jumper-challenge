import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, Box } from '@mui/material';

interface TableSkeletonProps {
  columns: string[];
  rowCount?: number;
  centered?: boolean;
  columnWidths?: string[];
  skeletonHeight?: number;
  rounded?: boolean;
  sx?: Record<string, any>;
}

export const TableSkeleton = ({
  columns,
  rowCount = 5,
  centered = true,
  columnWidths,
  skeletonHeight = 24,
  rounded = false,
  sx = {},
}: TableSkeletonProps) => {
  return (
    <TableContainer component={Paper} sx={{ ...sx }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} align={centered ? 'center' : 'left'}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(rowCount)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((_, colIndex) => {
                const width = columnWidths?.[colIndex] || '100%';
                return (
                  <TableCell key={colIndex} align={centered ? 'center' : 'left'}>
                    <Box sx={{ display: 'flex', justifyContent: centered ? 'center' : 'flex-start' }}>
                      <Skeleton
                        animation="wave"
                        height={skeletonHeight}
                        width={width}
                        variant={rounded ? 'rounded' : 'text'}
                      />
                    </Box>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;
