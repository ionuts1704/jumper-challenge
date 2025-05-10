import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { AppProvider } from '@/app/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jumper Technical Challenge',
  description: 'ERC20 Token Dashboard',
};

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const headersData = await headers();
  const cookies = headersData.get('cookie');

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider cookies={cookies}>{children}</AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
