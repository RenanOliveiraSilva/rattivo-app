import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

interface QuickSuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function QuickSuggestions({
  suggestions,
  onSelect,
  disabled = false,
}: QuickSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {suggestions.map((item, idx) => (
          <TouchableOpacity
            key={`${item}-${idx}`}
            style={[styles.chip, disabled && styles.chipDisabled]}
            onPress={() => onSelect(item)}
            disabled={disabled}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Pergunta rápida: ${item}`}
          >
            <Text style={styles.chipText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 44,
    justifyContent: 'center',
    marginBottom: 6,
  },
  container: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.full,
    backgroundColor: '#1E231C',
    borderWidth: 1,
    borderColor: '#30382B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
