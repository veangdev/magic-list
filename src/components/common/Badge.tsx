import { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-300',
    error: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-300',
  };
  
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </span>
  );
}