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
    <div className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 shadow-xs transition-all hover:border-parchment-400 dark:hover:border-ink-600">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-forest-50 dark:bg-ink-900 text-forest-700 dark:text-forest-300 border border-forest-100 dark:border-ink-700">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-ink-900 dark:text-ink-50 tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-terracotta-50 text-terracotta-800 dark:bg-terracotta-950/40 dark:text-terracotta-300'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-ink-400 dark:text-ink-500 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};
