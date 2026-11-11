import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/theme/tokens';

export const StatusCards: React.FC = () => {
  const router = useRouter();

  const handleCameraPress = () => {
    Alert.alert(
      'Câmera da Bancada',
      'A sincronização com a câmera externa de visão computacional será disponibilizada na próxima etapa do projeto.',
      [{ text: 'Entendi' }]
    );
  };

  const handleRattitoPress = () => {
    router.push('/(tabs)/assistant');
  };

  return (
    <View style={styles.row}>
      {/* Card 1: Rattito */}
      <Pressable
        onPress={handleRattitoPress}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Abrir assistente Rattito"
      >
        <View style={styles.cardHeader}>
          <View style={styles.logoBadge}>
            <Image
              source={require('@/../assets/images/onboarding/chef-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          {/* Ponto de status âmbar indicando assistente em preparação */}
          <View style={[styles.statusDot, styles.statusDotWarning]} />
        </View>

        <Text style={styles.cardTitle}>Rattito</Text>
        <Text style={styles.cardSubtitle}>Assistente em preparação</Text>
      </Pressable>

      {/* Card 2: Câmera da bancada */}
      <Pressable
        onPress={handleCameraPress}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Verificar status da câmera da bancada"
      >
        <View style={styles.cardHeader}>
          <View style={styles.cameraBadge}>
            <Image
              source={require('@/../assets/images/icons/icon-camera.png')}
              style={styles.cameraIcon}
              resizeMode="contain"
            />
          </View>
          {/* Ponto de status cinza indicando aguardando conexão */}
          <View style={[styles.statusDot, styles.statusDotNeutral]} />
        </View>

        <Text style={styles.cardTitle}>Câmera da bancada</Text>
        <Text style={styles.cardSubtitle}>Aguardando conexão</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.md,
    minHeight: 130,
    justifyContent: 'space-between',
  },
  cardPressed: {
    backgroundColor: colors.surfaceCardMuted,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#1E2519',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 226, 46, 0.15)',
  },
  cameraIcon: {
    width: 26,
    height: 26,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotWarning: {
    backgroundColor: colors.statusWarning,
  },
  statusDotNeutral: {
    backgroundColor: colors.statusNeutral,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
});
