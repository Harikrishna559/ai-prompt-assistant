import type { User, Session, AuthChangeEvent, Subscription } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthResponse<T = unknown> {
  data: T | null;
  error: string | null;
}

export interface SignUpResult {
  user: User | null;
  session: Session | null;
}

export interface SignInResult {
  user: User | null;
  session: Session | null;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResponse<SignUpResult>> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: fullName ? { data: { full_name: fullName.trim() } } : undefined,
    });

    if (error) {
      return {
        data: null,
        error: mapAuthError(error.message),
      };
    }

    return {
      data: {
        user: data.user,
        session: data.session,
      },
      error: null,
    };
  } catch {
    return {
      data: null,
      error: 'Unable to complete sign up. Please try again.',
    };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse<SignInResult>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return {
        data: null,
        error: mapAuthError(error.message),
      };
    }

    return {
      data: {
        user: data.user,
        session: data.session,
      },
      error: null,
    };
  } catch {
    return {
      data: null,
      error: 'Unable to complete sign in. Please try again.',
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: mapAuthError(error.message) };
    }
    return { error: null };
  } catch {
    return { error: 'Unable to sign out. Please try again.' };
  }
}

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser(): Promise<AuthResponse<User>> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return { data: null, error: mapAuthError(error.message) };
    }
    return { data: data.user, error: null };
  } catch {
    return { data: null, error: 'Unable to retrieve user information.' };
  }
}

/**
 * Get the current auth session
 */
export async function getSession(): Promise<AuthResponse<Session>> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { data: null, error: mapAuthError(error.message) };
    }
    return { data: data.session, error: null };
  } catch {
    return { data: null, error: 'Unable to retrieve session.' };
  }
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): { data: { subscription: Subscription } } {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Convert Supabase auth errors into clear, friendly, and safe messages
 */
function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  if (lower.includes('user already registered') || lower.includes('email already in use')) {
    return 'An account with this email already exists.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Please verify your email address before signing in.';
  }
  if (lower.includes('password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (lower.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  return message || 'An unexpected authentication error occurred.';
}
