'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { getSettings, generateSyncPreview, commitSync } from '@/lib/db/queries';
import { HTBBrowserClient } from '@/lib/providers/htb/browser-client';
import { THMBrowserClient } from '@/lib/providers/thm/browser-client';

export default function SyncManagerClient({
  initialSyncText,
  autoSync,
  syncIntervalStr,
  lastSyncTimestamp,
}: {
  initialSyncText: string;
  autoSync: boolean;
  syncIntervalStr: string;
  lastSyncTimestamp?: number;
}) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncText, setSyncText] = useState(initialSyncText);

  useEffect(() => {
    setSyncText(initialSyncText);
  }, [initialSyncText]);

  const handleSync = async (isManual = false) => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const settings = await getSettings();
      const hasHTB = !!settings?.htbAppToken;
      const hasTHM = !!settings?.thmUsername;

      if (!hasHTB && !hasTHM) {
        throw new Error('No platform connections configured.');
      }

      const allRemoteItems: any[] = [];

      if (hasHTB && settings?.htbAppToken) {
        try {
          const htbClient = new HTBBrowserClient(settings.htbAppToken);
          const htbItems = await htbClient.fetchLearningState();
          allRemoteItems.push(...htbItems);
        } catch (e) {
          console.warn('HTB Sync failed:', e);
        }
      }

      if (hasTHM && settings?.thmUsername) {
        try {
          const thmClient = new THMBrowserClient();
          const thmItems = await thmClient.fetchLearningState(settings.thmUsername);
          allRemoteItems.push(...thmItems);
        } catch (e) {
          console.warn('THM Sync failed:', e);
        }
      }

      const preview = await generateSyncPreview(allRemoteItems);
      await commitSync(preview);

      setSyncText('Synced just now');
      if (isManual) {
        window.location.reload();
      }
    } catch (e: any) {
      console.error(e);
      if (isManual) {
        alert(`Sync failed: ${e.message}`);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncRef = useRef(handleSync);
  useEffect(() => {
    handleSyncRef.current = handleSync;
  }, [handleSync]);

  useEffect(() => {
    if (!autoSync || syncIntervalStr === 'Manual') return;

    let intervalMs = 15 * 60 * 1000;
    if (syncIntervalStr === '30 min') intervalMs = 30 * 60 * 1000;
    if (syncIntervalStr === '1 hour') intervalMs = 60 * 60 * 1000;

    const timeSinceLastSync = lastSyncTimestamp ? Date.now() - lastSyncTimestamp : Infinity;

    if (timeSinceLastSync > intervalMs) {
      handleSyncRef.current(false);
    }

    const timer = setInterval(() => handleSyncRef.current(false), intervalMs);
    return () => clearInterval(timer);
  }, [autoSync, syncIntervalStr, lastSyncTimestamp]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{syncText}</span>
      <button
        onClick={() => handleSync(true)}
        disabled={isSyncing}
        className={`p-1.5 hover:bg-white/10 rounded-md transition text-gray-400 hover:text-white disabled:opacity-50 ${isSyncing ? 'animate-spin text-purple-400' : ''}`}
        title="Sync Now"
        suppressHydrationWarning
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
}
