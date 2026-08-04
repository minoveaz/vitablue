import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/marketing-studio/utils/supabaseClient';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  role: 'admin' | 'editor' | 'viewer' | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AuthContextValue['role']>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRole = async (nextSession: Session | null) => {
      if (!active) return;
      setSession(nextSession);
      if (!nextSession) {
        setRole(null);
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase.rpc('get_my_marketing_role');
      if (!active) return;
      if (error) console.error('Error loading Marketing Studio role:', error.message);
      setRole(data === 'admin' || data === 'editor' || data === 'viewer' ? data : null);
      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => loadRole(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setIsLoading(true);
      void loadRole(nextSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    role,
    isLoading,
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
  }), [isLoading, role, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
