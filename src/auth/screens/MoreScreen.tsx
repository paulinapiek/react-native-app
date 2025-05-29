// src/auth/screens/MoreScreen.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import ThemedView from '../../components/ThemedView';
import { AppTheme } from '../../theme/theme';

type MoreScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Więcej'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface OptionItemProps {
  title: string;
  iconName: string;
  onPress: () => void;
  theme: AppTheme;
}

const OptionItem = ({ title, iconName, onPress, theme }: OptionItemProps) => (
  <TouchableOpacity
    style={[
      styles.optionButton,
      {
        backgroundColor: theme.card,
        borderBottomColor: theme.separator,
      },
    ]}
    onPress={onPress}
  >
    <FontAwesome5
      name={iconName}
      size={22}
      color={theme.primary}
      style={styles.optionIcon}
    />
    <Text style={[styles.optionText, { color: theme.text }]}>{title}</Text>
    <FontAwesome5
      name="chevron-right"
      size={18}
      color={theme.secondaryText}
    />
  </TouchableOpacity>
);

const MoreScreen = () => {
  const navigation = useNavigation<MoreScreenNavigationProp>();
  const { t } = useTranslation();
  const { theme: currentUITheme, isLoadingTheme } = useTheme();

  if (isLoadingTheme || !currentUITheme) {
    const fallbackBackgroundColor = '#f4f6f8';
    const fallbackPrimaryColor = '#6dab3c';

    return (
      <View style={[styles.loadingContainer, { backgroundColor: fallbackBackgroundColor }]}>
        <ActivityIndicator size="large" color={fallbackPrimaryColor} />
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <OptionItem
          title={t('moreScreen.accountSettings')}
          iconName="user-cog"
          onPress={() => navigation.navigate('AccountSettings')}
          theme={currentUITheme}
        />
        <OptionItem
          title={t('moreScreen.appSettings')}
          iconName="cogs"
          onPress={() => navigation.navigate('AppSettings')}
          theme={currentUITheme}
        />
        <OptionItem
          title={t('moreScreen.helpContact')}
          iconName="question-circle"
          onPress={() => navigation.navigate('HelpContact')}
          theme={currentUITheme}
        />
        <OptionItem
          title={t('moreScreen.aboutAuthors')}
          iconName="info-circle"
          onPress={() => navigation.navigate('AboutAuthors')}
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
    width: 25,
    textAlign: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 17,
  },
});

export default MoreScreen;
