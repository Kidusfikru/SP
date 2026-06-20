import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Speaker, 
  Event, 
  Attendee, 
  MessageConversation, 
  ChatMessage, 
  AppNotification, 
  RSVPStatus,
  AttendanceStatus,
  EmojiReaction
} from './types';

// Importing Firebase persistence layers
import { 
  seedDatabaseIfEmpty,
  listenSpeakers,
  addSpeakerToDb,
  updateSpeakerInDb,
  listenEvents,
  addEventToDb,
  updateEventInDb,
  listenAttendees,
  addAttendeeToDb,
  updateAttendeeInDb,
  deleteAttendeeFromDb,
  listenConversations,
  listenMessages,
  addMessageToDb,
  updateMessageInDb,
  listenNotifications,
  addNotificationToDb,
  updateNotificationInDb,
  deleteNotificationFromDb
} from './lib/firebaseService';

// Importing Views
import { DashboardView } from './views/DashboardView';
import { EventsView } from './views/EventsView';
import { SpeakersView } from './views/SpeakersView';
import { AttendeesView } from './views/AttendeesView';
import { MessagesView } from './views/MessagesView';
import { NotificationsView } from './views/NotificationsView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';

// Importing Core Components
import { Sidebar, SidebarTab } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('speaker-portal-theme');
    return saved ? saved === 'dark' : true; // Defaulting to refined dark mode!
  });

  // UI state
  const [activeTab, setActiveTab] = useState<SidebarTab>(() => {
    const hash = window.location.hash.replace('#', '');
    const validTabs: SidebarTab[] = ['dashboard', 'events', 'speakers', 'attendees', 'messages', 'notifications', 'analytics', 'settings'];
    return validTabs.includes(hash as SidebarTab) ? (hash as SidebarTab) : 'dashboard';
  });
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Synchronize active tab with URL hash change events
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs: SidebarTab[] = ['dashboard', 'events', 'speakers', 'attendees', 'messages', 'notifications', 'analytics', 'settings'];
      if (validTabs.includes(hash as SidebarTab)) {
        setActiveTab(hash as SidebarTab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when activeTab changes
  useEffect(() => {
    if (window.location.hash !== `#${activeTab}`) {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  // Entities state - initialized empty, dynamically populated by real-time Snapshot streams
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Sync state loader
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  // Initialize and synchronize Firestore in real-time
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    async function initDb() {
      // 1. Seed fallback collections if empty
      await seedDatabaseIfEmpty();

      // 2. Open Snapshots listeners
      const unsubSpeakers = listenSpeakers((data) => {
        setSpeakers(data);
      });
      const unsubEvents = listenEvents((data) => {
        setEvents(data);
      });
      const unsubAttendees = listenAttendees((data) => {
        setAttendees(data);
      });
      const unsubConversations = listenConversations((data) => {
        setConversations(data.sort((a, b) => {
          if (a.id === 'conv-ai') return -1;
          if (b.id === 'conv-ai') return 1;
          return a.id.localeCompare(b.id);
        }));
      });
      const unsubMessages = listenMessages((data) => {
        setMessages(data);
      });
      const unsubNotifications = listenNotifications((data) => {
        setNotifications(data);
        setDbLoading(false); // Stop loading indicator once first stack resolves
      });

      unsubs.push(unsubSpeakers, unsubEvents, unsubAttendees, unsubConversations, unsubMessages, unsubNotifications);
    }

    initDb();

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  // Synchronize system theme classes
  useEffect(() => {
    localStorage.setItem('speaker-portal-theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Synchronize unread badges
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleToggleTheme = () => setDarkMode(!darkMode);

  // VIEW DETAILS DRAWER LOGIC OR EVENT ROUTER ACTION
  const handleSelectEvent = (event: Event) => {
    alert(`Checking detailed parameters for event:\n"${event.title}"\nZoom coordinates linked and soundcheck credentials dispatched.`);
  };

  // MUTATE ACTION: Assemble / Create Event and update Firestore
  const handleCreateEvent = async (newEvent: Omit<Event, 'id' | 'rsvpRate' | 'totalAttendees'>) => {
    const freshId = `evt-${Date.now()}`;
    const rsvpRate = Math.floor(Math.random() * 25) + 70; // 70% to 95%
    const totalAttendees = Math.floor(Math.random() * 400) + 150; // 150 to 550

    const createdEvent: Event = {
      ...newEvent,
      id: freshId,
      rsvpRate,
      totalAttendees
    };

    await addEventToDb(createdEvent);

    // Dispatch system notification
    const alertNotif: AppNotification = {
      id: `not-${Date.now()}`,
      title: `Event Stage Assembled: ${newEvent.title}`,
      message: `Assigned Category: ${newEvent.category}. Broadcast scheduled successfully.`,
      date: 'Just now',
      type: 'reminder',
      read: false
    };
    await addNotificationToDb(alertNotif);
  };

  // MUTATE ACTION: Onboard / Invite Speaker and update Firestore
  const handleAddSpeaker = async (newSpeaker: Omit<Speaker, 'id' | 'rsvpStatus' | 'totalSessions'>) => {
    const freshSpeaker: Speaker = {
      ...newSpeaker,
      id: `spk-${Date.now()}`,
      rsvpStatus: 'pending',
      totalSessions: 0
    };

    await addSpeakerToDb(freshSpeaker);

    // Dispatch alert notification
    const alertNotif: AppNotification = {
      id: `not-${Date.now()}`,
      title: `Speaker Invited: ${newSpeaker.name}`,
      message: `Invitation successfully dispatched to contact email: ${newSpeaker.contactEmail}`,
      date: 'Just now',
      type: 'registration',
      read: false
    };
    await addNotificationToDb(alertNotif);
  };

  // MUTATE ACTION: Modify Speaker Bio parameters and update Firestore
  const handleUpdateSpeaker = async (updatedSpeaker: Speaker) => {
    await updateSpeakerInDb(updatedSpeaker);
  };

  // MUTATE ACTION: Trigger fast RSVP Changes and update Firestore
  const handleRsvpChange = async (speakerId: string, status: RSVPStatus) => {
    const targetedSpeaker = speakers.find(s => s.id === speakerId);
    if (!targetedSpeaker) return;

    await updateSpeakerInDb({
      ...targetedSpeaker,
      rsvpStatus: status
    });

    // Dispatch status alert notification
    const alertNotif: AppNotification = {
      id: `not-${Date.now()}`,
      title: `RSVP Updated: ${targetedSpeaker.name}`,
      message: `Invitation roster status altered to: ${status.toUpperCase()} schedule index.`,
      date: 'Just now',
      type: 'system',
      read: false
    };
    await addNotificationToDb(alertNotif);

    // Recalculate event-level progress rates representation
    for (const evt of events) {
      if (evt.speakerIds.includes(speakerId)) {
        const adjustment = status === 'accepted' ? 6 : status === 'declined' ? -15 : 0;
        await updateEventInDb({
          ...evt,
          rsvpRate: Math.max(10, Math.min(100, evt.rsvpRate + adjustment))
        });
      }
    }
  };

  // MUTATE ACTION: Register Ticket Attendee and update Firestore
  const handleAddAttendee = async (newAttendee: Omit<Attendee, 'id' | 'registrationDate'>) => {
    const createdAttendee: Attendee = {
      ...newAttendee,
      id: `att-${Date.now()}`,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    await addAttendeeToDb(createdAttendee);

    // Dispatch alert notification
    const alertNotif: AppNotification = {
      id: `not-${Date.now()}`,
      title: `Ticket Sold: ${newAttendee.name}`,
      message: `Registered for virtual Green Room channels on behalf of ${newAttendee.company}.`,
      date: 'Just now',
      type: 'registration',
      read: false
    };
    await addNotificationToDb(alertNotif);
  };

  // MUTATE ACTION: Check-In Attendee Checkmark and update Firestore
  const handleUpdateAttendeeStatus = async (id: string, status: AttendanceStatus) => {
    await updateAttendeeInDb(id, { status });
  };

  // MUTATE ACTION: Remove Attendee and update Firestore
  const handleDeleteAttendee = async (id: string) => {
    await deleteAttendeeFromDb(id);
  };

  // MUTATE ACTION: Send Message log and update Firestore
  const handleSendMessage = async (convId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: 'Portal Admin',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    await addMessageToDb(convId, newMessage);

    // If typing in the AI Assistant chatbot channel, trigger Gemini Advisor
    if (convId === 'conv-ai') {
      try {
        setIsAiThinking(true);
        // Send actual grounding database contextual objects so the chatbot has full intelligence on speaker/event data
        const response = await fetch('/api/chat-bot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: text,
            context: {
              speakers,
              events,
              attendees
            }
          })
        });

        if (!response.ok) {
          throw new Error('API server returned response error');
        }

        const data = await response.json();
        
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: 'ai',
          senderName: 'Gemini Assistant',
          senderAvatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        await addMessageToDb(convId, aiMessage);
      } catch (error) {
        console.error("Failed to query chatbot:", error);
        const errorMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: 'ai',
          senderName: 'Gemini Assistant',
          senderAvatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80',
          text: "I experienced a connection issue reaching the Gemini advisor. Please make sure the backend dev server is active and configured correctly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        await addMessageToDb(convId, errorMessage);
      } finally {
        setIsAiThinking(false);
      }
    }
  };

  // MUTATE ACTION: React to messages with emojis and update Firestore
  const handleReactToMessage = async (convId: string, msgId: string, emoji: string) => {
    const chatLogs = messages[convId] || [];
    const targetedMsg = chatLogs.find(msg => msg.id === msgId);
    if (!targetedMsg) return;

    const reactions = targetedMsg.emojiReactions || [];
    const existing = reactions.find(r => r.emoji === emoji);

    let newReactions: EmojiReaction[] = [];
    if (existing) {
      newReactions = reactions.map(r => 
        r.emoji === emoji 
          ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
          : r
      ).filter(r => r.count > 0);
    } else {
      newReactions = [...reactions, { emoji, count: 1, userReacted: true }];
    }

    await updateMessageInDb(convId, msgId, newReactions);
  };

  // MUTATE ACTION: Notifications reads/clearance and update Firestore
  const handleMarkRead = async (id: string) => {
    await updateNotificationInDb(id, { read: true });
  };

  const handleMarkAllRead = async () => {
    for (const notif of notifications) {
      if (!notif.read) {
        await updateNotificationInDb(notif.id, { read: true });
      }
    }
  };

  const handleClearNotification = async (id: string) => {
    await deleteNotificationFromDb(id);
  };

  // Navigate view screen callback
  const handleNavigateToTab = (tab: any) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  if (dbLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white font-sans animate-pulse">
        <div className="text-center space-y-4">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xs uppercase font-extrabold tracking-widest text-zinc-400 font-mono">
            Establishing Live Firebase Connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Left Navigation Sidebar Drawer */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleNavigateToTab}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main app viewport container on the right */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top bar search engine, notifications badge, profiles and toggler theme */}
        <TopNavbar
          searchValue={globalSearch}
          onSearchChange={setGlobalSearch}
          notifications={notifications}
          darkMode={darkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateToTab={handleNavigateToTab}
          onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Scrollable primary content stage with smooth routing switch fades */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  events={events}
                  speakers={speakers}
                  totalAttendeesCount={attendees.length}
                  unreadMessagesCount={unreadMessagesCount}
                  onNavigateToTab={handleNavigateToTab}
                  onCreateEventClick={() => handleNavigateToTab('events')}
                  onSelectEvent={handleSelectEvent}
                />
              )}

              {activeTab === 'events' && (
                <EventsView
                  events={events}
                  speakers={speakers}
                  onCreateEvent={handleCreateEvent}
                  onSelectEvent={handleSelectEvent}
                  searchValue={globalSearch}
                />
              )}

              {activeTab === 'speakers' && (
                <SpeakersView
                  speakers={speakers}
                  events={events}
                  onUpdateSpeaker={handleUpdateSpeaker}
                  onAddSpeaker={handleAddSpeaker}
                  onRsvpChange={handleRsvpChange}
                  searchValue={globalSearch}
                />
              )}

              {activeTab === 'attendees' && (
                <AttendeesView
                  attendees={attendees}
                  onAddAttendee={handleAddAttendee}
                  onUpdateAttendeeStatus={handleUpdateAttendeeStatus}
                  onDeleteAttendee={handleDeleteAttendee}
                  searchValue={globalSearch}
                />
              )}

              {activeTab === 'messages' && (
                <MessagesView
                  conversations={conversations}
                  activeConvId={activeConvId}
                  onSetActiveConv={setActiveConvId}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onReactToMessage={handleReactToMessage}
                  isAiThinking={isAiThinking}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                  onMarkAllRead={handleMarkAllRead}
                  onClearNotification={handleClearNotification}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView
                  totalEventsCount={events.length}
                  totalAttendeesCount={attendees.length}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  darkMode={darkMode}
                  onToggleTheme={handleToggleTheme}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* Floating Sparkles Gemini AI Button everywhere */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="btn-global-ai-fab"
          onClick={() => {
            setActiveConvId('conv-ai');
            handleNavigateToTab('messages');
          }}
          className="flex items-center gap-2.5 px-4.5 py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-full shadow-[0_4px_24px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.65)] hover:border-indigo-300 font-bold text-xs tracking-wide transition-all duration-300 transform hover:scale-105 select-none cursor-pointer group active:scale-95 border border-indigo-500/20"
          title="Pose queries to AI Advisor"
        >
          <div className="relative">
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
            </span>
            <Sparkles className="w-4 h-4 text-violet-100 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="font-sans">AI ADVISOR</span>
        </button>
      </div>

    </div>
  );
}
