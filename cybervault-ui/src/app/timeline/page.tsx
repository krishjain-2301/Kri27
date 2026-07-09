'use client';

import React, { useEffect, useState } from 'react';
import { getAllActivityEvents } from '@/lib/db/queries';
import TimelineFeed from './TimelineFeed';

export default function TimelinePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllActivityEvents().then(setEvents).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading timeline...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Activity Timeline</h1>
        <p className="text-gray-500 text-sm">Your hacking journey, mapped chronologically.</p>
      </div>
      <TimelineFeed initialEvents={events} />
    </div>
  );
}
