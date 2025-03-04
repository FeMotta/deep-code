import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

import { COLORS } from '@/constants/colors';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleResetPassword = () => {
    if (!email) {
      setError('Por favor, informe seu endereço de email');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setSuccess(true);
      setError(null);
      setIsLoading(false);
    }, 1500);
  };

  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  const styles = createStyles(colors, isDark);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </Link>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            Digite seu endereço de email e enviaremos instruções para recuperar sua senha.
          </Text>
          
          {success && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                Instruções para recuperação de senha foram enviadas para seu email.
              </Text>
            </View>
          )}
          
          <Input
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!success}
            containerStyle={styles.inputContainer}
          />
          
          {!success ? (
            <Button
              title="Enviar Link de Recuperação"
              onPress={handleResetPassword}
              fullWidth
              isLoading={isLoading}
              style={styles.resetButton}
              size="large"
            />
          ) : (
            <Button
              title="Voltar para Login"
              onPress={() => router.replace('/login')} 
              variant="secondary"
              fullWidth
              style={styles.backToLoginButton}
              size="large"
            />
          )}
        </View>
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
    padding: 20,
  },
  backButton: {
    marginTop: 60,
    marginBottom: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? colors.cardBackground : colors.inputBackground,
  },
  formContainer: {
    width: '100%',
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
    lineHeight: 22,
  },
  successContainer: {
    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  successText: {
    color: isDark ? 'rgba(16, 185, 129, 0.9)' : colors.success,
    fontSize: 15,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  resetButton: {
    marginBottom: 16,
  },
  backToLoginButton: {
    marginBottom: 16,
  },
});