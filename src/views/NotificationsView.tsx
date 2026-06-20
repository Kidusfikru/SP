import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  BellRing, 
  Calendar, 
  Users, 
  MessageSquare, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { AppNotification, NotificationType } from '../types';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

interface NotificationsViewProps {
  id?: string;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearNotification: (id: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  id,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearNotification
}) => {
  const [filterType, setFilterType] = useState<'All' | NotificationType>('All');

  const filteredNotifs = notifications.filter(n => {
    return filterType === 'All' || n.type === filterType;
  });

  const getNotifIcon = (type: NotificationType) => {
    const iconClass = "w-4 h-4 shrink-0 mt-0.5 ";
    switch (type) {
      case 'reminder':
        return <Calendar className={`${iconClass} text-indigo-500`} />;
      case 'registration':
        return <Users className={`${iconClass} text-emerald-500`} />;
      case 'message':
        return <MessageSquare className={`${iconClass} text-amber-500`} />;
      case 'system':
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      default:
        return <Bell className={`${iconClass} text-zinc-400`} />;
    }
  };

  const getNotifBackground = (type: NotificationType, read: boolean) => {
    if (read) return 'bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60';
    
    switch (type) {
      case 'reminder':
        return 'bg-indigo-50/20 dark:bg-indigo-950/15 border-indigo-150 dark:border-indigo-900/30 ring-1 ring-indigo-500/5';
      case 'registration':
        return 'bg-emerald-50/20 dark:bg-emerald-950/15 border-emerald-150 dark:border-emerald-900/30 ring-1 ring-emerald-500/5';
      case 'message':
        return 'bg-amber-50/20 dark:bg-amber-950/15 border-amber-150 dark:border-amber-900/30 ring-1 ring-amber-500/5';
      case 'system':
        return 'bg-rose-50/10 dark:bg-rose-950/15 border-rose-150 dark:border-rose-900/30 ring-1 ring-rose-500/5';
      default:
        return 'bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60';
    }
  };

  return (
    <div id={id || 'notifications-dashboard-center'} className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <PageHeader 
        title="Notification Alerts Feed" 
        description="Monitor system events, schedule clocks, panel ticket reminders, and speaker chat briefs."
      >
        {notifications.some(n => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All As Read</span>
          </button>
        )}
      </PageHeader>

      {/* Filter categories bar */}
      <div className="flex flex-wrap gap-2 pb-2">
        {(['All', 'reminder', 'registration', 'message', 'system'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-xl border transition-all cursor-pointer ${
              filterType === type
                ? 'bg-zinc-950 border-zinc-950 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 shadow-xs'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            {type === 'All' ? 'All Alerts' : `${type}s`}
          </button>
        ))}
      </div>

      {/* Main Feed */}
      {filteredNotifs.length === 0 ? (
        <EmptyState
          title="Archive is Clear!"
          description="We couldn't detect any active logs matching the selected alert filters."
          icon={<BellRing className="w-8 h-8" />}
          action={filterType !== 'All' ? {
            label: "Reset Alert Filter",
            onClick: () => setFilterType('All')
          } : undefined}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredNotifs.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              onClick={() => onMarkRead(notif.id)}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 ${getNotifBackground(notif.type, notif.read)}`}
            >
              {/* Type Category Specific Icon */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 shrink-0">
                {getNotifIcon(notif.type)}
              </div>

              {/* Message text details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className={`text-xs text-zinc-900 dark:text-zinc-50 leading-snug ${!notif.read ? 'font-bold' : 'font-semibold'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{notif.date}</span>
                  </span>
                </div>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-normal font-sans">
                  {notif.message}
                </p>
                {!notif.read && (
                  <span className="inline-block mt-1 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
                    NEW ALERT
                  </span>
                )}
              </div>

              {/* Mark / delete actions */}
              <div className="flex items-center gap-1 shrink-0 self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearNotification(notif.id);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  title="Remove alert from feed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};
