import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, KeyRound, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { updateUserPassword } from '../services/auth';
import { supabase } from '../lib/supabase';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Recovery session validation state
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkRecoverySession = async () => {
      // 1. Check for error parameters in URL hash or query
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const queryParams = new URLSearchParams(window.location.search);

      const errorDesc =
        hashParams.get('error_description') ||
        queryParams.get('error_description') ||
        hashParams.get('error') ||
        queryParams.get('error');

      if (errorDesc) {
        if (isMounted) {
          setIsSessionValid(false);
          setSessionError(decodeURIComponent(errorDesc.replace(/\+/g, ' ')));
          setIsCheckingSession(false);
        }
        return;
      }

      // 2. Check for active session in Supabase Auth
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          // Listen for PASSWORD_RECOVERY auth event if session is being established from hash tokens
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (!isMounted) return;
            if (event === 'PASSWORD_RECOVERY' || (newSession && event === 'SIGNED_IN')) {
              setIsSessionValid(true);
              setSessionError(null);
              setIsCheckingSession(false);
            }
          });

          // Allow a brief timeout for token exchange to complete
          const timer = setTimeout(() => {
            if (isMounted && isCheckingSession) {
              setIsSessionValid(false);
              setSessionError(
                'This password reset link is invalid or has expired. Please request a new reset link.'
              );
              setIsCheckingSession(false);
            }
          }, 1500);

          return () => {
            subscription.unsubscribe();
            clearTimeout(timer);
          };
        } else {
          if (isMounted) {
            setIsSessionValid(true);
            setSessionError(null);
            setIsCheckingSession(false);
          }
        }
      } catch {
        if (isMounted) {
          setIsSessionValid(false);
          setSessionError(
            'Unable to verify password reset link. Please try requesting a new link.'
          );
          setIsCheckingSession(false);
        }
      }
    };

    checkRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [isCheckingSession]);

  const clearErrors = () => {
    if (validationError) setValidationError(null);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!password) {
      setValidationError('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (!confirmPassword) {
      setValidationError('Please confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    setValidationError(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { error } = await updateUserPassword(password);

      if (error) {
        setErrorMessage(error);
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMessage('An unexpected error occurred while updating your password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Checking link state
  if (isCheckingSession) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 shadow-sm text-center space-y-4 animate-fade-in">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Verifying reset link...
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please wait while we validate your password recovery session.
          </p>
        </div>
      </div>
    );
  }

  // 2. Invalid or expired link state
  if (!isSessionValid) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Reset Link Invalid or Expired
              </h1>
              <p className="text-sm text-rose-600 dark:text-rose-400 leading-relaxed">
                {sessionError || 'The password reset link is invalid, expired, or has already been used.'}
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <Link to="/login" className="block">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="w-full justify-center shadow-xs"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Valid session: show password reset form
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Set new password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choose a new, secure password for your account.
          </p>
        </div>

        {/* Validation / Error Alert */}
        {(validationError || errorMessage) && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError || errorMessage}</span>
          </div>
        )}

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {isSuccess ? (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Password updated successfully.
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your password has been changed. You can now log in with your new credentials.
                </p>
              </div>
              <Link to="/login" className="block">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="w-full justify-center shadow-xs"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* New Password */}
              <div>
                <label
                  htmlFor="reset-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearErrors();
                    }}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  Must be at least 6 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="reset-confirm-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="reset-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearErrors();
                    }}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full justify-center shadow-xs"
              >
                Update Password
              </Button>

              {/* Back to Login Link */}
              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  Cancel and return to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
