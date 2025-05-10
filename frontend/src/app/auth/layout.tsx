import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export const metadata = {
  title: 'Jumper Technical Challenge',
  description: 'ERC20 Token Dashboard',
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <ErrorBoundary fallback={<div>Something went wrong!</div>}>{children}</ErrorBoundary>;
};

export default AuthLayout;
