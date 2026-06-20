import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  orderBy 
} from './firebase';
import { 
  Speaker, 
  Event, 
  Attendee, 
  MessageConversation, 
  ChatMessage, 
  AppNotification 
} from '../types';
import { 
  initialSpeakers, 
  initialEvents, 
  initialAttendees, 
  initialConversations, 
  initialMessages, 
  initialNotifications 
} from '../mockData';

// Seed Database helper
export async function seedDatabaseIfEmpty() {
  try {
    const speakersSnap = await getDocs(collection(db, 'speakers'));
    if (speakersSnap.empty) {
      console.log('Seeding speakers into Firestore...');
      for (const speaker of initialSpeakers) {
        await setDoc(doc(db, 'speakers', speaker.id), speaker);
      }
    }

    const eventsSnap = await getDocs(collection(db, 'events'));
    if (eventsSnap.empty) {
      console.log('Seeding events into Firestore...');
      for (const event of initialEvents) {
        await setDoc(doc(db, 'events', event.id), event);
      }
    }

    const attendeesSnap = await getDocs(collection(db, 'attendees'));
    if (attendeesSnap.empty) {
      console.log('Seeding attendees into Firestore...');
      for (const attendee of initialAttendees) {
        await setDoc(doc(db, 'attendees', attendee.id), attendee);
      }
    }

    const convsSnap = await getDocs(collection(db, 'conversations'));
    if (convsSnap.empty) {
      console.log('Seeding conversations into Firestore...');
      for (const conv of initialConversations) {
        await setDoc(doc(db, 'conversations', conv.id), conv);
      }
    }

    // Dynamic check: Always ensure a dedicated 'conv-ai' chatbot thread is available
    let hasAiChat = false;
    const currentConvs = await getDocs(collection(db, 'conversations'));
    currentConvs.forEach((docSnapshot) => {
      if (docSnapshot.id === 'conv-ai') {
        hasAiChat = true;
      }
    });

    if (!hasAiChat) {
      console.log('Seeding conv-ai chatbot thread into Firestore...');
      const chatbotConv: MessageConversation = {
        id: 'conv-ai',
        name: 'Speaker Portal AI Assistant',
        title: 'Gemini Real-Time Event Advisor',
        avatarUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&auto=format&fit=crop&q=80',
        isGroup: false,
        unreadCount: 0,
        lastMessageText: 'Hello! I am your real-time Speaker Portal Assistant. Ask me anything about your speakers, schedules, or attendees!',
        lastMessageTime: 'Just now'
      };
      await setDoc(doc(db, 'conversations', 'conv-ai'), chatbotConv);

      const welcomeMsgDocId = 'conv-ai_msg-welcome';
      await setDoc(doc(db, 'messages', welcomeMsgDocId), {
        id: 'msg-welcome',
        senderId: 'ai',
        senderName: 'Gemini Assistant',
        senderAvatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&auto=format&fit=crop&q=80',
        text: 'Hello! I am your real-time Speaker Portal Assistant. Ask me anything about your speakers, schedules, or attendees!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        conversationId: 'conv-ai',
        timestampValue: Date.now() - 1000
      });
    }

    const messagesSnap = await getDocs(collection(db, 'messages'));
    if (messagesSnap.empty) {
      console.log('Seeding messages into Firestore...');
      // Flatten initialMessages
      for (const [convId, list] of Object.entries(initialMessages)) {
        for (const msg of list) {
          const msgDocId = `${convId}_${msg.id}`;
          await setDoc(doc(db, 'messages', msgDocId), {
            ...msg,
            conversationId: convId,
            timestampValue: Date.now() - (list.length - list.indexOf(msg)) * 60000 // Ensure ordering if needed
          });
        }
      }
    }

    const notificationsSnap = await getDocs(collection(db, 'notifications'));
    if (notificationsSnap.empty) {
      console.log('Seeding notifications into Firestore...');
      for (const notif of initialNotifications) {
        await setDoc(doc(db, 'notifications', notif.id), {
          ...notif,
          timestampValue: Date.now()
        });
      }
    }
    console.log('Firestore Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// ------------------- SPEAKERS COLLECTIONS -------------------
export function listenSpeakers(callback: (speakers: Speaker[]) => void) {
  return onSnapshot(collection(db, 'speakers'), (snap) => {
    const list: Speaker[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Speaker);
    });
    callback(list);
  });
}

export async function addSpeakerToDb(speaker: Speaker) {
  await setDoc(doc(db, 'speakers', speaker.id), speaker);
}

export async function updateSpeakerInDb(speaker: Speaker) {
  await updateDoc(doc(db, 'speakers', speaker.id), speaker as any);
}

// ------------------- EVENTS COLLECTIONS -------------------
export function listenEvents(callback: (events: Event[]) => void) {
  return onSnapshot(collection(db, 'events'), (snap) => {
    const list: Event[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Event);
    });
    callback(list);
  });
}

export async function addEventToDb(event: Event) {
  await setDoc(doc(db, 'events', event.id), event);
}

export async function updateEventInDb(event: Event) {
  await updateDoc(doc(db, 'events', event.id), event as any);
}

// ------------------- ATTENDEES COLLECTIONS -------------------
export function listenAttendees(callback: (attendees: Attendee[]) => void) {
  return onSnapshot(collection(db, 'attendees'), (snap) => {
    const list: Attendee[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Attendee);
    });
    callback(list);
  });
}

export async function addAttendeeToDb(attendee: Attendee) {
  await setDoc(doc(db, 'attendees', attendee.id), attendee);
}

export async function updateAttendeeInDb(id: string, updates: Partial<Attendee>) {
  await updateDoc(doc(db, 'attendees', id), updates as any);
}

export async function deleteAttendeeFromDb(id: string) {
  await deleteDoc(doc(db, 'attendees', id));
}

// ------------------- CONVERSATIONS COLLECTIONS -------------------
export function listenConversations(callback: (conversations: MessageConversation[]) => void) {
  return onSnapshot(collection(db, 'conversations'), (snap) => {
    const list: MessageConversation[] = [];
    snap.forEach((d) => {
      list.push(d.data() as MessageConversation);
    });
    callback(list);
  });
}

export async function updateConversationInDb(convId: string, updates: Partial<MessageConversation>) {
  await updateDoc(doc(db, 'conversations', convId), updates as any);
}

// ------------------- MESSAGES COLLECTIONS -------------------
export function listenMessages(callback: (messages: Record<string, ChatMessage[]>) => void) {
  // Listen to all messages, sort by timestampValue or order to return Record<string, ChatMessage[]>
  const q = query(collection(db, 'messages'), orderBy('timestampValue', 'asc'));
  return onSnapshot(q, (snap) => {
    const records: Record<string, ChatMessage[]> = {};
    snap.forEach((d) => {
      const data = d.data();
      const convId = data.conversationId;
      if (!convId) return;
      if (!records[convId]) {
        records[convId] = [];
      }
      records[convId].push({
        id: data.id,
        senderId: data.senderId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        text: data.text,
        timestamp: data.timestamp,
        emojiReactions: data.emojiReactions || []
      });
    });
    callback(records);
  });
}

export async function addMessageToDb(convId: string, message: ChatMessage) {
  const msgDocId = `${convId}_${message.id}`;
  await setDoc(doc(db, 'messages', msgDocId), {
    ...message,
    conversationId: convId,
    timestampValue: Date.now()
  });

  // Also update parent conversation's last message info
  await updateConversationInDb(convId, {
    lastMessageText: message.text,
    lastMessageTime: message.timestamp,
    unreadCount: 0 // Reset read
  });
}

export async function updateMessageInDb(convId: string, msgId: string, emojiReactions: any[]) {
  const msgDocId = `${convId}_${msgId}`;
  await updateDoc(doc(db, 'messages', msgDocId), { emojiReactions });
}

// ------------------- NOTIFICATIONS COLLECTIONS -------------------
export function listenNotifications(callback: (notifications: AppNotification[]) => void) {
  const q = query(collection(db, 'notifications'), orderBy('timestampValue', 'desc'));
  return onSnapshot(q, (snap) => {
    const list: AppNotification[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: data.id,
        title: data.title,
        message: data.message,
        date: data.date,
        type: data.type,
        read: data.read
      });
    });
    callback(list);
  });
}

export async function addNotificationToDb(notification: AppNotification) {
  await setDoc(doc(db, 'notifications', notification.id), {
    ...notification,
    timestampValue: Date.now()
  });
}

export async function updateNotificationInDb(id: string, updates: Partial<AppNotification>) {
  await updateDoc(doc(db, 'notifications', id), updates as any);
}

export async function deleteNotificationFromDb(id: string) {
  await deleteDoc(doc(db, 'notifications', id));
}
