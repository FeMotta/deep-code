import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

import { COLORS } from '@/constants/colors';

import { useTheme } from '@/context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon
}: ButtonProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  const styles = createStyles(colors, isDark);
  
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle[] = [styles.button];
    
    // Apply variant style
    switch (variant) {
      case 'primary':
        buttonStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        buttonStyle.push(styles.secondaryButton);
        break;
      case 'outline':
        buttonStyle.push(styles.outlineButton);
        break;
    }
    
    switch (size) {
      case 'small':
        buttonStyle.push(styles.smallButton);
        break;
      case 'medium':
        buttonStyle.push(styles.mediumButton);
        break;
      case 'large':
        buttonStyle.push(styles.largeButton);
        break;
    }
    
    if (fullWidth) {
      buttonStyle.push(styles.fullWidth);
    }
    
    if (disabled || isLoading) {
      buttonStyle.push(styles.disabledButton);
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleArray: TextStyle[] = [styles.buttonText];
    
    switch (variant) {
      case 'primary':
        textStyleArray.push(styles.primaryButtonText);
        break;
      case 'secondary':
        textStyleArray.push(styles.secondaryButtonText);
        break;
      case 'outline':
        textStyleArray.push(styles.outlineButtonText);
        break;
    }
    
    if (style && 'backgroundColor' in style) {
      const bg = style.backgroundColor as string;
      if (bg === colors.github || bg === '#171515' || bg === '#24292E') {
        textStyleArray.push(styles.darkButtonText);
      }
    }
    
    if (size === 'small') {
      textStyleArray.push(styles.smallButtonText);
    }
    
    if (disabled) {
      textStyleArray.push(styles.disabledButtonText);
    }
    
    return textStyleArray;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      style={[...getButtonStyle(), style]}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary : colors.text} 
          size="small" 
        />
      ) : (
        <>
          {leftIcon && <Text style={styles.iconContainer}>{leftIcon}</Text>}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <Text style={styles.iconContainer}>{rightIcon}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (colors: typeof COLORS.dark | typeof COLORS.light, isDark: boolean) => StyleSheet.create({
  button: {
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: isDark ? '#000000' : '#2D3748',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: isDark ? colors.cardBackground : colors.inputBackground,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    shadowOpacity: 0.1,
  },
  smallButton: {
    height: 40,
    paddingHorizontal: 16,
  },
  mediumButton: {
    height: 48,
    paddingHorizontal: 24,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: 32,
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  buttonText: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: isDark ? colors.text : colors.textSecondary,
    fontSize: 16,
  },
  outlineButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
  darkButtonText: {
    color: 'white',
  },
  smallButtonText: {
    fontSize: 14,
  },
  disabledButtonText: {
    opacity: 0.8,
  },
  iconContainer: {
    marginHorizontal: 8,
  }
});
