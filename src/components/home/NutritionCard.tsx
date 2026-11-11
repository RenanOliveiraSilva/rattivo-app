import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/theme/tokens';

export const NutritionCard: React.FC = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(tabs)/nutrition');
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Abrir área de nutrição e metas"
    >
      <View style={styles.contentRow}>
        {/* Gráfico circular/anel de meta */}
        <View style={styles.circleContainer}>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <Text style={styles.ringKcalNumber}>---</Text>
              <Text style={styles.ringKcalLabel}>kcal / dia</Text>
            </View>
          </View>
        </View>

        {/* Detalhes de metas e macros */}
        <View style={styles.detailsContainer}>
          {/* Cabeçalho do Card */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Meta nutricional</Text>
            <Text style={styles.chevron}>›</Text>
          </View>

          {/* Barra de Proteínas */}
          <View style={styles.macroRow}>
            <View style={styles.macroTextRow}>
              <Text style={styles.macroName}>Proteínas</Text>
              <Text style={styles.macroValue}>Definir meta</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '0%' }]} />
            </View>
          </View>

          {/* Barra de Carboidratos */}
          <View style={styles.macroRow}>
            <View style={styles.macroTextRow}>
              <Text style={styles.macroName}>Carboidratos</Text>
              <Text style={styles.macroValue}>Definir meta</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '0%' }]} />
            </View>
          </View>

          {/* Barra de Gorduras */}
          <View style={styles.macroRow}>
            <View style={styles.macroTextRow}>
              <Text style={styles.macroName}>Gorduras</Text>
              <Text style={styles.macroValue}>Definir meta</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '0%' }]} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardPressed: {
    backgroundColor: colors.surfaceCardMuted,
    transform: [{ scale: 0.99 }],
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 8,
    borderColor: 'rgba(167, 226, 46, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F120D',
  },
  ringInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringKcalNumber: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  ringKcalLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
  },
  macroRow: {
    marginTop: 6,
  },
  macroTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  macroName: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  macroValue: {
    color: colors.textMuted,
    fontSize: 11,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#262D20',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});
