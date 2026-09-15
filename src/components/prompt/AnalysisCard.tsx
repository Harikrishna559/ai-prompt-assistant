import React from 'react';
import { AlertCircle, CheckCircle2, Lightbulb, ShieldAlert } from 'lucide-react';

interface AnalysisCardProps {
  problems: string[];
  whyBetter: string[];
  suggestions: string[];
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  problems,
  whyBetter,
  suggestions,
}) => {
  return (
    <div className="space-y-6">
      {/* Identified Problems */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Identified Weaknesses in Original Prompt
        </h4>
        <div className="space-y-2.5">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200"
            >
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-sm">{problem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why This Is Better */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Why This Improved Prompt Is Better
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {whyBetter.map((reason, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200"
            >
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span className="text-sm font-medium">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Suggestions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-500" />
          Optimization Suggestions for Next Time
        </h4>
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
