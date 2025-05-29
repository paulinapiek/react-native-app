// src/components/ThemedView.tsx
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ThemedView: React.FC<ViewProps> = ({ style, ...rest }) => {
  const { theme: currentGlobalTheme } = useTheme();
  const defaultStyle = {
    backgroundColor: currentGlobalTheme.background,
  };
  return <View style={StyleSheet.flatten([defaultStyle, style])} {...rest} />;
};
export default ThemedView;
