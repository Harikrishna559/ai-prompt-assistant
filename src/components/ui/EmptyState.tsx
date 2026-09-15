import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 mb-4">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
