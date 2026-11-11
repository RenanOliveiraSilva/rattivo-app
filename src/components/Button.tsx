import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, radius, typography } from '@/theme/tokens';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  showArrow?: boolean;
  style?: StyleProp<ViewStyle>;
  flex?: number;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  showArrow = false,
  style,
  flex,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        pressed && !disabled && (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
        disabled && styles.disabled,
        flex !== undefined && { flex },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? colors.primaryText : colors.primary}
        />
      ) : (
        <>
          <Text
            style={[
              styles.text,
              isPrimary && styles.textPrimary,
              isSecondary && styles.textSecondary,
              isGhost && styles.textGhost,
              disabled && styles.textDisabled,
            ]}
          >
            {title}
          </Text>
          {showArrow && (
            <Text
              style={[
                styles.arrow,
                isPrimary && styles.textPrimary,
                isSecondary && styles.textSecondary,
                isGhost && styles.textGhost,
              ]}
            >
              →
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.99 }],
  },
  secondary: {
    backgroundColor: colors.buttonSecondaryBg,
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
  },
  secondaryPressed: {
    backgroundColor: '#242921',
    transform: [{ scale: 0.99 }],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
  },
  textPrimary: {
    color: colors.primaryText,
    fontWeight: '700',
  },
  textSecondary: {
    color: colors.buttonSecondaryText,
    fontWeight: '600',
  },
  textGhost: {
    color: colors.primary,
    fontWeight: '600',
  },
  textDisabled: {
    color: colors.textMuted,
  },
  arrow: {
    fontSize: 18,
    marginLeft: 8,
    fontWeight: '700',
  },
});

