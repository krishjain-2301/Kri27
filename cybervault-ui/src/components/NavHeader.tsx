'use client';

import React, { useEffect, useState } from 'react';
import { Target, Layers, User } from 'lucide-react';
import { getSettings, getLatestSync } from '@/lib/db/queries';
import { formatDistanceToNow } from 'date-fns';
import SyncManagerClient from './SyncManagerClient';

export default function NavHeader() {
  const [htbConnected, setHtbConnected] = useState(false);
  const [htbUsername, setHtbUsername] = useState('');
  const [thmConnected, setThmConnected] = useState(false);
  const [thmUsername, setThmUsername] = useState('');

  const [syncText, setSyncText] = useState('Never synced');
  const [autoSync, setAutoSync] = useState(false);
  const [syncIntervalStr, setSyncIntervalStr] = useState('Manual');
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const settings = await getSettings();
        if (settings?.htbAppToken) {
          setHtbConnected(true);
          setHtbUsername(settings.htbUsername || 'HTB User');
        }
        if (settings?.thmUsername) {
          setThmConnected(true);
          setThmUsername(settings.thmUsername);
        }
        if (settings) {
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

  const isAnyConnected = htbConnected || thmConnected;

  return (
    <header className="h-[80px] flex items-center justify-end px-8 border-b border-[#1a1a20]">
      {isAnyConnected ? (
        <div className="flex items-center gap-4 text-sm bg-[#0c0c0e] border border-[#1a1a20] px-4 py-2 rounded-xl">
          <div className="flex items-center gap-3">
            {htbConnected && (
              <a
                href="/settings"
                title="Hack The Box Account (Click to manage)"
                className="flex items-center gap-1.5 text-white font-bold text-xs bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 px-2.5 py-1 rounded-lg transition"
              >
                <Target className="w-3.5 h-3.5 text-green-400" />
                <span>{htbUsername}</span>
              </a>
            )}
            {thmConnected && (
              <a
                href="/settings"
                title="TryHackMe Account (Click to manage)"
                className="flex items-center gap-1.5 text-white font-bold text-xs bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 px-2.5 py-1 rounded-lg transition"
              >
                <Layers className="w-3.5 h-3.5 text-red-400" />
                <span>{thmUsername}</span>
              </a>
            )}
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
