// src/navigation/AppNavigator.tsx
import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

import HomeScreen from '../auth/screens/HomeScreen';
import StudentIdScreen from '../auth/screens/StudentIdScreen';
import MoreScreen from '../auth/screens/MoreScreen';
import { MainTabParamList } from './types';

const wseiLogoIcon = require('../assets/images/logo_wsei.png');
const Tab = createBottomTabNavigator<MainTabParamList>();

const AppNavigator = () => {
  const { theme: currentUITheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'Start') iconName = 'home';
          else if (route.name === 'Legitymacja') return <Image source={wseiLogoIcon} style={{ width: size * 1.2, height: size * 1.2, tintColor: focused ? currentUITheme.tabBarActive : color }} resizeMode="contain" />;
          else if (route.name === 'Więcej') iconName = 'ellipsis-h';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: currentUITheme.tabBarActive,
        tabBarInactiveTintColor: currentUITheme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: currentUITheme.card,
          borderTopColor: currentUITheme.separator,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: currentUITheme.headerBackground,
        },
        headerTintColor: currentUITheme.headerText,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarLabelStyle: {
            paddingBottom: 2,
        }
      })}
    >
      <Tab.Screen name="Start" component={HomeScreen} options={{ title: t('navigation.tabStart') }} />
      <Tab.Screen
        name="Legitymacja"
        component={StudentIdScreen}
        options={{ title: t('navigation.tabStudentId') }}
      />
      <Tab.Screen name="Więcej" component={MoreScreen} options={{ title: t('navigation.tabMore') }} />
    </Tab.Navigator>
  );
};
export default AppNavigator;
