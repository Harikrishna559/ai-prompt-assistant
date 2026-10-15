import React from 'react';
import { Coins, Clock, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { UserCredits } from '../../types';

interface CreditsCardProps {
  credits: UserCredits;
}

export const CreditsCard: React.FC<CreditsCardProps> = ({ credits }) => {
  const allowance = credits.allowance || 1000;
  const used = credits.used || 0;
  const remaining = typeof credits.remaining === 'number' ? credits.remaining : Math.max(0, allowance - used);
  const percentageRemaining = Math.max(0, Math.min(100, Math.round((remaining / allowance) * 100)));
  const percentageUsed = Math.max(0, Math.min(100, Math.round((used / allowance) * 100)));

  // Detect user local timezone
  let userTimezone = 'Local Time';
  try {
    userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';
  } catch {
    // fallback
  }

  // Determine progress bar color based on remaining percentage
  const getProgressBarColor = () => {
    if (remaining <= 50) {
      return 'bg-terracotta-600 dark:bg-terracotta-500';
    }
    if (remaining <= 200) {
      return 'bg-amber-500 dark:bg-amber-400';
    }
    return 'bg-forest-600 dark:bg-forest-500';
  };

  const isExhausted = remaining <= 0;

  return (
    <div className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-5 sm:p-6 shadow-xs transition-all">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-parchment-100 dark:border-ink-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-50 dark:bg-ink-900 border border-forest-200/80 dark:border-ink-700 text-forest-700 dark:text-forest-400 flex items-center justify-center shadow-2xs">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-ink-900 dark:text-ink-50">
                Daily Free Credits Allowance
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-forest-50 dark:bg-ink-900 text-forest-700 dark:text-forest-300 border border-forest-200 dark:border-ink-700">
                100% Free Public Access
              </span>
            </div>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              Zero login or registration required. Refreshes every midnight.
            </p>
          </div>
        </div>

        {/* Midnight Reset Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-parchment-100/80 dark:bg-ink-900/80 border border-parchment-200 dark:border-ink-700 text-xs text-ink-600 dark:text-ink-300 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400 shrink-0" />
          <span>
            Resets at <strong>00:00 midnight</strong> ({userTimezone})
          </span>
        </div>
      </div>

      {/* Credit Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
        {/* Daily Allowance */}
        <div className="p-3.5 rounded-xl bg-parchment-50/70 dark:bg-ink-900/50 border border-parchment-200/60 dark:border-ink-700/50">
          <span className="text-xs font-medium text-ink-500 dark:text-ink-400 block mb-1">
            Daily Allowance
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-ink-900 dark:text-ink-50 font-mono">
              {allowance.toLocaleString()}
            </span>
            <span className="text-xs text-ink-400 dark:text-ink-500">credits/day</span>
          </div>
        </div>

        {/* Credits Used Today */}
        <div className="p-3.5 rounded-xl bg-parchment-50/70 dark:bg-ink-900/50 border border-parchment-200/60 dark:border-ink-700/50">
          <span className="text-xs font-medium text-ink-500 dark:text-ink-400 block mb-1">
            Used Today
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-ink-700 dark:text-ink-200 font-mono">
              {used.toLocaleString()}
            </span>
            <span className="text-xs text-ink-400 dark:text-ink-500">
              ({percentageUsed}% used)
            </span>
          </div>
        </div>

        {/* Credits Remaining */}
        <div
          className={`p-3.5 rounded-xl border transition-colors ${
            isExhausted
              ? 'bg-terracotta-50/80 dark:bg-ink-900/80 border-terracotta-200 dark:border-terracotta-900/60'
              : remaining <= 200
              ? 'bg-amber-50/70 dark:bg-ink-900/70 border-amber-200 dark:border-amber-900/50'
              : 'bg-forest-50/60 dark:bg-ink-900/60 border-forest-200/70 dark:border-ink-700/60'
          }`}
        >
          <span className="text-xs font-medium text-ink-500 dark:text-ink-400 block mb-1">
            Credits Remaining
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-black font-mono ${
                isExhausted
                  ? 'text-terracotta-600 dark:text-terracotta-400'
                  : remaining <= 200
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-forest-700 dark:text-forest-300'
              }`}
            >
              {remaining.toLocaleString()}
            </span>
            <span className="text-xs text-ink-400 dark:text-ink-500">
              ({percentageRemaining}% available)
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 mt-2">
        <div className="flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
          <span className="font-medium">Credit Balance Progress</span>
          <span className="font-mono font-medium">
            {remaining} / {allowance} credits remaining
          </span>
        </div>
        <div
          className="w-full h-3 rounded-full bg-parchment-200 dark:bg-ink-700 overflow-hidden p-0.5 border border-parchment-300/60 dark:border-ink-600"
          role="progressbar"
          aria-valuenow={remaining}
          aria-valuemin={0}
          aria-valuemax={allowance}
          aria-label="Daily credits remaining"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressBarColor()}`}
            style={{ width: `${percentageRemaining}%` }}
          />
        </div>
      </div>

      {/* Exhausted Notice */}
      {isExhausted && (
        <div className="mt-4 p-3.5 rounded-xl bg-terracotta-50 dark:bg-ink-900 border border-terracotta-200 dark:border-terracotta-900/60 flex items-start gap-2.5 text-xs text-terracotta-800 dark:text-terracotta-300">
          <AlertTriangle className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Daily Free Credit Allowance Reached (1,000 / 1,000 used)</p>
            <p className="text-terracotta-700 dark:text-terracotta-400">
              Your free credits will automatically replenish at midnight in your local timezone ({userTimezone}).
            </p>
          </div>
        </div>
      )}

      {/* Footer Notes: Deduction Policy & Provider Burst Limits Distinction */}
      <div className="mt-4 pt-3.5 border-t border-parchment-100 dark:border-ink-700/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-ink-500 dark:text-ink-400">
        <div className="flex items-start gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400 shrink-0 mt-0.5" />
          <span>
            <strong>Deduction Policy:</strong> Exactly 1 credit is deducted only when a Groq AI prompt improvement succeeds. Failed requests, timeouts, and validation errors never consume credits.
          </span>
        </div>
        <div className="flex items-start gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Provider Rate Limits:</strong> Website daily allowance is 1,000/day. Upstream Groq Cloud burst limits (requests per minute) are managed separately to prevent rapid automated spam.
          </span>
        </div>
      </div>
    </div>
  );
};
