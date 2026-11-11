import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/tokens';

export default function TabsLayout() {
  const { user, token, isLoading } = useAuth();

  // Proteção da área autenticada
  if (!isLoading && (!token || !user)) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* 1. Início */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/../assets/images/icons/nav-home-active.png')
                  : require('@/../assets/images/icons/nav-home-inactive.png')
              }
              style={styles.tabIcon}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* 2. Receitas */}
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Receitas',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/../assets/images/icons/nav-recipes.png')}
              style={[styles.tabIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* 3. Chef IA (Central Elevada) */}
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'Chef IA',
          tabBarIcon: () => (
            <View style={styles.floatingButton}>
              <Image
                source={require('@/../assets/images/icons/nav-chef-star.png')}
                style={styles.floatingIcon}
                resizeMode="contain"
              />
            </View>
          ),
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabBarLabel, { color, marginTop: 14 }]}>Chef IA</Text>
          ),
        }}
      />

      {/* 4. Nutrição */}
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrição',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/../assets/images/icons/nav-nutrition.png')}
              style={[styles.tabIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* 5. Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/../assets/images/icons/nav-profile.png')}
              style={[styles.tabIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBarBg,
    borderTopColor: colors.tabBarBorder,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
  floatingButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 4,
    borderColor: colors.tabBarBg,
  },
  floatingIcon: {
    width: 28,
    height: 28,
  },
});
