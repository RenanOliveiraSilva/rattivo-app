import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const tokenKey = 'rattivo.access-token';

export async function loadAccessToken() {
  if (Platform.OS === 'web') return globalThis.sessionStorage?.getItem(tokenKey) ?? null;
  return SecureStore.getItemAsync(tokenKey);
}

export async function saveAccessToken(token: string) {
  if (Platform.OS === 'web') {
    globalThis.sessionStorage?.setItem(tokenKey, token);
    return;
  }
  await SecureStore.setItemAsync(tokenKey, token);
}

export async function clearAccessToken() {
  if (Platform.OS === 'web') {
    globalThis.sessionStorage?.removeItem(tokenKey);
    return;
  }
  await SecureStore.deleteItemAsync(tokenKey);
}

