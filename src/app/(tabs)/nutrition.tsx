import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function NutritionScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.kicker}>SAÚDE E METAS</Text>
        <Text style={styles.title}>Nutrição</Text>
        <Text style={styles.subtitle}>
          Acompanhamento de calorias, macronutrientes e adaptação das porções às suas metas físicas.
        </Text>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderIcon}>🥗</Text>
          <Text style={styles.placeholderTitle}>Metas e Macronutrientes</Text>
          <Text style={styles.placeholderText}>
            A configuração de perfil nutricional (ganho de massa, manutenção ou perda de gordura) e o cálculo automático serão entregues nas próximas tasks.
          </Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Em breve</Text>
          </View>
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
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 95,
  },
  kicker: {
    ...typography.kicker,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
  placeholderCard: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  placeholderIcon: {
    fontSize: 42,
    marginBottom: spacing.md,
  },
  placeholderTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  pill: {
    backgroundColor: 'rgba(167, 226, 46, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(167, 226, 46, 0.3)',
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  pillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

