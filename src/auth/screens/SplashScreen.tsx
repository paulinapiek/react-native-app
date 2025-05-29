// src/auth/screens/SplashScreen.tsx
import React from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const wseiLogo = require('../../assets/images/logo_wsei.png');

const SplashScreen = () => {
  const { t } = useTranslation();
  console.log('[SplashScreen] Rendering simple splash screen.');
  return (
    <View style={styles.container}>
      <Image source={wseiLogo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.appName}>{t('splash.appName', 'eWSEI')}</Text>
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.activityIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6dab3c',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  activityIndicator: {
    marginTop: 20,
  },
});

export default SplashScreen;
