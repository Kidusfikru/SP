import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Radio,
  ArrowRight
} from 'lucide-react';
import { AppNotification } from '../types';

interface TopNavbarProps {
  id?: string;
  searchValue: string;
  onSearchChange: (val: string) => void;
  notifications: AppNotification[];
  darkMode: boolean;
  onToggleTheme: () => void;
  onNavigateToTab: (tab: 'notifications' | 'settings' | 'messages') => void;
  onMobileMenuToggle: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  id,
  searchValue,
  onSearchChange,
  notifications,
  darkMode,
  onToggleTheme,
  onNavigateToTab,
  onMobileMenuToggle
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const handleNotificationClick = (nId: string) => {
    setNotifDropdownOpen(false);
    onNavigateToTab('notifications');
  };

  return (
    <header
      id={id || 'top-navbar'}
      className="h-16 border-b border-zinc-205 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between gap-4 transition-all duration-300"
    >
      {/* Mobile Toggle Button & Search Block */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        {/* Global Instant Search */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search events, speakers, or company filters..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-805/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Action utilities item list */}
      <div className="flex items-center gap-2 md:gap-3.5 shrink-0">
        
        {/* Toggle Theme button */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 rounded-xl transition-all cursor-pointer"
          title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Quick Notification Dropdown bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setProfileDropdownOpen(false);
            }}
            className={`p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 border ${
              notifDropdownOpen ? 'border-zinc-200 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-900' : 'border-transparent hover:border-zinc-200 dark:hover:border-zinc-800'
            } rounded-xl transition-all relative cursor-pointer`}
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-indigo-650 dark:bg-indigo-500 ring-2 ring-white dark:ring-zinc-950" />
            )}
          </button>

          {/* Alert Dropdown dialog */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/20">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                  Recent Notifications
                </span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-full font-bold">
                  {unreadNotifs.length} Unread
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-zinc-400">
                    No notifications available
                  </p>
                ) : (
                  notifications.slice(0, 4).map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors ${!notif.read ? 'bg-indigo-500/[0.02]' : ''}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-indigo-500' : 'bg-transparent'}`} />
                        <div>
                          <p className={`text-xs text-zinc-800 dark:text-zinc-200 leading-snug ${!notif.read ? 'font-medium' : ''}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-1">
                            {notif.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => {
                  setNotifDropdownOpen(false);
                  onNavigateToTab('notifications');
                }}
                className="w-full text-center py-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-800/80 cursor-pointer flex items-center justify-center gap-1"
              >
                <span>View all notifications</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Vertical divider line */}
        <span className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />

        {/* User profile dropdown block */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 md:gap-2.5 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 cursor-pointer"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Profile Avatar"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-500/10"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 block leading-tight">
                Admin Panel
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5 font-mono">
                yeabmesfin0@gmail.com
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-1.5 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-zinc-150 dark:border-zinc-800/80 mb-1.5 bg-zinc-50/50 dark:bg-zinc-950/20">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-extrabold block">
                  Logged in as
                </span>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 block mt-1 truncate">
                  yeabmesfin0@gmail.com
                </span>
              </div>
              
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigateToTab('settings');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left cursor-pointer transition-colors"
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span>My Account</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigateToTab('settings');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left cursor-pointer transition-colors"
              >
                <Settings className="w-4 h-4 text-zinc-400" />
                <span>System Configurations</span>
              </button>

              <span className="block border-t border-zinc-100 dark:border-zinc-800/80 my-1.5" />

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  alert('Thank you for exploring the Premium Speaker Portal dashboard demo!');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-left cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold">Sign Out Demo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
