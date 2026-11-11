import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';

export interface ProgressDotsProps {
  currentStep: number; // 0, 1 ou 2
  totalSteps?: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  currentStep,
  totalSteps = 3,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        return (
          <View
            key={index}
            style={[styles.dot, isActive ? styles.activeBar : styles.inactiveDot]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  activeBar: {
    width: 24,
    backgroundColor: colors.dotActive,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.dotInactive,
  },
});

