import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'rattivo_auth_access_token';

// Fallback de memória para web quando SecureStore não estiver disponível
let webMemoryToken: string | null = null;

async function isSecureStoreAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Salva o JWT retornado pela autenticação de forma segura no SecureStore.
 * Nunca registre o token em logs.
 */
export async function saveToken(token: string): Promise<void> {
  const available = await isSecureStoreAvailable();
  if (available) {
    await SecureStore.setItemAsync(TOKEN_KEY, token, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
    return;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
      return;
    } catch {
      // Ignora erro de cota ou bloqueio no browser
    }
  }
  webMemoryToken = token;
}

/**
 * Recupera o token de acesso armazenado de forma segura.
 */
export async function getToken(): Promise<string | null> {
  const available = await isSecureStoreAvailable();
  if (available) {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(TOKEN_KEY);
      if (stored) return stored;
    } catch {
      // Ignora erro no browser
    }
  }
  return webMemoryToken;
}

/**
 * Remove o token de acesso armazenado no logout ou invalidação de sessão.
 */
export async function removeToken(): Promise<void> {
  const available = await isSecureStoreAvailable();
  if (available) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    return;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Ignora erro
    }
  }
  webMemoryToken = null;
}

