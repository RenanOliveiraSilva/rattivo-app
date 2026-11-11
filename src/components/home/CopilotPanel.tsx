import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export const CopilotPanel: React.FC = () => {
  const router = useRouter();

  const handleStartCooking = () => {
    // Navega para a área de receitas conforme especificação da Task 02
    router.push('/(tabs)/recipes');
  };

  const handleExploreFridge = () => {
    router.push('/fridge-capture');
  };

  return (
    <View style={styles.card}>
      {/* Imagem Gastronômica de Fundo */}
      <View style={styles.backgroundWrapper}>
        <Image
          source={require('@/../assets/images/onboarding/hero-1.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.backgroundOverlay} />
      </View>

      {/* Conteúdo do Painel */}
      <View style={styles.content}>
        {/* Badge Copiloto Culinário */}
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>✦</Text>
          <Text style={styles.badgeText}>Copiloto culinário</Text>
        </View>

        {/* Título e Texto de Apoio */}
        <Text style={styles.title}>O que vamos cozinhar hoje?</Text>
        <Text style={styles.subtitle}>
          Sua IA transforma ingredientes em refeições incríveis.
        </Text>

        {/* Botão 1: Começar a cozinhar */}
        <Pressable
          onPress={handleStartCooking}
          style={({ pressed }) => [
            styles.actionButtonPrimary,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Começar a cozinhar: ativar câmera da bancada e assistente"
        >
          <View style={styles.actionIconPrimaryWrapper}>
            <Image
              source={require('@/../assets/images/icons/icon-chef-hat.png')}
              style={styles.actionIconPrimary}
              resizeMode="contain"
            />
          </View>
          <View style={styles.actionTextColumn}>
            <Text style={styles.actionTitlePrimary}>Começar a cozinhar</Text>
            <Text style={styles.actionSubtitlePrimary}>
              Ativar câmera da bancada e assistente
            </Text>
          </View>
          <Text style={styles.actionArrowPrimary}>→</Text>
        </Pressable>

        {/* Botão 2: Explorar minha geladeira */}
        <Pressable
          onPress={handleExploreFridge}
          style={({ pressed }) => [
            styles.actionButtonSecondary,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Explorar minha geladeira: fotografar ou selecionar fotos de ingredientes"
        >
          <View style={styles.actionIconSecondaryWrapper}>
            <Image
              source={require('@/../assets/images/icons/icon-camera.png')}
              style={styles.actionIconSecondary}
              resizeMode="contain"
            />
          </View>
          <View style={styles.actionTextColumn}>
            <Text style={styles.actionTitleSecondary}>Explorar minha geladeira</Text>
            <Text style={styles.actionSubtitleSecondary}>
              Tire uma foto e descubra receitas
            </Text>
          </View>
          <Text style={styles.actionArrowSecondary}>→</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.heroCard,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0E241E',
    borderWidth: 1,
    borderColor: 'rgba(167, 226, 46, 0.25)',
    marginBottom: spacing.xxl,
  },
  backgroundWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.18,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 26, 20, 0.88)',
  },
  content: {
    padding: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(167, 226, 46, 0.15)',
    borderColor: 'rgba(167, 226, 46, 0.3)',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
    marginBottom: spacing.md,
  },
  badgeIcon: {
    color: colors.primary,
    fontSize: 12,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    ...typography.heading,
    fontSize: 24,
    lineHeight: 30,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: '#B0B8B2',
    marginBottom: spacing.lg,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  actionButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  actionIconPrimaryWrapper: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(15, 18, 8, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionIconPrimary: {
    width: 26,
    height: 26,
  },
  actionTextColumn: {
    flex: 1,
  },
  actionTitlePrimary: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '700',
  },
  actionSubtitlePrimary: {
    color: '#2A3816',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  actionArrowPrimary: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  actionButtonSecondary: {
    backgroundColor: 'rgba(22, 38, 30, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(167, 226, 46, 0.2)',
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  actionIconSecondaryWrapper: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(167, 226, 46, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionIconSecondary: {
    width: 24,
    height: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionTitleSecondary: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  soonPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  soonPillText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  actionSubtitleSecondary: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  actionArrowSecondary: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});
