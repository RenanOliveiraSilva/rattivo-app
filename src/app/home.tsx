import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout, resetOnboarding } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleResetOnboarding = async () => {
    await resetOnboarding();
    setResetMessage('Status do onboarding limpo com sucesso! Ao sair, o fluxo reiniciará no primeiro acesso.');
    setTimeout(() => {
      setResetMessage(null);
    }, 4000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com Logo */}
        <View style={styles.header}>
          <Image
            source={require('@/../assets/images/onboarding/chef-logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.brandTitle}>Rattivo</Text>
            <Text style={styles.brandSubtitle}>SMART COOKING</Text>
          </View>
        </View>

        {/* Saudação */}
        <View style={styles.headingContainer}>
          <Text style={styles.kicker}>ÁREA AUTENTICADA PROVISÓRIA</Text>
          <Text style={styles.title}>Olá, {user?.displayName || 'Cozinheiro'}!</Text>
          <Text style={styles.subtitle}>
            Sua sessão está ativa e o token JWT foi validado com sucesso pelo endpoint GET /auth/me.
          </Text>
        </View>

        {/* Card de Sessão */}
        <View style={styles.card}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>SESSÃO ATIVA</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValue}>{user?.displayName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>E-mail:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Função:</Text>
            <Text style={styles.infoValue}>{user?.role}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={[styles.infoValue, styles.monoText]}>{user?.id}</Text>
          </View>
        </View>

        {/* Mensagem de Feedback de Reset */}
        {Boolean(resetMessage) && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>{resetMessage}</Text>
          </View>
        )}

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <Button
            title="Sair da conta"
            onPress={handleLogout}
            loading={isLoggingOut}
            disabled={isLoggingOut}
            variant="secondary"
            style={styles.logoutButton}
          />

          <Button
            title="Limpar onboarding para testes"
            onPress={handleResetOnboarding}
            variant="ghost"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.xl,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  logoTextContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  headingContainer: {
    marginBottom: spacing.xl,
  },
  kicker: {
    ...typography.kicker,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.display,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.badgeBg,
    borderColor: colors.badgeBorder,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    marginBottom: spacing.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  statusText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#242A20',
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  monoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoBanner: {
    backgroundColor: colors.badgeBg,
    borderColor: colors.badgeBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoBannerText: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  logoutButton: {
    borderColor: '#3F4938',
  },
});
