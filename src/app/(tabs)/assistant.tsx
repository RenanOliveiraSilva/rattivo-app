import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useCookingSession } from '@/hooks/useCookingSession';
import { colors, radius, spacing } from '@/theme/tokens';
import { ChefHeader } from '@/components/assistant/ChefHeader';
import { CookingStepCard } from '@/components/assistant/CookingStepCard';
import { ChatMessage, ChatMessages } from '@/components/assistant/ChatMessages';
import { QuickSuggestions } from '@/components/assistant/QuickSuggestions';

const chefAvatar = require('@/../assets/images/brand-mark.png');

const DEFAULT_SUGGESTIONS = [
  'Qual é a etapa atual?',
  'O que devo observar?',
  'A câmera detectou algo?',
  'Posso confirmar a etapa?',
  'Quais ingredientes tenho disponíveis?',
];

export default function AssistantScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();

  const [isFocused, setIsFocused] = useState(true);

  const defaultWelcome: ChatMessage = {
    id: 'welcome',
    sender: 'assistant',
    text: user?.displayName
      ? `Oi, ${user.displayName.split(' ')[0]}! Estou de olho na bancada. Posso ajudar com a receita, dúvidas da etapa atual ou orientações da câmera.`
      : 'Oi! Estou de olho na bancada. Posso ajudar com a receita, dúvidas da etapa atual ou orientações da câmera.',
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([defaultWelcome]);
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => setIsFocused(true));
    const unsubBlur = navigation.addListener('blur', () => {
      setIsFocused(false);
    });

    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation]);

  const {
    session,
    isLoading,
    isSyncing,
    error,
    actionError,
    isPerformingAction,
    pauseSession,
    resumeSession,
    cancelSession,
    confirmStep,
    refresh,
    clearActionError,
  } = useCookingSession({ isFocused });

  // Responde a dúvidas locais simuladas baseadas nos dados reais da sessão
  const handleSendMessage = (text: string) => {
    if (!text.trim() || !session) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    let reply = '';
    const lower = text.toLowerCase();
    const currentStep = session.currentStep;

    if (lower.includes('etapa') || lower.includes('passo')) {
      if (currentStep) {
        reply = `Estamos na etapa ${currentStep.number} de ${session.totalSteps}: "${currentStep.instruction}".`;
      } else {
        reply = 'Todas as etapas da receita foram concluídas com sucesso!';
      }
    } else if (lower.includes('observar') || lower.includes('olho')) {
      if (currentStep?.visualCheck) {
        reply = `Observe na bancada: ${currentStep.visualCheck}.`;
      } else if (currentStep) {
        reply = `Siga a instrução principal: ${currentStep.instruction}.`;
      } else {
        reply = 'O preparo foi finalizado.';
      }
    } else if (lower.includes('câmera') || lower.includes('detectou') || lower.includes('webcam')) {
      if (session.latestObservation) {
        const obs = session.latestObservation;
        reply = `Pela última leitura da câmera da bancada: ${obs.guidance} (Status: ${obs.assessment}).`;
      } else {
        reply = 'Aguardando a próxima leitura da câmera da bancada. Nenhum dado foi detectado recentemente.';
      }
    } else if (lower.includes('confirmar') || lower.includes('posso')) {
      if (session.status === 'PAUSED') {
        reply = 'A sessão está pausada. Retome o preparo para poder confirmar a etapa.';
      } else if (session.latestObservation?.assessment === 'READY_FOR_CONFIRMATION') {
        reply = 'A câmera da bancada indicou que a etapa parece pronta! Você pode tocar no botão "Confirmar etapa" quando quiser avançar.';
      } else if (session.latestObservation?.assessment === 'NEEDS_ADJUSTMENT') {
        reply = `A câmera sugeriu um ajuste: "${session.latestObservation.guidance}". Verifique a bancada antes de confirmar.`;
      } else {
        reply = 'O avanço de etapa exige a sua confirmação explícita. Toque em "Confirmar etapa" assim que finalizar este passo na bancada.';
      }
    } else if (lower.includes('ingrediente')) {
      reply = `Para o preparo de ${session.recipeName}, siga a quantidade indicada na receita. O reconhecimento automático de ingredientes da geladeira está em modo demonstração.`;
    } else {
      reply = `Entendido! Siga as orientações da etapa ${currentStep?.number || 1} e observe a bancada para garantir o ponto ideal.`;
    }

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      sender: 'assistant',
      text: reply,
    };

    setChatMessages((prev) => [...prev, userMsg, assistantMsg]);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ChefHeader
          recipeName={session?.recipeName}
          status={session?.status}
          isSyncing={isSyncing}
        />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Central do Chef Rattito */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Image source={chefAvatar} style={styles.avatarImage} resizeMode="cover" />
            </View>
            <Text style={styles.avatarSubtext}>
              {session?.status === 'PAUSED'
                ? 'Preparo pausado'
                : session?.status === 'COMPLETED'
                ? 'Receita finalizada'
                : 'Assistente culinário'}
            </Text>
          </View>

          {/* Feedback de erro de ação (ex: 409 conflito de revisão) */}
          {actionError ? (
            <View style={styles.errorAlert}>
              <Text style={styles.errorAlertText}>{actionError}</Text>
              <TouchableOpacity onPress={clearActionError}>
                <Text style={styles.errorAlertDismiss}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Estado de Carregamento Inicial */}
          {isLoading ? (
            <View style={styles.centerCard}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.centerText}>Buscando sessão de preparo...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerCard}>
              <Text style={styles.errorTitle}>Falha na sincronização</Text>
              <Text style={styles.centerText}>{error}</Text>
              <TouchableOpacity style={styles.actionBtn} onPress={refresh}>
                <Text style={styles.actionBtnText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : !session ? (
            /* Sem sessão ativa */
            <View style={styles.emptySessionCard}>
              <Text style={styles.emptySessionTitle}>Nenhum preparo em andamento</Text>
              <Text style={styles.emptySessionText}>
                Escolha uma receita no catálogo para iniciar o acompanhamento guiado pelo Chef
                Rattito com visão computacional.
              </Text>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push('/(tabs)/recipes')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>Explorar receitas</Text>
              </TouchableOpacity>
            </View>
          ) : session.status === 'COMPLETED' ? (
            /* Sessão concluída */
            <View style={styles.completedCard}>
              <Text style={styles.completedEmoji}>🎉</Text>
              <Text style={styles.completedTitle}>Receita concluída com sucesso!</Text>
              <Text style={styles.completedSubtitle}>
                Todas as {session.totalSteps} etapas de {session.recipeName} foram preparadas e
                confirmadas. Bom apetite!
              </Text>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push('/(tabs)/recipes')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>Fazer outra receita</Text>
              </TouchableOpacity>
            </View>
          ) : session.status === 'CANCELLED' ? (
            /* Sessão cancelada */
            <View style={styles.centerCard}>
              <Text style={styles.emptySessionTitle}>Preparo cancelado</Text>
              <Text style={styles.centerText}>
                Esta sessão de {session.recipeName} foi cancelada.
              </Text>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push('/(tabs)/recipes')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>Voltar às receitas</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Sessão Ativa ou Pausada: Card de Etapa e Controles Reais (P0) */
            <>
              <CookingStepCard
                session={session}
                isPerformingAction={isPerformingAction}
                onConfirmStep={confirmStep}
                onPause={pauseSession}
                onResume={resumeSession}
                onCancel={cancelSession}
              />

              {/* Mensagens Conversacionais (P1) */}
              <ChatMessages messages={chatMessages} />
            </>
          )}
        </ScrollView>

        {/* Pílulas de Sugestões Rápidas (P1) */}
        {session && (session.status === 'ACTIVE' || session.status === 'PAUSED') ? (
          <QuickSuggestions
            suggestions={DEFAULT_SUGGESTIONS}
            onSelect={handleSendMessage}
            disabled={isPerformingAction}
          />
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  avatarCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#1E2619',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  errorAlert: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorAlertText: {
    flex: 1,
    fontSize: 12,
    color: colors.error,
    lineHeight: 16,
  },
  errorAlertDismiss: {
    color: colors.error,
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 8,
  },
  centerCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    alignItems: 'center',
    gap: 12,
  },
  centerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  },
  emptySessionCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    alignItems: 'center',
    gap: 10,
  },
  emptySessionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptySessionText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  completedCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    alignItems: 'center',
    gap: 10,
  },
  completedEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  actionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.button,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryText,
  },
});
