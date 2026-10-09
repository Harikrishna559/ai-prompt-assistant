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
      className={`bg-white dark:bg-slate-900 border border-sky-100/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs transition-all duration-200 ${
        hoverable
          ? 'hover:shadow-md hover:border-sky-200 dark:hover:border-slate-700 hover:-translate-y-0.5'
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
  <div className={`flex items-start justify-between gap-4 pb-4 mb-4 border-b border-sky-50 dark:border-slate-800/80 ${className}`}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
