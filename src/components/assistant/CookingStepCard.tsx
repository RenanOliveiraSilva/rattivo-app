import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Assessment, SessionView } from '@/api/types';
import { colors, radius, spacing } from '@/theme/tokens';

interface CookingStepCardProps {
  session: SessionView;
  isPerformingAction: boolean;
  onConfirmStep: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

export function CookingStepCard({
  session,
  isPerformingAction,
  onConfirmStep,
  onPause,
  onResume,
  onCancel,
}: CookingStepCardProps) {
  const { currentStep, totalSteps, completedSteps, status, latestObservation } = session;
  const isPaused = status === 'PAUSED';

  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const handleConfirmPress = () => {
    if (!currentStep) return;

    Alert.alert(
      `Confirmar etapa ${currentStep.number}?`,
      'Você concluiu o preparo desta etapa na bancada e deseja avançar para o próximo passo?',
      [
        { text: 'Ainda não', style: 'cancel' },
        {
          text: 'Sim, confirmar etapa',
          onPress: onConfirmStep,
        },
      ]
    );
  };

  const handleCancelPress = () => {
    Alert.alert(
      'Cancelar sessão de preparo?',
      'O progresso desta receita será interrompido e a sessão será encerrada.',
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Sim, cancelar preparo',
          style: 'destructive',
          onPress: onCancel,
        },
      ]
    );
  };

  const getAssessmentBadge = (assessment?: Assessment) => {
    switch (assessment) {
      case 'READY_FOR_CONFIRMATION':
        return { label: 'Pronto para confirmar', color: colors.primary, bg: 'rgba(167, 226, 46, 0.15)' };
      case 'NEEDS_ADJUSTMENT':
        return { label: 'Ajuste necessário', color: colors.statusWarning, bg: 'rgba(234, 179, 8, 0.15)' };
      case 'IN_PROGRESS':
        return { label: 'Em andamento', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' };
      case 'INCONCLUSIVE':
      default:
        return { label: 'Aguardando câmera', color: colors.textSecondary, bg: 'rgba(158, 163, 168, 0.15)' };
    }
  };

  const badgeInfo = getAssessmentBadge(latestObservation?.assessment);

  return (
    <View style={styles.card}>
      {/* Cabeçalho do Card com Etapa e Progresso */}
      <View style={styles.cardHeader}>
        <View style={styles.stepInfo}>
          <Text style={styles.stepTitle}>
            {currentStep ? `Etapa ${currentStep.number} de ${totalSteps}` : 'Preparo concluído'}
          </Text>
          <Text style={styles.stepSub}>
            {completedSteps} {completedSteps === 1 ? 'etapa concluída' : 'etapas concluídas'}
          </Text>
        </View>

        {isPaused ? (
          <View style={styles.pausedBadge}>
            <Text style={styles.pausedBadgeText}>PAUSADA</Text>
          </View>
        ) : (
          <View style={[styles.assessmentBadge, { backgroundColor: badgeInfo.bg }]}>
            <Text style={[styles.assessmentBadgeText, { color: badgeInfo.color }]}>
              {badgeInfo.label}
            </Text>
          </View>
        )}
      </View>

      {/* Barra de Progresso */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${Math.min(progressPercent, 100)}%` }]} />
      </View>

      {/* Instrução da Etapa */}
      {currentStep ? (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>{currentStep.instruction}</Text>

          {currentStep.visualCheck ? (
            <View style={styles.visualCheckBox}>
              <Text style={styles.visualCheckTitle}>👁️ Ponto de observação:</Text>
              <Text style={styles.visualCheckText}>{currentStep.visualCheck}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Orientação recebida da bancada (Webcam / IA) */}
      <View style={styles.guidanceBox}>
        <View style={styles.guidanceHeader}>
          <Text style={styles.guidanceTitle}>Orientação da bancada</Text>
          {latestObservation ? (
            <Text style={styles.guidanceTime}>Câmera ativa</Text>
          ) : null}
        </View>

        {latestObservation?.guidance ? (
          <Text style={styles.guidanceText}>{latestObservation.guidance}</Text>
        ) : (
          <Text style={styles.guidancePlaceholder}>
            Aguardando a próxima leitura da câmera da bancada.
          </Text>
        )}
      </View>

      {/* Controles de Ação de Preparo */}
      <View style={styles.actionsContainer}>
        {/* Botão de Confirmar Etapa (Avanço Humano) */}
        {currentStep ? (
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (isPaused || isPerformingAction) && styles.buttonDisabled,
            ]}
            onPress={handleConfirmPress}
            disabled={isPaused || isPerformingAction}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Confirmar etapa ${currentStep.number}`}
          >
            {isPerformingAction ? (
              <ActivityIndicator color={colors.primaryText} size="small" />
            ) : (
              <>
                <Text style={styles.confirmButtonText}>
                  {currentStep.number === totalSteps ? 'Concluir receita' : 'Confirmar etapa'}
                </Text>
                <Text style={styles.confirmArrow}>✓</Text>
              </>
            )}
          </TouchableOpacity>
        ) : null}

        {/* Botões Secundários: Pausar/Retomar e Cancelar */}
        <View style={styles.secondaryActionsRow}>
          {isPaused ? (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onResume}
              disabled={isPerformingAction}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>▶ Retomar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onPause}
              disabled={isPerformingAction}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>⏸ Pausar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.secondaryButton, styles.cancelButton]}
            onPress={handleCancelPress}
            disabled={isPerformingAction}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>✕ Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  assessmentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.badge,
  },
  assessmentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pausedBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.badge,
  },
  pausedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.statusWarning,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  instructionContainer: {
    marginBottom: spacing.md,
  },
  instructionText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  visualCheckBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: 8,
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
    lineHeight: 16,
  },
  guidanceBox: {
    backgroundColor: '#151913',
    borderRadius: radius.card,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  guidanceTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  guidanceTime: {
    fontSize: 10,
    color: colors.primary,
  },
  guidanceText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  guidancePlaceholder: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  actionsContainer: {
    gap: 8,
  },
  confirmButton: {
    height: 48,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryText,
  },
  confirmArrow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    height: 40,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cancelButton: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
});

