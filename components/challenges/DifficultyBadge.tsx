import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface DifficultyBadgeProps {
  difficulty: string;
}

export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const styles = createStyles(isDark);
  
  const getBadgeStyle = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return styles.easyBadge;
      case 'medium':
        return styles.mediumBadge;
      case 'hard':
        return styles.hardBadge;
      default:
        return styles.easyBadge;
    }
  };
  
  const getTextStyle = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return styles.easyText;
      case 'medium':
        return styles.mediumText;
      case 'hard':
        return styles.hardText;
      default:
        return styles.easyText;
    }
  };
  
  return (
    <View style={[styles.badge, getBadgeStyle()]}>
      <Text style={[styles.text, getTextStyle()]}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Text>
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  easyBadge: {
    backgroundColor: isDark ? '#2F855A' : '#E6FFFA',
  },
  easyText: {
    color: isDark ? '#FFFFFF' : '#2C7A7B',
  },
  mediumBadge: {
    backgroundColor: isDark ? '#C05621' : '#FFFAF0',
  },
  mediumText: {
    color: isDark ? '#FFFFFF' : '#C05621',
  },
  hardBadge: {
    backgroundColor: isDark ? '#9B2C2C' : '#FFF5F5',
  },
  hardText: {
    color: isDark ? '#FFFFFF' : '#9B2C2C',
  },
});