// src/auth/screens/AccountSettingsScreen.tsx
import React from 'react';
import { StyleSheet, ScrollView, Alert, Pressable, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useTheme } from '../../context/ThemeContext';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import { AppTheme } from '../../theme/theme';
import { logoutUser } from '../services/authService';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';

type AccountSettingsScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, 'AccountSettings'>,
  BottomTabNavigationProp<MainTabParamList>
>;

interface OptionItemProps {
  title: string;
  iconName: string;
  onPress: () => void;
  theme: AppTheme;
  isDestructive?: boolean;
}

const OptionItem = ({ title, iconName, onPress, theme, isDestructive = false }: OptionItemProps) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const dynamicTextColor = isDestructive ? theme.danger : (isPressed ? theme.primary : theme.text);
  const dynamicIconColor = isDestructive ? theme.danger : (isPressed ? theme.primary : theme.primary);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.optionButton,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.separator,
        },
        pressed && { backgroundColor: theme.separator }
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <FontAwesome5 name={iconName} size={20} color={dynamicIconColor} style={styles.optionIcon} />
      <ThemedText variant="p" style={[styles.optionText, { color: dynamicTextColor }]}>
        {title}
      </ThemedText>
      <FontAwesome5 name="chevron-right" size={16} color={theme.secondaryText} />
    </Pressable>
  );
};

const AccountSettingsScreen = () => {
  const { t } = useTranslation();
  const { theme: currentUITheme, isLoadingTheme } = useTheme();
  const navigation = useNavigation<AccountSettingsScreenNavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      t('accountSettings.logoutConfirmTitle', 'Wylogowanie'),
      t('accountSettings.logoutConfirmMessage', 'Czy na pewno chcesz się wylogować?'),
      [
        { text: t('common.cancel', 'Anuluj'), style: 'cancel' },
        {
          text: t('common.ok', 'OK'),
          onPress: async () => {
            try {
              await logoutUser();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(t('common.error', 'Błąd'), t('accountSettings.logoutError', 'Wystąpił błąd podczas wylogowywania.'));
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteAccount = () => {
    navigation.navigate('DeleteAccount');
  };

  const handleNavigateToUserProfile = () => {
    navigation.navigate('UserProfile');
  };

  const handleNavigateToChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  if (isLoadingTheme || !currentUITheme) {
    const primaryColorFallback = currentUITheme?.primary || '#6dab3c';
    const backgroundColorFallback = currentUITheme?.background || '#f4f6f8';
    return (
      <ThemedView style={[styles.loadingContainer, { backgroundColor: backgroundColorFallback }]}>
        <ActivityIndicator size="large" color={primaryColorFallback} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <OptionItem
          title={t('accountSettings.editProfile', 'Profil użytkownika')}
          iconName="user-circle"
          onPress={handleNavigateToUserProfile}
          theme={currentUITheme}
        />
        <OptionItem
          title={t('accountSettings.changePassword', 'Zmień hasło')}
          iconName="key"
          onPress={handleNavigateToChangePassword}
          theme={currentUITheme}
        />
        <OptionItem
          title={t('accountSettings.deleteAccount', 'Usuń konto')}
          iconName="trash-alt"
          onPress={handleDeleteAccount}
          theme={currentUITheme}
          isDestructive={true}
        />
        <OptionItem
          title={t('accountSettings.logout', 'Wyloguj się')}
          iconName="sign-out-alt"
          onPress={handleLogout}
          theme={currentUITheme}
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
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    width: '100%',
  },
  optionIcon: {
    marginRight: 20,
    width: 24,
    textAlign: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 17,
  },
});

export default AccountSettingsScreen;
