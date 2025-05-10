'use client'; // Important to add this directive

import { Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

// Define size variants
const sizeValues = {
  sm: 16,
  md: 32,
  lg: 64,
  xl: 96,
};

// Define color variants
const colorVariants = {
  light: 'white',
  primary: '#475569', // slate-600 equivalent
};

export type SpinnerProps = {
  size?: keyof typeof sizeValues;
  variant?: keyof typeof colorVariants;
  className?: string;
  sx?: SxProps<Theme>;
};

export const Spinner = ({ size = 'md', variant = 'primary', className = '', sx = {} }: SpinnerProps) => {
  return (
    <Box className={className} sx={sx} display="inline-flex">
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        width={sizeValues[size]}
        height={sizeValues[size]}
        viewBox="0 0 24 24"
        fill="none"
        stroke={colorVariants[variant]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        sx={{
          animation: 'spin 1.5s linear infinite',
          '@keyframes spin': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            },
          },
        }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </Box>
      <Box
        component="span"
        sx={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: '1px',
          margin: '-1px',
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          width: '1px',
          whiteSpace: 'nowrap',
        }}
      >
        Loading
      </Box>
    </Box>
  );
};
