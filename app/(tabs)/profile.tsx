import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { 
  User, Settings, Moon, Sun, Bell, Shield, LogOut, 
  Award, Code, BookOpen, ChevronRight, Github, Linkedin
} from 'lucide-react-native';

import { api } from "@/convex/_generated/api";

import { COLORS } from '@/constants/colors';

import { useTheme } from '@/context/ThemeContext';

import { HeaderBar } from '@/components/layout/HeaderBar';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const user = useQuery(api.users.current);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  const styles = createStyles(colors, isDark);

  // const achievements = [
  //   { id: 1, title: 'Primeira Conquista', description: 'Completou seu primeiro desafio', icon: '🏆', date: '2 semanas atrás' },
  //   { id: 2, title: 'Mestre da Sequência', description: 'Manteve uma sequência de 7 dias', icon: '🔥', date: '1 semana atrás' },
  //   { id: 3, title: 'Ás dos Algoritmos', description: 'Resolveu 10 desafios de algoritmos', icon: '🧠', date: '3 dias atrás' },
  // ];

  const stats = [
    { label: 'Desafios', value: 42 },
    { label: 'Sequência', value: 12 },
    { label: 'Pontos', value: 2150 },
    { label: 'Ranking', value: '#7' },
  ];

  return (
    <View style={styles.container}>
      <HeaderBar 
        title="Perfil" 
        scrollY={scrollY}
        rightElement={
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color={colors.text} />
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
      >
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        <View style={styles.profileCard}>
          <Image 
            source={{ uri: user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' }} 
            style={styles.profileImage} 
          />
          <Text style={styles.profileName}>{user?.name || 'James Wilson'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'james.wilson@example.com'}</Text>
          
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialButton}>
              <Github size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Linkedin size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conquistas Recentes</Text>        
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Ver Todas as Conquistas</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                {isDark ? (
                  <Moon size={20} color={colors.textSecondary} />
                ) : (
                  <Sun size={20} color={colors.textSecondary} />
                )}
                <Text style={styles.settingText}>Modo Escuro</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.settingDivider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={colors.textSecondary} />
                <Text style={styles.settingText}>Notificações</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity 
              style={styles.menuItem} 
              // onPress={() => router.push('/edit-profile')}
            >
              <View style={styles.menuLeft}>
                <User size={20} color={colors.textSecondary} />
                <Text style={styles.menuText}>Editar Perfil</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Code size={20} color={colors.textSecondary} />
                <Text style={styles.menuText}>Meus Desafios</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <BookOpen size={20} color={colors.textSecondary} />
                <Text style={styles.menuText}>Trilha de Aprendizado</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Award size={20} color={colors.textSecondary} />
                <Text style={styles.menuText}>Conquistas</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Shield size={20} color={colors.textSecondary} />
                <Text style={styles.menuText}>Privacidade & Segurança</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color={colors.error} />
          <Text style={styles.signOutText}>Sair</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.versionText}>DeepCode v1.0.0</Text>
        </View>
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
  // Update header styles
  header: {
    paddingHorizontal: 20,
    paddingTop: 80, // Increased to account for sticky header
    paddingBottom: 20,
  },
  
  // Modify settings button for the header bar
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: isDark ? colors.cardBackground : colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // ...rest of existing styles...
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  socialLinks: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? colors.inputBackground : colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  settingsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: colors.text,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: colors.text,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  versionText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});