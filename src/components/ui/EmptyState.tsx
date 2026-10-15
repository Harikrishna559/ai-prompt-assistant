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
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-ink-800 border border-dashed border-parchment-300 dark:border-ink-700 rounded-2xl">
      <div className="p-3.5 rounded-2xl bg-forest-50 dark:bg-ink-900 text-forest-700 dark:text-forest-300 mb-4 border border-forest-100 dark:border-ink-700">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <h4 className="text-lg font-bold text-ink-900 dark:text-ink-50 mb-1">
        {title}
      </h4>
      <p className="text-sm text-ink-500 dark:text-ink-400 max-w-sm mb-6 leading-relaxed">
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
