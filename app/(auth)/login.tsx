import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { Link } from 'expo-router';
import { Mail, Lock, Github } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/constants/colors';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const fadeAnim = useState(new Animated.Value(0))[0];

  const { signIn } = useAuth();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePasswordLogin = () => {
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      return;
    }
    
    signIn(email, password, "password");
  };

  const handleProviderSignIn = async (provider: "github" | "google") => {
    signIn(email, password, provider);
  }

  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  const styles = createStyles(colors, isDark);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.appName}>DeepCode</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Bem-vindo</Text>
            
            <Input
              leftIcon={<Mail size={20} color={colors.textSecondary} />}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error && !email ? 'Email é obrigatório' : undefined}
            />
            
            <Input
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={error && !password ? 'Senha é obrigatória' : undefined}
            />
            
            <Link href="/forgot-password" asChild>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </Link>
            
            <Button
              title="Entrar"
              onPress={handlePasswordLogin}
              size="medium"
              fullWidth
            />
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou continue com</Text>
              <View style={styles.divider} />
            </View>
            
            <View style={styles.socialContainer}>
              <View style={styles.socialButtonWrapper}>
                <Button
                  title="GitHub"
                  onPress={() => handleProviderSignIn('github')}
                  variant="secondary"
                  style={styles.githubButton}
                  leftIcon={<Github size={20} color={isDark ? 'rgba(255, 255, 255, 0.9)' : '#FFFFFF'} />}
                  fullWidth
                />
              </View>
              {/* TODO: Add google provider login */}
            </View>
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Cadastre-se</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: typeof COLORS.dark | typeof COLORS.light, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoWrapper: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: isDark ? '#2A2F45' : '#E6EEF8',
    padding: 4,
    shadowColor: isDark ? '#000000' : '#1A365D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.15,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    color: colors.text,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    maxWidth: '80%',
  },
  formContainer: {
    width: '100%',
    padding: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: colors.text,
  },
  forgotPassword: {
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 24,
    fontSize: 15,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    marginHorizontal: 14,
    color: colors.textSecondary,
    fontSize: 15,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 12,
  },
  socialButtonWrapper: {
    flex: 1,
  },
  githubButton: {
    backgroundColor: colors.github,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});