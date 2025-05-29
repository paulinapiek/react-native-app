// src/localization/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './translations/en.json';
import pl from './translations/pl.json';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const storedLanguage = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (storedLanguage) {
        return callback(storedLanguage);
      }
      return callback('pl');
    } catch (error) {
      console.log('Error reading language from AsyncStorage:', error);
      return callback('pl');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      pl: { translation: pl },
    },
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
