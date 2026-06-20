import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Settings2, 
  Sparkles, 
  Upload, 
  X, 
  Save, 
  Users,
  Eye,
  Video,
  ExternalLink,
  Tag
} from 'lucide-react';
import { Speaker, Event, RSVPStatus } from '../types';
import { ProfileCard } from '../components/ProfileCard';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

interface SpeakersViewProps {
  id?: string;
  speakers: Speaker[];
  events: Event[];
  onUpdateSpeaker: (updatedSpeaker: Speaker) => void;
  onAddSpeaker: (newSpeaker: Omit<Speaker, 'id' | 'rsvpStatus' | 'totalSessions'>) => void;
  onRsvpChange: (speakerId: string, status: RSVPStatus) => void;
  searchValue: string;
}

export const SpeakersView: React.FC<SpeakersViewProps> = ({
  id,
  speakers,
  events,
  onUpdateSpeaker,
  onAddSpeaker,
  onRsvpChange,
  searchValue: globalSearchValue
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<'All' | RSVPStatus>('All');
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(speakers[0] || null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit Speaker Form states
  const [tempSpeaker, setTempSpeaker] = useState<Speaker | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Add Speaker Form states
  const [addName, setAddName] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [addCompany, setAddCompany] = useState('');
  const [addBio, setAddBio] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhoto, setAddPhoto] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80');
  const [addExpertise, setAddExpertise] = useState('React, TypeScript, Frontend');

  const searchString = (localSearch || globalSearchValue).toLowerCase();

  // Filtered list
  const filteredSpeakers = speakers.filter(sp => {
    const matchesSearch = sp.name.toLowerCase().includes(searchString) ||
                          sp.title.toLowerCase().includes(searchString) ||
                          sp.company.toLowerCase().includes(searchString) ||
                          sp.expertise.some(e => e.toLowerCase().includes(searchString));
    const matchesRsvp = rsvpFilter === 'All' || sp.rsvpStatus === rsvpFilter;
    return matchesSearch && matchesRsvp;
  });

  const handleEditClick = (speaker: Speaker) => {
    setTempSpeaker({ ...speaker });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempSpeaker) return;
    onUpdateSpeaker(tempSpeaker);
    if (selectedSpeaker?.id === tempSpeaker.id) {
      setSelectedSpeaker(tempSpeaker);
    }
    setIsEditModalOpen(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;

    onAddSpeaker({
      name: addName,
      title: addTitle || 'Guest Speaker',
      company: addCompany || 'Independent Tech',
      bio: addBio || 'No biography uploaded yet.',
      photoUrl: addPhoto,
      expertise: addExpertise.split(',').map(tag => tag.trim()).filter(Boolean),
      socialLinks: {
        website: 'https://example.com'
      },
      contactEmail: addEmail || 'speaker@example.com'
    });

    // Reset Form
    setAddName('');
    setAddTitle('');
    setAddCompany('');
    setAddBio('');
    setAddEmail('');
    setIsAddModalOpen(false);
  };

  // Mock Photo Upload triggers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Mock upload image setting via cute placeholder avatars
      const mockUnsplashPres = [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
      ];
      const randomUrl = mockUnsplashPres[Math.floor(Math.random() * mockUnsplashPres.length)];
      if (tempSpeaker) {
        setTempSpeaker({ ...tempSpeaker, photoUrl: randomUrl });
      } else {
        setAddPhoto(randomUrl);
      }
      alert('File received! Profile updated with demo optimized network avatar.');
    }
  };

  // Get events allocated to this selected speaker
  const speakerEvents = selectedSpeaker 
    ? events.filter(e => e.speakerIds.includes(selectedSpeaker.id))
    : [];

  return (
    <div id={id || 'speakers-portal-view'} className="space-y-6">
      
      {/* Page Header */}
      <PageHeader 
        title="Speaker Profile Registry" 
        description="Onboard speakers, curate their background details, manage their invitations, and review their schedules."
      >
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl shadow-xs hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer animate-pulse"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Guest Speaker</span>
        </button>
      </PageHeader>

      {/* Profile Filters Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-805/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs transition-colors">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search speaker, expertise, company..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9.5 pr-4 py-1.8 w-44 md:w-56 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-400 px-2 border-r border-zinc-200 dark:border-zinc-800 leading-none">
              RSVP Filter
            </span>
            <div className="flex flex-wrap gap-1 ml-1">
              {(['All', 'accepted', 'pending', 'declined'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRsvpFilter(r)}
                  className={`px-2 py-0.5 text-[10px] uppercase font-semibold rounded-md transition-all cursor-pointer ${
                    rsvpFilter === r
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-150 dark:hover:bg-zinc-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-medium">
          Showing {filteredSpeakers.length} of {speakers.length} onboarded profiles
        </div>
      </div>

      {/* Grid view containing layout detailing side-by-side selected bio profile details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Speaker Cards lists */}
        <div className="lg:col-span-2 space-y-4 max-h-[68vh] overflow-y-auto pr-1">
          {filteredSpeakers.length === 0 ? (
            <EmptyState
              title="No Speakers Registered"
              description="Adjust invitation filters or search query terms to find records."
              action={{
                label: "Show All Speakers",
                onClick: () => {
                  setLocalSearch('');
                  setRsvpFilter('All');
                }
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              {filteredSpeakers.map((spk) => (
                <div 
                  key={spk.id} 
                  onClick={() => setSelectedSpeaker(spk)}
                  className={`rounded-2xl transition-all cursor-pointer border ${
                    selectedSpeaker?.id === spk.id
                      ? 'ring-2 ring-indigo-500 border-transparent bg-indigo-50/10 dark:bg-indigo-950/20'
                      : 'ring-0'
                  }`}
                >
                  <ProfileCard
                    speaker={spk}
                    onEdit={handleEditClick}
                    onRsvpChange={onRsvpChange}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Selected Speaker Full Profile View Block */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs h-fit hover:shadow-md transition-all duration-300">
          {selectedSpeaker ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* Profile Details Header */}
              <div className="text-center space-y-2">
                <img
                  src={selectedSpeaker.photoUrl}
                  alt={selectedSpeaker.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto ring-4 ring-indigo-500/10 shadow-md"
                />
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
                    {selectedSpeaker.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {selectedSpeaker.title}
                  </p>
                  <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
                    {selectedSpeaker.company}
                  </p>
                </div>
              </div>

              {/* Tag links */}
              <div className="space-y-2 p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/60 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  On-stage Bio abstract
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {selectedSpeaker.bio}
                </p>
              </div>

              {/* Expertise Skills tags */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Expertise parameters
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSpeaker.expertise.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 rounded-lg flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Scheduled Event details */}
              <div className="space-y-3 pt-4 border-t border-zinc-150 dark:border-zinc-800/80">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Scheduled Panels (({speakerEvents.length}))
                </span>
                
                {speakerEvents.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-4 italic">
                    Not currently scheduled for any live stages.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {speakerEvents.map((evt) => (
                      <div 
                        key={evt.id} 
                        className="p-3 bg-zinc-50/50 dark:bg-zinc-850/50 border border-zinc-200/50 dark:border-zinc-800 rounded-xl hover:border-zinc-300 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                            {evt.title}
                          </p>
                          <span className="px-1.5 py-0.2 bg-zinc-100 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 rounded text-[9px] font-bold uppercase shrink-0">
                            {evt.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-mono mt-1">
                          {evt.date} • {evt.time}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trigger Direct Messaging option */}
              <button 
                onClick={() => handleEditClick(selectedSpeaker)}
                className="w-full py-2.2 text-center text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-xl text-zinc-700 dark:text-zinc-200 transition-colors block border border-zinc-200/40 dark:border-zinc-700 cursor-pointer"
              >
                Configure profile / bio variables
              </button>

            </div>
          ) : (
            <div className="text-center py-12 text-zinc-400">
              <Users className="w-8 h-8 mx-auto text-zinc-300 animate-bounce mb-3" />
              <p className="text-xs">Select speaker thumbnail to look up registry metadata.</p>
            </div>
          )}
        </div>

      </div>

      {/* EDIT PROFILE DIALOG MODAL (includes photo upload drag and drop) */}
      {isEditModalOpen && tempSpeaker && (
        <div className="fixed inset-0 z-55 flex items-center justify-center">
          <div onClick={() => setIsEditModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg mx-4 z-10 shadow-2xl p-6 select-none max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-b-zinc-800 mb-5">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 font-sans">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Adjust Speaker Profile: {tempSpeaker.name}</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-zinc-700"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              
              {/* Drag and Drop Mock File Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Profile Photo (Drag & Drop or click preset)
                </label>
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-250 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-950/60 hover:bg-zinc-100'}`}
                >
                  <img
                    src={tempSpeaker.photoUrl}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover mb-2 border border-zinc-200 shadow-sm"
                  />
                  <Upload className="w-4 h-4 text-zinc-400 mb-1" />
                  <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                    Drag and drop file here, or click to simulation upload
                  </p>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1">
                    Accepts PNG, JPG assets up to 4MB sizes
                  </p>
                </div>
                <input
                  type="text"
                  required
                  value={tempSpeaker.photoUrl}
                  onChange={(e) => setTempSpeaker({ ...tempSpeaker, photoUrl: e.target.value })}
                  className="w-full px-3 py-1 text-[10px] font-mono text-zinc-700 dark:text-zinc-300 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-xl"
                  placeholder="Or enter direct photo URL..."
                />
              </div>

              {/* Title & Company */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                    Speaker Title
                  </label>
                  <input
                    type="text"
                    required
                    value={tempSpeaker.title}
                    onChange={(e) => setTempSpeaker({ ...tempSpeaker, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                    Affiliation Company
                  </label>
                  <input
                    type="text"
                    required
                    value={tempSpeaker.company}
                    onChange={(e) => setTempSpeaker({ ...tempSpeaker, company: e.target.value })}
                    className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Bio Abstract description
                </label>
                <textarea
                  required
                  rows={2}
                  value={tempSpeaker.bio}
                  onChange={(e) => setTempSpeaker({ ...tempSpeaker, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl resize-none dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                />
              </div>

              {/* Expertise comma separated list */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Expertise Tags (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={tempSpeaker.expertise.join(', ')}
                  onChange={(e) => setTempSpeaker({ ...tempSpeaker, expertise: e.target.value.split(',').map(tag => tag.trim()) })}
                  className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  required
                  value={tempSpeaker.contactEmail}
                  onChange={(e) => setTempSpeaker({ ...tempSpeaker, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3.5 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-850 dark:hover:bg-zinc-800 dark:text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl shadow-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Profile Details</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ADD SPEAKER DIALOG MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md mx-4 z-10 shadow-2xl p-6 dark:text-zinc-100 select-none max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-5">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white font-sans">
                Onboard Guest Speaker invitation
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-700"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  FullName
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Hendricks"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                    Speaker Role Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CEO & Founder"
                    value={addTitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pied Piper"
                    value={addCompany}
                    onChange={(e) => setAddCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="richard@piedpiper.com"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Biography Summary
                </label>
                <textarea
                  placeholder="Brief history of key accolades, past advisory positions, etc..."
                  rows={2}
                  value={addBio}
                  onChange={(e) => setAddBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl resize-none dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Tags (Separated with commas)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Compression, Architecture, GoLang"
                  value={addExpertise}
                  onChange={(e) => setAddExpertise(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                />
              </div>

              <div className="pt-4 border-t border-zinc-150 flex justify-end gap-3.5 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-950 dark:text-white dark:border-zinc-850 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Dispatch Invitation
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
