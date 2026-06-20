import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Mic2, 
  Users, 
  MessageCircle, 
  BellRing, 
  AreaChart, 
  Settings, 
  Radio, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export type SidebarTab = 
  | 'dashboard' 
  | 'events' 
  | 'speakers' 
  | 'attendees' 
  | 'messages' 
  | 'notifications' 
  | 'analytics' 
  | 'settings';

interface SidebarProps {
  id?: string;
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  id,
  activeTab,
  onTabChange,
  unreadMessagesCount,
  unreadNotificationsCount,
  mobileOpen,
  setMobileOpen
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Sync initial browser state
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  interface MenuItem {
    id: SidebarTab;
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
  }

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'speakers', label: 'Speakers', icon: Mic2 },
    { id: 'attendees', label: 'Attendees', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'notifications', label: 'Notifications', icon: BellRing, badge: unreadNotificationsCount },
    { id: 'analytics', label: 'Analytics', icon: AreaChart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabClick = (tabId: SidebarTab) => {
    onTabChange(tabId);
    setMobileOpen(false); // Auto-close drawer on mobile selection
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-300 border-r border-zinc-900/80">
      {/* Brand Logo and Title */}
      <div className="p-6 flex items-center justify-between border-b border-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-zinc-100 text-base tracking-tight font-sans">
              Speaker<span className="text-indigo-400">Portal</span>
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">
                PRO NETWORK
              </span>
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-50 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Navigation links */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id as SidebarTab)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'hover:bg-zinc-900 hover:text-zinc-100 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-4.5 h-4.5 transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  isActive ? 'bg-white text-indigo-700' : 'bg-indigo-500/10 text-indigo-400'
                }`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Bottom Connection Status & Synchronization info */}
      <div className="p-6 border-t border-zinc-900/60 bg-zinc-950/60">
        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-900 flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5">
            <div className="mt-1 shrink-0 relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOnline ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-zinc-100 flex items-center gap-1.5 leading-none">
                {isOnline ? 'Live Sync Active' : 'Offline Mode'}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                {isOnline 
                  ? 'Firestore synchronized with instant real-time streams.' 
                  : 'Local fallback active. Auto-reconnecting...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div id={id || 'sidebar-nav'} className="relative">
      {/* Desktop Sidebar (Permanent block) */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Absolute overlay) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-55 flex">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" 
          />
          {/* Drawer menu drawer */}
          <div className="relative flex flex-col w-64 max-w-xs h-full transform transition-transform duration-300 shadow-2xl z-10 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </div>
  );
};
