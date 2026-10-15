import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 shadow-xs transition-all duration-150 ${
        hoverable
          ? 'hover:border-parchment-400 dark:hover:border-ink-600 hover:shadow-sm'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, icon, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 pb-4 mb-4 border-b border-parchment-100 dark:border-ink-700/60 ${className}`}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="p-2.5 rounded-xl bg-forest-50 text-forest-700 dark:bg-ink-900 dark:text-forest-300 border border-forest-100/80 dark:border-ink-700">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-lg font-bold text-ink-900 dark:text-ink-50 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
