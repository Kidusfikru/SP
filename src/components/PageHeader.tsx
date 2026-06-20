import React from 'react';

interface PageHeaderProps {
  id?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ id, title, description, children }) => {
  return (
    <div id={id || `header-${title.toLowerCase().replace(/\s+/g, '-')}`} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800/80 mb-6 transition-all duration-300">
      <div>
        <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};
