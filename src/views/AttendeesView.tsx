import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Download, 
  Trash2, 
  SlidersHorizontal, 
  PlusCircle,
  X,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { Attendee, AttendanceStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

interface AttendeesViewProps {
  id?: string;
  attendees: Attendee[];
  onAddAttendee: (attendee: Omit<Attendee, 'id' | 'registrationDate'>) => void;
  onUpdateAttendeeStatus: (id: string, status: AttendanceStatus) => void;
  onDeleteAttendee: (id: string) => void;
  searchValue: string;
}

export const AttendeesView: React.FC<AttendeesViewProps> = ({
  id,
  attendees,
  onAddAttendee,
  onUpdateAttendeeStatus,
  onDeleteAttendee,
  searchValue: globalSearchValue
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AttendanceStatus>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form parameters
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addCompany, setAddCompany] = useState('');
  const [addStatus, setAddStatus] = useState<AttendanceStatus>('registered');

  const uniqueCompanies = ['All', ...Array.from(new Set(attendees.map(a => a.company)))];

  const searchString = (localSearch || globalSearchValue).toLowerCase();

  const filteredAttendees = attendees.filter(att => {
    const matchesSearch = att.name.toLowerCase().includes(searchString) ||
                          att.email.toLowerCase().includes(searchString) ||
                          att.company.toLowerCase().includes(searchString);
    const matchesStatus = statusFilter === 'All' || att.status === statusFilter;
    const matchesCompany = companyFilter === 'All' || att.company === companyFilter;
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim()) return;

    onAddAttendee({
      name: addName,
      email: addEmail,
      company: addCompany || 'Independent Tech',
      status: addStatus,
      avatarUrl: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?w=100&auto=format&fit=crop&q=80`
    });

    setAddName('');
    setAddEmail('');
    setAddCompany('');
    setIsAddModalOpen(false);
  };

  // GENUINE CLIENT-SIDE EXPORT TO EXCEL/CSV
  const handleExportCSV = () => {
    if (filteredAttendees.length === 0) {
      alert('No records available to export.');
      return;
    }

    const headers = ['ID', 'FullName', 'EmailAddress', 'Company', 'Status', 'DateRegistered'];
    const rows = filteredAttendees.map(att => [
      att.id,
      `"${att.name}"`,
      att.email,
      `"${att.company}"`,
      att.status,
      att.registrationDate
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `speaker_portal_attendees_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id={id || 'attendee-registry-view'} className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <PageHeader 
        title="Registered Ticket Attendees" 
        description="Filter registrations, search user emails, and download ticket statistics as standard formatted spreadsheets."
      >
        <div className="flex items-center gap-2">
          {/* Export to CSV trigger */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-805/85 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download CSV spreadsheet"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            <span>Export CSV</span>
          </button>
          
          {/* Add Attendee trigger */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl shadow-xs hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Onboard Attendee</span>
          </button>
        </div>
      </PageHeader>

      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs transition-colors">
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3.2" />
            <input
              type="text"
              placeholder="Search attendee or email..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9.5 pr-4 py-1.8 w-44 md:w-56 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 pr-2 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-400 px-3 py-1.8 bg-zinc-100/60 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 rounded-l-xl leading-none">
              Status Filter
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-transparent text-zinc-700 dark:text-zinc-300 px-2 py-1 focus:outline-hidden cursor-pointer capitalize"
            >
              <option value="All">All Statuses</option>
              <option value="registered">Registered</option>
              <option value="attended">Attended</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 pr-2 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-zinc-400 px-3 py-1.8 bg-zinc-100/60 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 rounded-l-xl leading-none">
              Affiliation
            </span>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="text-xs bg-transparent text-zinc-700 dark:text-zinc-300 px-2 py-1 focus:outline-hidden cursor-pointer"
            >
              {uniqueCompanies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-medium font-mono">
          Filtered: {filteredAttendees.length} records available
        </div>
      </div>

      {/* Attendee Details Table list */}
      {filteredAttendees.length === 0 ? (
        <EmptyState
          title="No Attendees Found"
          description="Try broadening query parameters, clearing filter selections, or manually register new guests."
          action={{
            label: "Clear Filter Selections",
            onClick: () => {
              setLocalSearch('');
              setStatusFilter('All');
              setCompanyFilter('All');
            }
          }}
        />
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-805/80 rounded-2xl overflow-hidden shadow-xs transition-colors animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-850 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
                  <th className="py-4.5 px-6">Attendee profile</th>
                  <th className="py-4.5 px-3">Registered Contact Detail</th>
                  <th className="py-4.5 px-3">Company Affiliation</th>
                  <th className="py-4.5 px-3">Date Registered</th>
                  <th className="py-4.5 px-3">Attendance Badge</th>
                  <th className="py-4.5 px-5">Mark Attendance</th>
                  <th className="py-4.5 px-6 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/60 text-xs text-zinc-700 dark:text-zinc-300">
                {filteredAttendees.map((att) => (
                  <tr 
                    key={att.id}
                    className="hover:bg-zinc-50/40 dark:hover:bg-zinc-850/45 transition-colors"
                  >
                    {/* Portrait headshot avatar */}
                    <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={att.avatarUrl}
                          alt={att.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-50 dark:ring-zinc-800 shrink-0"
                        />
                        <span className="truncate max-w-40">{att.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 font-medium text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                      {att.email}
                    </td>
                    <td className="py-4 px-3">
                      <span className="px-2 py-0.5 font-bold uppercase text-[10px] tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 rounded-lg">
                        {att.company}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-zinc-500 dark:text-zinc-400 font-mono">
                      {att.registrationDate}
                    </td>
                    <td className="py-4 px-3">
                      <StatusBadge type="attendance" status={att.status} />
                    </td>
                    
                    {/* Action toggles: fast mark attended inside table */}
                    <td className="py-4 px-5">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onUpdateAttendeeStatus(att.id, 'attended')}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${att.status === 'attended' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-emerald-500'}`}
                          title="Mark Attended"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onUpdateAttendeeStatus(att.id, 'no_show')}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${att.status === 'no_show' ? 'bg-zinc-550 border-zinc-500 text-zinc-900 bg-zinc-100 dark:bg-zinc-850' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500'}`}
                          title="Mark Absent No-Show"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onDeleteAttendee(att.id)}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-transparent hover:border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Remove registrant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REGISTER ATTENDEE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-sm mx-4 z-10 shadow-2xl p-6 dark:text-zinc-100 select-none animate-scale-in">
            
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-5">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white font-sans">
                Manually Onboard Attendee
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-750"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  FullName Name
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

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. richard@piedpiper.com"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Employer / Affiliation Company
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe Inc."
                  value={addCompany}
                  onChange={(e) => setAddCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Initial Ticket Status
                </label>
                <select
                  value={addStatus}
                  onChange={(e) => setAddStatus(e.target.value as AttendanceStatus)}
                  className="w-full px-2 py-2 text-xs text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:text-white dark:border-zinc-800"
                >
                  <option value="registered">Registered (Pending)</option>
                  <option value="attended">Attended (Checked-In)</option>
                  <option value="no_show">Absent No-Show</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-150 flex justify-end gap-3 dark:border-zinc-800">
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
                  Register Ticket
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
