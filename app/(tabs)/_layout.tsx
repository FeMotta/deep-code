import { Tabs } from 'expo-router';
import { Home, Code, Trophy, BookOpen, User } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';

import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;

  const renderTabIcon = (Icon: typeof Home) => (
    { color, size, focused }: 
    { color: string, size: number, focused: boolean }
  ) => {
    const iconColor = isDark && focused ? 'white' : color;
    return <Icon size={size} color={iconColor} />;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? 'white' : colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: renderTabIcon(Home),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Desafios',
          tabBarIcon: renderTabIcon(Code),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Aprender',
          tabBarIcon: renderTabIcon(BookOpen),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: renderTabIcon(Trophy),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: renderTabIcon(User),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}