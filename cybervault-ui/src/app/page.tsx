import React from 'react';
import DashboardClient from './DashboardClient';
import { getDashboardStats, getTodaysRecommendation, getRecentActivity, getActivityStats } from '@/lib/queries/dashboard';
import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';

// Force dynamic since we read directly from local SQLite
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recommendation = await getTodaysRecommendation();
  const recentActivity = await getRecentActivity();
  const activityStats = await getActivityStats();
  const userSettings = await db.select().from(settings).limit(1);
  const isConnected = userSettings.length > 0 && userSettings[0].htbAppToken;
  const username = userSettings.length > 0 ? userSettings[0].htbUsername : null;

  return (
    <DashboardClient 
      stats={stats} 
      recommendation={recommendation} 
      recentActivity={recentActivity} 
      activityStats={activityStats}
      isConnected={isConnected}
      username={username}
    />
  );
}
