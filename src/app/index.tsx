import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing } from '@/theme/tokens';

export default function IndexScreen() {
  const { isLoading, token, user, isOnboardingDone } = useAuth();

  // Enquanto a sessão está sendo restaurada com SecureStore e GET /auth/me
  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('@/../assets/images/onboarding/chef-logo.png')}
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <Text style={styles.brandTitle}>Rattivo</Text>
        <Text style={styles.brandSubtitle}>SMART COOKING</Text>

        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.spinner}
        />
      </View>
    );
  }

  // Se já possui sessão autenticada e validada
  if (token && user) {
    return <Redirect href="/(tabs)" />;
  }

  // Primeiro acesso: direciona para o onboarding de 3 telas
  if (!isOnboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  // Onboarding já realizado: vai direto para o login
  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 14,
    marginBottom: spacing.md,
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 2,
    marginBottom: spacing.xl,
  },
  spinner: {
    marginTop: spacing.md,
  },
});
