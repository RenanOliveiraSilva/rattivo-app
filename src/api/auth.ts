import { apiRequest } from './client';
import type { AuthResult, User } from './types';

export const login = (email: string, password: string) =>
  apiRequest<AuthResult>('/auth/login', { method: 'POST', body: { email, password } });

export const register = (displayName: string, email: string, password: string) =>
  apiRequest<AuthResult>('/auth/register', {
    method: 'POST',
    body: { displayName, email, password },
  });

export const getCurrentUser = (token: string) =>
  apiRequest<User>('/auth/me', { token });

