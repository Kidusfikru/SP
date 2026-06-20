import React from 'react';
import { motion } from 'motion/react';
import { Mail, Globe, Github, Linkedin, Twitter, Sparkles, Pencil } from 'lucide-react';
import { Speaker } from '../types';
import { StatusBadge } from './StatusBadge';

interface ProfileCardProps {
  id?: string;
  speaker: Speaker;
  onEdit?: (speaker: Speaker) => void;
  onSelect?: (speaker: Speaker) => void;
  onRsvpChange?: (speakerId: string, newStatus: 'accepted' | 'pending' | 'declined') => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  speaker,
  onEdit,
  onSelect,
  onRsvpChange
}) => {
  return (
    <motion.div
      id={id || `speaker-card-${speaker.id}`}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
    >
      <div className="p-6">
        {/* Header content */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group/avatar">
              <img
                src={speaker.photoUrl}
                alt={speaker.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400';
                }}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-zinc-100 dark:ring-zinc-800 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-white cursor-pointer">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 
                onClick={() => onSelect?.(speaker)}
                className="text-base font-bold text-zinc-950 dark:text-zinc-50 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer truncate font-sans tracking-tight"
              >
                {speaker.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                {speaker.title}
              </p>
              <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono tracking-tight mt-0.5">
                {speaker.company}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2.5">
            <StatusBadge type="rsvp" status={speaker.rsvpStatus} />
            {onEdit && (
              <button
                onClick={() => onEdit(speaker)}
                className="p-1.5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-lg border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50 transition-all cursor-pointer"
                title="Edit profile parameters"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Biography */}
        <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
          {speaker.bio}
        </p>

        {/* Skills expert tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {speaker.expertise.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[11px] font-medium bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md border border-zinc-100 dark:border-zinc-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* RSVP Fast Switch Controls */}
        {onRsvpChange && (
          <div className="mt-5 p-2.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/60 rounded-xl flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest shrink-0">
              Set Invitation:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['accepted', 'pending', 'declined'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onRsvpChange(speaker.id, status)}
                  className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md transition-all cursor-pointer shrink-0 ${
                    speaker.rsvpStatus === status
                      ? status === 'accepted'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : status === 'pending'
                        ? 'bg-amber-500 text-zinc-950 shadow-xs'
                        : 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {status === 'accepted' ? 'Accept' : status === 'pending' ? 'Pend' : 'Decline'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact and Social Links */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors text-xs col-span-1">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <a href={`mailto:${speaker.contactEmail}`} className="truncate font-mono text-[11px] max-w-40 hover:underline">
              {speaker.contactEmail}
            </a>
          </div>

          <div className="flex items-center gap-1.5">
            {speaker.socialLinks.twitter && (
              <a
                href={speaker.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-zinc-400 hover:text-sky-500 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            )}
            {speaker.socialLinks.github && (
              <a
                href={speaker.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {speaker.socialLinks.linkedin && (
              <a
                href={speaker.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-zinc-400 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {speaker.socialLinks.website && (
              <a
                href={speaker.socialLinks.website}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-zinc-400 hover:text-indigo-500 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
