import React from 'react';
import { db } from '@/lib/db/client';
import { activityEvents } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import TimelineFeed from './TimelineFeed';

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  const allEvents = await db.select()
    .from(activityEvents)
    .orderBy(desc(activityEvents.createdAt));
    
  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Activity Timeline</h1>
        <p className="text-gray-500 text-sm">Your hacking journey, mapped chronologically.</p>
      </div>
      
      <TimelineFeed initialEvents={allEvents} />
    </div>
  );
}
