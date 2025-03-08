import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/constants/colors';

interface InputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
}

export const Input = ({
  leftIcon,
  rightIcon,
  label,
  error,
  containerStyle,
  inputContainerStyle,
  style,
  ...rest
}: InputProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer, 
        inputContainerStyle, 
        error ? styles.inputError : null
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput 
          style={[styles.input, style]} 
          placeholderTextColor={colors.textTertiary}
          {...rest} 
        />
        
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const createStyles = (colors: typeof COLORS.dark | typeof COLORS.light) => StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.inputBackground,
    height: 56,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 8,
  },
  iconContainer: {
    marginHorizontal: 4,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  }
});
