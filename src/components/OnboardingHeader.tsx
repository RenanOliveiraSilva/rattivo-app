import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';

export interface OnboardingHeaderProps {
  onSkip?: () => void;
  showSkip?: boolean;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onSkip,
  showSkip = true,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.brandContainer}>
        <Image
          source={require('@/../assets/images/onboarding/chef-logo.png')}
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.brandTitle}>Rattivo</Text>
          <Text style={styles.brandSubtitle}>SMART COOKING</Text>
        </View>
      </View>

      {showSkip && onSkip && (
        <Pressable
          onPress={onSkip}
          style={({ pressed }) => [styles.skipButton, pressed && styles.skipPressed]}
          accessibilityRole="button"
          accessibilityLabel="Pular introdução"
        >
          <Text style={styles.skipText}>Pular</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    zIndex: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  textContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipPressed: {
    opacity: 0.6,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});

