import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Video, Users2, ArrowRight } from 'lucide-react';
import { Event, Speaker } from '../types';
import { StatusBadge } from './StatusBadge';

interface EventCardProps {
  id?: string;
  event: Event;
  speakers: Speaker[];
  onSelect?: (event: Event) => void;
  onEditRSVP?: (speakerId: string, eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  id,
  event,
  speakers,
  onSelect,
  onEditRSVP
}) => {
  const eventSpeakers = speakers.filter(sp => event.speakerIds.includes(sp.id));

  return (
    <motion.div
      id={id || `event-card-${event.id}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg dark:hover:shadow-zinc-950/40 transition-all duration-300"
    >
      {/* Banner portion */}
      <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <img
          src={event.bannerUrl}
          alt={event.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600';
          }}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-semibold bg-white/94 dark:bg-zinc-950/80 text-zinc-900 dark:text-zinc-50 rounded-lg shadow-sm border border-zinc-200/20 backdrop-blur-xs">
            {event.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge type="event" status={event.status} />
        </div>

        {/* Attendance progress bar overlay at the bottom of the image */}
        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 flex justify-between items-end">
          <div className="w-full flex items-center justify-between gap-3 text-white text-xs">
            <span>RSVP Ratio: {event.rsvpRate}%</span>
            <div className="w-24 bg-zinc-700/60 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${event.rsvpRate}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content portion */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Title */}
          <h3 
            onClick={() => onSelect?.(event)}
            className="text-base font-semibold text-zinc-950 dark:text-zinc-50 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-2 leading-snug tracking-tight font-sans"
          >
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Meta parameters */}
          <div className="grid grid-cols-2 gap-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{event.time} ({event.duration})</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Users2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>{event.totalAttendees} Registered</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium col-span-1">
              <Video className="w-3.5 h-3.5 text-zinc-400" />
              <a 
                href={event.zoomLink} 
                target="_blank" 
                rel="noreferrer"
                className="hover:underline text-indigo-600 dark:text-indigo-400 truncate"
              >
                Join Stream
              </a>
            </div>
          </div>
        </div>

        {/* Footer: facepile & primary action */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          {/* Speaker facepile */}
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2 overflow-hidden">
              {eventSpeakers.map(spk => (
                <img
                  key={spk.id}
                  src={spk.photoUrl}
                  alt={spk.name}
                  title={`${spk.name} - ${spk.title}`}
                  referrerPolicy="no-referrer"
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover"
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">
              {eventSpeakers.length} {eventSpeakers.length === 1 ? 'Speaker' : 'Speakers'}
            </span>
          </div>

          <button
            onClick={() => onSelect?.(event)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors group cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
