'use client';

import React, { useMemo } from 'react';
import { subDays, format, isSameDay } from 'date-fns';

interface ActivityEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
}

export default function StudyHeatmap({ events }: { events: ActivityEvent[] }) {
  // Generate last 90 days
  const days = useMemo(() => {
    const arr = [];
    for (let i = 89; i >= 0; i--) {
      arr.push(subDays(new Date(), i));
    }
    return arr;
  }, []);

  // Map events to days
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach(e => {
      // Exclude sync events from heatmap
      if (e.entityType === 'sync') return;
      
      const dayStr = format(e.createdAt, 'yyyy-MM-dd');
      map.set(dayStr, (map.get(dayStr) || 0) + 1);
    });
    return map;
  }, [events]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-[#1a1a20] border border-[#2a2a30]';
    if (count === 1) return 'bg-green-900 border border-green-800';
    if (count <= 3) return 'bg-green-700 border border-green-600';
    if (count <= 5) return 'bg-green-500 border border-green-400';
    return 'bg-green-400 border border-green-300 shadow-[0_0_8px_rgba(74,222,128,0.5)]';
  };

  return (
    <div className="stakent-glass p-6 overflow-hidden">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="font-bold text-lg">Study Heatmap</h3>
          <p className="text-xs text-gray-500">Your hacking consistency over the last 90 days</p>
        </div>
        <div className="text-sm font-bold text-green-400">
          {Array.from(activityMap.values()).reduce((a, b) => a + b, 0)} total actions
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 md:gap-[3px]">
        {days.map((day, i) => {
          const count = activityMap.get(format(day, 'yyyy-MM-dd')) || 0;
          return (
            <div 
              key={i} 
              title={`${format(day, 'MMM d, yyyy')}: ${count} actions`}
              className={`w-3 h-3 md:w-[14px] md:h-[14px] rounded-sm transition-all hover:scale-125 hover:z-10 cursor-help ${getColor(count)}`}
            />
          );
        })}
      </div>
    </div>
  );
}
