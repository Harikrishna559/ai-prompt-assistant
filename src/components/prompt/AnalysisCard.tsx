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
      <div className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-ink-900 dark:text-ink-50 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-terracotta-600 dark:text-terracotta-400 shrink-0" />
            Identified Weaknesses
          </h4>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 dark:bg-terracotta-950/40 dark:text-terracotta-300 border border-terracotta-200 dark:border-terracotta-900/60">
            {problems.length} detected
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl bg-terracotta-50/50 dark:bg-ink-900/50 border border-terracotta-200/70 dark:border-terracotta-900/40 text-terracotta-900 dark:text-terracotta-200"
            >
              <div className="w-2 h-2 rounded-full bg-terracotta-600 shrink-0" />
              <span className="text-sm font-medium">{problem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why This Is Better */}
      <div className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-ink-900 dark:text-ink-50 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-forest-700 dark:text-forest-400 shrink-0" />
            Why This Is Better
          </h4>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-800 dark:bg-forest-950/40 dark:text-forest-300 border border-forest-200 dark:border-forest-900/60">
            Architected Structure
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {whyBetter.map((reason, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-forest-50/50 dark:bg-ink-900/50 border border-forest-200/70 dark:border-forest-900/40 text-forest-950 dark:text-forest-200"
            >
              <span className="text-forest-700 dark:text-forest-400 font-bold shrink-0 text-sm">✓</span>
              <span className="text-sm font-medium">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Best Practices */}
      <div className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-ink-900 dark:text-ink-50 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            Prompt Engineering Best Practices
          </h4>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-parchment-100 text-ink-700 dark:bg-ink-900 dark:text-ink-300 border border-parchment-200 dark:border-ink-700">
            Field Notes
          </span>
        </div>
        <ul className="space-y-2.5">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-parchment-50/80 dark:bg-ink-900/40 border border-parchment-200 dark:border-ink-700/60 text-sm text-ink-800 dark:text-ink-200"
            >
              <ArrowUpRight className="w-4 h-4 text-forest-700 dark:text-forest-400 shrink-0 mt-0.5" />
              <span className="font-medium">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
