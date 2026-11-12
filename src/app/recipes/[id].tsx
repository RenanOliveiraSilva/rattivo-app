import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { getRecipe } from '@/api/recipes';
import { listCookingSessions, startCookingSession } from '@/api/cooking';
import { RecipeView } from '@/api/types';
import { colors, radius, spacing } from '@/theme/tokens';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, logout } = useAuth();

  const [recipe, setRecipe] = useState<RecipeView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipeDetail = useCallback(async () => {
    if (!token || !id) return;
    try {
      setError(null);
      const data = await getRecipe(token, id);
      setRecipe(data);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'status' in err && (err as { status?: number }).status === 401) {
        await logout();
        return;
      }
      setError('Não foi possível obter os detalhes da receita informada.');
    }
  }, [token, id, logout]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!token || !id) return;
      try {
        setError(null);
        const data = await getRecipe(token, id);
        if (isMounted) {
          setRecipe(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (typeof err === 'object' && err !== null && 'status' in err && (err as { status?: number }).status === 401) {
            await logout();
            return;
          }
          setError('Não foi possível obter os detalhes da receita informada.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [token, id, logout]);

  const executeStartSession = async () => {
    if (!token || !id) return;

    try {
      setIsStarting(true);
      await startCookingSession(token, id);
      router.replace('/(tabs)/assistant');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao iniciar o preparo guiado.';
      Alert.alert('Erro ao iniciar preparo', msg);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStartCooking = async () => {
    if (!token || !id) return;

    try {
      setIsStarting(true);
      const page = await listCookingSessions(token, 0, 5);
      const existing = page.items.find(
        (s) => s.status === 'ACTIVE' || s.status === 'PAUSED'
      );

      if (existing) {
        setIsStarting(false);
        Alert.alert(
          'Sessão em andamento',
          `Você já possui um preparo em andamento para "${existing.recipeName}". Deseja continuar o preparo existente ou iniciar um novo?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Continuar anterior',
              onPress: () => {
                router.replace('/(tabs)/assistant');
              },
            },
            {
              text: 'Iniciar novo',
              style: 'destructive',
              onPress: () => {
                executeStartSession();
              },
            },
          ]
        );
        return;
      }

      await executeStartSession();
    } catch (err: unknown) {
      setIsStarting(false);
      const msg = err instanceof Error ? err.message : 'Não foi possível verificar sessões anteriores.';
      Alert.alert('Erro', msg);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />

      {/* Header com botão voltar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a lista de receitas"
        >
          <Text style={styles.backChevron}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {recipe?.name || 'Detalhes da Receita'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando receita...</Text>
        </View>
      ) : error || !recipe ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error || 'Receita não encontrada.'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setIsLoading(true);
              fetchRecipeDetail().finally(() => setIsLoading(false));
            }}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Título e Descrição */}
            <View style={styles.heroSection}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>RECEITA GUIADA</Text>
              </View>
              <Text style={styles.title}>{recipe.name}</Text>
              <Text style={styles.description}>{recipe.description}</Text>
              {recipe.preparationNotes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesTitle}>Dica de preparo</Text>
                  <Text style={styles.notesText}>{recipe.preparationNotes}</Text>
                </View>
              ) : null}
            </View>

            {/* Seção de Ingredientes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Ingredientes ({recipe.ingredients.length})
              </Text>
              <View style={styles.ingredientsList}>
                {recipe.ingredients.map((ing, idx) => (
                  <View key={`${ing.name}-${idx}`} style={styles.ingredientRow}>
                    <Text style={styles.ingredientBullet}>•</Text>
                    <Text style={styles.ingredientName}>{ing.name}</Text>
                    <Text style={styles.ingredientQuantity}>{ing.quantity}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Seção de Etapas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Passo a passo ({recipe.steps.length} etapas)
              </Text>
              <View style={styles.stepsList}>
                {recipe.steps.map((st) => (
                  <View key={st.id} style={styles.stepCard}>
                    <View style={styles.stepHeader}>
                      <View style={styles.stepNumberBadge}>
                        <Text style={styles.stepNumberText}>{st.number}</Text>
                      </View>
                      <Text style={styles.stepLabel}>Etapa {st.number}</Text>
                    </View>

                    <Text style={styles.stepInstruction}>{st.instruction}</Text>

                    {st.visualCheck ? (
                      <View style={styles.visualCheckBox}>
                        <Text style={styles.visualCheckTitle}>👁️ Observe na bancada:</Text>
                        <Text style={styles.visualCheckText}>{st.visualCheck}</Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>

            {/* Aviso de Confirmação Humana */}
            <View style={styles.confirmationNotice}>
              <Text style={styles.noticeIcon}>ℹ️</Text>
              <Text style={styles.noticeText}>
                O assistente acompanha visualmente o preparo pela câmera, mas o avanço de cada
                etapa exige a sua confirmação explícita.
              </Text>
            </View>
          </ScrollView>

          {/* Barra Fixa Inferior com CTA Iniciar Preparo */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.startButton, isStarting && styles.startButtonDisabled]}
              onPress={handleStartCooking}
              disabled={isStarting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Iniciar preparo guiado com Chef Rattito"
            >
              {isStarting ? (
                <ActivityIndicator color={colors.primaryText} size="small" />
              ) : (
                <>
                  <Text style={styles.startButtonText}>Iniciar preparo</Text>
                  <Text style={styles.startButtonArrow}>→</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
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
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 110,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 15,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  retryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  heroSection: {
    marginBottom: spacing.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.badge,
    borderWidth: 1,
    borderColor: colors.badgeBorder,
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  notesBox: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  ingredientsList: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  ingredientBullet: {
    color: colors.primary,
    fontSize: 16,
    marginRight: 8,
  },
  ingredientName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  ingredientQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  stepsList: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryText,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepInstruction: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  visualCheckBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: 8,
    marginTop: 4,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  visualCheckTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  visualCheckText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  confirmationNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#161914',
    borderRadius: radius.card,
    padding: spacing.md,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  noticeIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  startButton: {
    width: '100%',
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: radius.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
  },
  startButtonArrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
});
