import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

const STEPS = [
  'Parsing prompt semantics...',
  'Evaluating clarity, specificity, and constraints...',
  'Identifying ambiguities and missing context...',
  'Applying expert prompt engineering frameworks...',
  'Finalizing optimized prompt and actionable advice...',
];

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Analyzing and Optimizing Prompt',
  subMessage,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 animate-pulse">
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-8 h-8 animate-spin text-brand-500" style={{ animationDuration: '4s' }} />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping" />
      </div>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {message}
      </h3>
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 h-6 transition-all duration-300">
        {subMessage || STEPS[stepIndex]}
      </p>

      {/* Progress bar visual */}
      <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full animate-pulse w-3/4 transition-all duration-500" />
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
    <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded" />
    <div className="space-y-2 pt-2">
      <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-5/6" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-4/6" />
    </div>
  </div>
);
