// src/auth/screens/SplashScreen.tsx
import React from 'react';
import { View, ActivityIndicator, Image, StyleSheet, Text } from 'react-native';

const wseiLogo = require('../../assets/images/logo_wsei.png');

const SplashScreen = () => {
  console.log('[SplashScreen] Rendering simple splash screen.');
  return (
    <View style={styles.container}>
      <Image source={wseiLogo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.appName}>eWSEI</Text>
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
