import { apiRequest } from './client';
import { AuthResult, LoginRequest, RegisterRequest, UserView } from './types';

/**
 * Cadastra um novo usuário no backend e emite o token JWT.
 */
export async function registerUser(data: RegisterRequest): Promise<AuthResult> {
  return apiRequest<AuthResult>('/auth/register', {
    method: 'POST',
    body: {
      displayName: data.displayName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    },
  });
}

/**
 * Realiza o login com e-mail e senha e retorna o token JWT e dados do usuário.
 */
export async function loginUser(data: LoginRequest): Promise<AuthResult> {
  return apiRequest<AuthResult>('/auth/login', {
    method: 'POST',
    body: {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    },
  });
}

/**
 * Consulta o perfil do usuário logado usando o JWT armazenado.
 */
export async function getMe(token: string): Promise<UserView> {
  return apiRequest<UserView>('/auth/me', {
    method: 'GET',
    token,
  });
}

