import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};
