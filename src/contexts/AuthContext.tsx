import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe, loginUser, registerUser } from '@/api/auth';
import { LoginRequest, RegisterRequest, UserView } from '@/api/types';
import {
  clearOnboardingCompleted,
  getToken,
  isOnboardingCompleted,
  removeToken,
  saveOnboardingCompleted,
  saveToken,
} from '@/storage';

export interface AuthContextData {
  user: UserView | null;
  token: string | null;
  isLoading: boolean;
  isOnboardingDone: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserView | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isOnboardingDone, setIsOnboardingDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const [onboardingStatus, savedToken] = await Promise.all([
          isOnboardingCompleted(),
          getToken(),
        ]);

        if (isMounted) {
          setIsOnboardingDone(onboardingStatus);
        }

        if (savedToken) {
          try {
            const currentUser = await getMe(savedToken);
            if (isMounted) {
              setUser(currentUser);
              setToken(savedToken);
            }
          } catch {
            // Token inválido, expirado ou recusado pelo backend: limpa armazenamento
            await removeToken();
            if (isMounted) {
              setUser(null);
              setToken(null);
            }
          }
        }
      } catch {
        // Falha inesperada ao ler armazenamento local
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (data: LoginRequest) => {
    const result = await loginUser(data);
    await saveToken(result.accessToken);
    setToken(result.accessToken);
    setUser(result.user);
  };

  const register = async (data: RegisterRequest) => {
    const result = await registerUser(data);
    await saveToken(result.accessToken);
    setToken(result.accessToken);
    setUser(result.user);
  };

  const logout = async () => {
    await removeToken();
    setToken(null);
    setUser(null);
  };

  const completeOnboarding = async () => {
    await saveOnboardingCompleted(true);
    setIsOnboardingDone(true);
  };

  const resetOnboarding = async () => {
    await clearOnboardingCompleted();
    setIsOnboardingDone(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isOnboardingDone,
        login,
        register,
        logout,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

