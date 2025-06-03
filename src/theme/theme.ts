// src/theme/theme.ts
import { StyleSheet } from 'react-native';

export const baseColors = {
  primary: '#6dab3c',
  secondary: '#464f5a',
  accent: '#ff8c00',
  danger: '#D32F2F',
  white: '#ffffff',
  black: '#000000',
  lightGray: '#e0e0e0',
  mediumGray: '#888888',
  darkGray: '#333333',
  success: '#4caf50',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(255, 255, 255, 0.08)',
};

export const lightTheme = {
  themeMode: 'light' as const,
  background: '#f4f6f8',
  card: baseColors.white,
  text: baseColors.darkGray,
  secondaryText: baseColors.mediumGray,
  separator: baseColors.lightGray,
  primary: baseColors.primary,
  secondary: baseColors.secondary,
  accent: baseColors.accent,
  danger: baseColors.danger,
  success: '#4caf50',
  successBackground: '#e8f5e8',
  buttonText: baseColors.white,
  headerBackground: baseColors.primary,
  headerText: baseColors.white,
  tabBarActive: baseColors.primary,
  tabBarInactive: baseColors.mediumGray,
  shadowColor: baseColors.shadowLight,
  inputBackground: baseColors.white,
  inputBorder: baseColors.lightGray,
  placeholderText: baseColors.mediumGray,
};

export const darkTheme = {
  themeMode: 'dark' as const,
  background: '#121212',
  card: '#1e1e1e',
  text: '#e0e0e0',
  secondaryText: '#a0a0a0',
  separator: '#303030',
  primary: baseColors.primary,
  secondary: '#5a6f80',
  accent: baseColors.accent,
  danger: baseColors.danger,
  success: '#66bb6a',
  successBackground: '#1b5e20',
  buttonText: baseColors.white,
  headerBackground: '#1f1f1f',
  headerText: baseColors.white,
  tabBarActive: baseColors.primary,
  tabBarInactive: '#707070',
  shadowColor: baseColors.shadowDark,
  inputBackground: '#2c2c2c',
  inputBorder: '#404040',
  placeholderText: baseColors.mediumGray,
};

export type AppTheme = typeof lightTheme | typeof darkTheme;

export const getGlobalStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 16 },
  text: { color: theme.text, fontSize: 16 },
  title: { color: theme.text, fontSize: 24, fontWeight: 'bold' },
});

