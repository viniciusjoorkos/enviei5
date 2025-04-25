'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticating: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            console.error('Error fetching user data:', userError);
            setUser(null);
          } else {
            setUser(userData);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos');
        }
        throw error;
      }
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Este email já está registrado');
        }
        throw error;
      }
      
      router.push('/login');
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = async () => {
    setIsAuthenticating(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsAuthenticating(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticating, 
        signIn, 
        signUp, 
        signOut,
        resetPassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 