'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { parseCookieString } from '@/utils/parse-cookie';

interface SessionState {
  isAuthorized: boolean;
}

interface AuthContextType extends SessionState {
  isAuthenticated: boolean; // Based on wallet connection
  updateSession: () => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthorized: false,
  isAuthenticated: false,
  updateSession: () => {},
  clearSession: () => {},
});

export const AuthContextProvider: React.FC<{
  children: React.ReactNode;
  cookies: string | null;
}> = ({ children, cookies }) => {
  const [sessionState, setSessionState] = useState<SessionState>({
    isAuthorized: false,
  });

  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    if (!cookies) {
      return;
    }

    const cookieMap = parseCookieString(cookies);
    const hasSession = cookieMap['jumper.session.id'] !== undefined;

    if (hasSession && address) {
      setSessionState({
        isAuthorized: true,
      });
    } else if (!hasSession) {
      setSessionState({
        isAuthorized: false,
      });
    }
  }, [cookies, address]);

  const updateSession = useCallback(() => {
    if (address) {
      setSessionState({
        isAuthorized: true,
      });
    }
  }, [address]);

  const clearSession = useCallback(() => {
    setSessionState({
      isAuthorized: false,
    });
  }, []);

  const value = useMemo(
    () => ({
      ...sessionState,
      isAuthenticated: isConnected, // Set directly from wallet connection status
      updateSession,
      clearSession,
    }),
    [sessionState, isConnected, updateSession, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default useAuth;
