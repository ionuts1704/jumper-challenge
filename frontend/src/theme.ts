'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9333ea', // Purple for the button
    },
    background: {
      paper: 'rgba(46, 16, 101, 0.8)', // Semi-transparent purple for paper elements
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '2rem',
    },
  },
  components: {},
});

export default theme;
