'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { getSettings, getLatestSync } from '@/lib/db/queries';
import { formatDistanceToNow } from 'date-fns';
import SyncManagerClient from './SyncManagerClient';

export default function NavHeader() {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [syncText, setSyncText] = useState('Never synced');
  const [autoSync, setAutoSync] = useState(false);
  const [syncIntervalStr, setSyncIntervalStr] = useState('Manual');
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const settings = await getSettings();
        if (settings?.htbAppToken) {
          setIsConnected(true);
          setUsername(settings.htbUsername || '');
          setAutoSync(settings.autoSync ?? false);
          setSyncIntervalStr(settings.syncInterval || 'Manual');
        }

        const latestSync = await getLatestSync();
        if (latestSync?.createdAt) {
          setLastSyncTimestamp(new Date(latestSync.createdAt).getTime());
          setSyncText(`Synced ${formatDistanceToNow(new Date(latestSync.createdAt), { addSuffix: true })}`);
        }
      } catch {
        // IndexedDB not ready yet (SSR guard)
      }
    }
    load();
  }, []);

  return (
    <header className="h-[80px] flex items-center justify-end px-8 border-b border-[#1a1a20]">
      {isConnected ? (
        <div className="flex items-center gap-4 text-sm bg-[#0c0c0e] border border-[#1a1a20] px-4 py-2 rounded-xl">
          <div className="flex items-center gap-2 text-white font-bold">
            <User className="w-4 h-4 text-green-400" /> {username}
          </div>
          <div className="w-px h-4 bg-[#1a1a20]" />
          <SyncManagerClient
            initialSyncText={syncText}
            autoSync={autoSync}
            syncIntervalStr={syncIntervalStr}
            lastSyncTimestamp={lastSyncTimestamp}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-[#0c0c0e] border border-[#1a1a20] px-4 py-2 rounded-xl">
          <User className="w-4 h-4" /> Not Connected
        </div>
      )}
    </header>
  );
}
