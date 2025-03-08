import React from 'react';
import { View, Text, StyleSheet, Animated, Platform, StatusBar } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

interface HeaderBarProps {
  title: string;
  scrollY: Animated.Value;
  rightElement?: React.ReactNode;
}

export function HeaderBar({ title, scrollY, rightElement }: HeaderBarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;

  const styles = createStyles(isDark);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 40, 80],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

  return (
    <Animated.View 
      style={[
        styles.header, 
        { 
          opacity: headerOpacity,
          backgroundColor: colors.background,
          paddingTop: STATUSBAR_HEIGHT,
        }
      ]}
    >
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
        {rightElement && rightElement}
      </View>
    </Animated.View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
