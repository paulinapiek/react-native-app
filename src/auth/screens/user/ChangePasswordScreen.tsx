// src/auth/screens/ChangePasswordScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  View as ReactNativeView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import ThemedView from '../../../components/ThemedView';
import ThemedText from '../../../components/ThemedText';
import ThemedButton from '../../../components/ThemedButton';

const ChangePasswordScreen = () => {
  const { t } = useTranslation();
  const { theme: currentUITheme, isLoadingTheme } = useTheme();
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = useCallback(async () => {
    if (isChanging) return;

    if (!currentPassword.trim()) {
      Alert.alert(t('common.error'), t('changePassword.currentPasswordRequired', 'Podaj obecne hasło'));
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert(t('common.error'), t('changePassword.newPasswordRequired', 'Podaj nowe hasło'));
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(t('common.error'), t('changePassword.passwordTooShort', 'Nowe hasło musi mieć co najmniej 6 znaków'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), t('changePassword.passwordsDoNotMatch', 'Nowe hasła nie są identyczne'));
      return;
    }

    setIsChanging(true);

    try {
      const user = auth().currentUser;
      if (!user || !user.email) {
        throw new Error('Użytkownik niezalogowany');
      }
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPassword);

      Alert.alert(
        t('common.success'),
        t('changePassword.passwordChanged', 'Hasło zostało pomyślnie zmienione'),
        [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Error changing password:', error);
      let errorMessage = t('changePassword.changeError', 'Nie udało się zmienić hasła');
      if (error.code === 'auth/wrong-password') {
        errorMessage = t('changePassword.wrongCurrentPassword', 'Obecne hasło jest niepoprawne');
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t('changePassword.weakPassword', 'Nowe hasło jest zbyt słabe');
      }
      Alert.alert(t('common.error'), errorMessage);
    } finally {
      setIsChanging(false);
    }
  }, [currentPassword, newPassword, confirmPassword, isChanging, t, navigation]);

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ThemedText variant="p" style={[styles.description, { color: currentUITheme.secondaryText }]}>
          {t('changePassword.description', 'Aby zmienić hasło, najpierw potwierdź swoje obecne hasło, a następnie podaj nowe.')}
        </ThemedText>

        <ThemedText variant="label" style={styles.label}>
          {t('changePassword.currentPassword', 'Obecne hasło')}
        </ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: currentUITheme.inputBackground, color: currentUITheme.text, borderColor: currentUITheme.inputBorder }]}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder={t('changePassword.currentPasswordPlaceholder', 'Wprowadź obecne hasło')}
          placeholderTextColor={currentUITheme.placeholderText}
          secureTextEntry
          autoCapitalize="none"
        />

        <ThemedText variant="label" style={styles.label}>
          {t('changePassword.newPassword', 'Nowe hasło')}
        </ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: currentUITheme.inputBackground, color: currentUITheme.text, borderColor: currentUITheme.inputBorder }]}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={t('changePassword.newPasswordPlaceholder', 'Wprowadź nowe hasło')}
          placeholderTextColor={currentUITheme.placeholderText}
          secureTextEntry
          autoCapitalize="none"
        />

        <ThemedText variant="label" style={styles.label}>
          {t('changePassword.confirmPassword', 'Potwierdź nowe hasło')}
        </ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: currentUITheme.inputBackground, color: currentUITheme.text, borderColor: currentUITheme.inputBorder }]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('changePassword.confirmPasswordPlaceholder', 'Wprowadź ponownie nowe hasło')}
          placeholderTextColor={currentUITheme.placeholderText}
          secureTextEntry
          autoCapitalize="none"
        />

        <ThemedButton
          title={isChanging ? t('changePassword.changing', 'Zmienianie...') : t('changePassword.changeButton', 'Zmień hasło')}
          onPress={handleChangePassword}
          type="primary"
          loading={isChanging}
          style={styles.changeButton}
        />

        <ThemedButton
          title={t('common.cancel', 'Anuluj')}
          onPress={() => navigation.goBack()}
          type="outline"
          style={styles.cancelButton}
          disabled={isChanging}
        />

      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  description: {
    marginBottom: 30,
    lineHeight: 22,
  },
  label: {
    marginBottom: 6,
    marginTop: 12,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 18,
    fontSize: 16,
  },
  changeButton: {
    marginTop: 30,
    marginBottom: 15,
  },
  cancelButton: {
    marginBottom: 15,
  },
});

export default ChangePasswordScreen;
