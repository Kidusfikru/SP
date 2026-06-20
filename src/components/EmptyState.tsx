import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  id?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id,
  title,
  description,
  icon,
  action
}) => {
  return (
    <div
      id={id || 'empty-state-view'}
      className="flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 transition-all duration-300"
    >
      <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 dark:text-zinc-500 mb-4 animate-pulse">
        {icon || <Search className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 font-sans">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4.5 py-2 text-sm font-medium bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
