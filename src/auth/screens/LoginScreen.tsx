// src/auth/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Alert, TextInput } from 'react-native';
import { loginUser } from '../services/authService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTranslation } from 'react-i18next';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import { useTheme } from '../../context/ThemeContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
interface Props { navigation: LoginScreenNavigationProp; }

const LoginScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { theme: currentGlobalTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error', 'Błąd'), t('auth.errorAllFieldsRequired', 'Wszystkie pola są wymagane.'));
      return;
    }
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (error: any) {
      console.error("Login attempt failed:", error);
      let errorMessage = t('auth.errorLoginGeneric', 'Wystąpił nieoczekiwany błąd logowania.');
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = t('auth.errorInvalidCredentials', 'Nieprawidłowy email lub hasło.');
            break;
          case 'auth/invalid-email':
            errorMessage = t('auth.errorInvalidEmail', 'Nieprawidłowy format adresu email.');
            break;
        }
      } else if (error.message) {
      }
      Alert.alert(t('common.error', 'Błąd'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h2" style={styles.title}>
        {t('auth.loginTitle')}
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentGlobalTheme.inputBackground,
            color: currentGlobalTheme.text,
            borderColor: currentGlobalTheme.inputBorder,
          },
        ]}
        placeholder={t('auth.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={currentGlobalTheme.placeholderText}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentGlobalTheme.inputBackground,
            color: currentGlobalTheme.text,
            borderColor: currentGlobalTheme.inputBorder,
          },
        ]}
        placeholder={t('auth.passwordPlaceholder')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={currentGlobalTheme.placeholderText}
      />
      <ThemedButton
        title={loading ? t('auth.loggingInButton') : t('auth.loginButton')}
        onPress={handleLogin}
        loading={loading}
        type="primary"
        style={styles.loginButton}
      />
      <ThemedButton
        title={t('auth.noAccount')}
        onPress={() => navigation.navigate('Register')}
        type="link"
        style={styles.linkButton}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  linkButton: {
    marginTop: 15,
  },
});

export default LoginScreen;
