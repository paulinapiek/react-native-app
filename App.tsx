// App.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import './src/localization/i18n';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import SplashScreen from './src/auth/screens/SplashScreen';
import UserProfileScreen from './src/auth/screens/user/UserProfileScreen';
import EditProfileScreen from './src/auth/screens/user/EditProfileScreen';
import { subscribeToAuthChanges } from './src/auth/services/authService';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import AccountSettingsScreen from './src/auth/screens/AccountSettingsScreen';
import AppSettingsScreen from './src/auth/screens/AppSettingsScreen';
import HelpContactScreen from './src/auth/screens/HelpContactScreen';
import AboutAuthorsScreen from './src/auth/screens/AboutAuthorsScreen';
import ChangePasswordScreen from './src/auth/screens/user/ChangePasswordScreen';
import DeleteAccountScreen from './src/auth/screens/user/DeleteAccountScreen';
import { RootStackParamList } from './src/navigation/types';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigationContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const { theme: currentAppThemeObject, activeThemeMode, isLoadingTheme: isThemeContextLoading } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const subscriber = subscribeToAuthChanges((firebaseUser: FirebaseAuthTypes.User | null) => {
      setUser(firebaseUser);
      if (isLoading) {
        setIsLoading(false);
      }
    });
    return () => subscriber();
  }, [isLoading]);

  if (isThemeContextLoading || !currentAppThemeObject) {
    return <SplashScreen />;
  }

  const navigationTheme = activeThemeMode === 'dark' ? {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      primary: currentAppThemeObject.primary,
      background: currentAppThemeObject.background,
      card: currentAppThemeObject.headerBackground,
      text: currentAppThemeObject.headerText,
      border: currentAppThemeObject.separator,
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: currentAppThemeObject.primary,
      background: currentAppThemeObject.background,
      card: currentAppThemeObject.headerBackground,
      text: currentAppThemeObject.headerText,
      border: currentAppThemeObject.separator,
    },
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="MainApp" component={AppNavigator} />
            <Stack.Screen
              name="AccountSettings"
              component={AccountSettingsScreen}
              options={{
                headerShown: true,
                title: t('navigation.headerAccountSettings'),
                headerStyle: {backgroundColor: currentAppThemeObject.headerBackground},
                headerTintColor: currentAppThemeObject.headerText,
              }}
            />
            <Stack.Screen
              name="UserProfile"
              component={UserProfileScreen}
              options={{
                headerShown: true,
                title: t('userProfile.screenTitle'),
                headerStyle: {backgroundColor: currentAppThemeObject.headerBackground},
                headerTintColor: currentAppThemeObject.headerText,
              }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                headerShown: true,
                headerStyle: {backgroundColor: currentAppThemeObject.headerBackground},
                headerTintColor: currentAppThemeObject.headerText,
              }}
            />
            <Stack.Screen
              name="AppSettings"
              component={AppSettingsScreen}
              options={{
                headerShown: true,
                title: t('navigation.headerAppSettings'),
                headerStyle: {backgroundColor: currentAppThemeObject.headerBackground},
                headerTintColor: currentAppThemeObject.headerText,
              }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{
                headerShown: true,
                title: t('changePassword.screenTitle', 'Zmień hasło'),
                headerStyle: {backgroundColor: currentAppThemeObject.headerBackground},
                headerTintColor: currentAppThemeObject.headerText,
              }}
            />
            <Stack.Screen
              name="DeleteAccount"
              component={DeleteAccountScreen}
              options={{
                headerShown: true,
                title: t('deleteAccount.screenTitle', 'Usuń konto'),
                headerStyle: {backgroundColor: currentAppThemeObject.headerBackground},
                headerTintColor: currentAppThemeObject.headerText,
              }}
            />
            <Stack.Screen
              name="HelpContact"
              component={HelpContactScreen}
              options={{
                headerShown: true,
                title: t('navigation.headerHelpContact'),
                headerStyle: {backgroundColor: currentAppThemeObject.headerBackground},
                headerTintColor: currentAppThemeObject.headerText,
              }}
            />
            <Stack.Screen
              name="AboutAuthors"
              component={AboutAuthorsScreen}
              options={{
                headerShown: true,
                title: t('navigation.headerAboutAuthors'),
                headerStyle: {backgroundColor: currentAppThemeObject.headerBackground},
                headerTintColor: currentAppThemeObject.headerText,
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AppNavigationContent />
    </ThemeProvider>
  );
}

export default App;
