import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { useIngredientPhotos } from '@/contexts/IngredientPhotosContext';
import { analyzeFridgePhotos } from '@/api/fridge';
import {
  FridgeAnalysisView,
  IngredientConfidence,
} from '@/api/types';
import { ApiClientError } from '@/api/client';
import { colors, radius, spacing } from '@/theme/tokens';

export default function FridgeAnalysisScreen() {
  const router = useRouter();
  const { token, logout, user } = useAuth();
  const { photos, clearPhotos } = useIngredientPhotos();

  const [analysisResult, setAnalysisResult] = useState<FridgeAnalysisView | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(photos.length > 0);
  const [errorInfo, setErrorInfo] = useState<{
    title: string;
    message: string;
    canRetry: boolean;
  } | null>(null);

  const hasRequestedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Redirecionamento de segurança para usuário não autenticado
  useEffect(() => {
    if (!token || !user) {
      router.replace('/login');
    }
  }, [token, user, router]);

  // Executa a análise real das fotos
  const executeAnalysis = useCallback(async () => {
    if (!token || photos.length === 0) return;

    setIsLoading(true);
    setErrorInfo(null);

    try {
      const data = await analyzeFridgePhotos(token, photos);
      if (isMountedRef.current) {
        setAnalysisResult(data);
      }
    } catch (err: unknown) {
      if (!isMountedRef.current) return;

      if (err instanceof ApiClientError) {
        if (err.status === 401) {
          await logout();
          return;
        }

        if (err.status === 413 || err.code === 'PAYLOAD_TOO_LARGE') {
          setErrorInfo({
            title: 'Fotos muito grandes',
            message:
              'O tamanho das fotos enviadas ultrapassou o limite do servidor (máximo de 5 MiB por foto ou 12 MiB somados). Ajuste as fotos e tente novamente.',
            canRetry: false,
          });
          return;
        }

        if (err.status === 400 || err.code === 'INVALID_REQUEST') {
          setErrorInfo({
            title: 'Fotos inválidas',
            message:
              err.message ||
              'Uma ou mais fotos selecionadas não puderam ser validadas. Verifique se são imagens nos formatos JPEG, PNG ou WebP.',
            canRetry: false,
          });
          return;
        }

        if (err.status === 502 || err.code === 'AI_INVALID_RESPONSE') {
          setErrorInfo({
            title: 'Resposta não interpretada',
            message:
              'A inteligência artificial não conseguiu processar as imagens enviadas. Tente novamente com melhor iluminação e enquadramento.',
            canRetry: true,
          });
          return;
        }

        if (err.status === 503 || err.code === 'AI_UNAVAILABLE') {
          setErrorInfo({
            title: 'Serviço temporariamente indisponível',
            message:
              'O serviço de visão computacional da IA está indisponível no momento. Verifique a conexão do servidor e tente em instantes.',
            canRetry: true,
          });
          return;
        }

        if (err.status === 504 || err.code === 'TIMEOUT') {
          setErrorInfo({
            title: 'Tempo limite excedido',
            message:
              'O processamento demorou mais que o esperado (30 segundos). Sua conexão ou o serviço podem estar lentos. Deseja tentar novamente?',
            canRetry: true,
          });
          return;
        }

        if (err.code === 'NETWORK_ERROR') {
          setErrorInfo({
            title: 'Falha de conexão',
            message:
              'Não foi possível conectar ao servidor. Verifique se o backend está ligado e se o celular está conectado na mesma rede Wi-Fi.',
            canRetry: true,
          });
          return;
        }

        setErrorInfo({
          title: 'Erro na análise',
          message: err.message || 'Ocorreu uma falha ao processar as fotos da geladeira.',
          canRetry: true,
        });
      } else {
        setErrorInfo({
          title: 'Erro inesperado',
          message: 'Ocorreu um erro inesperado durante a comunicação. Tente novamente.',
          canRetry: true,
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [token, photos, logout]);

  // Dispara uma única requisição automática ao montar
  useEffect(() => {
    isMountedRef.current = true;

    if (!hasRequestedRef.current && photos.length > 0 && token) {
      hasRequestedRef.current = true;
      executeAnalysis();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [executeAnalysis, photos.length, token]);

  // Ações de navegação e saída
  const handleReturnHome = () => {
    clearPhotos();
    router.replace('/(tabs)');
  };

  const handleAdjustPhotos = () => {
    // Preserva as fotos para ajuste
    router.back();
  };

  const handleOpenRecipe = (recipeId: string) => {
    clearPhotos();
    router.push(`/recipes/${recipeId}`);
  };

  const handleRetry = () => {
    executeAnalysis();
  };

  const renderConfidenceBadge = (confidence: IngredientConfidence) => {
    let label = 'Confiança média';
    let textColor: string = colors.statusWarning;
    let bgColor: string = 'rgba(234, 179, 8, 0.15)';

    if (confidence === 'HIGH') {
      label = 'Confiança alta';
      textColor = colors.primary;
      bgColor = 'rgba(167, 226, 46, 0.15)';
    } else if (confidence === 'LOW') {
      label = 'Confiança baixa';
      textColor = colors.textSecondary;
      bgColor = 'rgba(158, 163, 168, 0.15)';
    }

    return (
      <View style={[styles.confidenceBadge, { backgroundColor: bgColor }]}>
        <Text style={[styles.confidenceBadgeText, { color: textColor }]}>{label}</Text>
      </View>
    );
  };

  // 1. Estado sem fotos
  if (photos.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="light" />
        <View style={styles.centerContainer}>
          <Text style={styles.iconBig}>📷</Text>
          <Text style={styles.stateTitle}>Nenhuma foto para analisar</Text>
          <Text style={styles.stateSubtitle}>
            Tire até 3 fotos da sua geladeira ou escolha da galeria para que o Chef IA possa
            identificar os ingredientes disponíveis.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/fridge-capture')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Ir para a câmera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />

      {/* Cabeçalho */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleAdjustPhotos}
          disabled={isLoading}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a câmera"
        >
          <Text style={[styles.backChevron, isLoading && { opacity: 0.3 }]}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Análise da Geladeira</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo compacto das fotos enviadas */}
        <View style={styles.photosSummaryCard}>
          <View style={styles.photosSummaryHeader}>
            <Text style={styles.photosSummaryTitle}>Fotos em análise</Text>
            <Text style={styles.photosCountBadge}>
              {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
            </Text>
          </View>
          <View style={styles.photosThumbRow}>
            {photos.map((item, index) => (
              <View key={item.id} style={styles.miniThumbWrapper}>
                <Image source={{ uri: item.uri }} style={styles.miniThumb} />
                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeText}>{index + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ESTADO 1: Carregando com IA */}
        {isLoading && (
          <View style={styles.loadingBox}>
            <View style={styles.loadingSpinnerWrapper}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
            <Text style={styles.loadingTitle}>Analisando ingredientes com IA...</Text>
            <Text style={styles.loadingSubtitle}>
              Identificando alimentos visíveis em cada prateleira e cruzando com o catálogo de receitas do Rattivo.
            </Text>
            <View style={styles.loadingTipBox}>
              <Text style={styles.loadingTipText}>
                ⏱️ Isso costuma levar alguns segundos. Por favor, aguarde.
              </Text>
            </View>
          </View>
        )}

        {/* ESTADO 2: Erro recuperável */}
        {!isLoading && errorInfo && (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>{errorInfo.title}</Text>
            <Text style={styles.errorMessage}>{errorInfo.message}</Text>

            <View style={styles.errorActions}>
              {errorInfo.canRetry && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleRetry}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Tentar novamente</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleAdjustPhotos}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Ajustar fotos</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ESTADO 3 e 4: Sucesso com resposta da análise */}
        {!isLoading && !errorInfo && analysisResult && (
          <View style={styles.resultsContainer}>
            {/* Bloco de Ingredientes */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingredientes identificados</Text>
                <View style={styles.countPill}>
                  <Text style={styles.countPillText}>
                    {analysisResult.ingredients.length} encontrados
                  </Text>
                </View>
              </View>

              {analysisResult.ingredients.length === 0 ? (
                <View style={styles.emptyIngredientsBox}>
                  <Text style={styles.emptyIngredientsIcon}>🔍</Text>
                  <Text style={styles.emptyIngredientsTitle}>
                    Nenhum ingrediente identificado com segurança
                  </Text>
                  <Text style={styles.emptyIngredientsText}>
                    Não identificamos alimentos visíveis do nosso catálogo nestas fotos.
                  </Text>
                  <View style={styles.tipsList}>
                    <Text style={styles.tipItem}>• Melhore a iluminação do ambiente</Text>
                    <Text style={styles.tipItem}>• Aproxime mais a câmera das prateleiras</Text>
                    <Text style={styles.tipItem}>• Retire embalagens opacas ou fechadas</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.ingredientsGrid}>
                  {analysisResult.ingredients.map((item, idx) => (
                    <View key={`${item.name}-${idx}`} style={styles.ingredientItem}>
                      <View style={styles.ingredientDot} />
                      <Text style={styles.ingredientName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      {renderConfidenceBadge(item.confidence)}
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Bloco de Receitas Recomendadas */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Receitas sugeridas</Text>
                <Text style={styles.sectionSub}>com os itens visíveis</Text>
              </View>

              {analysisResult.recommendations.length === 0 ? (
                <View style={styles.noRecipesBox}>
                  <Text style={styles.noRecipesText}>
                    {analysisResult.ingredients.length > 0
                      ? 'Não há receitas no catálogo que combinem com todos os ingredientes identificados no momento.'
                      : 'Nenhuma receita pôde ser sugerida sem ingredientes identificados.'}
                  </Text>
                  <TouchableOpacity
                    style={styles.catalogButton}
                    onPress={() => {
                      clearPhotos();
                      router.replace('/(tabs)/recipes');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.catalogButtonText}>Ver catálogo completo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.recommendationsList}>
                  {analysisResult.recommendations.map((rec) => (
                    <View key={rec.recipeId} style={styles.recipeCard}>
                      <View style={styles.recipeCardHeader}>
                        <Text style={styles.recipeName}>{rec.name}</Text>
                        <View style={styles.matchBadge}>
                          <Text style={styles.matchBadgeText}>
                            {rec.matchPercentage}% correspondência
                          </Text>
                        </View>
                      </View>

                      {/* Ingredientes encontrados */}
                      {rec.matchedIngredients.length > 0 && (
                        <View style={styles.ingredientsGroup}>
                          <Text style={styles.ingredientsGroupLabel}>Você tem:</Text>
                          <View style={styles.tagWrap}>
                            {rec.matchedIngredients.map((ing, i) => (
                              <View key={`${ing}-${i}`} style={styles.tagMatched}>
                                <Text style={styles.tagMatchedText}>✓ {ing}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Ingredientes ausentes */}
                      {rec.missingIngredients.length > 0 && (
                        <View style={styles.ingredientsGroup}>
                          <Text style={styles.ingredientsGroupLabel}>Falta providenciar:</Text>
                          <View style={styles.tagWrap}>
                            {rec.missingIngredients.map((ing, i) => (
                              <View key={`${ing}-${i}`} style={styles.tagMissing}>
                                <Text style={styles.tagMissingText}>✗ {ing}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Ação Ver Receita */}
                      <TouchableOpacity
                        style={styles.recipeCtaButton}
                        onPress={() => handleOpenRecipe(rec.recipeId)}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={`Ver receita de ${rec.name}`}
                      >
                        <Text style={styles.recipeCtaText}>Ver receita</Text>
                        <Text style={styles.recipeCtaArrow}>→</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Advertências oficiais retornadas pelo backend */}
            {analysisResult.warnings && analysisResult.warnings.length > 0 && (
              <View style={styles.warningsCard}>
                <View style={styles.warningsHeader}>
                  <Text style={styles.warningsIcon}>ⓘ</Text>
                  <Text style={styles.warningsTitle}>Avisos importantes</Text>
                </View>
                {analysisResult.warnings.map((warn, i) => (
                  <Text key={`warn-${i}`} style={styles.warningText}>
                    • {warn}
                  </Text>
                ))}
              </View>
            )}

            {/* Ações Inferiores */}
            <View style={styles.bottomActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleAdjustPhotos}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Tirar novas fotos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleReturnHome}
                activeOpacity={0.7}
              >
                <Text style={styles.linkButtonText}>Voltar ao Início</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  backChevron: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '300',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  photosSummaryCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
  },
  photosSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  photosSummaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  photosCountBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  photosThumbRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniThumbWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: '#0E100D',
  },
  miniThumb: {
    width: '100%',
    height: '100%',
  },
  miniBadge: {
    position: 'absolute',
    top: 3,
    left: 3,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBadgeText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingBox: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  loadingSpinnerWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(167, 226, 46, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  loadingSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  loadingTipBox: {
    backgroundColor: '#151913',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  loadingTipText: {
    fontSize: 12,
    color: colors.primary,
  },
  errorCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: spacing.xl,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  errorIcon: {
    fontSize: 34,
    marginBottom: spacing.sm,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.error,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorActions: {
    width: '100%',
    gap: 12,
  },
  resultsContainer: {
    gap: spacing.lg,
  },
  sectionCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  countPill: {
    backgroundColor: 'rgba(167, 226, 46, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.badge,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  ingredientsGrid: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.sm,
    gap: 10,
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  ingredientName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.badge,
  },
  confidenceBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyIngredientsBox: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  emptyIngredientsIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  emptyIngredientsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyIngredientsText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  tipsList: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.md,
    gap: 4,
  },
  tipItem: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  noRecipesBox: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 12,
  },
  noRecipesText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  catalogButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  catalogButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  recommendationsList: {
    gap: 14,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    gap: 10,
  },
  recipeCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  recipeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  matchBadge: {
    backgroundColor: 'rgba(167, 226, 46, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.badge,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  ingredientsGroup: {
    gap: 4,
  },
  ingredientsGroupLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagMatched: {
    backgroundColor: '#1E281A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(167, 226, 46, 0.3)',
  },
  tagMatchedText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  tagMissing: {
    backgroundColor: '#20241E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#30362C',
  },
  tagMissingText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  recipeCtaButton: {
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  recipeCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryText,
  },
  recipeCtaArrow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
  warningsCard: {
    backgroundColor: '#151913',
    borderRadius: radius.card,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    gap: 4,
  },
  warningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  warningsIcon: {
    fontSize: 14,
    color: colors.primary,
  },
  warningsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  warningText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  bottomActions: {
    gap: 12,
    marginTop: spacing.sm,
  },
  primaryButton: {
    width: '100%',
    height: 50,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryText,
  },
  secondaryButton: {
    width: '100%',
    height: 48,
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
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: 12,
  },
  iconBig: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
