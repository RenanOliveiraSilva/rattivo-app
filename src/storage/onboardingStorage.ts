import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ONBOARDING_KEY = 'rattivo_onboarding_completed_v1';

let webMemoryOnboarding = false;

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
 * Persiste que o usuário concluiu as 3 telas de onboarding.
 */
export async function saveOnboardingCompleted(completed = true): Promise<void> {
  const value = completed ? 'true' : 'false';
  const available = await isSecureStoreAvailable();
  if (available) {
    await SecureStore.setItemAsync(ONBOARDING_KEY, value);
    return;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(ONBOARDING_KEY, value);
      return;
    } catch {
      // Fallback
    }
  }
  webMemoryOnboarding = completed;
}

/**
 * Consulta se o onboarding já foi concluído anteriormente.
 */
export async function isOnboardingCompleted(): Promise<boolean> {
  const available = await isSecureStoreAvailable();
  if (available) {
    const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
    return value === 'true';
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(ONBOARDING_KEY);
      return stored === 'true';
    } catch {
      // Fallback
    }
  }
  return webMemoryOnboarding;
}

/**
 * Limpa o status de onboarding para fins de teste e desenvolvimento.
 */
export async function clearOnboardingCompleted(): Promise<void> {
  const available = await isSecureStoreAvailable();
  if (available) {
    await SecureStore.deleteItemAsync(ONBOARDING_KEY);
    return;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(ONBOARDING_KEY);
    } catch {
      // Fallback
    }
  }
  webMemoryOnboarding = false;
}

