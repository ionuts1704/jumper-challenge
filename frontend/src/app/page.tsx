'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/context/AuthContext';
import { paths } from '@/config/paths';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    router.push(isAuthenticated ? paths.app.root.getHref() : paths.auth.login.getHref());
  }, [isAuthenticated, router]);

  return null;
}
