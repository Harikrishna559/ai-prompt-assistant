import React from 'react';
import type { ScoreBreakdown } from '../../types';
import { Award } from 'lucide-react';
import { getScoreColor, getScoreTier } from '../../utils/formatters';

interface ScoreCardProps {
  score: ScoreBreakdown;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const scoreTheme = getScoreColor(score.overall);
  const tier = getScoreTier(score.overall);

  const metrics = [
    {
      label: 'Clarity',
      value: score.clarity,
      explanation: 'Clear, direct objective',
    },
    {
      label: 'Context',
      value: score.context,
      explanation: 'Role framing & background',
    },
    {
      label: 'Specificity',
      value: score.specificity,
      explanation: 'Concrete details & bounds',
    },
    {
      label: 'Completeness',
      value: score.completeness,
      explanation: 'Output format & acceptance criteria',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-sky-50 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-500" />
              Prompt Quality Score
            </h3>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${scoreTheme.badgeBg}`}
            >
              {tier.label} Prompt
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {tier.description}
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-baseline gap-1.5 bg-sky-50/80 dark:bg-slate-800/80 px-5 py-2.5 rounded-2xl border border-sky-200/80 dark:border-slate-700/80 shrink-0">
          <span className={`text-3xl sm:text-4xl font-black tracking-tight ${scoreTheme.text}`}>
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
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-sky-50 dark:border-slate-800/80 hover:border-sky-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {metric.label}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    "{metric.explanation}"
                  </span>
                </div>
                <span className={`text-sm font-bold font-mono ${itemColor.text}`}>
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
