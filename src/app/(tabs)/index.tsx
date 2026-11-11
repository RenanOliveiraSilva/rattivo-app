import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CopilotPanel } from '@/components/home/CopilotPanel';
import { HomeHeader } from '@/components/home/HomeHeader';
import { NutritionCard } from '@/components/home/NutritionCard';
import { StatusCards } from '@/components/home/StatusCards';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/tokens';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Saudação e Avatar com Iniciais */}
        <HomeHeader displayName={user?.displayName} />

        {/* Dois Cards de Status (Rattito e Câmera da Bancada) */}
        <StatusCards />

        {/* Card Nutricional com estado honesto de configuração */}
        <NutritionCard />

        {/* Painel Copiloto Culinário: "O que vamos cozinhar hoje?" */}
        <CopilotPanel />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 95, // Margem para não ser coberto pela barra inferior elevada
  },
});

