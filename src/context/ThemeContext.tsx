// src/context/ThemeContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Appearance, useColorScheme as useDeviceColorScheme, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import { getFirestore, doc, getDoc, setDoc } from '@react-native-firebase/firestore';
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';

import { lightTheme, darkTheme, AppTheme } from '../theme/theme';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: AppTheme;
  themePreference: ThemePreference;
  setAppThemePreference: (preference: ThemePreference) => Promise<void>;
  isLoadingTheme: boolean;
  activeThemeMode: 'light' | 'dark';
}

const THEME_PREFERENCE_KEY = '@app_theme_preference_v3';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useDeviceColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);
  const [activeThemeMode, setActiveThemeMode] = useState<'light' | 'dark'>(() => systemColorScheme || 'light');
  const [currentThemeObject, setCurrentThemeObject] = useState<AppTheme>(() =>
    (systemColorScheme === 'dark' ? darkTheme : lightTheme)
  );

  const firebaseAuthInstance = React.useMemo(() => getAuth(firebase.app()), []);
  const firestoreInstance = React.useMemo(() => getFirestore(firebase.app()), []);
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(() => firebaseAuthInstance.currentUser);

  useEffect(() => {
    const subscriber = onAuthStateChanged(firebaseAuthInstance, (user) => {
      setCurrentUser(user);
    });
    return () => subscriber();
  }, [firebaseAuthInstance]);

  const updateActiveTheme = useCallback((pref: ThemePreference, systemScheme: 'light' | 'dark') => {
    let newMode: 'light' | 'dark';
    if (pref === 'system') {
      newMode = systemScheme;
    } else {
      newMode = pref;
    }
    setActiveThemeMode(newMode);
    setCurrentThemeObject(newMode === 'dark' ? darkTheme : lightTheme);
  }, []);

  const loadPreferences = useCallback(async (
    userToLoadFor: FirebaseAuthTypes.User | null,
    currentSystemScheme: 'light' | 'dark'
  ) => {
    setIsLoadingTheme(true);
    let finalPreference: ThemePreference = 'system';
    try {
      let loadedPreference: ThemePreference | null = null;
      if (userToLoadFor) {
        const userDocRef = doc(firestoreInstance, 'userPreferences', userToLoadFor.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          loadedPreference = userDocSnap.data()?.themePreference as ThemePreference;
        }
      }
      if (!loadedPreference) {
        const asyncStoredPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (asyncStoredPreference) {
          loadedPreference = asyncStoredPreference as ThemePreference;
        }
      }
      finalPreference = loadedPreference || 'system';
      setThemePreferenceState(finalPreference);
      updateActiveTheme(finalPreference, currentSystemScheme);
    } catch (error) {
      console.error('[ThemeContext] loadPreferences: ERROR', error);
      Alert.alert('Błąd', 'Nie udało się załadować ustawień motywu.');
      setThemePreferenceState('system');
      updateActiveTheme('system', currentSystemScheme);
    } finally {
      setIsLoadingTheme(false);
    }
  }, [firestoreInstance, updateActiveTheme]);


  useEffect(() => {
    const effectiveSystemTheme = systemColorScheme || 'light';
    loadPreferences(currentUser, effectiveSystemTheme);
  }, [currentUser, systemColorScheme, loadPreferences]);


  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const newSystemScheme = colorScheme || 'light';
      if (themePreference === 'system') {
        updateActiveTheme('system', newSystemScheme);
      }
    });
    return () => subscription.remove();
  }, [themePreference, updateActiveTheme]);


  const setAppThemePreference = useCallback(async (preference: ThemePreference) => {
    setIsLoadingTheme(true);
    try {
      setThemePreferenceState(preference);
      updateActiveTheme(preference, systemColorScheme || 'light');

      console.log('[ThemeContext] setAppThemePreference: BEFORE AsyncStorage.setItem');
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference);
      console.log('[ThemeContext] setAppThemePreference: AFTER AsyncStorage.setItem');

      if (currentUser) {
        console.log('[ThemeContext] setAppThemePreference: BEFORE Firestore setDoc for user:', currentUser.uid);
        const userDocRef = doc(firestoreInstance, 'userPreferences', currentUser.uid);
        await setDoc(userDocRef, { themePreference: preference }, { merge: true });
        console.log('[ThemeContext] setAppThemePreference: AFTER Firestore setDoc');
      } else {
        console.log('[ThemeContext] setAppThemePreference: No user, skipping Firestore.');
      }

    } catch (error) {
      console.error('[ThemeContext] setAppThemePreference: ERROR', error);
      Alert.alert('Błąd', 'Nie udało się zapisać preferencji motywu.');
    } finally {
      setIsLoadingTheme(false);
      console.log('[ThemeContext] setAppThemePreference: FINALLY, isLoadingTheme is false.');
    }
  }, [currentUser, systemColorScheme, firestoreInstance, updateActiveTheme]);


  const contextValue = {
    theme: currentThemeObject,
    themePreference,
    setAppThemePreference,
    isLoadingTheme,
    activeThemeMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
