import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getCurrentUser, login as loginRequest, register as registerRequest } from '@/api/auth';
import type { User } from '@/api/types';
import { clearAccessToken, loadAccessToken, saveAccessToken } from '@/storage/session-storage';

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isRestoring: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(displayName: string, email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  const applyAuthentication = useCallback(async (nextToken: string, nextUser: User) => {
    await saveAccessToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(async () => {
    await clearAccessToken();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const storedToken = await loadAccessToken();
        if (!storedToken) return;
        const storedUser = await getCurrentUser(storedToken);
        if (active) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch {
        await clearAccessToken();
      } finally {
        if (active) setIsRestoring(false);
      }
    }
    void restore();
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email.trim(), password);
    await applyAuthentication(result.accessToken, result.user);
  }, [applyAuthentication]);

  const signUp = useCallback(async (displayName: string, email: string, password: string) => {
    const result = await registerRequest(displayName.trim(), email.trim(), password);
    await applyAuthentication(result.accessToken, result.user);
  }, [applyAuthentication]);

  const value = useMemo(
    () => ({ token, user, isRestoring, signIn, signUp, signOut }),
    [isRestoring, signIn, signOut, signUp, token, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}

