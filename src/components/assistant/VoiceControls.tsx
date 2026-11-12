import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

interface VoiceControlsProps {
  onToggleKeyboard: () => void;
  onSimulateVoiceQuery: () => void;
  onToggleSpeech: () => void;
  isSpeaking: boolean;
  disabled?: boolean;
}

export function VoiceControls({
  onToggleKeyboard,
  onSimulateVoiceQuery,
  onToggleSpeech,
  isSpeaking,
  disabled = false,
}: VoiceControlsProps) {
  const [isPressingVoice, setIsPressingVoice] = useState(false);

  const handlePressIn = () => {
    if (disabled) return;
    setIsPressingVoice(true);
  };

  const handlePressOut = () => {
    if (disabled) return;
    setIsPressingVoice(false);
    onSimulateVoiceQuery();
  };

  return (
    <View style={styles.container}>
      {/* Botão de Teclado */}
      <TouchableOpacity
        style={[styles.squareButton, disabled && styles.buttonDisabled]}
        onPress={onToggleKeyboard}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Digitar pergunta pelo teclado"
      >
        <Text style={styles.iconText}>⌨️</Text>
      </TouchableOpacity>

      {/* Botão Central: Segure para falar (Simulado) */}
      <TouchableOpacity
        style={[
          styles.voiceButton,
          isPressingVoice && styles.voiceButtonPressed,
          disabled && styles.buttonDisabled,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Segure para falar demonstração"
      >
        <Text style={styles.micIcon}>🎙️</Text>
        <Text style={styles.voiceButtonText}>
          {isPressingVoice ? 'Solte para enviar' : 'Segure para falar'}
        </Text>
      </TouchableOpacity>

      {/* Botão de Leitura em Voz Alta (TTS) */}
      <TouchableOpacity
        style={[
          styles.squareButton,
          isSpeaking && styles.squareButtonActive,
          disabled && styles.buttonDisabled,
        ]}
        onPress={onToggleSpeech}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={isSpeaking ? 'Parar leitura em voz alta' : 'Ouvir orientação em voz alta'}
      >
        <Text style={[styles.iconText, isSpeaking && styles.iconActive]}>
          {isSpeaking ? '⏹' : '🔊'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: Platform.OS === 'ios' ? 88 : 74,
    gap: 12,
  },
  squareButton: {
    width: 52,
    height: 52,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  squareButtonActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(167, 226, 46, 0.12)',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  iconText: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  iconActive: {
    color: colors.primary,
  },
  voiceButton: {
    flex: 1,
    height: 52,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  voiceButtonPressed: {
    backgroundColor: '#8BC324',
    transform: [{ scale: 0.98 }],
  },
  micIcon: {
    fontSize: 18,
  },
  voiceButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryText,
  },
});

