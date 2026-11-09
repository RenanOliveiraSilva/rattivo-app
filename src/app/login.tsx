import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { apiBaseUrl } from '@/api/client';
import { Button } from '@/components/ui/button';
import { ErrorMessage, Loading } from '@/components/ui/feedback';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/contexts/auth-context';
import { colors, radius, spacing } from '@/theme/tokens';
import { errorMessage } from '@/utils/errors';

export default function LoginScreen() {
  const { token, isRestoring, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isRestoring) return <Loading label="Recuperando sua sessão…" />;
  if (token) return <Redirect href="/home" />;

  async function submit() {
    setError('');
    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace('/home');
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.brand}>
        <Text style={styles.mascot}>🐭</Text>
        <Text style={styles.title}>Rattivo</Text>
        <Text style={styles.subtitle}>Seu preparo guiado com o Rattito</Text>
      </View>

      {!apiBaseUrl ? (
        <ErrorMessage message="Configure EXPO_PUBLIC_API_URL no arquivo .env antes de entrar." />
      ) : null}
      {error ? <ErrorMessage message={error} /> : null}

      <View style={styles.form}>
        <Input
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="E-mail"
          onChangeText={setEmail}
          placeholder="voce@email.com"
          value={email}
        />
        <Input
          autoComplete="current-password"
          label="Senha"
          onChangeText={setPassword}
          onSubmitEditing={() => void submit()}
          placeholder="Sua senha"
          secureTextEntry
          value={password}
        />
        <Button
          disabled={!apiBaseUrl}
          loading={submitting}
          onPress={() => void submit()}
          title="Entrar"
        />
        <Button
          onPress={() => router.push('/register')}
          title="Criar uma conta"
          variant="ghost"
        />
      </View>

      <Text style={styles.endpoint}>
        API: {apiBaseUrl || 'não configurada'}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'center', flexGrow: 1 },
  brand: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  mascot: {
    width: 88,
    height: 88,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 48,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
  },
  title: { color: colors.text, fontSize: 38, fontWeight: '900' },
  subtitle: { color: colors.textMuted, textAlign: 'center', fontSize: 16 },
  form: { gap: spacing.md },
  endpoint: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
});

