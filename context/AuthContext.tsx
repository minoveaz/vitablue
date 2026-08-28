import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/marketing-studio/utils/supabaseClient';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let initialized = false;

    const applySession = (nextSession: Session | null) => {
      if (!active) return;
      setSession(nextSession);
      setAuthError(null);
      setIsLoading(false);
    };

    const initialize = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        initialized = true;
        applySession(data.session);
      } catch (error) {
        if (!active) return;
        initialized = true;
        const message = error instanceof Error ? error.message : 'Unknown authentication error';
        console.error('Error initializing Supabase authentication:', message);
        setSession(null);
        setAuthError('No se pudo inicializar la autenticación. Revisa la configuración de Supabase.');
        setIsLoading(false);
      }
    };

    void initialize();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      if (!initialized) return;
      setAuthError(null);
      setIsLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    isLoading,
    authError,
    signIn: async (email, password) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { error: error.message } : {};
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'No se pudo iniciar sesión.' };
      }
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
  }), [authError, isLoading, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
