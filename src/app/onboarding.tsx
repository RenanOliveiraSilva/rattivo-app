import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { ProgressDots } from '@/components/ProgressDots';
import { useAuth } from '@/contexts/AuthContext';
import { colors, radius, spacing, typography } from '@/theme/tokens';

interface StepData {
  heroImage: ImageSourcePropType;
  badgeImage: ImageSourcePropType;
  kicker: string;
  title: string;
  description: string;
}

const STEPS: StepData[] = [
  {
    heroImage: require('@/../assets/images/onboarding/hero-1.png'),
    badgeImage: require('@/../assets/images/onboarding/badge-vision.png'),
    kicker: 'VISÃO COMPUTACIONAL',
    title: 'Sua cozinha ficou\ninteligente.',
    description:
      'Uma câmera externa sobre a bancada reconhece os ingredientes disponíveis. Sem segurar o celular, sem digitar listas.',
  },
  {
    heroImage: require('@/../assets/images/onboarding/hero-2.png'),
    badgeImage: require('@/../assets/images/onboarding/badge-fitness.png'),
    kicker: 'PERSONALIZAÇÃO FITNESS',
    title: 'Seus objetivos, suas\nreceitas.',
    description:
      'Receitas ajustadas à sua meta (ganho de massa, manutenção ou perda de gordura), às suas preferências e restrições.',
  },
  {
    heroImage: require('@/../assets/images/onboarding/hero-3.png'),
    badgeImage: require('@/../assets/images/onboarding/badge-assistant.png'),
    kicker: 'ASSISTENTE PROATIVO',
    title: 'Cozinhe. O Rattivo\nacompanha.',
    description:
      'O Chef IA observa o preparo, percebe quando uma etapa termina e orienta você por voz, no momento certo.',
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;
  const currentData = STEPS[currentStep];

  const handleNext = async () => {
    if (isLastStep) {
      await completeOnboarding();
      router.replace('/login');
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <OnboardingHeader onSkip={handleSkip} showSkip={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagem Hero do Prato/Ingredientes */}
        <View style={styles.heroWrapper}>
          <Image
            source={currentData.heroImage}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Gradiente escuro sutil inferior */}
          <View style={styles.heroOverlay} />
        </View>

        {/* Conteúdo Informativo */}
        <View style={styles.contentContainer}>
          {/* Badge com ícone de contexto */}
          <View style={styles.badgeWrapper}>
            <Image
              source={currentData.badgeImage}
              style={styles.badgeImage}
              resizeMode="contain"
            />
          </View>

          {/* Rótulo de categoria (kicker) */}
          <Text style={styles.kicker}>{currentData.kicker}</Text>

          {/* Título de destaque */}
          <Text style={styles.title}>{currentData.title}</Text>

          {/* Descrição em cinza */}
          <Text style={styles.description}>{currentData.description}</Text>

          {/* Indicador de progresso (barra + círculos) */}
          <View style={styles.dotsWrapper}>
            <ProgressDots currentStep={currentStep} totalSteps={3} />
          </View>
        </View>
      </ScrollView>

      {/* Barra inferior de ações */}
      <View style={styles.footer}>
        {!isFirstStep && (
          <Button
            title="Voltar"
            onPress={handleBack}
            variant="secondary"
            flex={1}
            style={styles.backButton}
          />
        )}
        <Button
          title={isLastStep ? 'Começar agora' : 'Avançar'}
          onPress={handleNext}
          variant="primary"
          showArrow={true}
          flex={isFirstStep ? undefined : 2}
          style={isFirstStep ? styles.fullWidthButton : undefined}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.md,
  },
  heroWrapper: {
    width: '100%',
    height: 330,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.background,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'transparent',
    borderBottomWidth: 70,
    borderBottomColor: colors.background,
    opacity: 0.9,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  badgeWrapper: {
    width: 56,
    height: 56,
    borderRadius: radius.badge,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  kicker: {
    ...typography.kicker,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.display,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  dotsWrapper: {
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  backButton: {
    marginRight: 2,
  },
  fullWidthButton: {
    width: '100%',
  },
});

