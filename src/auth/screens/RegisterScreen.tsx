// src/auth/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView, TextInput, ActivityIndicator, View as ReactNativeView } from 'react-native';
import { registerUser } from '../services/authService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { UserProfileData } from '../../navigation/types'; // Dodaj ten import
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { theme: currentUITheme, isLoadingTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [albumNumber, setAlbumNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName || !albumNumber) {
      Alert.alert(
        t('common.error', 'Błąd'),
        t('auth.errorAllFieldsRequired', 'Wszystkie pola są wymagane.')
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(
        t('common.error', 'Błąd'),
        t('auth.errorPasswordsMismatch', 'Hasła nie są takie same.')
      );
      return;
    }
    if (!email.endsWith('@microsoft.wsei.edu.pl')) {
      Alert.alert(
        t('common.error', 'Błąd'),
        t('auth.errorInvalidDomain', 'Rejestracja jest możliwa tylko dla adresów email w domenie @microsoft.wsei.edu.pl.')
      );
      return;
    }

    setLoading(true);
    const userProfileData: Partial<UserProfileData> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      albumNumber: albumNumber.trim(),
      email: email.trim(),
      studyYear: null,
      studyMode: null,
      studyModule: null,
      birthDate: null,
      profileImageUri: null,
    };

    try {
      await registerUser(email, password, userProfileData);
      Alert.alert(
        t('common.success', 'Sukces'), 
        t('auth.registrationSuccess', 'Konto zostało utworzone! Możesz się teraz zalogować.'),
        [
          {
            text: t('common.ok', 'OK'),
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = t('auth.errorRegistrationGeneric', 'Wystąpił nieoczekiwany błąd rejestracji.');
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = t('auth.errorEmailInUse', 'Ten adres email jest już używany.');
            break;
          case 'auth/weak-password':
            errorMessage = t('auth.errorWeakPassword', 'Hasło jest zbyt słabe.');
            break;
          case 'auth/invalid-email':
            errorMessage = t('auth.errorInvalidEmail', 'Nieprawidłowy format adresu email.');
            break;
        }
      }
      Alert.alert(t('common.error', 'Błąd rejestracji'), errorMessage);
    } finally {
      setLoading(false);
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText variant="h2" style={styles.title}>
          {t('auth.registrationTitle', 'Rejestracja do eWSEI')}
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
          placeholder={t('auth.firstNamePlaceholder', 'Imię')}
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor={currentUITheme.placeholderText}
          autoCapitalize="words"
        />
        
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentUITheme.inputBackground,
              color: currentUITheme.text,
              borderColor: currentUITheme.inputBorder,
            },
          ]}
          placeholder={t('auth.lastNamePlaceholder', 'Nazwisko')}
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor={currentUITheme.placeholderText}
          autoCapitalize="words"
        />
        
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentUITheme.inputBackground,
              color: currentUITheme.text,
              borderColor: currentUITheme.inputBorder,
            },
          ]}
          placeholder={t('auth.albumNumberPlaceholder', 'Numer albumu')}
          value={albumNumber}
          onChangeText={setAlbumNumber}
          keyboardType="numeric"
          placeholderTextColor={currentUITheme.placeholderText}
        />
        
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentUITheme.inputBackground,
              color: currentUITheme.text,
              borderColor: currentUITheme.inputBorder,
            },
          ]}
          placeholder={t('auth.emailPlaceholder', 'Email (@microsoft.wsei.edu.pl)')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={currentUITheme.placeholderText}
        />
        
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentUITheme.inputBackground,
              color: currentUITheme.text,
              borderColor: currentUITheme.inputBorder,
            },
          ]}
          placeholder={t('auth.passwordMinCharsPlaceholder', 'Hasło (min. 6 znaków)')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={currentUITheme.placeholderText}
        />
        
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentUITheme.inputBackground,
              color: currentUITheme.text,
              borderColor: currentUITheme.inputBorder,
            },
          ]}
          placeholder={t('auth.confirmPasswordPlaceholder', 'Potwierdź hasło')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={currentUITheme.placeholderText}
        />

        <ThemedButton
          title={loading ? t('auth.registeringButton', 'Rejestrowanie...') : t('auth.registerButton', 'Zarejestruj się')}
          onPress={handleRegister}
          loading={loading}
          type="primary"
          style={styles.registerButton}
        />
        
        <ThemedButton
          title={t('auth.haveAccount', 'Masz już konto? Zaloguj się')}
          onPress={() => navigation.navigate('Login')}
          type="link"
          style={styles.linkButton}
          disabled={loading}
        />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  linkButton: {
    marginBottom: 12,
  },
});

export default RegisterScreen;
