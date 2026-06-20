import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Grid, 
  List, 
  Plus, 
  Calendar, 
  Clock, 
  SlidersHorizontal,
  ChevronDown,
  X,
  PlusCircle,
  Video,
  FileSpreadsheet
} from 'lucide-react';
import { Event, Speaker, EventStatus } from '../types';
import { EventCard } from '../components/EventCard';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

interface EventsViewProps {
  id?: string;
  events: Event[];
  speakers: Speaker[];
  onCreateEvent: (newEvent: Omit<Event, 'id' | 'rsvpRate' | 'totalAttendees'>) => void;
  onSelectEvent: (event: Event) => void;
  searchValue: string;
}

export const EventsView: React.FC<EventsViewProps> = ({
  id,
  events,
  speakers,
  onCreateEvent,
  onSelectEvent,
  searchValue: globalSearchValue
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'rsvp'>('date');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal State Parameters
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('2026-07-28');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newDuration, setNewDuration] = useState('60 min');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newZoom, setNewZoom] = useState('https://zoom.us/j/123456789');
  const [newBanner, setNewBanner] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80');
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);

  // Unique lists of categories
  const categories = ['All', ...Array.from(new Set(events.map(e => e.category)))];
  const statuses = ['All', 'upcoming', 'live', 'completed', 'cancelled'];

  const handleSpeakerTagClick = (speakerId: string) => {
    setSelectedSpeakers(prev => 
      prev.includes(speakerId) 
        ? prev.filter(id => id !== speakerId) 
        : [...prev, speakerId]
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateEvent({
      title: newTitle,
      description: newDesc || 'No description supplied.',
      date: newDate,
      time: newTime,
      duration: newDuration,
      category: newCategory,
      zoomLink: newZoom,
      bannerUrl: newBanner,
      speakerIds: selectedSpeakers.length > 0 ? selectedSpeakers : [speakers[0]?.id || 'spk-1'],
      status: 'upcoming'
    });

    // Reset Form Fields
    setNewTitle('');
    setNewDesc('');
    setSelectedSpeakers([]);
    setIsModalOpen(false);
  };

  // Filter & Sort Events
  const searchString = (localSearch || globalSearchValue).toLowerCase();
  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchString) || 
                          evt.description.toLowerCase().includes(searchString) ||
                          evt.category.toLowerCase().includes(searchString);
    const matchesCategory = categoryFilter === 'All' || evt.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || evt.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'rsvp') return b.rsvpRate - a.rsvpRate;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Preset quick Unsplash banners the user can tap instead of typing URLs
  const presetBanners = [
    { name: 'Conference Stage', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80' },
    { name: 'Interactive Design', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80' },
    { name: 'Web Workshop', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80' },
    { name: 'Briefing Room', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80' }
  ];

  return (
    <div id={id || 'events-management-view'} className="space-y-6">
      
      {/* Page Header with Action Utilities */}
      <PageHeader 
        title="Event Schedule Management" 
        description="Filter, sort, index, and organize virtual workshops, panel configurations and panel details below."
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl shadow-xs hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Assemble New Panel</span>
        </button>
      </PageHeader>

      {/* Control Filters Toolbar bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-805/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs transition-colors">
        
        {/* Search bar & Category filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search panel name..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9.5 pr-4 py-1.8 w-44 md:w-56 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 pr-2 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-400 px-3 py-1.8 bg-zinc-100/60 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 rounded-l-xl leading-none">
              Category
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-transparent text-zinc-700 dark:text-zinc-300 px-2 py-1 focus:outline-hidden cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 pr-2 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-400 px-3 py-1.8 bg-zinc-100/60 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 rounded-l-xl leading-none">
              Status
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-transparent text-zinc-700 dark:text-zinc-300 px-2 py-1 focus:outline-hidden cursor-pointer capitalize"
            >
              {statuses.map((stat) => (
                <option key={stat} value={stat}>{stat === 'All' ? 'All' : stat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View toggles & Sorting parameters */}
        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 pr-2 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-400 px-3 py-1.8 bg-zinc-100/60 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 rounded-l-xl leading-none">
              Sort
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-transparent text-zinc-700 dark:text-zinc-300 px-2 py-1 focus:outline-hidden cursor-pointer"
            >
              <option value="date">Chronological</option>
              <option value="title">Alphabetical</option>
              <option value="rsvp">Top RSVP Rates</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200'}`}
              title="Grid layout view"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'table' ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200'}`}
              title="Table details view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Results Board */}
      {filteredEvents.length === 0 ? (
        <EmptyState 
          title="No Matching Panels Found" 
          description="Adjust categories, status values, or change search strings to discover items."
          action={{
            label: "Reset Search Filters",
            onClick: () => {
              setLocalSearch('');
              setCategoryFilter('All');
              setStatusFilter('All');
            }
          }}
        />
      ) : viewMode === 'grid' ? (
        /* GRID CARDS LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              speakers={speakers}
              onSelect={onSelectEvent}
            />
          ))}
        </div>
      ) : (
        /* DETAILED TABLE VIEW */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs transition-colors animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
                  <th className="py-4.5 px-6">Topic / Title</th>
                  <th className="py-4.5 px-3">Date & Time</th>
                  <th className="py-4.5 px-3">Category</th>
                  <th className="py-4.5 px-3">Zoom Stream Link</th>
                  <th className="py-4.5 px-3">Status</th>
                  <th className="py-4.5 px-3">RSVP Progress</th>
                  <th className="py-4.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs text-zinc-700 dark:text-zinc-300">
                {filteredEvents.map((evt) => {
                  const evSps = speakers.filter(s => evt.speakerIds.includes(s.id));
                  return (
                    <tr 
                      key={evt.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-colors"
                    >
                      <td className="py-4.5 px-6 font-semibold text-zinc-900 dark:text-white max-w-sm">
                        <div>
                          <p className="line-clamp-1 text-xs">{evt.title}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex -space-x-1.5">
                              {evSps.map(sp => (
                                <img
                                  key={sp.id}
                                  src={sp.photoUrl}
                                  alt={sp.name}
                                  title={sp.name}
                                  referrerPolicy="no-referrer"
                                  className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-white dark:ring-zinc-900"
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                              By {evSps.map(sp => sp.name).join(', ')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4.5 px-3 font-medium">
                        <div className="space-y-0.5">
                          <p>{evt.date}</p>
                          <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-mono">{evt.time} ({evt.duration})</p>
                        </div>
                      </td>
                      <td className="py-4.5 px-3">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
                          {evt.category}
                        </span>
                      </td>
                      <td className="py-4.5 px-3 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] truncate max-w-40 hover:underline">
                        <a href={evt.zoomLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          <span>Join Stream</span>
                        </a>
                      </td>
                      <td className="py-4.5 px-3">
                        <StatusBadge type="event" status={evt.status} />
                      </td>
                      <td className="py-4.5 px-3">
                        <div className="space-y-1.5 w-24">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span>{evt.rsvpRate}%</span>
                            <span className="text-zinc-400">{evt.totalAttendees} atd</span>
                          </div>
                          <div className="bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full" style={{ width: `${evt.rsvpRate}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <button
                          onClick={() => onSelectEvent(evt)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors cursor-pointer"
                        >
                          Review Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE EVENT DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200" 
          />
          {/* Form Card */}
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl mx-4 shadow-2xl overflow-hidden z-10 p-6 animate-scale-in dark:text-zinc-100 select-none max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-5">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-sans">
                  Assemble Speaker Panel
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  Draft schedule times, select categories and assign onboarded key speakers
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-450 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer border border-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                  Panel Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Scaling Next-Gen Realtime Layers"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                  Description / Bullet Abstract
                </label>
                <textarea
                  placeholder="Outline spatial alignment, postgres indices, or rendering paradigms..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>

              {/* Grid detail inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-2 py-2 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                    Time & duration
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10:00 AM"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-1/2 px-2 py-2 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden"
                    />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 90 min"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-1/2 px-2 py-2 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                    Interactive Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2 py-2 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Backend & Databases">Backend & Databases</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="API Architecture">API Architecture</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                    Zoom Meeting Link
                  </label>
                  <input
                    type="url"
                    required
                    value={newZoom}
                    onChange={(e) => setNewZoom(e.target.value)}
                    className="w-full px-2 py-2 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Banner Selector presets or custom */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                  Stage Cover Banner Image
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {presetBanners.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewBanner(p.url)}
                      className={`h-12 rounded-lg bg-cover bg-center overflow-hidden border-2 relative cursor-pointer ${newBanner === p.url ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-transparent'}`}
                      style={{ backgroundImage: `url(${p.url})` }}
                    >
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-bold text-white text-center leading-none p-0.5">
                        {p.name}
                      </div>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Custom cover banner absolute photo link URL..."
                  value={newBanner}
                  onChange={(e) => setNewBanner(e.target.value)}
                  className="w-full px-3 py-2 text-[10px] font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden"
                />
              </div>

              {/* Assign Key Speakers (Multi-select pill triggers) */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                  Assign Onboarded Speakers
                </label>
                <div className="flex flex-wrap gap-2">
                  {speakers.map((sp) => {
                    const isSelected = selectedSpeakers.includes(sp.id);
                    return (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={() => handleSpeakerTagClick(sp.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500 border-indigo-500 text-white font-semibold'
                            : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100'
                        }`}
                      >
                        <img
                          src={sp.photoUrl}
                          alt={sp.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{sp.name}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedSpeakers.length === 0 && (
                  <p className="text-[10px] text-amber-500 font-bold">
                    * If none selected, the first speaker will automatically be assigned.
                  </p>
                )}
              </div>

              {/* Form Action Controls */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-450 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 dark:bg-indigo-500 text-white shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Build Event Stage</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
