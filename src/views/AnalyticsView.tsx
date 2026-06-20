import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  TrendingUp, 
  Users, 
  Heart, 
  Award, 
  Calendar,
  Layers,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { mockDashboardGrowth, mockCategoryStats } from '../mockData';

interface AnalyticsViewProps {
  id?: string;
  totalEventsCount: number;
  totalAttendeesCount: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  id,
  totalEventsCount,
  totalAttendeesCount
}) => {
  const [selectedRange, setSelectedRange] = useState<'30days' | '90days' | 'all'>('30days');
  const [activeDataNode, setActiveDataNode] = useState<{ label: string; count: number } | null>(null);

  // 1. Line Trend SVG Calculations
  const renderTrendSVG = () => {
    const data = mockDashboardGrowth;
    const padding = 30;
    const width = 600;
    const height = 220;
    const maxVal = Math.max(...data.map(d => d.count)) * 1.1;

    const points = data.map((d, index) => {
      const x = padding + (index * (width - padding * 2)) / (data.length - 1);
      const y = height - padding - (d.count * (height - padding * 2)) / maxVal;
      return { x, y, label: d.month, count: d.count };
    });

    const pathString = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    const areaString = points.length > 0 
      ? `${pathString} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : '';

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible select-none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="60%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((gridIndex) => {
            const y = padding + (gridIndex * (height - padding * 2)) / 4;
            return (
              <g key={gridIndex}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  className="stroke-zinc-150 dark:stroke-zinc-850"
                  strokeWidth={0.8}
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-zinc-400 dark:fill-zinc-550 font-mono"
                >
                  {Math.round(maxVal - (gridIndex * maxVal) / 4)}
                </text>
              </g>
            );
          })}

          {/* Shaded Area */}
          {areaString && (
            <path d={areaString} fill="url(#areaGrad)" />
          )}

          {/* Glowing Line */}
          {pathString && (
            <path
              d={pathString}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_2px_8px_rgba(99,102,241,0.2)]"
            />
          )}

          {/* Interactive node nodes */}
          {points.map((p, pIdx) => (
            <g 
              key={pIdx}
              onMouseEnter={() => setActiveDataNode({ label: p.label, count: p.count })}
              onMouseLeave={() => setActiveDataNode(null)}
              className="cursor-pointer group/node"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={activeDataNode?.label === p.label ? 7 : 5}
                className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-zinc-900 transition-all duration-150"
                strokeWidth={2}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={14}
                className="fill-indigo-500 opacity-0 group-hover/node:opacity-15 transition-opacity"
              />
            </g>
          ))}

          {/* X axis lines labels */}
          {points.map((p, pIdx) => (
            <text
              key={pIdx}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[10px] font-bold fill-zinc-400 dark:fill-zinc-400 font-sans"
            >
              {p.label}
            </text>
          ))}
        </svg>

        {/* Hover detail HUD panel */}
        {activeDataNode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-2 bg-zinc-950 dark:bg-zinc-52 py-2 px-3.5 rounded-xl border border-zinc-900 text-white shadow-xl flex items-center gap-2"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {activeDataNode.label}:
            </span>
            <span className="text-sm font-extrabold text-indigo-400 font-mono">
              {activeDataNode.count} Attendances
            </span>
          </motion.div>
        )}
      </div>
    );
  };

  // 2. Bar Chart Categories SVG Calculations
  const renderCategoriesSVG = () => {
    const data = mockCategoryStats;
    const width = 450;
    const height = 180;
    const padding = 20;
    const maxVal = Math.max(...data.map(d => d.count)) * 1.25;

    const barWidth = 32;
    const points = data.map((d, idx) => {
      const x = padding + (idx * (width - padding * 2)) / data.length + (width - padding * 2) / (data.length * 4);
      const h = (d.count * (height - padding * 2.5)) / maxVal;
      const y = height - padding - h;
      return { x, y, h, label: d.category, val: d.count, color: d.color };
    });

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible select-none">
        {/* Horizontal base grid line */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          className="stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth={1}
        />

        {points.map((p, idx) => (
          <g key={idx} className="group/bar">
            {/* Background pill track */}
            <rect
              x={p.x - barWidth / 2}
              y={padding}
              width={barWidth}
              height={height - padding * 2}
              className="fill-zinc-50 dark:fill-zinc-950/40 rounded-lg"
              rx={6}
            />

            {/* Glowing bar column */}
            <rect
              x={p.x - barWidth / 2}
              y={p.y}
              width={barWidth}
              height={p.h}
              fill={p.color}
              rx={6}
              className="transition-all duration-300 transform group-hover/bar:brightness-110 shadow-lg"
            />

            {/* Label texts */}
            <text
              x={p.x}
              y={p.y - 6}
              textAnchor="middle"
              className="text-[10px] font-bold fill-zinc-700 dark:fill-zinc-300 font-mono"
            >
              {p.val}
            </text>

            <text
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="text-[9px] font-bold fill-zinc-400 dark:fill-zinc-500 font-sans"
            >
              {p.label.split(' ')[0]} {/* Grab first abbreviation */}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div id={id || 'analytics-dashboard-view'} className="space-y-6">
      
      {/* Page Header */}
      <PageHeader 
        title="Interactive Platform Analytics" 
        description="Review audience registration velocities, category indices and historical session tracking charts."
      >
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
          {(['30days', '90days', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedRange === range
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-750 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {range === '30days' ? 'Last 30d' : range === '90days' ? 'Last 90d' : 'Historical'}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Grid boxes showcasing detailed statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-850 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 block uppercase font-bold tracking-wider">
              Registration Speed
            </span>
            <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 block tracking-tight mt-1">
              +14.5 regs / hr
            </span>
            <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">
              ▲ 22.4% velocity growth
            </span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-855 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <Users className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 block uppercase font-bold tracking-wider">
              Cumulative Audience
            </span>
            <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 block tracking-tight mt-1">
              {totalAttendeesCount * 4} active members
            </span>
            <span className="text-[10px] text-indigo-500 font-bold block mt-0.5">
              • Tracked via token logs
            </span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-860 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-100 dark:border-amber-900/30">
            <Award className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 block uppercase font-bold tracking-wider">
              Active Stage Quota
            </span>
            <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 block tracking-tight mt-1">
              {totalEventsCount} Active Stages
            </span>
            <span className="text-[10px] text-zinc-450 dark:text-zinc-400 font-bold block mt-0.5">
              • 3 pending soundchecks
            </span>
          </div>
        </div>

      </div>

      {/* Primary Analytics Visualization graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 rounded-2xl shadow-xs">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-905 dark:text-zinc-50 font-sans">
                Stage Attendance Velocities
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-505 mt-0.5">
                Hover over specific data nodes on the curve to slide details
              </p>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded-xl font-bold font-mono">
              REALTIME OVERLAY
            </span>
          </div>
          {renderTrendSVG()}
        </div>

        {/* Categories Bar chart */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-905 dark:text-zinc-50 font-sans">
              Top Panel Categories
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-505 mt-0.5 mb-6">
              Total assigned workshops classified by technology
            </p>
          </div>
          {renderCategoriesSVG()}
        </div>

      </div>

      {/* Helpful instruction guidelines */}
      <div className="bg-indigo-500/10 dark:bg-indigo-950/25 border border-indigo-200/30 dark:border-indigo-900/40 rounded-2xl p-4 flex gap-4.5 text-xs text-indigo-700 dark:text-indigo-300">
        <Info className="w-5 h-5 shrink-0" />
        <div className="space-y-1">
          <p className="font-bold">
            Insight: Realtime Zoom Integrations Active
          </p>
          <p className="leading-relaxed text-zinc-650 dark:text-zinc-400">
            Attendance growth peaked at 195+ in June. High-contrast categories like <strong>Design & UX</strong> and <strong>Backend & Databases</strong> drive 72% of guest traffic indices. Keep rosters active by scheduling soundchecks inside the Messages module.
          </p>
        </div>
      </div>

    </div>
  );
};
