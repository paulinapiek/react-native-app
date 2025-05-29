// src/auth/screens/HomeScreen.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';

const HomeScreen = () => {
  const { t } = useTranslation();
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h3" style={styles.title}>{t('homeScreen.title')}</ThemedText>
      <ThemedText variant="p">{t('homeScreen.welcomeMessage')}</ThemedText>
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { marginBottom: 8},
});
export default HomeScreen;
