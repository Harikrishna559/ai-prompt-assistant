import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, Mail, ArrowRight, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { resendVerificationEmail } from '../services/auth';
import { supabase } from '../lib/supabase';

export const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const { user, isEmailVerified } = useAuth();

  const [status, setStatus] = useState<'checking' | 'verified' | 'error' | 'unverified'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check for error parameters in URL hash or query
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const queryParams = new URLSearchParams(window.location.search);

    const errorDesc =
      hashParams.get('error_description') ||
      queryParams.get('error_description') ||
      hashParams.get('error') ||
      queryParams.get('error');

    if (errorDesc) {
      setStatus('error');
      setErrorMessage(decodeURIComponent(errorDesc.replace(/\+/g, ' ')));
      return;
    }

    // 2. Check if the user is already verified via AuthContext
    if (isEmailVerified) {
      setStatus('verified');
      return;
    }

    // 3. Inspect Supabase session and listen for auth state changes (e.g. email confirmation redirect)
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;

      if (session?.user) {
        setEmail(session.user.email || '');
        const isGoogle =
          session.user.app_metadata?.provider === 'google' ||
          session.user.identities?.some((id) => id.provider === 'google');
        if (session.user.email_confirmed_at || isGoogle) {
          setStatus('verified');
          return;
        }
      }

      // If not immediately verified, listen for auth event or mark unverified after brief check
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (!isMounted) return;
        if (currentSession?.user) {
          setEmail(currentSession.user.email || '');
          const isGoogle =
            currentSession.user.app_metadata?.provider === 'google' ||
            currentSession.user.identities?.some((id) => id.provider === 'google');
          if (currentSession.user.email_confirmed_at || isGoogle) {
            setStatus('verified');
          }
        }
      });

      const timer = setTimeout(() => {
        if (isMounted && status === 'checking') {
          setStatus('unverified');
        }
      }, 1200);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timer);
      };
    });

    return () => {
      isMounted = false;
    };
  }, [isEmailVerified, status]);

  // Set email from context if available
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
    const stateEmail = (location.state as { email?: string })?.email;
    if (stateEmail && !email) {
      setEmail(stateEmail);
    }
  }, [user, location.state, email]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isResending) return;

    if (!email.trim()) {
      setResendError('Please enter your email address.');
      return;
    }

    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      const { error } = await resendVerificationEmail(email.trim());
      if (error) {
        setResendError(error);
      } else {
        setResendSuccess(true);
      }
    } catch {
      setResendError('An unexpected error occurred while resending verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Loading / Checking State */}
        {status === 'checking' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 shadow-sm text-center space-y-4 animate-fade-in">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Verifying your email...
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please wait while we confirm your account.
            </p>
          </div>
        )}

        {/* Verified Success State */}
        {status === 'verified' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 shadow-sm text-center space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Email verified successfully!
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your account is verified. You now have full access to the AI Prompt Improvement Assistant.
              </p>
            </div>
            <Link to="/dashboard" className="block">
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full justify-center shadow-xs"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Dashboard
              </Button>
            </Link>
          </div>
        )}

        {/* Error / Link Expired State */}
        {status === 'error' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Verification failed
              </h1>
              <p className="text-sm text-rose-600 dark:text-rose-400">
                {errorMessage || 'The verification link is invalid or has expired.'}
              </p>
            </div>

            {/* Resend Form */}
            <form onSubmit={handleResend} className="space-y-3 pt-2">
              {resendSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-700 dark:text-emerald-300">
                  Verification email sent! Please check your inbox.
                </div>
              )}
              {resendError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
                  {resendError}
                </div>
              )}
              <div>
                <label
                  htmlFor="verify-error-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="verify-error-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isResending}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isResending}
                disabled={isResending}
                className="w-full justify-center"
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Resend Verification Email
              </Button>
            </form>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Unverified / Verification Pending State */}
        {status === 'unverified' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center mx-auto text-white shadow-md shadow-indigo-500/20">
              <Mail className="w-7 h-7" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Verify your email
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please check your inbox and verify your email address to access the application.
              </p>
            </div>

            {email && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center font-medium text-sm text-slate-800 dark:text-slate-200 break-all">
                {email}
              </div>
            )}

            {/* Resend Form */}
            <form onSubmit={handleResend} className="space-y-3">
              {resendSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-700 dark:text-emerald-300">
                  Verification email sent! Please check your inbox.
                </div>
              )}
              {resendError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
                  {resendError}
                </div>
              )}
              {!email && (
                <div>
                  <label
                    htmlFor="verify-unverified-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="verify-unverified-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isResending}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isResending}
                disabled={isResending}
                className="w-full justify-center"
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Resend Verification Email
              </Button>
            </form>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
