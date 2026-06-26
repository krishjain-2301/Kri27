'use client';

import React, { useState, useMemo } from 'react';
import { format, isToday, isYesterday, isThisWeek, subDays, startOfMonth, formatDistanceToNow } from 'date-fns';
import { Activity, BookOpen, Monitor, TerminalSquare, ShieldCheck, RefreshCw, FileText } from 'lucide-react';
import StudyHeatmap from './StudyHeatmap';
import Link from 'next/link';

interface ActivityEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  title: string;
  description: string | null;
  metadata: string | null;
  createdAt: Date;
}

export default function TimelineFeed({ initialEvents }: { initialEvents: ActivityEvent[] }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredEvents = useMemo(() => {
    return initialEvents.filter(e => {
      // Type filtering
      if (filter === 'Machines' && e.entityType !== 'machine') return false;
      if (filter === 'Challenges' && e.entityType !== 'challenge') return false;
      if (filter === 'Journals' && e.eventType !== 'journal_created' && e.eventType !== 'journal_updated') return false;
      if (filter === 'Daily Notes' && e.eventType !== 'daily_note_created') return false;
      if (filter === 'Sync' && e.entityType !== 'sync') return false;

      // Search filtering
      if (search) {
        const query = search.toLowerCase();
        const matchesTitle = e.title?.toLowerCase().includes(query);
        const matchesDesc = e.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }
      
      return true;
    });
  }, [initialEvents, filter, search]);

  // Group events
  const groups = useMemo(() => {
    const res: Record<string, ActivityEvent[]> = {};
    
    filteredEvents.forEach(e => {
      let groupName = '';
      if (isToday(e.createdAt)) groupName = 'Today';
      else if (isYesterday(e.createdAt)) groupName = 'Yesterday';
      else if (isThisWeek(e.createdAt)) groupName = 'This Week';
      else if (e.createdAt > subDays(new Date(), 14)) groupName = 'Last Week';
      else groupName = format(startOfMonth(e.createdAt), 'MMMM yyyy');
      
      if (!res[groupName]) res[groupName] = [];
      res[groupName].push(e);
    });
    
    return res;
  }, [filteredEvents]);

  const groupKeys = Object.keys(groups);

  const getIcon = (eventType: string) => {
    switch(eventType) {
      case 'machine_rooted': return <ShieldCheck className="w-5 h-5 text-green-400" />;
      case 'machine_started': return <Monitor className="w-5 h-5 text-blue-400" />;
      case 'challenge_completed': return <TerminalSquare className="w-5 h-5 text-purple-400" />;
      case 'journal_created': return <BookOpen className="w-5 h-5 text-yellow-400" />;
      case 'journal_updated': return <BookOpen className="w-5 h-5 text-orange-400" />;
      case 'daily_note_created': return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'sync_completed': return <RefreshCw className="w-5 h-5 text-gray-400" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getHref = (event: ActivityEvent) => {
    if (event.entityType === 'sync') return '/settings';
    if (event.entityType === 'daily_note') return '/journals?type=Daily';
    return `/journals/${event.entityId}`;
  };

  return (
    <div className="space-y-8">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full no-scrollbar">
          {['All', 'Machines', 'Challenges', 'Journals', 'Daily Notes', 'Sync'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                filter === f 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-[#0c0c0e] text-gray-400 border border-[#1a1a20] hover:text-white hover:border-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <input 
          type="text" 
          placeholder="Search timeline..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64 bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Heatmap */}
      <StudyHeatmap events={initialEvents} />

      {/* Timeline */}
      <div className="space-y-12">
        {groupKeys.length === 0 && (
          <div className="text-center py-20 text-gray-500 italic">No activity matches your filters.</div>
        )}
        
        {groupKeys.map(group => (
          <div key={group}>
            {/* Group Header */}
            <h3 className="text-lg font-bold text-gray-300 mb-6 flex items-center gap-4">
              <span className="bg-[#0c0c0e] px-4 py-1 rounded-full border border-[#1a1a20]">{group}</span>
              <div className="h-px bg-[#1a1a20] flex-1"></div>
            </h3>

            {/* Events */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#1a1a20] before:to-transparent">
              {groups[group].map((event, i) => {
                const meta = event.metadata ? JSON.parse(event.metadata) : {};
                
                return (
                  <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0c0c0e] bg-[#1a1a20] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {getIcon(event.eventType)}
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] stakent-glass p-5 rounded-2xl border border-[#1a1a20] group-hover:border-blue-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{format(event.createdAt, 'h:mm a')}</span>
                        {meta.difficulty && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${meta.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : meta.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' : meta.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            {meta.difficulty}
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-bold text-lg mb-1">{event.title}</h4>
                      
                      {event.description && (
                        <p className="text-sm text-gray-400 mb-3">{event.description}</p>
                      )}
                      
                      {/* Rich Metadata Render */}
                      {meta.words_added !== undefined && (
                        <div className="text-xs text-green-400 font-bold mb-3 bg-green-500/10 inline-block px-2 py-1 rounded">+{meta.words_added} words</div>
                      )}
                      
                      {meta.itemsImported !== undefined && (
                        <div className="text-xs text-blue-400 font-bold mb-3 bg-blue-500/10 inline-block px-2 py-1 rounded">{meta.itemsImported} Imported • {meta.itemsUpdated} Updated</div>
                      )}

                      <Link href={getHref(event)} className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2">
                        Continue <span className="text-lg leading-none">→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
