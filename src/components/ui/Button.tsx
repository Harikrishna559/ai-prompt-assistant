import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5 shadow-xs',
  };

  const variantStyles = {
    primary:
      'bg-forest-700 hover:bg-forest-800 text-parchment-50 border border-forest-800/30 shadow-xs focus-visible:ring-forest-700 dark:bg-forest-600 dark:hover:bg-forest-500 font-medium',
    accent:
      'bg-terracotta-600 hover:bg-terracotta-700 text-white border border-terracotta-700/30 shadow-xs focus-visible:ring-terracotta-600 font-medium',
    secondary:
      'bg-parchment-100 hover:bg-parchment-200/80 text-ink-900 dark:bg-ink-800 dark:hover:bg-ink-700 dark:text-ink-100 border border-parchment-300 dark:border-ink-700 focus-visible:ring-forest-700',
    outline:
      'bg-white hover:bg-parchment-50 text-ink-800 dark:text-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700/80 border border-parchment-300 dark:border-ink-700 focus-visible:ring-forest-700 shadow-2xs',
    ghost:
      'bg-transparent hover:bg-parchment-100/70 text-ink-700 dark:text-ink-300 dark:hover:bg-ink-800/80 dark:hover:text-ink-100 focus-visible:ring-forest-700',
    danger:
      'bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 dark:bg-ink-900 dark:hover:bg-terracotta-950/40 dark:text-terracotta-300 border border-terracotta-200 dark:border-terracotta-900/50 focus-visible:ring-terracotta-600',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
