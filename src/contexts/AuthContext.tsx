import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isDemoMode } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  demoMode: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const demoMode = isDemoMode();

  useEffect(() => {
    // Skip auth in demo mode
    if (demoMode) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase!.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [demoMode]);

  const signInWithGoogle = async () => {
    if (demoMode) {
      toast.error('Demo mode: Add Supabase credentials to enable authentication');
      return;
    }

    try {
      const { error } = await supabase!.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      toast.error(`Authentication failed: ${authError.message}`);
      console.error('Auth error:', authError);
    }
  };

  const signOut = async () => {
    if (demoMode) {
      return;
    }

    try {
      const { error } = await supabase!.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      const authError = error as AuthError;
      toast.error(`Sign out failed: ${authError.message}`);
      console.error('Sign out error:', authError);
    }
  };

  const value = {
    user,
    session,
    loading,
    demoMode,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
