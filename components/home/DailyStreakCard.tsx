import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/constants/colors';

interface DailyStreakCardProps {
  streak: number;
}

export const DailyStreakCard = ({ streak }: DailyStreakCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  
  const styles = createStyles(colors, isDark);
  
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
  const today = new Date().getDay();
  const orderedDays = [...days.slice(today === 0 ? 6 : today - 1), ...days.slice(0, today === 0 ? 6 : today - 1)];
  
  const completedDays = Array(7).fill(false).map((_, i) => i < streak % 7);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.streakContainer}>
          <Flame size={20} color={colors.warning} />
          <Text style={styles.streakText}>
            {streak} Dia{streak > 1 ? 's' : ''} consecutivo{streak > 1 ? 's' : ''}
          </Text>
        </View>
        <Text style={styles.streakSubtext}>
          {streak === 0 ? 'Comece hoje!' : 'Continue assim!'}
        </Text>
      </View>
      
      <View style={styles.daysContainer}>
        {orderedDays.map((day, index) => (
          <View key={day} style={styles.dayItem}>
            <View 
              style={[
                styles.dayCircle, 
                completedDays[index] && styles.completedDay,
                index === 0 && styles.todayCircle
              ]}
            >
              {completedDays[index] && (
                <Flame size={16} color="#FFFFFF" />
              )}
            </View>
            <Text style={[
              styles.dayText,
              index === 0 && styles.todayText
            ]}>
              {day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: typeof COLORS.dark | typeof COLORS.light, isDark: boolean) => StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  streakSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: isDark ? colors.inputBackground : colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  completedDay: {
    backgroundColor: colors.warning,
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  todayText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});