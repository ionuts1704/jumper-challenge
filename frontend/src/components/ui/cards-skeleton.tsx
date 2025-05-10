import { Card, CardContent, Grid, Skeleton, Stack } from '@mui/material';

interface CardsSkeletonProps {
  cardCount?: number;
  cardConfig?: {
    elements: Array<{
      height?: number;
      width?: string;
      variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    }>;
  };
  spacing?: number;
  sx?: Record<string, any>;
}

export const CardsSkeleton = ({
  cardCount = 3,
  cardConfig = {
    elements: [
      { height: 32, width: '70%', variant: 'text' },
      { height: 24, width: '50%', variant: 'text' },
      { height: 24, width: '80px', variant: 'rounded' },
      { height: 20, width: '90%', variant: 'text' },
    ],
  },
  spacing = 2,
  sx = {},
}: CardsSkeletonProps) => {
  return (
    <Grid container spacing={spacing} sx={{ ...sx }}>
      {[...Array(cardCount)].map((_, index) => (
        <Grid item xs={12} key={index}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                {cardConfig.elements.map((element, elementIndex) => (
                  <Skeleton
                    key={elementIndex}
                    animation="wave"
                    height={element.height || 24}
                    width={element.width || '100%'}
                    variant={element.variant || 'text'}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardsSkeleton;
