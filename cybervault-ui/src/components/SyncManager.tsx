'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { triggerManualSync } from '@/actions/sync';

export default function SyncManager({ 
  initialSyncText, 
  autoSync, 
  syncIntervalStr,
  lastSyncTimestamp 
}: { 
  initialSyncText: string, 
  autoSync: boolean, 
  syncIntervalStr: string,
  lastSyncTimestamp?: number 
}) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await triggerManualSync();
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Sync failed. Ensure you have network connectivity.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!autoSync || syncIntervalStr === 'Manual') return;
    
    let intervalMs = 15 * 60 * 1000; // default 15 min
    if (syncIntervalStr === '30 min') intervalMs = 30 * 60 * 1000;
    if (syncIntervalStr === '1 hour') intervalMs = 60 * 60 * 1000;

    // Check if we should sync immediately on mount because we missed the window
    if (lastSyncTimestamp && Date.now() - lastSyncTimestamp > intervalMs) {
      handleSync();
    }

    const timer = setInterval(() => {
      handleSync();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoSync, syncIntervalStr, lastSyncTimestamp]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{initialSyncText}</span>
      <button 
        onClick={handleSync}
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
