import React from 'react';
import type { ScoreBreakdown } from '../../types';
import { Award } from 'lucide-react';
import { getScoreColor } from '../../utils/formatters';

interface ScoreCardProps {
  score: ScoreBreakdown;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const scoreTheme = getScoreColor(score.overall);

  const metrics = [
    { label: 'Clarity', value: score.clarity, description: 'Directness & phrasing' },
    { label: 'Context', value: score.context, description: 'Background & persona' },
    { label: 'Specificity', value: score.specificity, description: 'Precision & detail' },
    { label: 'Completeness', value: score.completeness, description: 'Constraints & format' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Prompt Quality Score
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Objective evaluation based on standard prompt engineering principles
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-baseline gap-1 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <span className={`text-3xl font-extrabold tracking-tight ${scoreTheme.text}`}>
            {score.overall}
          </span>
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            / 100
          </span>
        </div>
      </div>

      {/* Subscores Grid with Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const itemColor = getScoreColor(metric.value);
          return (
            <div
              key={metric.label}
              className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {metric.label}
                  </span>
                  <span className="block text-[11px] text-slate-400 dark:text-slate-500">
                    {metric.description}
                  </span>
                </div>
                <span className={`text-sm font-bold ${itemColor.text}`}>
                  {metric.value}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200/70 dark:bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${itemColor.barColor}`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
