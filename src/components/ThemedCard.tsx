// src/components/ThemedCard.tsx
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ThemedCard: React.FC<ViewProps> = ({ style, ...rest }) => {
  const { theme: currentGlobalTheme } = useTheme();

  const cardStyle = {
    backgroundColor: currentGlobalTheme.card,
    borderRadius: 10,
    padding: 20,
    shadowColor: currentGlobalTheme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 8,
  };
  return <View style={StyleSheet.flatten([cardStyle, style])} {...rest} />;
};
export default ThemedCard;
