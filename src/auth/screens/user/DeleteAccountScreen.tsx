// src/auth/screens/DeleteAccountScreen.tsx
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
import firestore from '@react-native-firebase/firestore';

import ThemedView from '../../../components/ThemedView';
import ThemedText from '../../../components/ThemedText';
import ThemedButton from '../../../components/ThemedButton';

const DeleteAccountScreen = () => {
  const { t } = useTranslation();
  const { theme: currentUITheme, isLoadingTheme } = useTheme();
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const performAccountDeletion = useCallback(async () => {
    setIsDeleting(true);

    try {
      const user = auth().currentUser;
      if (!user || !user.email) {
        throw new Error('Użytkownik niezalogowany');
      }

      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);

      try {
        await firestore().collection('studentProfiles').doc(user.uid).delete();
        await firestore().collection('userPreferences').doc(user.uid).delete();
      } catch (firestoreError) {
        console.warn('Error deleting user data from Firestore:', firestoreError);
      }

      // Usuń konto użytkownika
      await user.delete();

      Alert.alert(
        t('deleteAccount.accountDeleted', 'Konto usunięte'),
        t('deleteAccount.accountDeletedMessage', 'Twoje konto zostało pomyślnie usunięte.'),
        [{ text: t('common.ok'), onPress: () => {
        }}]
      );
    } catch (error: any) {
      console.error('Error deleting account:', error);
      let errorMessage = t('deleteAccount.deleteError', 'Nie udało się usunąć konta');
      if (error.code === 'auth/wrong-password') {
        errorMessage = t('deleteAccount.wrongPassword', 'Podane hasło jest niepoprawne');
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = t('deleteAccount.requiresRecentLogin', 'Ze względów bezpieczeństwa musisz się ponownie zalogować przed usunięciem konta');
      }
      Alert.alert(t('common.error'), errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [currentPassword, t]);

  const handleDeleteAccount = useCallback(async () => {
    if (isDeleting) return;

    if (!currentPassword.trim()) {
      Alert.alert(t('common.error'), t('deleteAccount.passwordRequired', 'Podaj swoje obecne hasło aby potwierdzić usunięcie konta'));
      return;
    }

    Alert.alert(
      t('deleteAccount.finalConfirmTitle', 'Ostateczne potwierdzenie'),
      t('deleteAccount.finalConfirmMessage', 'Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna. Wszystkie Twoje dane zostaną trwale usunięte.'),
      [
        {
          text: t('common.cancel', 'Anuluj'),
          style: 'cancel',
        },
        {
          text: t('deleteAccount.confirmDelete', 'Usuń konto'),
          style: 'destructive',
          onPress: performAccountDeletion, // Bezpośrednie wywołanie bez arrow function
        },
      ]
    );
  }, [currentPassword, isDeleting, t, performAccountDeletion]); // Dodaj performAccountDeletion do zależności

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
        <ReactNativeView style={[styles.warningBox, { backgroundColor: '#ffebee', borderColor: '#ffcdd2' }]}>
          <ThemedText variant="h3" style={[styles.warningTitle, { color: '#c62828' }]}>
            ⚠️  {t('deleteAccount.warning', 'Ostrzeżenie')}
          </ThemedText>
          <ThemedText variant="p" style={[styles.warningText, { color: '#d32f2f' }]}>
            {t('deleteAccount.warningMessage', 'Usunięcie konta jest operacją nieodwracalną. Wszystkie Twoje dane, w tym profil studenta, preferencje i historia aktywności zostaną trwale usunięte.')}
          </ThemedText>
        </ReactNativeView>

        <ThemedText variant="p" style={[styles.description, { color: currentUITheme.secondaryText }]}>
          {t('deleteAccount.description', 'Aby usunąć swoje konto, potwierdź swoją tożsamość podając obecne hasło.')}
        </ThemedText>

        <ThemedText variant="label" style={styles.label}>
          {t('deleteAccount.currentPassword', 'Obecne hasło')}
        </ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: currentUITheme.inputBackground, color: currentUITheme.text, borderColor: currentUITheme.inputBorder }]}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder={t('deleteAccount.passwordPlaceholder', 'Wprowadź swoje obecne hasło')}
          placeholderTextColor={currentUITheme.placeholderText}
          secureTextEntry
          autoCapitalize="none"
        />

        <ThemedButton
          title={isDeleting ? t('deleteAccount.deleting', 'Usuwanie...') : t('deleteAccount.deleteButton', 'Usuń konto')}
          onPress={handleDeleteAccount}
          type="primary"
          loading={isDeleting}
          style={[styles.deleteButton, { backgroundColor: '#d32f2f' }]}
        />

        <ThemedButton
          title={t('common.cancel', 'Anuluj')}
          onPress={() => navigation.goBack()}
          type="outline"
          style={styles.cancelButton}
          disabled={isDeleting}
        />

      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  warningBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  warningTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  warningText: {
    lineHeight: 20,
  },
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
  deleteButton: {
    marginTop: 30,
    marginBottom: 15,
  },
  cancelButton: {
    marginBottom: 15,
  },
});

export default DeleteAccountScreen;
