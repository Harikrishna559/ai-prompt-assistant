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
      options: {
        data: fullName ? { full_name: fullName.trim() } : undefined,
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
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
): Promise<AuthResponse<SignInResult> & { isUnverified?: boolean }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      const mapped = mapAuthError(error.message);
      const isUnverified =
        mapped.toLowerCase().includes('verify your email') ||
        error.message.toLowerCase().includes('email not confirmed');
      return {
        data: null,
        error: mapped,
        isUnverified,
      };
    }

    // Inspect user email verification state
    if (data.user) {
      const isGoogleUser =
        data.user.app_metadata?.provider === 'google' ||
        data.user.identities?.some((id) => id.provider === 'google');
      const isEmailVerified = Boolean(data.user.email_confirmed_at) || Boolean(isGoogleUser);

      if (!isEmailVerified) {
        // Sign out immediately so unverified session does not remain active
        await supabase.auth.signOut();
        return {
          data: null,
          error: 'Please verify your email address before signing in.',
          isUnverified: true,
        };
      }
    }

    return {
      data: {
        user: data.user,
        session: data.session,
      },
      error: null,
      isUnverified: false,
    };
  } catch {
    return {
      data: null,
      error: 'Unable to complete sign in. Please try again.',
    };
  }
}

/**
 * Resend email verification link for unconfirmed signup
 */
export async function resendVerificationEmail(
  email: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });

    if (error) {
      return { error: mapAuthError(error.message) };
    }

    return { error: null };
  } catch {
    return { error: 'Unable to resend verification email. Please try again.' };
  }
}

/**
 * Sign in with Google OAuth provider
 */
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      return { error: mapAuthError(error.message) };
    }

    return { error: null };
  } catch {
    return { error: 'Unable to initiate Google sign-in. Please try again.' };
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
 * Request a password reset email
 */
export async function resetPasswordForEmail(
  email: string
): Promise<AuthResponse<null>> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return {
        data: null,
        error: mapAuthError(error.message),
      };
    }

    return {
      data: null,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: 'Unable to send password reset email. Please try again.',
    };
  }
}

/**
 * Update the current user's password (used in password reset / recovery flow)
 */
export async function updateUserPassword(
  password: string
): Promise<AuthResponse<User>> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return {
        data: null,
        error: mapAuthError(error.message),
      };
    }

    return {
      data: data.user,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: 'Unable to update password. Please try again.',
    };
  }
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
