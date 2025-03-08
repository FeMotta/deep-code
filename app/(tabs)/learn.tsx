import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, BookOpen, Video, Code, ChevronRight } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';

import { COLORS } from '@/constants/colors';

import { HeaderBar } from '@/components/layout/HeaderBar';

export default function LearnScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  const styles = createStyles(colors, isDark);

  // Topic data
  const topics = [
    { id: 1, title: 'Arrays & Strings', icon: '🔢', count: 24 },
    { id: 2, title: 'Linked Lists', icon: '🔗', count: 18 },
    { id: 3, title: 'Trees & Graphs', icon: '🌳', count: 32 },
    { id: 4, title: 'Dynamic Programming', icon: '📊', count: 27 },
    { id: 5, title: 'Sorting & Searching', icon: '🔍', count: 15 },
    { id: 6, title: 'Recursion', icon: '🔄', count: 12 },
  ];

  // Course data
  const courses = [
    {
      id: 1,
      title: 'Data Structures Fundamentals',
      description: 'Learn the core data structures used in coding interviews',
      image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=300&auto=format&fit=crop',
      lessons: 12,
      duration: '4 hours',
      type: 'course',
    },
    {
      id: 2,
      title: 'Algorithms Masterclass',
      description: 'Deep dive into essential algorithms and their implementations',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=300&auto=format&fit=crop',
      lessons: 18,
      duration: '6 hours',
      type: 'course',
    },
    {
      id: 3,
      title: 'System Design Interview Prep',
      description: 'Learn how to approach and solve system design problems',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop',
      lessons: 8,
      duration: '3 hours',
      type: 'video',
    },
  ];

  // Article data
  const articles = [
    {
      id: 1,
      title: 'Understanding Big O Notation',
      description: 'A comprehensive guide to time and space complexity analysis',
      readTime: '8 min read',
      type: 'article',
    },
    {
      id: 2,
      title: 'Mastering Binary Search',
      description: 'Tips and tricks for implementing binary search correctly',
      readTime: '5 min read',
      type: 'article',
    },
    {
      id: 3,
      title: 'Dynamic Programming Patterns',
      description: 'Common patterns to recognize and solve DP problems',
      readTime: '12 min read',
      type: 'article',
    },
  ];

  const filteredContent = () => {
    if (activeTab === 'all') {
      return [...courses, ...articles];
    } else if (activeTab === 'courses') {
      return courses.filter(item => item.type === 'course');
    } else if (activeTab === 'videos') {
      return courses.filter(item => item.type === 'video');
    } else if (activeTab === 'articles') {
      return articles;
    }
    return [];
  };

  return (
    <View style={styles.container}>
      <HeaderBar title="Aprender" scrollY={scrollY} />
      
      <Animated.ScrollView 
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Aprender</Text>
          <Text style={styles.subtitle}>Expanda seu conhecimento em programação</Text>
        </View>

        <TouchableOpacity style={styles.searchBar}>
          <Search size={20} color={colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Pesquisar tópicos, cursos, artigos...</Text>
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContent}
          >
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'all' && styles.activeTab]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'courses' && styles.activeTab]}
              onPress={() => setActiveTab('courses')}
            >
              <BookOpen size={16} color={activeTab === 'courses' ? '#FFFFFF' : colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'courses' && styles.activeTabText]}>Cursos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
              onPress={() => setActiveTab('videos')}
            >
              <Video size={16} color={activeTab === 'videos' ? '#FFFFFF' : colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>Vídeos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'articles' && styles.activeTab]}
              onPress={() => setActiveTab('articles')}
            >
              <Code size={16} color={activeTab === 'articles' ? '#FFFFFF' : colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'articles' && styles.activeTabText]}>Artigos</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tópicos Populares</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Ver Todos</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topicScrollContent}
            snapToInterval={160} // Topic width + margin
            decelerationRate="fast"
          >
            {topics.map((topic) => (
              <TouchableOpacity key={topic.id} style={styles.topicCard}>
                <Text style={styles.topicIcon}>{topic.icon}</Text>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicCount}>{topic.count} lições</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === 'all' ? 'Recomendado Para Você' : 
               activeTab === 'courses' ? 'Cursos Populares' :
               activeTab === 'videos' ? 'Vídeos em Destaque' : 'Artigos Recentes'}
            </Text>
          </View>
          
          {filteredContent().map((item: any, index) => (
            <TouchableOpacity 
              key={`${item.type}-${item.id || index}`} 
              style={styles.contentCard}
            >
              {(item.type === 'course' || item.type === 'video') && (
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.courseImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.contentInfo}>
                <View style={styles.contentTypeContainer}>
                  {item.type === 'course' && (
                    <View style={[styles.contentTypeTag, { backgroundColor: colors.primary }]}>
                      <BookOpen size={12} color="#FFFFFF" />
                      <Text style={styles.contentTypeText}>Curso</Text>
                    </View>
                  )}
                  {item.type === 'video' && (
                    <View style={[styles.contentTypeTag, { backgroundColor: colors.error }]}>
                      <Video size={12} color="#FFFFFF" />
                      <Text style={styles.contentTypeText}>Vídeo</Text>
                    </View>
                  )}
                  {item.type === 'article' && (
                    <View style={[styles.contentTypeTag, { backgroundColor: colors.success }]}>
                      <Code size={12} color="#FFFFFF" />
                      <Text style={styles.contentTypeText}>Artigo</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.contentTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                <Text style={styles.contentDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
                <View style={styles.contentMeta}>
                  {(item.type === 'course' || item.type === 'video') ? (
                    <>
                      <Text style={styles.contentMetaText}>{item.lessons} lições</Text>
                      <View style={styles.contentMetaDot} />
                      <Text style={styles.contentMetaText}>{item.duration}</Text>
                    </>
                  ) : (
                    <Text style={styles.contentMetaText}>{item.readTime}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Add bottom padding for better scrolling experience */}
        <View style={styles.bottomSpacer} />
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
    paddingHorizontal: 20,
    paddingTop: 80, // Increased to account for sticky header
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 10,
    color: colors.textTertiary,
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabScrollContent: {
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: colors.inputBackground,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    marginLeft: 4,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  topicScrollContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  topicCard: {
    width: 140,
    height: 140,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topicIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  topicCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  contentCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    height: 120, // Fixed height for consistency
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseImage: {
    width: 100,
    height: '100%',
  },
  contentInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  contentTypeContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  contentTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  contentTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  contentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  contentMetaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});