import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { Calendar, Clock, Zap, Award, TrendingUp, ChevronRight, Bell } from 'lucide-react-native';

import { api } from '@/convex/_generated/api';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/constants/colors';
// import { useChallenges } from '@/context/ChallengeContext';
// import ChallengeCard from '@/components/challenges/ChallengeCard';
// import ProgressChart from '@/components/home/ProgressChart';

import { DailyStreakCard } from '@/components/home/DailyStreakCard';
import { HeaderBar } from '@/components/layout/HeaderBar';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  // const { getDailyChallenge, getRecommendedChallenges } = useChallenges();
  const [refreshing, setRefreshing] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [recommendedChallenges, setRecommendedChallenges] = useState<any[]>([]);

  const user = useQuery(api.users.current);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // const daily = await getDailyChallenge();
    // setDailyChallenge(daily);
    
    // const recommended = await getRecommendedChallenges();
    // setRecommendedChallenges(recommended);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <HeaderBar 
        title="Início" 
        scrollY={scrollY}
        rightElement={
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />
      
      <Animated.ScrollView 
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0] || 'Dev'}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image 
                source={{ uri: user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <DailyStreakCard streak={3} />
        
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Desafio Diário
            </Text>
            <Calendar size={20} color={colors.textSecondary} />
          </View>
          
          {dailyChallenge ? (
            <ChallengeCard 
              challenge={dailyChallenge}
              onPress={() => router.push({
                pathname: '/challenge-details',
                params: { id: dailyChallenge.id }
              })}
            />
          ) : (
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderText}>Loading daily challenge...</Text>
            </View>
          )}
        </View> */}

        {/* <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? colors.cardBackground : '#EBF8FF' }]}>
              <Clock size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? colors.cardBackground : '#FEEBCF' }]}>
              <Zap size={20} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? colors.cardBackground : '#E6FFFA' }]}>
              <Award size={20} color={colors.success} />
            </View>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View> */}

        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <TrendingUp size={20} color={colors.textSecondary} />
          </View>
          
          <View style={styles.progressCard}>
            <ProgressChart isDark={isDark} />
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>42</Text>
                <Text style={styles.progressStatLabel}>Total</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>15</Text>
                <Text style={styles.progressStatLabel}>Easy</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>20</Text>
                <Text style={styles.progressStatLabel}>Medium</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>7</Text>
                <Text style={styles.progressStatLabel}>Hard</Text>
              </View>
            </View>
          </View>
        </View> */}

        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/challenges')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {recommendedChallenges.length > 0 ? (
            recommendedChallenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id}
                challenge={challenge}
                onPress={() => router.push({
                  pathname: '/challenge-details',
                  params: { id: challenge.id }
                })}
              />
            ))
          ) : (
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderText}>Loading recommendations...</Text>
            </View>
          )}
        </View> */}
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (colors: typeof COLORS.dark | typeof COLORS.light, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80, // Increased to account for sticky header
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? colors.cardBackground : colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  placeholderCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  progressStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});