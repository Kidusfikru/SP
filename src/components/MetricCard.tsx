import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trendValue?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  description?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'rose';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  icon,
  trendValue,
  trendDirection = 'neutral',
  description,
  color = 'indigo'
}) => {
  const colorMap = {
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30',
    rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/30'
  };

  return (
    <motion.div
      id={id || `metric-${title.toLowerCase().replace(/\s+/g, '-')}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="p-5 bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xs hover:shadow-md dark:hover:shadow-zinc-950/30 transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-tight">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {value}
        </span>
        {trendValue && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendDirection === 'up' 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
              : trendDirection === 'down'
              ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
          }`}>
            {trendDirection === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
            {trendDirection === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
            {trendValue}
          </span>
        )}
      </div>

      {(description || trendValue) && (
        <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500 line-clamp-1">
          {description || 'vs. previous 30-day index'}
        </p>
      )}
    </motion.div>
  );
};
