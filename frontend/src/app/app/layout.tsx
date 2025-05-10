import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Navbar from '@/components/ui/navbar';

export const metadata = {
  title: 'Jumper Technical Challenge',
  description: 'ERC20 Token Dashboard',
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <Navbar></Navbar>
      <main>{children}</main>
    </ErrorBoundary>
  );
};

export default AuthLayout;
