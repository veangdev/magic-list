import { ReactNode } from 'react';
import { Badge } from '../common/Badge';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export function StatsCard({ title, value, icon, trend, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
    success: 'bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400',
    error: 'bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <Badge 
                variant={trend.value > 0 ? 'success' : trend.value < 0 ? 'error' : 'default'}
                size="sm"
              >
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}