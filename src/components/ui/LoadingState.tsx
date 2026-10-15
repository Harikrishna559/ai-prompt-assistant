import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Circle } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

const STAGES = [
  'Connecting to Groq Cloud API...',
  'Evaluating clarity & context score...',
  'Analyzing specificity & completeness bounds...',
  'Architecting expert role & structural framework...',
  'Finalizing optimized prompt deliverable...',
];

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Evaluating prompt quality...',
}) => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 280);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl shadow-xs animate-fade-in">
      {/* Quiet, craftsman-grade icon */}
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-forest-700 text-parchment-50 flex items-center justify-center shadow-xs">
          <Sparkles className="w-6 h-6 animate-spin text-parchment-100" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-ink-900 dark:text-ink-50 mb-1">
        {message}
      </h3>
      <p className="text-xs text-ink-500 dark:text-ink-400 mb-6 max-w-sm">
        Running deterministic optimization and structural analysis via Groq Cloud engine.
      </p>

      {/* Structured stages list */}
      <div className="w-full max-w-xs space-y-2 text-left">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeStage;
          const isCurrent = idx === activeStage;
          return (
            <div
              key={stage}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 ${
                isCurrent
                  ? 'bg-forest-50 dark:bg-ink-900 text-forest-800 dark:text-forest-200 font-semibold'
                  : isDone
                  ? 'text-forest-700 dark:text-forest-400 font-medium'
                  : 'text-ink-400 dark:text-ink-600 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-forest-700 dark:text-forest-400 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-forest-700 dark:bg-forest-400 animate-pulse" />
                </div>
              ) : (
                <Circle className="w-4 h-4 text-parchment-400 dark:text-ink-600 shrink-0" />
              )}
              <span>{stage}</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar visual */}
      <div className="w-64 h-1.5 bg-parchment-200 dark:bg-ink-900 rounded-full overflow-hidden mt-6">
        <div
          className="h-full bg-forest-700 dark:bg-forest-500 rounded-full transition-all duration-300"
          style={{ width: `${((activeStage + 1) / STAGES.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700 rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-4 bg-parchment-200 dark:bg-ink-700 rounded w-1/3" />
    <div className="h-10 bg-parchment-100 dark:bg-ink-900/60 rounded" />
    <div className="space-y-2 pt-2">
      <div className="h-3 bg-parchment-100 dark:bg-ink-900/50 rounded w-5/6" />
      <div className="h-3 bg-parchment-100 dark:bg-ink-900/50 rounded w-4/6" />
    </div>
  </div>
);
