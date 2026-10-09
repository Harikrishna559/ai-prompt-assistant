import React from 'react';
import { AlertCircle, CheckCircle2, Lightbulb, ArrowUpRight } from 'lucide-react';

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
      {/* Identified Weaknesses */}
      <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            Identified Weaknesses
          </h4>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
            {problems.length} detected
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-amber-900 dark:text-amber-200"
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-sm font-medium">{problem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why This Is Better */}
      <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            Why This Is Better
          </h4>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            Optimized Structure
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {whyBetter.map((reason, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 text-emerald-950 dark:text-emerald-200"
            >
              <span className="text-emerald-500 font-bold shrink-0 text-sm">✓</span>
              <span className="text-sm font-medium">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-sky-500 shrink-0" />
            Optimization Best Practices
          </h4>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
            Pro Tips
          </span>
        </div>
        <ul className="space-y-2.5">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/50 dark:bg-slate-800/40 border border-sky-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300"
            >
              <ArrowUpRight className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span className="font-medium">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
