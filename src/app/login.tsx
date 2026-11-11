import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiClientError } from '@/api/client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Informe seu e-mail.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Digite um e-mail válido.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Informe sua senha.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      await login({
        email: email.trim(),
        password,
      });
      router.replace('/(tabs)');
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        if (err.status === 401 || err.code === 'UNAUTHORIZED') {
          setGeneralError('E-mail ou senha incorretos. Verifique suas credenciais.');
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError('Não foi possível realizar o login. Tente novamente mais tarde.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header com Logo do Rattivo */}
          <View style={styles.header}>
            <Image
              source={require('@/../assets/images/onboarding/chef-logo.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <View style={styles.logoTextContainer}>
              <Text style={styles.brandTitle}>Rattivo</Text>
              <Text style={styles.brandSubtitle}>SMART COOKING</Text>
            </View>
          </View>

          {/* Títulos e Subtítulos */}
          <View style={styles.headingContainer}>
            <Text style={styles.kicker}>ACESSO</Text>
            <Text style={styles.title}>Bem-vindo de volta.</Text>
            <Text style={styles.subtitle}>
              Acesse sua conta para continuar cozinhando com assistência inteligente.
            </Text>
          </View>

          {/* Mensagem de Erro Geral */}
          {Boolean(generalError) && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{generalError}</Text>
            </View>
          )}

          {/* Formulário */}
          <View style={styles.form}>
            <Input
              label="E-mail"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError(null);
                if (generalError) setGeneralError(null);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              error={emailError}
              editable={!isSubmitting}
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError(null);
                if (generalError) setGeneralError(null);
              }}
              isPassword={true}
              autoCapitalize="none"
              error={passwordError}
              editable={!isSubmitting}
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={isSubmitting}
              disabled={isSubmitting}
              showArrow={true}
              style={styles.submitButton}
            />
          </View>

          {/* Alternativa para Cadastro */}
          <View style={styles.footerLinkContainer}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <Pressable
              onPress={() => router.push('/register')}
              disabled={isSubmitting}
              style={({ pressed }) => [pressed && styles.linkPressed]}
              accessibilityRole="button"
              accessibilityLabel="Ir para tela de cadastro"
            >
              <Text style={styles.linkText}>Cadastre-se</Text>
            </Pressable>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.xl,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  logoTextContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  headingContainer: {
    marginBottom: spacing.xl,
  },
  kicker: {
    ...typography.kicker,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.display,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
  },
  errorBanner: {
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  form: {
    marginBottom: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  footerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  linkPressed: {
    opacity: 0.7,
  },
});

