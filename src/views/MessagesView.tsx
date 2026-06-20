import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Smile, 
  Search, 
  Users, 
  Sparkles, 
  Radio, 
  MoreVertical, 
  Phone, 
  Video,
  CheckCheck
} from 'lucide-react';
import { ChatMessage, MessageConversation, EmojiReaction } from '../types';

interface MessagesViewProps {
  id?: string;
  conversations: MessageConversation[];
  activeConvId: string;
  onSetActiveConv: (id: string) => void;
  messages: Record<string, ChatMessage[]>;
  onSendMessage: (convId: string, text: string) => void;
  onReactToMessage: (convId: string, msgId: string, emoji: string) => void;
  isAiThinking?: boolean;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  id,
  conversations,
  activeConvId,
  onSetActiveConv,
  messages,
  onSendMessage,
  onReactToMessage,
  isAiThinking = false
}) => {
  const [typedText, setTypedText] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);
  const [isLocalMessageSearching, setIsLocalMessageSearching] = useState(false);
  const [messageSearchValue, setMessageSearchValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const activeMessages = messages[activeConv?.id] || [];

  const filteredMessages = activeMessages.filter(msg => {
    if (!messageSearchValue.trim()) return true;
    return msg.text.toLowerCase().includes(messageSearchValue.toLowerCase()) ||
           msg.senderName.toLowerCase().includes(messageSearchValue.toLowerCase());
  });

  // Smooth scroll message log to the bottom when new message arrives or thread changes
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeMessages, activeConvId]);

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim() || !activeConv) return;

    onSendMessage(activeConv.id, typedText);
    const sentText = typedText;
    setTypedText('');

    // Trigger funny simulation typing response if it's a 1-1 thread with a speaker!
    if (!activeConv.isGroup && activeConv.id !== 'conv-ai') {
      setIsTypingSimulated(true);
      setTimeout(() => {
        setIsTypingSimulated(false);
        const replyResponses = [
          "Got it! That sounds like an excellent design adjustment.",
          "Perfect. Let me compile my slides and review the stream ratios.",
          "Awesome. I verified my microphone settings and I'm ready for the panel on Wednesday!",
          "Excellent, see you inside the green room backstage shortly."
        ];
        const randomReply = replyResponses[Math.floor(Math.random() * replyResponses.length)];
        onSendMessage(activeConv.id, randomReply);
      }, 2500);
    }
  };

  const handleEmojiClick = (msgId: string, emoji: string) => {
    if (!activeConv) return;
    onReactToMessage(activeConv.id, msgId, emoji);
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(localSearch.toLowerCase()) ||
    c.title.toLowerCase().includes(localSearch.toLowerCase())
  );

  return (
    <div id={id || 'slack-messaging-view'} className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xs overflow-hidden h-[76vh] flex transition-all duration-300">
      
      {/* Left panel: Conversations list */}
      <div className="w-1/3 border-r border-zinc-200/80 dark:border-zinc-800/80 flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950/20">
        
        {/* Search inside threads */}
        <div className="p-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.8" />
            <input
              type="text"
              placeholder="Search chats..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.6 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-450 dark:placeholder-zinc-550 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-801 rounded-xl focus:outline-hidden"
            />
          </div>
        </div>

        {/* Conversation list viewport */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-850">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            const isAi = conv.id === 'conv-ai';
            return (
              <div
                key={conv.id}
                onClick={() => onSetActiveConv(conv.id)}
                className={`p-4 flex items-start gap-3 cursor-pointer transition-all ${
                  isActive
                    ? isAi
                      ? 'bg-violet-50/75 dark:bg-violet-950/20 border-l-4 border-violet-600 ring-1 ring-violet-500/10'
                      : 'bg-white dark:bg-zinc-900 border-l-4 border-indigo-600'
                    : isAi
                      ? 'bg-violet-50/30 dark:bg-violet-950/10 hover:bg-violet-50/60 dark:hover:bg-violet-950/15 border-l-4 border-violet-500/20'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-850/50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.avatarUrl}
                    alt={conv.name}
                    className={`w-10 h-10 rounded-xl object-cover ring-2 ${
                      isAi 
                        ? 'ring-violet-500/40 dark:ring-violet-400/20' 
                        : 'ring-white dark:ring-zinc-950'
                    }`}
                  />
                  {isAi ? (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-violet-500 ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
                  ) : !conv.isGroup ? (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[11.5px] font-bold text-zinc-900 dark:text-zinc-50 truncate flex items-center gap-1.5">
                      {conv.name}
                      {isAi && (
                        <span className="shrink-0 text-[8px] tracking-wider font-extrabold px-1.5 py-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md scale-95 leading-none">
                          AI ADVISOR
                        </span>
                      )}
                    </h4>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono">
                      {conv.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-500 truncate mt-0.5 font-medium">
                    {conv.title}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-1 leading-normal font-sans">
                    {conv.lastMessageText}
                  </p>
                </div>

                {conv.unreadCount > 0 && !isActive ? (
                  <span className="px-1.8 py-0.5 bg-indigo-600 text-white font-bold text-[9px] rounded-full shrink-0">
                    {conv.unreadCount}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

      </div>

      {/* Right panel: Chat messages viewport */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-900">
        
        {activeConv ? (
          <>
            {/* Header toolbar */}
            <div className="px-6 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
              
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.avatarUrl}
                  alt={activeConv.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50">
                    {activeConv.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">
                    {activeConv.title}
                  </p>
                </div>
              </div>

              {/* Utility call icons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setIsLocalMessageSearching(!isLocalMessageSearching);
                    setMessageSearchValue('');
                  }}
                  className={`p-2 rounded-xl transition-all cursor-pointer border ${
                    isLocalMessageSearching 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-indigo-400' 
                      : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                  title="Search messages in this thread"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer border border-transparent">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer border border-transparent">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer border border-transparent">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Inline active chat search bar */}
            {isLocalMessageSearching && (
              <div className="px-6 py-2.5 bg-zinc-150/50 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-850 flex items-center justify-between gap-3 animate-fade-in">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-zinc-450 dark:text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Type query to filter message history in real-time..."
                    value={messageSearchValue}
                    onChange={(e) => setMessageSearchValue(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500/35"
                  />
                </div>
                <button 
                  onClick={() => {
                    setIsLocalMessageSearching(false);
                    setMessageSearchValue('');
                  }}
                  className="text-[10px] font-bold text-zinc-400 hover:text-indigo-600 uppercase tracking-widest px-1 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}

            {/* Message log viewport */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/20 dark:bg-zinc-950/10">
              
              {filteredMessages.map((msg, index) => {
                const isMe = msg.senderId === 'user';
                return (
                  <div
                    key={msg.id || index}
                    className={`flex items-end gap-3 max-w-lg ${
                      isMe ? 'ml-auto flex-row-reverse' : ''
                    } animate-fade-in`}
                  >
                    {/* Speaker Portrait */}
                    {!isMe && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-850 shadow-xs shrink-0"
                      />
                    )}

                    <div className="space-y-1">
                      {/* Sender name label on group threads */}
                      {activeConv.isGroup && !isMe && (
                        <span className="text-[10px] font-bold text-zinc-400 block ml-1">
                          {msg.senderName}
                        </span>
                      )}

                      {/* Bubble content */}
                      <div className={`p-4.5 rounded-2xl text-xs relative group/bubble shadow-xs ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-bl-none border border-zinc-200 dark:border-zinc-700/60'
                      }`}>
                        
                        <p className="leading-relaxed font-sans">{msg.text}</p>
                        
                        <div className={`flex items-center gap-1.5 mt-2.5 ${isMe ? 'justify-end text-indigo-200' : 'text-zinc-400'}`}>
                          <span className="text-[9px] font-mono font-medium block">
                            {msg.timestamp}
                          </span>
                          {isMe && <CheckCheck className="w-3.5 h-3.5 text-indigo-300" />}
                        </div>

                        {/* Emoji Reactions Tray overlay (UI Only) */}
                        <div className={`absolute bottom-[-14px] flex items-center gap-1 ${isMe ? 'left-2' : 'right-2'}`}>
                          {msg.emojiReactions?.map((r, rIdx) => (
                            <button
                              key={rIdx}
                              onClick={() => handleEmojiClick(msg.id, r.emoji)}
                              className={`px-1.5 py-0.5 rounded-full text-[10px] border flex items-center gap-1 font-semibold transition-all cursor-pointer ${
                                r.userReacted
                                  ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-650 hover:bg-zinc-100'
                              }`}
                            >
                              <span>{r.emoji}</span>
                              <span>{r.count}</span>
                            </button>
                          ))}

                          {/* Quick Add reaction button */}
                          <div className="hidden group-hover/bubble:flex items-center gap-1 bg-white dark:bg-zinc-850 p-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 transition-opacity">
                            {['👍', '🔥', '🚀', '💖'].map(character => (
                              <button
                                key={character}
                                onClick={() => handleEmojiClick(msg.id, character)}
                                className="hover:scale-125 px-1 py-0.2 transition-transform cursor-pointer"
                              >
                                {character}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typist animation indicator */}
              {isAiThinking && activeConv.id === 'conv-ai' && (
                <div className="flex items-start gap-3 max-w-lg animate-pulse pb-2">
                  <img
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80"
                    alt="Gemini Assistant"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/30 shrink-0"
                  />
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[9px] font-sans font-extrabold text-violet-600 dark:text-violet-400 tracking-wider flex items-center gap-1.5 uppercase leading-none bg-indigo-50 dark:bg-zinc-800 w-fit px-2 py-1 rounded-md">
                      <Sparkles className="w-3 h-3 text-violet-500 animate-spin" /> THINKING...
                    </span>
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-100 rounded-2xl rounded-bl-none border border-zinc-200 dark:border-zinc-700/65 shadow-xs flex items-center gap-3">
                      <div className="flex space-x-1.5 py-1">
                        <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                      </div>
                      <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 leading-none">
                        Drafting schedule matching suggestions...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isTypingSimulated && (
                <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" />
                  <span className="text-[10px] uppercase font-bold tracking-widest font-mono">
                    {activeConv.name} is drafting reply...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Compose Text input panel */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200/80 dark:border-zinc-800/80">
              <form onSubmit={handleComposeSubmit} className="flex items-center gap-2.5">
                
                <button
                  type="button"
                  className="p-2 hover:bg-zinc-150 rounded-xl text-zinc-400 hover:text-zinc-650 dark:hover:bg-zinc-800 transition-colors border border-transparent cursor-pointer"
                  title="Emoji list (demo only)"
                  onClick={() => setTypedText(prev => prev + ' 👍')}
                >
                  <Smile className="w-4.5 h-4.5" />
                </button>

                <input
                  type="text"
                  placeholder={activeConv.id === 'conv-ai' ? "Ask Speaker Portal AI Advisor anything..." : `Send direct guidelines to ${activeConv.name}...`}
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-450 dark:placeholder-zinc-550 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-801 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />

                <button
                  type="submit"
                  disabled={!typedText.trim()}
                  className="p-2 bg-indigo-600 dark:bg-indigo-500 disabled:opacity-40 text-white rounded-xl shadow-xs hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>

              </form>
            </div>
          </>
        ) : (
          <div className="m-auto text-center space-y-3 dark:text-zinc-400 text-zinc-405">
            <Users className="w-12 h-12 text-zinc-300 animate-pulse mx-auto" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Green Room coordinates
            </h4>
            <p className="text-xs">
              Select speaker chat from discussions stack on the left to start coordinating schedules.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
