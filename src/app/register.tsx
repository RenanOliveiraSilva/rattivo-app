import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ErrorMessage, Loading } from '@/components/ui/feedback';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/contexts/auth-context';
import { colors, spacing } from '@/theme/tokens';
import { errorMessage } from '@/utils/errors';

export default function RegisterScreen() {
  const { token, isRestoring, signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isRestoring) return <Loading />;
  if (token) return <Redirect href="/home" />;

  async function submit() {
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (password !== confirmation) {
      setError('As senhas não coincidem.');
      return;
    }
    setSubmitting(true);
    try {
      await signUp(name, email, password);
      router.replace('/home');
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <PageHeader onBack={() => router.back()} title="Criar conta" />
      <Text style={styles.intro}>Crie sua conta para guardar o progresso do preparo.</Text>
      {error ? <ErrorMessage message={error} /> : null}
      <View style={styles.form}>
        <Input label="Nome" onChangeText={setName} placeholder="Como podemos chamar você?" value={name} />
        <Input
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="E-mail"
          onChangeText={setEmail}
          placeholder="voce@email.com"
          value={email}
        />
        <Input label="Senha" onChangeText={setPassword} secureTextEntry value={password} />
        <Input
          label="Confirmar senha"
          onChangeText={setConfirmation}
          onSubmitEditing={() => void submit()}
          secureTextEntry
          value={confirmation}
        />
        <Button loading={submitting} onPress={() => void submit()} title="Criar conta" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.textMuted, fontSize: 16, lineHeight: 23 },
  form: { gap: spacing.md },
});

