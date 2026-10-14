import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Circle } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

const STAGES = [
  'Connecting to Groq Cloud API...',
  'Evaluating clarity & context score...',
  'Analyzing specificity & completeness...',
  'Building expert role & structural framework...',
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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl shadow-xs animate-fade-in">
      {/* Visual pulse icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-600 to-blue-700 p-0.5 shadow-md shadow-sky-500/20">
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Sparkles className="w-8 h-8 animate-spin text-sky-500" style={{ animationDuration: '6s' }} />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-sky-400 rounded-full border-2 border-white dark:border-slate-900 animate-ping" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
        {message}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
        Applying advanced AI prompt engineering frameworks to generate structured recommendations.
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
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                  : isDone
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-sky-600 dark:bg-sky-400 animate-ping" />
                </div>
              ) : (
                <Circle className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
              )}
              <span>{stage}</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar visual */}
      <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
        <div
          className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${((activeStage + 1) / STAGES.length) * 100}%` }}
        />
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
