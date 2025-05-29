// src/components/ThemedButton.tsx
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemedButtonProps extends TouchableOpacityProps {
  title?: string;
  type?: 'primary' | 'secondary' | 'danger' | 'link' | 'outline';
  loading?: boolean;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  type = 'primary',
  style,
  textStyle: customTextStyle,
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...rest
}) => {
  const { theme: currentGlobalTheme } = useTheme();

  const baseButtonStyle: ViewStyle = {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 8,
    minHeight: 48,
  };

  const baseTextStyle: TextStyle = {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: leftIcon || rightIcon ? 8 : 0,
  };

  let specificButtonStyle: ViewStyle = {};
  let specificTextStyle: TextStyle = { color: currentGlobalTheme.buttonText };

  switch (type) {
    case 'primary':
      specificButtonStyle.backgroundColor = currentGlobalTheme.primary;
      break;
    case 'secondary':
      specificButtonStyle.backgroundColor = currentGlobalTheme.secondary;
      break;
    case 'danger':
      specificButtonStyle.backgroundColor = currentGlobalTheme.danger;
      break;
    case 'link':
      specificButtonStyle = { ...baseButtonStyle, paddingVertical: 8, marginVertical: 4, backgroundColor: 'transparent' };
      specificTextStyle.color = currentGlobalTheme.primary;
      specificTextStyle.fontWeight = 'normal';
      break;
    case 'outline':
      specificButtonStyle.backgroundColor = 'transparent';
      specificButtonStyle.borderWidth = 1.5;
      specificButtonStyle.borderColor = currentGlobalTheme.primary;
      specificTextStyle.color = currentGlobalTheme.primary;
      break;
  }

  const finalDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[baseButtonStyle, specificButtonStyle, finalDisabled && styles.disabledButton, style]}
      disabled={finalDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={type === 'outline' || type === 'link' ? currentGlobalTheme.primary : currentGlobalTheme.buttonText} />
      ) : (
        <>
          {leftIcon}
          {title && <Text style={[baseTextStyle, specificTextStyle, customTextStyle]}>{title}</Text>}
          {children}
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.6,
  },
});

export default ThemedButton;
