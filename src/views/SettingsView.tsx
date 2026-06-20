import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  Save, 
  Volume2, 
  AppWindow, 
  KeyRound,
  MailCheck,
  Check
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface SettingsViewProps {
  id?: string;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  id,
  darkMode,
  onToggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'security'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Profile forms
  const [adminName, setAdminName] = useState('Portal Admin');
  const [adminEmail, setAdminEmail] = useState('kidusfikru0@gmail.com');
  const [orgName, setOrgName] = useState('Global Speakers Network Inc.');

  // Toggle state variables
  const [notifSound, setNotifSound] = useState(true);
  const [notifEmailRegs, setNotifEmailRegs] = useState(true);
  const [notifInviteAuto, setNotifInviteAuto] = useState(false);

  const [portalThemeAccent, setPortalThemeAccent] = useState<'indigo' | 'violet' | 'blue' | 'emerald'>('indigo');
  const [allowTwoFactor, setAllowTwoFactor] = useState(true);

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      alert('SaaS Configurations saved successfully!');
    }, 1500);
  };

  const getAccentClass = (color: typeof portalThemeAccent) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-600 dark:bg-indigo-500';
      case 'violet': return 'bg-violet-600 dark:bg-violet-500';
      case 'blue': return 'bg-blue-600 dark:bg-blue-500';
      case 'emerald': return 'bg-emerald-600 dark:bg-emerald-500';
      default: return 'bg-indigo-600';
    }
  };

  return (
    <div id={id || 'portal-settings-view'} className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Header */}
      <PageHeader 
        title="Settings Configurations" 
        description="Configure account, toggle notifications settings, customize themes parameters, and monitor security indices."
      />

      {/* Main Settings Panel Grid */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[50vh] transition-colors">
        
        {/* Left Toggles Tabs Column */}
        <div className="w-full md:w-56 border-r border-zinc-200/80 dark:border-zinc-805/80 bg-zinc-50/50 dark:bg-zinc-950/25 p-4 flex flex-row md:flex-col gap-1 overflow-x-auto shrink-0 select-none">
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>My Account</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'notifications'
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'appearance'
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'security'
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Security</span>
          </button>

        </div>

        {/* Right Settings Form Container */}
        <div className="flex-1 p-6 relative">
          
          <form onSubmit={handleSaveForm} className="space-y-6">
            
            {/* TABS 1: Profile forms */}
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-sm font-bold text-zinc-905 dark:text-white">Account Details</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Adjust information linked to your administrator panel</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Admin Profile Name</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Organization Company</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                  />
                </div>
              </div>
            )}

            {/* TABS 2: Notifications toggles */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-sm font-bold text-zinc-905 dark:text-white">Email & System Toggles</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Control sound alert pitches and webhook automation dispatches</p>
                </div>

                <div className="space-y-4">
                  {/* Toggle 1 */}
                  <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/40 dark:border-zinc-800/60">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Live Sound Notifications</p>
                      <p className="text-[10px] text-zinc-405 dark:text-zinc-500">Play chime sounds on incoming speaker guidelines messages</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifSound(!notifSound)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${notifSound ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${notifSound ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Toggle 2 */}
                  <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/40 dark:border-zinc-800/60">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Weekly Ticket Digests</p>
                      <p className="text-[10px] text-zinc-405 dark:text-zinc-500">Dispatch cumulative attendee RSVP CSV sheets to registered admins</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifEmailRegs(!notifEmailRegs)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${notifEmailRegs ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${notifEmailRegs ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Toggle 3 */}
                  <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/40 dark:border-zinc-800/60">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Auto-Invite Speaker Pipelines</p>
                      <p className="text-[10px] text-zinc-405 dark:text-zinc-500">Automatically dispatch pending invitations on event builds</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifInviteAuto(!notifInviteAuto)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${notifInviteAuto ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${notifInviteAuto ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TABS 3: Appearance theme toggle & accents */}
            {activeTab === 'appearance' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-sm font-bold text-zinc-905 dark:text-white">Visual Themes Customizer</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Adjust dark theme variables and set color presets for metrics components</p>
                </div>

                {/* Dark mode layout toggles block */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/40 dark:border-zinc-800/60">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Toggle Dark-Canvas Theme</p>
                    <p className="text-[10px] text-zinc-405 dark:text-zinc-500">Enable warm eye-safe slate templates for late night scheduling drafts</p>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${darkMode ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Custom Accents colors selectors */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Choose Brand Accent Tint</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['indigo', 'violet', 'blue', 'emerald'] as const).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setPortalThemeAccent(color)}
                        className={`py-2 px-3.5 text-xs font-semibold uppercase tracking-wider rounded-xl text-white transition-all cursor-pointer flex items-center justify-between gap-1 ${
                          portalThemeAccent === color
                            ? getAccentClass(color) + ' shadow-md'
                            : 'bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        <span>{color}</span>
                        {portalThemeAccent === color && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TABS 4: Security passcodes */}
            {activeTab === 'security' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                  <h3 className="text-sm font-bold text-zinc-905 dark:text-white">Security & Multi-Factor</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Manage API token caches, administrative passwords, and SSL parameters</p>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/40 dark:border-zinc-800/60">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Force Two-Factor (2FA)</p>
                      <p className="text-[10px] text-zinc-405 dark:text-zinc-500">Require mobile OTP inputs on administrative login sessions</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowTwoFactor(!allowTwoFactor)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${allowTwoFactor ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${allowTwoFactor ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/40 dark:border-zinc-805/85 flex items-start gap-3 text-xs leading-normal">
                    <KeyRound className="w-5 h-5 text-zinc-400 shrink-0 select-none mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">Mock API Integrations token</p>
                      <p className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 p-1.5 rounded-lg border border-indigo-100/50 dark:border-indigo-900/10 truncate font-bold select-all max-w-[440px]">
                        spk_live_aa81729b81734919cb4928e0e1a4
                      </p>
                      <p className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-relaxed font-sans">
                        Use this readwork token inside server environments to programmatically dispatch invites and fetch rsvp indices secure endpoints.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Bottom save actions panel */}
            <div className="pt-4 mt-6 border-t border-zinc-150 dark:border-zinc-805/85 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaved}
                className="px-4 py-2.2 text-xs font-semibold bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl shadow-xs inline-flex items-center gap-1.8 cursor-pointer disabled:opacity-40"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saving configurations...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save SaaS Settings</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};
