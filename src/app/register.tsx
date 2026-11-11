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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    let isValid = true;
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmError(null);
    setGeneralError(null);

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setNameError('Informe seu nome.');
      isValid = false;
    } else if (trimmedName.length > 120) {
      setNameError('O nome deve ter no máximo 120 caracteres.');
      isValid = false;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Informe seu e-mail.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Digite um e-mail válido.');
      isValid = false;
    } else if (trimmedEmail.length > 255) {
      setEmailError('O e-mail deve ter no máximo 255 caracteres.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Informe uma senha.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('A senha deve ter no mínimo 8 caracteres.');
      isValid = false;
    } else if (password.length > 72) {
      setPasswordError('A senha deve ter no máximo 72 caracteres.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmError('Confirme sua senha.');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmError('As senhas não coincidem.');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      await register({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      });
      router.replace('/(tabs)');
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        if (err.status === 409 || err.code === 'CONFLICT') {
          setEmailError('Este e-mail já está cadastrado.');
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError('Não foi possível concluir seu cadastro. Tente novamente.');
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
          {/* Header com Logo */}
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

          {/* Cabeçalho de Cadastro */}
          <View style={styles.headingContainer}>
            <Text style={styles.kicker}>NOVA CONTA</Text>
            <Text style={styles.title}>Crie sua conta.</Text>
            <Text style={styles.subtitle}>
              Comece a transformar sua cozinha com receitas inteligentes e personalizadas.
            </Text>
          </View>

          {/* Erro Geral */}
          {Boolean(generalError) && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{generalError}</Text>
            </View>
          )}

          {/* Formulário */}
          <View style={styles.form}>
            <Input
              label="Nome"
              placeholder="Como quer ser chamado?"
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                if (nameError) setNameError(null);
                if (generalError) setGeneralError(null);
              }}
              autoCapitalize="words"
              autoComplete="name"
              error={nameError}
              editable={!isSubmitting}
            />

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
              placeholder="Mínimo de 8 caracteres"
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

            <Input
              label="Confirmação de senha"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmError) setConfirmError(null);
                if (generalError) setGeneralError(null);
              }}
              isPassword={true}
              autoCapitalize="none"
              error={confirmError}
              editable={!isSubmitting}
            />

            <Button
              title="Cadastrar"
              onPress={handleRegister}
              loading={isSubmitting}
              disabled={isSubmitting}
              showArrow={true}
              style={styles.submitButton}
            />
          </View>

          {/* Link para Login */}
          <View style={styles.footerLinkContainer}>
            <Text style={styles.footerText}>Já tem uma conta?</Text>
            <Pressable
              onPress={() => router.push('/login')}
              disabled={isSubmitting}
              style={({ pressed }) => [pressed && styles.linkPressed]}
              accessibilityRole="button"
              accessibilityLabel="Voltar para login"
            >
              <Text style={styles.linkText}>Entrar</Text>
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
    marginBottom: spacing.lg,
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
    marginBottom: spacing.lg,
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
    marginBottom: spacing.lg,
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

