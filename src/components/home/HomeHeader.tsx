import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface HomeHeaderProps {
  displayName?: string | null;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ displayName }) => {
  const router = useRouter();

  // Saudação de acordo com o horário local
  const getGreeting = (): string => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Bom dia';
    if (hours < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const firstName = displayName?.trim().split(/\s+/)[0] || 'Cozinheiro';

  // Obter as iniciais do nome (até duas letras)
  const getInitials = (name?: string | null): string => {
    if (!name) return 'R';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.textColumn}>
        <Text style={styles.greeting}>
          {getGreeting()}, {firstName}!
        </Text>
        <Text style={styles.title}>
          {'Pronto para preparar\nalgo incrível?'}
        </Text>
      </View>

      <Pressable
        onPress={() => router.push('/(tabs)/profile')}
        style={({ pressed }) => [
          styles.avatarWrapper,
          pressed && styles.avatarPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Abrir perfil do usuário"
      >
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>{getInitials(displayName)}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  textColumn: {
    flex: 1,
    paddingRight: spacing.md,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '400',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.heading,
    fontSize: 26,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  avatarWrapper: {
    padding: 2,
  },
  avatarPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: radius.full,
    backgroundColor: '#1C2417',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

