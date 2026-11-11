import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme/tokens';

export interface FridgeHeaderProps {
  hasPhotos: boolean;
  onClearPhotos?: () => void;
}

export const FridgeHeader: React.FC<FridgeHeaderProps> = ({
  hasPhotos,
  onClearPhotos,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (hasPhotos) {
      Alert.alert(
        'Descartar fotos?',
        'As fotos selecionadas serão perdidas ao sair desta tela.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Descartar e Sair',
            style: 'destructive',
            onPress: () => {
              if (onClearPhotos) onClearPhotos();
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <Pressable
        onPress={handleBack}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Voltar para a página inicial"
      >
        <Text style={styles.backChevron}>‹</Text>
      </Pressable>

      <View style={styles.titleColumn}>
        <Text style={styles.title}>O que tem na sua geladeira?</Text>
        <Text style={styles.subtitle}>
          Câmera do smartphone · modo demonstração
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E231B',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: '#262D22',
    transform: [{ scale: 0.96 }],
  },
  backChevron: {
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
    marginTop: -2,
    marginLeft: -2,
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    ...typography.subheading,
    fontSize: 20,
    lineHeight: 25,
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
});
