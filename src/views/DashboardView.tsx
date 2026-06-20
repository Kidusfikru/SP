import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Plus, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Shield,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Event, Speaker } from '../types';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { mockDashboardGrowth, mockCategoryStats, mockRecentActivities } from '../mockData';

interface DashboardViewProps {
  id?: string;
  events: Event[];
  speakers: Speaker[];
  totalAttendeesCount: number;
  unreadMessagesCount: number;
  onNavigateToTab: (tab: any) => void;
  onCreateEventClick: () => void;
  onSelectEvent: (event: Event) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  id,
  events,
  speakers,
  totalAttendeesCount,
  unreadMessagesCount,
  onNavigateToTab,
  onCreateEventClick,
  onSelectEvent
}) => {
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const acceptedInvitations = speakers.filter(s => s.rsvpStatus === 'accepted').length;

  // Render modular high-fidelity SVG chart for event growth
  const renderGrowthChart = () => {
    const data = mockDashboardGrowth;
    const maxVal = Math.max(...data.map(d => d.count));
    const width = 500;
    const height = 180;
    const padding = 25;

    const points = data.map((d, index) => {
      const x = padding + (index * (width - padding * 2)) / (data.length - 1);
      const y = height - padding - (d.count * (height - padding * 2)) / maxVal;
      return { x, y, label: d.month, val: d.count };
    });

    const pathData = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    // SVG gradient fill calculations
    const areaPathData = points.length > 0 
      ? `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : '';

    return (
      <div className="w-full h-full flex flex-col justify-between">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 overflow-visible">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3].map((val) => {
            const y = padding + (val * (height - padding * 2)) / 3;
            return (
              <line
                key={val}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                className="stroke-zinc-100 dark:stroke-zinc-800/60"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area under curve */}
          {areaPathData && (
            <path d={areaPathData} fill="url(#chartGrad)" />
          )}

          {/* Spark line path */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke="url(#strokeGrad)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data point glowing nodes */}
          {points.map((p, index) => (
            <g key={index} className="group/node">
              <circle
                cx={p.x}
                cy={p.y}
                r={index === points.length - 1 ? 6 : 4}
                className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-zinc-950"
                strokeWidth={2}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={10}
                className="fill-indigo-500 opacity-0 group-hover/node:opacity-20 transition-opacity"
              />
              {/* Tooltip on node */}
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                className="text-[10px] fill-zinc-900 dark:fill-zinc-100 font-bold opacity-0 group-hover/node:opacity-100 transition-opacity bg-zinc-900 duration-200"
              >
                {p.val}
              </text>
            </g>
          ))}

          {/* Axis Labels */}
          {points.map((p, index) => (
            <text
              key={index}
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="text-[10px] font-semibold fill-zinc-400 dark:fill-zinc-500"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  // Render high-fidelity RSVP Status percentages progress bar lists
  const renderRsvpsStatusDistribution = () => {
    const totalSpeakers = speakers.length;
    const acceptedNum = speakers.filter(s => s.rsvpStatus === 'accepted').length;
    const pendingNum = speakers.filter(s => s.rsvpStatus === 'pending').length;
    const declinedNum = speakers.filter(s => s.rsvpStatus === 'declined').length;

    const acceptedPct = totalSpeakers ? Math.round((acceptedNum / totalSpeakers) * 100) : 0;
    const pendingPct = totalSpeakers ? Math.round((pendingNum / totalSpeakers) * 100) : 0;
    const declinedPct = totalSpeakers ? Math.round((declinedNum / totalSpeakers) * 100) : 0;

    const list = [
      { name: 'Accepted invitation', pct: acceptedPct, count: acceptedNum, colorClass: 'bg-emerald-500', textClass: 'text-emerald-600 dark:text-emerald-400' },
      { name: 'Pending confirmation', pct: pendingPct, count: pendingNum, colorClass: 'bg-amber-500', textClass: 'text-amber-500' },
      { name: 'Declined schedule', pct: declinedPct, count: declinedNum, colorClass: 'bg-rose-500', textClass: 'text-rose-500' }
    ];

    return (
      <div className="space-y-4">
        {list.map((item, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {item.name}
              </span>
              <span className={`font-mono font-bold ${item.textClass}`}>
                {item.count} ({item.pct}%)
              </span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-805 h-2 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${item.colorClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.pct}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div id={id || 'dashboard-view'} className="space-y-6">
      
      {/* Page Header */}
      <PageHeader 
        title="Portal Overview" 
        description="Monitor speaker activities, invitations rsvp ratios, and coordinate upcoming online panel sessions."
      >
        <button
          onClick={onCreateEventClick}
          className="px-4 py-2 text-xs font-semibold bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl shadow-xs hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </PageHeader>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Upcoming Panels"
          value={upcomingEvents.length}
          icon={<Calendar className="w-5 h-5" />}
          trendValue="+1 new"
          trendDirection="up"
          description="Ready to stream"
          color="indigo"
        />
        <MetricCard
          title="Total Registrations"
          value={totalAttendeesCount}
          icon={<Users className="w-5 h-5" />}
          trendValue="+12%"
          trendDirection="up"
          description="Active tickets sold"
          color="emerald"
        />
        <MetricCard
          title="Pending Messages"
          value={unreadMessagesCount}
          icon={<MessageSquare className="w-5 h-5" />}
          trendValue="2 unread"
          trendDirection="neutral"
          description="Speaker coordinates"
          color="amber"
        />
        <MetricCard
          title="Speakers Onboarded"
          value={`${acceptedInvitations} / ${speakers.length}`}
          icon={<CheckCircle className="w-5 h-5" />}
          trendValue={`${Math.round((acceptedInvitations / speakers.length) * 100)}%`}
          trendDirection="up"
          description="Participation index"
          color="blue"
        />
      </div>

      {/* Primary Analytics Charts layout container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth line chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-sans">
                Monthly Registration Index
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                SaaS system check-ins tracked chronologically
              </p>
            </div>
            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold font-mono">
                +42.5%
              </span>
            </div>
          </div>
          {renderGrowthChart()}
        </div>

        {/* RSVP Status Doughnut-replace progress bars */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-sans">
              Invitation Progress
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 mb-4">
              Speakers response quotas across all categories
            </p>
          </div>
          {renderRsvpsStatusDistribution()}
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
            <span className="text-[11px] text-indigo-500 font-bold block cursor-pointer hover:underline" onClick={() => onNavigateToTab('speakers')}>
              Coordinate Speakers
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

      </div>

      {/* Activity feed and upcoming panels widgets container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming events lists */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4.5">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-sans">
                Aesthetic Scheduled Panels
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                Active live stages pending countdown
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('events')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
            {events.slice(0, 3).map((evt) => (
              <div 
                key={evt.id} 
                onClick={() => onSelectEvent(evt)}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:bg-zinc-500/[0.02] cursor-pointer group rounded-lg px-1 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={evt.bannerUrl}
                    alt={evt.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-zinc-200/20"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate tracking-tight">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                        {evt.date} • {evt.time}
                      </span>
                      <span className="px-1.5 py-0.2 bg-zinc-100 dark:bg-zinc-850 text-zinc-500 dark:text-zinc-400 rounded text-[9px] font-bold">
                        {evt.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge type="event" status={evt.status} />
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed list log */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-sans">
              Recent Analytics Feed
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 mb-4.5">
              Live updates recorded from portal channels
            </p>
          </div>

          <div className="space-y-4">
            {mockRecentActivities.map((act) => (
              <div key={act.id} className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-zinc-800 dark:text-zinc-200">
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-50">{act.user}</strong> {act.action}
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    {act.description} • {act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 text-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
              <Shield className="w-3.5 h-3.5" />
              <span>Security encryption active (SSL)</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
