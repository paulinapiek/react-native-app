// src/components/ThemedText.tsx
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { AppTheme as AppSpecificThemeType } from '../theme/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'label' | 'caption';

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
}

const getVariantStyle = (variant: TextVariant | undefined, theme: AppSpecificThemeType): TextStyle => {
  switch (variant) {
    case 'h1': return { fontSize: 32, fontWeight: 'bold', color: theme.text, marginBottom: 16 };
    case 'h2': return { fontSize: 28, fontWeight: 'bold', color: theme.text, marginBottom: 14 };
    case 'h3': return { fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 12 };
    case 'h4': return { fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 10 };
    case 'h5': return { fontSize: 18, fontWeight: '500', color: theme.text, marginBottom: 8 };
    case 'h6': return { fontSize: 16, fontWeight: '500', color: theme.text, marginBottom: 6 };
    case 'label': return { fontSize: 14, color: theme.secondaryText, marginBottom: 4 };
    case 'caption': return { fontSize: 12, color: theme.secondaryText };
    case 'p':
    default:
      return { fontSize: 16, color: theme.text, lineHeight: 24 };
  }
};

const ThemedText: React.FC<ThemedTextProps> = ({ variant = 'p', style, children, ...rest }) => {
  const { theme: currentGlobalTheme } = useTheme();

  if (!currentGlobalTheme) {
    console.warn('[ThemedText] currentGlobalTheme is undefined. Rendering with default Text.');
    return <Text style={style} {...rest}>{children}</Text>;
  }

  const variantStyle = getVariantStyle(variant, currentGlobalTheme);
  return <Text style={[variantStyle, style]} {...rest}>{children}</Text>;
};

export default ThemedText;
