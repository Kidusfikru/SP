import { Speaker, Event, Attendee, MessageConversation, ChatMessage, AppNotification } from './types';

export const initialSpeakers: Speaker[] = [
  {
    id: 'spk-1',
    name: 'Sarah Jenkins',
    title: 'VP of Product Design',
    company: 'Linear',
    bio: 'Sarah leads product design at Linear, where she translates complex workflows into beautiful, efficient, high-performance interfaces. Previously she led designer-experience tools at Figma.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    expertise: ['UI/UX Design', 'Design Systems', 'Product Strategy', 'Figma workflows'],
    socialLinks: {
      twitter: 'https://twitter.com/sarahdesign',
      github: 'https://github.com/sarahj-design',
      linkedin: 'https://linkedin.com/in/sarahjenkins-design',
      website: 'https://linear.app'
    },
    contactEmail: 'sarah@linear.app',
    rsvpStatus: 'accepted',
    totalSessions: 3
  },
  {
    id: 'spk-2',
    name: 'Michael Chen',
    title: 'Staff Frontend Engineer',
    company: 'Vercel',
    bio: 'Michael works on the Next.js core team at Vercel. He is passionate about speed, rendering paradigms, web performance optimization, and crafting standard-compliant responsive structures.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    expertise: ['Next.js', 'React Server Components', 'Web Performance', 'TypeScript'],
    socialLinks: {
      twitter: 'https://twitter.com/mchen_web',
      github: 'https://github.com/mchenVercel',
      linkedin: 'https://linkedin.com/in/michaelchen-dev'
    },
    contactEmail: 'mchen@vercel.com',
    rsvpStatus: 'accepted',
    totalSessions: 4
  },
  {
    id: 'spk-3',
    name: 'Elena Rostova',
    title: 'Co-Founder & CTO',
    company: 'Supabase',
    bio: 'Elena is the CTO of Supabase. She is an expert in open-source databases, Postgres extensions, real-time sync systems, and secure serverless computing scaling structures.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    expertise: ['PostgreSQL', 'Database Tuning', 'Serverless Architecture', 'Open Source'],
    socialLinks: {
      twitter: 'https://twitter.com/elena_postgres',
      github: 'https://github.com/erostova',
      website: 'https://supabase.com'
    },
    contactEmail: 'elena@supabase.io',
    rsvpStatus: 'pending',
    totalSessions: 2
  },
  {
    id: 'spk-4',
    name: 'Marcus Sterling',
    title: 'Principal Engineer API Platforms',
    company: 'Stripe',
    bio: 'Marcus manages internal API standards at Stripe, ensuring standard security, robust rate-limiting, perfect error schemas, and outstanding developer experience across all multi-tenant API systems.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    expertise: ['API Design', 'Security', 'Caching Standards', 'SaaS Scaling'],
    socialLinks: {
      twitter: 'https://twitter.com/marcustalks',
      linkedin: 'https://linkedin.com/in/msterling'
    },
    contactEmail: 'marcus@stripe.com',
    rsvpStatus: 'declined',
    totalSessions: 1
  },
  {
    id: 'spk-5',
    name: 'Aisha Rahman',
    title: 'Lead AI Engineer',
    company: 'Anthropic',
    bio: 'Aisha conducts interface alignment engineering. Her research focuses on prompt optimization, agentic reasoning loops, context cache utilization, and multi-modal human-in-the-loop interfaces.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    expertise: ['AI Alignment', 'Prompt Engineering', 'LLM Agents', 'Vector Databases'],
    socialLinks: {
      twitter: 'https://twitter.com/aisha_ai',
      github: 'https://github.com/aisharahman'
    },
    contactEmail: 'aisha@anthropic.com',
    rsvpStatus: 'accepted',
    totalSessions: 3
  }
];

export const initialEvents: Event[] = [
  {
    id: 'evt-1',
    title: 'Crafting High-Performance User Interfaces & Design Systems',
    description: 'Learn the exact strategies used at Linear to align design and codebases. This session dives deep into state synchronization, spatial density control, fluid typography, and implementing consistent components using modern CSS, leading to fluid, professional responsive systems.',
    date: '2026-07-15',
    time: '10:00 AM',
    duration: '90 min',
    category: 'Design & UX',
    zoomLink: 'https://zoom.linear.example.com/j/481928374',
    bannerUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    speakerIds: ['spk-1', 'spk-2'],
    status: 'upcoming',
    rsvpRate: 92,
    totalAttendees: 420
  },
  {
    id: 'evt-2',
    title: 'Scaling Database Infrastructure in 2026: Postgres and Real-Time Flows',
    description: 'A technical workshop covering modern relational database techniques. Elena Rostova demonstrates production database configurations for scale-to-zero setups, PostgreSQL indexes, security policies, and optimizing WebSockets for instant data synchronization.',
    date: '2026-07-22',
    time: '01:00 PM',
    duration: '60 min',
    category: 'Backend & Databases',
    zoomLink: 'https://zoom.supabase.example.com/j/591028392',
    bannerUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    speakerIds: ['spk-3'],
    status: 'upcoming',
    rsvpRate: 78,
    totalAttendees: 185
  },
  {
    id: 'evt-3',
    title: 'Next-Generation Fullstack Render Modes and Advanced Hydration',
    description: 'Michael Chen reveals secret performance features in the Next.js core. Explore runtime components, nested layout caches, resource prioritization strategies, and how to entirely bypass unnecessary bundle hydration cycles in mission-critical standard portals.',
    date: '2026-08-04',
    time: '11:00 AM',
    duration: '75 min',
    category: 'Web Development',
    zoomLink: 'https://zoom.vercel.example.com/j/902837194',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    speakerIds: ['spk-2'],
    status: 'upcoming',
    rsvpRate: 98,
    totalAttendees: 640
  },
  {
    id: 'evt-4',
    title: 'API Platform Security, Token Caching, and Fault-Tolerance',
    description: 'Marcus Sterling breaks down the underlying standard specifications and caching systems designed to handle billions of transactional calls securely. Understand rate limits, fail-safes, and elegant fault separation frameworks.',
    date: '2026-06-18',
    time: '03:00 PM',
    duration: '60 min',
    category: 'Architecture',
    zoomLink: 'https://zoom.stripe.example.com/j/120938475',
    bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
    speakerIds: ['spk-4'],
    status: 'completed',
    rsvpRate: 64,
    totalAttendees: 275
  },
  {
    id: 'evt-5',
    title: 'Designing Prompt-Driven UI & Agentic Orchestration Panels',
    description: 'Aisha Rahman showcases live structures of agentic context optimization. This session focuses on the intersection of deep-reasoning loops and instant UI renderings, combining prompt templates with fluid client-side states.',
    date: '2026-08-11',
    time: '02:00 PM',
    duration: '90 min',
    category: 'Artificial Intelligence',
    zoomLink: 'https://zoom.anthropic.example.com/j/882739481',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    speakerIds: ['spk-5'],
    status: 'upcoming',
    rsvpRate: 88,
    totalAttendees: 310
  }
];

export const initialAttendees: Attendee[] = [
  {
    id: 'att-1',
    name: 'Jessica Vance',
    email: 'jess.vance@netflix.com',
    company: 'Netflix',
    status: 'attended',
    registrationDate: '2026-06-01',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'att-2',
    name: 'David Kael',
    email: 'david@figma.com',
    company: 'Figma',
    status: 'registered',
    registrationDate: '2026-06-03',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'att-3',
    name: 'Yuki Tanaka',
    email: 'yuki@sony.co.jp',
    company: 'Sony Interactive',
    status: 'registered',
    registrationDate: '2026-06-04',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'att-4',
    name: 'Oliver Griezmann',
    email: 'oliver.g@tesla.com',
    company: 'Tesla Energy',
    status: 'no_show',
    registrationDate: '2026-06-10',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'att-5',
    name: 'Cassandra Pierce',
    email: 'pierce.cass@cloudflared.com',
    company: 'Cloudflare',
    status: 'attended',
    registrationDate: '2026-06-11',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'att-6',
    name: 'Brandon Li',
    email: 'brandon_li@hashicorp.com',
    company: 'HashiCorp',
    status: 'registered',
    registrationDate: '2026-06-14',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'att-7',
    name: 'Sophia Martinez',
    email: 'sophia@uber.com',
    company: 'Uber Technologies',
    status: 'registered',
    registrationDate: '2026-06-16',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'att-8',
    name: 'Tariq Al-Fayed',
    email: 'tfayed@google.com',
    company: 'Google',
    status: 'registered',
    registrationDate: '2026-06-19',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  }
];

export const initialConversations: MessageConversation[] = [
  {
    id: 'conv-1',
    name: 'Sarah Jenkins',
    title: 'VP of Product Design @ Linear',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isGroup: false,
    unreadCount: 2,
    lastMessageText: 'Can we double-check the screen share settings?',
    lastMessageTime: '09:24 AM',
    speakerId: 'spk-1'
  },
  {
    id: 'conv-2',
    name: 'Michael Chen',
    title: 'Staff Frontend Engineer @ Vercel',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    isGroup: false,
    unreadCount: 0,
    lastMessageText: 'All assets for Advanced Hydration session are compiled.',
    lastMessageTime: 'Yesterday',
    speakerId: 'spk-2'
  },
  {
    id: 'conv-3',
    name: 'Main Speaker Briefing',
    title: 'Group Chat (Design Systems & Web Tech)',
    avatarUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&auto=format&fit=crop&q=80',
    isGroup: true,
    unreadCount: 0,
    lastMessageText: 'Elena: Perfect! Let us gather in the backstage link.',
    lastMessageTime: '2 days ago'
  }
];

export const initialMessages: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-1-1',
      senderId: 'spk-1',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: 'Good morning! I wanted to check if the design slides template I uploaded works well with the platform ratios.',
      timestamp: '09:12 AM',
      emojiReactions: [
        { emoji: '👍', count: 3, userReacted: true }
      ]
    },
    {
      id: 'm-1-2',
      senderId: 'user',
      senderName: 'Portal Admin',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      text: 'Morning Sarah! Yes, the 16:9 widescreen format looks perfect on our render stages. No clipping detected.',
      timestamp: '09:18 AM',
      emojiReactions: [
        { emoji: '💖', count: 1, userReacted: false }
      ]
    },
    {
      id: 'm-1-3',
      senderId: 'spk-1',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: 'Fantastic. Also, can we double-check the screen share settings? Last time we had some quality drops.',
      timestamp: '09:24 AM'
    }
  ],
  'conv-2': [
    {
      id: 'm-2-1',
      senderId: 'user',
      senderName: 'Portal Admin',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      text: 'Hi Michael! Your session Next-Generation rendering is trending first in sign-ups.',
      timestamp: 'Yesterday, 04:10 PM',
      emojiReactions: [
        { emoji: '🚀', count: 4, userReacted: true }
      ]
    },
    {
      id: 'm-2-2',
      senderId: 'spk-2',
      senderName: 'Michael Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text: 'Wow, that is amazing to hear! All assets for Advanced Hydration session are compiled.',
      timestamp: 'Yesterday, 04:30 PM'
    }
  ],
  'conv-3': [
    {
      id: 'm-3-1',
      senderId: 'spk-3',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      text: 'Supabase Postgres session agenda finalized. Ready for real-time demonstration!',
      timestamp: '2 days ago',
      emojiReactions: [{ emoji: '🔥', count: 5, userReacted: true }]
    },
    {
      id: 'm-3-2',
      senderId: 'spk-1',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: 'Awesome, Elena. I will join the soundcheck room 15 minutes before we go live on Wednesday.',
      timestamp: '2 days ago'
    },
    {
      id: 'm-3-3',
      senderId: 'spk-3',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      text: 'Perfect! Let us gather in the backstage link.',
      timestamp: '2 days ago'
    }
  ]
};

export const initialNotifications: AppNotification[] = [
  {
    id: 'not-1',
    title: 'Upcoming Event: Crafting High-Performance User Interfaces',
    message: 'Your soundcheck starts in 15 minutes. Please join the green room via the host Link.',
    date: 'Just now',
    type: 'reminder',
    read: false
  },
  {
    id: 'not-2',
    title: 'New Register on Next-Gen Rendering Methods',
    message: 'Tariq Al-Fayed (Google) just registered for Michael Chens upcoming session.',
    date: '2 hours ago',
    type: 'registration',
    read: false
  },
  {
    id: 'not-3',
    title: 'Pending Speaker RSVP Reminder',
    message: 'CTO Elena Rostova (Supabase) has pending invite for Database Scaling session.',
    date: '5 hours ago',
    type: 'system',
    read: true
  },
  {
    id: 'not-4',
    title: 'Direct Message from Sarah Jenkins',
    message: 'Sarah: "Fantastic. Also, can we double-check the screen share settings?"',
    date: '1 day ago',
    type: 'message',
    read: true
  }
];

export const mockDashboardGrowth = [
  { month: 'Jan', count: 55 },
  { month: 'Feb', count: 72 },
  { month: 'Mar', count: 98 },
  { month: 'Apr', count: 120 },
  { month: 'May', count: 155 },
  { month: 'Jun', count: 195 },
  { month: 'Jul', count: 245 }
];

export const mockCategoryStats = [
  { category: 'Design & UX', count: 1, color: '#6366f1' },       // indigo
  { category: 'Backend & DB', count: 1, color: '#10b981' },       // emerald
  { category: 'Web Dev', count: 1, color: '#3b82f6' },            // blue
  { category: 'AI Alignments', count: 1, color: '#ec4899' },      // pink
  { category: 'Architecture', count: 1, color: '#f59e0b' }        // amber
];

export const mockRecentActivities = [
  {
    id: 'act-1',
    user: 'Aisha Rahman',
    action: 'accepted the speaker invitation',
    description: 'Lead AI Engineer @ Anthropic',
    time: '24 min ago',
    type: 'speaker'
  },
  {
    id: 'act-2',
    user: 'Jessica Vance',
    action: 'registered for soundcheck panel',
    description: 'Senior Lead @ Netflix',
    time: '45 min ago',
    type: 'attendee'
  },
  {
    id: 'act-3',
    user: 'System Bot',
    action: 'dispatched automated calendar invites',
    description: 'For Advanced Hydration session',
    time: '2 hours ago',
    type: 'system'
  },
  {
    id: 'act-4',
    user: 'Marcus Sterling',
    action: 'updated bio & linkedin profile parameters',
    description: 'Principal API Advocate @ Stripe',
    time: 'Yesterday',
    type: 'speaker'
  }
];
