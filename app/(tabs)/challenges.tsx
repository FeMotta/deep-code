import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'expo-router';
import { Search, Filter, X } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

import { COLORS } from '@/constants/colors';

import FilterModal from '@/components/challenges/FilterModal';

export default function ChallengesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const [filteredChallenges, setFilteredChallenges] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    difficulty: [] as string[],
    topics: [] as string[],
    status: [] as string[],
  });

  const challenges = useQuery(api.challenges.get)

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeFilters, challenges]);

  const applyFilters = () => {
    let filtered = [...(challenges || [])];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(challenge => 
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply difficulty filter
    if (activeFilters.difficulty.length > 0) {
      filtered = filtered.filter(challenge => 
        activeFilters.difficulty.includes(challenge.difficulty)
      );
    }
    
    // Apply topics filter
    if (activeFilters.topics.length > 0) {
      filtered = filtered.filter(challenge => 
        challenge.topics.some((topic: string) => activeFilters.topics.includes(topic))
      );
    }
    
    // Apply status filter
    if (activeFilters.status.length > 0) {
      filtered = filtered.filter(challenge => 
        activeFilters.status.includes(challenge.status)
      );
    }
    
    setFilteredChallenges(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleFilterApply = (filters: any) => {
    setActiveFilters(filters);
    setFilterModalVisible(false);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      difficulty: [],
      topics: [],
      status: [],
    });
    setSearchQuery('');
  };

  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  const styles = createStyles(colors, isDark);

  const hasActiveFilters = () => {
    return activeFilters.difficulty.length > 0 || 
           activeFilters.topics.length > 0 || 
           activeFilters.status.length > 0;
  };
  
  const ChallengeCard = ({ challenge, onPress }: { challenge: any, onPress: () => void }) => (
    <TouchableOpacity style={styles.challengeCard} onPress={onPress}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <View style={[
          styles.difficultyTag, 
          challenge.difficulty === "Fácil" 
            ? { backgroundColor: colors.success } 
            : challenge.difficulty === "Médio" 
              ? { backgroundColor: colors.warning } 
              : { backgroundColor: colors.error }
        ]}>
          <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
        </View>
      </View>
      
      <Text style={styles.challengeDescription} numberOfLines={2}>
        {challenge.description}
      </Text>
      
      <View style={styles.challengeFooter}>
        <View style={styles.topicsContainer}>
          {challenge.topics.map((topic: string, index: number) => (
            <View key={index} style={styles.topicTag}>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>
        
        <View style={[
          styles.statusIndicator, 
          challenge.status === "Completed" 
            ? { backgroundColor: colors.success } 
            : challenge.status === "Attempted" 
              ? { backgroundColor: colors.warning }
              : { backgroundColor: colors.primary }
        ]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.View 
        style={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Desafios</Text>
          <Text style={styles.subtitle}>Encontre seu próximo desafio de programação</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar desafios..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={clearSearch}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              hasActiveFilters() && styles.activeFilterButton
            ]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter size={20} color={hasActiveFilters() ? '#FFFFFF' : colors.text} />
          </TouchableOpacity>
        </View>

        {hasActiveFilters() && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersText}>
              Filtros ativos: {[
                ...activeFilters.difficulty,
                ...activeFilters.topics,
                ...activeFilters.status
              ].join(', ')}
            </Text>
            <TouchableOpacity onPress={clearAllFilters}>
              <Text style={styles.clearFiltersText}>Limpar</Text>
            </TouchableOpacity>
          </View>
        )}

        <Animated.FlatList
          data={filteredChallenges}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ChallengeCard 
              challenge={item}
              onPress={() => router.push({
                pathname: '/challenge-details',
                params: { id: item._id },
              })}
            />
          )}
          contentContainerStyle={styles.listContainer}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery || hasActiveFilters() 
                  ? 'Nenhum desafio corresponde à sua pesquisa ou filtros' 
                  : 'Nenhum desafio disponível'}
              </Text>
              {(searchQuery || hasActiveFilters()) && (
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={clearAllFilters}
                >
                  <Text style={styles.resetButtonText}>Redefinir Filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          onApply={handleFilterApply}
          initialFilters={activeFilters}
        />
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: typeof COLORS.dark | typeof COLORS.light, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 80, // Account for header
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: colors.text,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  activeFiltersText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  clearFiltersText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  challengeCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  challengeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  topicTag: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  topicText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
});