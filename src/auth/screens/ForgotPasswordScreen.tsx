// src/auth/screens/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Alert, TextInput, ActivityIndicator, View as ReactNativeView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const { theme: currentUITheme, isLoadingTheme } = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        t('common.error'),
        t('forgotPassword.emailRequired', 'Podaj adres email')
      );
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert(
        t('common.error'),
        t('forgotPassword.emailInvalid', 'Podaj prawidłowy adres email')
      );
      return;
    }

    setIsSending(true);

    try {
      await auth().sendPasswordResetEmail(email.trim());
      setEmailSent(true);
      Alert.alert(
        t('common.success'),
        t('forgotPassword.emailSent', 'Link do resetowania hasła został wysłany na Twój adres email. Sprawdź swoją skrzynkę pocztową.'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      let errorMessage = t('forgotPassword.sendError', 'Nie udało się wysłać emaila z resetem hasła');
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('forgotPassword.userNotFound', 'Nie znaleziono użytkownika z tym adresem email');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('forgotPassword.emailInvalid', 'Podaj prawidłowy adres email');
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = t('forgotPassword.tooManyRequests', 'Zbyt wiele prób. Spróbuj ponownie później');
      }
      Alert.alert(t('common.error'), errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingTheme || !currentUITheme) {
    const fallbackBackgroundColor = currentUITheme?.background || '#f4f6f8';
    const fallbackPrimaryColor = currentUITheme?.primary || '#6dab3c';
    return (
      <ReactNativeView style={[styles.loadingContainer, { backgroundColor: fallbackBackgroundColor }]}>
        <ActivityIndicator size="large" color={fallbackPrimaryColor} />
      </ReactNativeView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h2" style={styles.title}>
        {t('forgotPassword.title', 'Resetowanie hasła')}
      </ThemedText>
      <ThemedText variant="p" style={[styles.description, { color: currentUITheme.secondaryText }]}>
        {t('forgotPassword.description', 'Podaj adres email powiązany z Twoim kontem. Wyślemy Ci link do resetowania hasła.')}
      </ThemedText>
      <ThemedText variant="label" style={styles.label}>
        {t('forgotPassword.emailLabel', 'Adres email')}
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentUITheme.inputBackground,
            color: currentUITheme.text,
            borderColor: currentUITheme.inputBorder,
          },
        ]}
        placeholder={t('forgotPassword.emailPlaceholder', 'Wprowadź swój adres email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={currentUITheme.placeholderText}
        editable={!emailSent}
      />

      <ThemedButton
        title={isSending ? t('forgotPassword.sending', 'Wysyłanie...') : t('forgotPassword.sendButton', 'Wyślij link resetujący')}
        onPress={handleResetPassword}
        loading={isSending}
        type="primary"
        style={styles.sendButton}
        disabled={emailSent}
      />

      <ThemedButton
        title={t('forgotPassword.backToLogin', 'Powrót do logowania')}
        onPress={() => navigation.goBack()}
        type="outline"
        style={styles.backButton}
        disabled={isSending}
      />

      {emailSent && (
  <ReactNativeView style={[styles.successBox, { 
    backgroundColor: currentUITheme.themeMode === 'dark' ? '#1b5e20' : '#e8f5e8', 
    borderColor: currentUITheme.primary 
  }]}>
    <ThemedText variant="p" style={[styles.successText, { color: currentUITheme.primary }]}>
      ✅ {t('forgotPassword.emailSentConfirmation', 'Email został wysłany! Sprawdź swoją skrzynkę pocztową.')}
    </ThemedText>
  </ReactNativeView>
)}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 24,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  sendButton: {
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 20,
  },
  successBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 20,
  },
  successText: {
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;
