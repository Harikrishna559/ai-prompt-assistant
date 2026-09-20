import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSession, onAuthStateChange } from '../services/auth';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. Retrieve initial session on application startup
    getSession()
      .then(({ data }) => {
        if (mounted) {
          setSession(data);
          setUser(data?.user ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      });

    // 2. Subscribe to Supabase auth state changes
    const {
      data: { subscription },
    } = onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });

    // 3. Unsubscribe on unmount to prevent leaks or duplicate listeners
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isGoogleUser =
    user?.app_metadata?.provider === 'google' ||
    user?.identities?.some((id) => id.provider === 'google');
  const isEmailVerified = Boolean(user?.email_confirmed_at) || Boolean(isGoogleUser);

  const value: AuthContextType = {
    user,
    session,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
    isEmailVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
