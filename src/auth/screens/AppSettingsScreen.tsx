// src/auth/screens/AppSettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useTheme, ThemePreference } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const AppSettingsScreen = () => {
  const {
    theme: currentAppliedUITheme,
    activeThemeMode,
    themePreference,
    setAppThemePreference,
    isLoadingTheme: isGlobalThemeLoading,
  } = useTheme();
  const { t, i18n } = useTranslation();

  const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  useEffect(() => {
    console.log(
      '[AppSettingsScreen] Update. Mode:', activeThemeMode,
      'Pref:', themePreference, 'GlobalLoading:', isGlobalThemeLoading, 'Lang:', i18n.language
    );
  }, [activeThemeMode, themePreference, isGlobalThemeLoading, i18n.language]);

  const handleSetThemePreference = async (preferenceToSet: ThemePreference) => {
    if (isUpdatingTheme || isGlobalThemeLoading) {
      return;
    }
    setIsUpdatingTheme(true);
    try {
      await setAppThemePreference(preferenceToSet);
    } catch (error) {
      Alert.alert(t('common.error', 'Błąd'), t('appSettings.errorSavingTheme', 'Nie udało się zapisać preferencji motywu.'));
    } finally {
      setIsUpdatingTheme(false);
    }
  };

  const handleChangeLanguage = async (langToSet: 'pl' | 'en') => {
    if (isChangingLanguage || i18n.language.startsWith(langToSet) || isGlobalThemeLoading) {
      return;
    }
    setIsChangingLanguage(true);
    try {
      await i18n.changeLanguage(langToSet);
    } catch (error) {
      Alert.alert(t('common.error', 'Błąd'), t('appSettings.errorSavingLanguage', 'Nie udało się zmienić języka.'));
    } finally {
      setIsChangingLanguage(false);
    }
  };

  if (isGlobalThemeLoading || !currentAppliedUITheme) {
    const fallbackBackgroundColor = '#f4f6f8';
    const fallbackTextColor = '#000000';
    const fallbackPrimaryColor = '#6dab3c';

    return (
      <View style={[styles.loadingContainer, { backgroundColor: fallbackBackgroundColor }]}>
        <ActivityIndicator size="large" color={fallbackPrimaryColor} />
        <Text style={{ color: fallbackTextColor, marginTop: 10 }}>
          {t('appSettings.loadingSettings', 'Ładowanie ustawień...')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentAppliedUITheme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={false}
      >
        <Text style={[styles.sectionTitle, { color: currentAppliedUITheme.text }]}>
          {t('appSettings.themeTitle', 'Motyw Aplikacji')}
        </Text>
        <View style={[styles.settingRow, { borderBottomColor: currentAppliedUITheme.separator }]}>
          <Text style={[styles.settingText, { color: currentAppliedUITheme.text }]}>
            {t('appSettings.darkMode', 'Tryb Ciemny')}
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: currentAppliedUITheme.primary }}
            thumbColor={activeThemeMode === 'dark' ? currentAppliedUITheme.primary : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => handleSetThemePreference(activeThemeMode === 'dark' ? 'light' : 'dark')}
            value={activeThemeMode === 'dark'}
            disabled={isUpdatingTheme || isGlobalThemeLoading}
          />
        </View>

        <Text style={[styles.sectionTitle, styles.marginTop30, { color: currentAppliedUITheme.text }]}>
          {t('appSettings.themePreferenceTitle', 'Preferencje Motywu')}
        </Text>
        <View style={styles.preferenceRow}>
          {(['light', 'dark', 'system'] as ThemePreference[]).map((pref) => (
            <TouchableOpacity
              key={pref}
              style={[
                styles.preferenceButton,
                { borderColor: currentAppliedUITheme.primary },
                themePreference === pref && { backgroundColor: currentAppliedUITheme.primary },
                (isUpdatingTheme || isGlobalThemeLoading) && styles.buttonDisabled,
              ]}
              onPress={() => handleSetThemePreference(pref)}
              disabled={isUpdatingTheme || isGlobalThemeLoading}
            >
              <Text style={[
                styles.preferenceButtonText,
                { color: themePreference === pref ? currentAppliedUITheme.buttonText : currentAppliedUITheme.primary },
              ]}>
                {t(`appSettings.themeValues.${pref}`, pref.charAt(0).toUpperCase() + pref.slice(1))}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, styles.marginTop30, { color: currentAppliedUITheme.text }]}>
          {t('appSettings.languageTitle', 'Język')}
        </Text>
        <View style={styles.preferenceRow}>
          <TouchableOpacity
            style={[
              styles.preferenceButton,
              { borderColor: currentAppliedUITheme.primary },
              i18n.language.startsWith('pl') && { backgroundColor: currentAppliedUITheme.primary },
              (isChangingLanguage || isGlobalThemeLoading) && styles.buttonDisabled,
            ]}
            onPress={() => handleChangeLanguage('pl')}
            disabled={isChangingLanguage || isGlobalThemeLoading}
          >
            <Text style={[
              styles.preferenceButtonText,
              { color: i18n.language.startsWith('pl') ? currentAppliedUITheme.buttonText : currentAppliedUITheme.primary },
            ]}>
              {t('appSettings.languagePolish', 'Polski')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.preferenceButton,
              { borderColor: currentAppliedUITheme.primary },
              i18n.language.startsWith('en') && { backgroundColor: currentAppliedUITheme.primary },
              (isChangingLanguage || isGlobalThemeLoading) && styles.buttonDisabled,
            ]}
            onPress={() => handleChangeLanguage('en')}
            disabled={isChangingLanguage || isGlobalThemeLoading}
          >
            <Text style={[
              styles.preferenceButtonText,
              { color: i18n.language.startsWith('en') ? currentAppliedUITheme.buttonText : currentAppliedUITheme.primary },
            ]}>
              {t('appSettings.languageEnglish', 'Angielski')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
    minHeight: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 17,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginBottom: 30,
  },
  preferenceButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    marginHorizontal: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  preferenceButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  marginTop30: {
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default AppSettingsScreen;
