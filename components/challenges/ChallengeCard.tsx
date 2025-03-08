import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

import { DifficultyBadge } from './DifficultyBadge';

interface ChallengeCardProps {
  challenge: any;
  onPress: () => void;
}

export default function ChallengeCard({ challenge, onPress }: ChallengeCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const styles = createStyles(isDark);
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{challenge.title}</Text>
          <DifficultyBadge difficulty={challenge.difficulty} />
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {challenge.description}
        </Text>
        
        <View style={styles.tags}>
          {challenge.topics && challenge.topics.slice(0, 3).map((topic: string, index: number) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{topic}</Text>
            </View>
          ))}
          
          {challenge.status && (
            <View style={[
              styles.statusTag,
              challenge.status === 'solved' ? styles.solvedTag : styles.unsolvedTag
            ]}>
              <Text style={[
                styles.statusTagText,
                challenge.status === 'solved' ? styles.solvedTagText : styles.unsolvedTagText
              ]}>
                {challenge.status === 'solved' ? 'Solved' : 'Unsolved'}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.chevronContainer}>
        <ChevronRight size={20} color={isDark ? '#A0AEC0' : '#718096'} />
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#2D3748' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#F7FAFC' : '#2D3748',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: isDark ? '#A0AEC0' : '#718096',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: isDark ? '#4A5568' : '#EDF2F7',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: isDark ? '#A0AEC0' : '#718096',
  },
  statusTag: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  solvedTag: {
    backgroundColor: isDark ? '#2F855A' : '#E6FFFA',
  },
  unsolvedTag: {
    backgroundColor: isDark ? '#4A5568' : '#EDF2F7',
  },
  statusTagText: {
    fontSize: 12,
  },
  solvedTagText: {
    color: isDark ? '#FFFFFF' : '#2C7A7B',
  },
  unsolvedTagText: {
    color: isDark ? '#A0AEC0' : '#718096',
  },
  chevronContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
});