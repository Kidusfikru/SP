export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export type RSVPStatus = 'accepted' | 'pending' | 'declined';

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  photoUrl: string;
  expertise: string[];
  socialLinks: SocialLinks;
  contactEmail: string;
  rsvpStatus: RSVPStatus;
  totalSessions: number;
}

export type EventStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string; // e.g., "60 min", "1.5 hours"
  category: string;
  zoomLink: string;
  bannerUrl: string;
  speakerIds: string[]; // references Speaker.id array
  status: EventStatus;
  rsvpRate: number; // percentage, e.g. 85
  totalAttendees: number;
}

export type AttendanceStatus = 'registered' | 'attended' | 'no_show';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  company: string;
  status: AttendanceStatus;
  registrationDate: string;
  avatarUrl: string;
}

export interface EmojiReaction {
  emoji: string;
  count: number;
  userReacted?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'user' or speakerId
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  emojiReactions?: EmojiReaction[];
}

export interface MessageConversation {
  id: string;
  name: string;
  title: string; // e.g. "Lead Developer @ Stripe" or Group Topic
  avatarUrl: string;
  isGroup: boolean;
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  speakerId?: string; // If 1-1, which speaker
}

export type NotificationType = 'reminder' | 'registration' | 'message' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: NotificationType;
  read: boolean;
}
