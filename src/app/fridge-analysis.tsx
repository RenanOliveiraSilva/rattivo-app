import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, radius, spacing } from '@/theme/tokens';
import { useIngredientPhotos } from '@/contexts/IngredientPhotosContext';

export default function FridgeAnalysisScreen() {
  const router = useRouter();
  const { photos, clearPhotos } = useIngredientPhotos();

  const handleReturnHome = () => {
    clearPhotos();
    router.replace('/(tabs)');
  };

  const handleRecapture = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ícone de status */}
        <View style={styles.iconCircle}>
          <Text style={styles.sparkleIcon}>✦</Text>
        </View>

        {/* Título e Subtítulo */}
        <Text style={styles.title}>Fotos prontas para análise</Text>
        <Text style={styles.subtitle}>
          O reconhecimento de ingredientes por visão computacional e a geração de receitas
          personalizadas serão integrados na próxima etapa.
        </Text>

        {/* Resumo das fotos capturadas */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Fotos selecionadas</Text>
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>
                {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
              </Text>
            </View>
          </View>

          {photos.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma foto selecionada nesta sessão.</Text>
          ) : (
            <View style={styles.photoGrid}>
              {photos.map((item, index) => (
                <View key={item.id} style={styles.photoCard}>
                  <Image source={{ uri: item.uri }} style={styles.photoPreview} />
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoLabel}>Prateleira #{index + 1}</Text>
                    <Text style={styles.photoMeta}>
                      {item.source === 'camera' ? '📷 Câmera' : '🖼️ Galeria'}
                      {item.width && item.height ? ` · ${item.width}x${item.height}` : ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Card informativo de arquitetura */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Próxima etapa (Task 04)</Text>
          <Text style={styles.infoDescription}>
            As imagens capturadas serão submetidas ao serviço de IA para extração e
            categorização dos ingredientes disponíveis, preservando sua privacidade e
            sem depender de listas digitadas manualmente.
          </Text>
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleReturnHome}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a página inicial"
          >
            <Text style={styles.primaryButtonText}>Voltar ao Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRecapture}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Tirar novas fotos"
          >
            <Text style={styles.secondaryButtonText}>Ajustar fotos</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(167, 226, 46, 0.12)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  sparkleIcon: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  badgeCount: {
    backgroundColor: 'rgba(167, 226, 46, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.badge,
  },
  badgeCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  photoGrid: {
    gap: 12,
  },
  photoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: 8,
    gap: 12,
  },
  photoPreview: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    backgroundColor: '#0F120E',
  },
  photoInfo: {
    flex: 1,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  photoMeta: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#151913',
    borderRadius: radius.card,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.textSecondary,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
  },
  secondaryButton: {
    width: '100%',
    height: 50,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
