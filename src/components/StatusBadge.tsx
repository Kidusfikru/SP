import React from 'react';

type BadgeType = 'rsvp' | 'event' | 'attendance';

interface StatusBadgeProps {
  id?: string;
  type: BadgeType;
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ id, type, status }) => {
  const normalizedValue = status.toLowerCase().replace(/_/g, ' ');

  let classes = 'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ';

  if (type === 'rsvp') {
    switch (normalizedValue) {
      case 'accepted':
        classes += 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
        break;
      case 'pending':
        classes += 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
        break;
      case 'declined':
        classes += 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
        break;
      default:
        classes += 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700';
    }
  } else if (type === 'event') {
    switch (normalizedValue) {
      case 'upcoming':
        classes += 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30';
        break;
      case 'live':
        classes += 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/40 animate-pulse';
        break;
      case 'completed':
        classes += 'bg-zinc-100 dark:bg-zinc-800 text-zinc-750 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80';
        break;
      case 'cancelled':
        classes += 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-50 border border-dashed border-zinc-300 dark:border-zinc-750/80';
        break;
      default:
        classes += 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300';
    }
  } else if (type === 'attendance') {
    switch (normalizedValue) {
      case 'attended':
        classes += 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
        break;
      case 'registered':
        classes += 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30';
        break;
      case 'no show':
      case 'no_show':
        classes += 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700';
        break;
      default:
        classes += 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300';
    }
  }

  const getIndicator = () => {
    if (normalizedValue === 'live') {
      return <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-0.5" />;
    }
    if (normalizedValue === 'accepted' || normalizedValue === 'attended') {
      return <span className="w-1 h-1 rounded-full bg-emerald-500 mr-0.5" />;
    }
    if (normalizedValue === 'pending') {
      return <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-0.5" />;
    }
    return null;
  };

  return (
    <span id={id} className={classes}>
      {getIndicator()}
      {normalizedValue}
    </span>
  );
};
