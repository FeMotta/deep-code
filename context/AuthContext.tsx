import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import { makeRedirectUri } from 'expo-auth-session';
import { openAuthSessionAsync } from 'expo-web-browser';
import { useAuthActions } from '@convex-dev/auth/dist/react';
import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

type Provider = "github" | "google" | "password";

interface AuthContextType {
  user: Doc<"users"> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, provider: Provider) => Promise<void>;
  signUp: (name: string, email: string, password: string, provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
  onAuthReady?: () => void;
}

const redirectTo = makeRedirectUri();

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Doc<"users"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInProgress, setAuthInProgress] = useState(false);
  const pathname = usePathname();

  const currentUser = useQuery(api.users.current);
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();

  const isAuthScreen = () => {
    return pathname === '/login' || 
      pathname === '/register' || 
      pathname === '/forgot-password' ||
      pathname === '/(auth)/login' || 
      pathname === '/(auth)/register' ||
      pathname === '/(auth)/forgot-password' ||
      pathname.includes('/(auth)');
  };

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      
      if (isAuthScreen() && !authInProgress) {
        router.replace('/(tabs)');
      }
      
      setIsLoading(false);
    } else {
      setUser(null);
      
      const timer = setTimeout(() => {
        if (!isAuthScreen() && !authInProgress && !isLoading) {
          router.replace('/login');
        }
        
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser, pathname, authInProgress]);

  const handleAuth = async (callback: () => Promise<any>) => {
    try {
      setIsLoading(true);
      setAuthInProgress(true);
      
      await callback();
      
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(tabs)');
        
        setTimeout(() => {
          setAuthInProgress(false);
        }, 500);
      }, 1000);
      
      return Promise.resolve();
    } catch (error) {
      setIsLoading(false);
      setAuthInProgress(false);
      return Promise.reject(error);
    }
  };

  const signIn = async (email: string, password: string, provider: Provider) => {
    return handleAuth(async () => {
      if (provider === "password") {
        await convexSignIn("password", { email, password, flow: "signIn"})
          .catch((e) => {
            throw new Error('Credenciais inválidas');
          });
      }

      if (provider === "github" || provider === "google") {
        const { redirect } = await convexSignIn(provider, { redirectTo });
        
        if (Platform.OS === "web") {
          setAuthInProgress(false);
          return;
        }
    
        const result = await openAuthSessionAsync(redirect!.toString(), redirectTo);
    
        if (result.type === "success") {
          const { url } = result;
          const code = new URL(url).searchParams.get("code")!;
          await convexSignIn(provider, { code });
        }
      }
    });
  };

  const signUp = async (name: string, email: string, password: string, provider: Provider) => {
    return handleAuth(async () => {
      if (provider === "password") {
        await convexSignIn("password", { name, email, password, flow: "signUp" })
          .catch((e) => {
            throw new Error('Erro ao criar conta');
          });
      }
    });
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setAuthInProgress(true);
      
      convexSignOut();
      setUser(null);
      
      router.replace('/login');
      
      setTimeout(() => {
        setIsLoading(false);
        setAuthInProgress(false);
      }, 500);
      
      return Promise.resolve();
    } catch (error) {
      setIsLoading(false);
      setAuthInProgress(false);
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};