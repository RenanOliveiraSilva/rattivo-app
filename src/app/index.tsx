import { Redirect } from 'expo-router';

import { Loading } from '@/components/ui/feedback';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/contexts/auth-context';

export default function IndexScreen() {
  const { token, isRestoring } = useAuth();
  if (isRestoring) {
    return (
      <Screen scroll={false}>
        <Loading label="Preparando o Rattito…" />
      </Screen>
    );
  }
  return <Redirect href={token ? '/home' : '/login'} />;
}

