import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
import { SessionStatus } from '@/api/types';

interface ChefHeaderProps {
  recipeName?: string;
  status?: SessionStatus;
  isSyncing?: boolean;
}

export function ChefHeader({ recipeName, status, isSyncing }: ChefHeaderProps) {
  const hasActiveSession = Boolean(recipeName && (status === 'ACTIVE' || status === 'PAUSED'));

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Chef Rattito</Text>

        <View style={styles.badgeSimulated}>
          <Text style={styles.badgeSimulatedText}>Respostas simuladas</Text>
        </View>
      </View>

      <View style={styles.contextRow}>
        <View
          style={[
            styles.statusDot,
            hasActiveSession ? styles.statusDotActive : styles.statusDotInactive,
          ]}
        />
        <Text style={styles.contextText} numberOfLines={1}>
          {hasActiveSession
            ? `Contexto: ${recipeName} ${status === 'PAUSED' ? '(Pausada)' : ''}`
            : 'Nenhuma receita em preparo'}
        </Text>
        {isSyncing ? (
          <Text style={styles.syncingText}>· sincronizando</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badgeSimulated: {
    backgroundColor: '#1E231B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.badge,
    borderWidth: 1,
    borderColor: '#2F382A',
  },
  badgeSimulatedText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: colors.primary,
  },
  statusDotInactive: {
    backgroundColor: colors.textSecondary,
  },
  contextText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  syncingText: {
    fontSize: 11,
    color: colors.primary,
    fontStyle: 'italic',
  },
});
