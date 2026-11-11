import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RecipeSummary } from '@/api/types';
import { colors, radius, spacing } from '@/theme/tokens';

interface RecipeCardProps {
  recipe: RecipeSummary;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Ver receita de ${recipe.name}`}
    >
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>RECEITA</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>

      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {recipe.description}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.actionText}>Ver ingredientes e etapas</Text>
        <Text style={styles.arrowIcon}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.badge,
    borderWidth: 1,
    borderColor: colors.badgeBorder,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  chevron: {
    fontSize: 22,
    color: colors.textSecondary,
    marginTop: -2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  arrowIcon: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

