'use client';

import React, { useState, useTransition } from 'react';
import { RefreshCw } from 'lucide-react';
import { updateSyncPreferences } from '@/actions/settings';

interface SyncPreferencesProps {
  initialAutoSync: boolean;
  initialInterval: string;
}

export default function SyncPreferences({ initialAutoSync, initialInterval }: SyncPreferencesProps) {
  const [autoSync, setAutoSync] = useState(initialAutoSync);
  const [interval, setIntervalVal] = useState(initialInterval);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newVal = !autoSync;
    setAutoSync(newVal);
    startTransition(() => {
      updateSyncPreferences(newVal, interval);
    });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    setIntervalVal(newVal);
    startTransition(() => {
      updateSyncPreferences(autoSync, newVal);
    });
  };

  return (
    <div className="stakent-glass p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <RefreshCw className="w-5 h-5 text-blue-400" /> Sync Preferences
      </h2>
      
      <div className="space-y-6 max-w-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Auto-Sync</p>
            <p className="text-xs text-gray-500">Automatically sync progress in the background (Coming in Phase 6).</p>
          </div>
          <div 
            onClick={handleToggle}
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${autoSync ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoSync ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2 block">Sync Interval</label>
          <select 
            value={interval}
            onChange={handleSelect}
            className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500/50 transition"
          >
            <option value="15 min">Every 15 minutes</option>
            <option value="30 min">Every 30 minutes</option>
            <option value="1 hour">Every hour</option>
            <option value="Manual">Manual only</option>
          </select>
        </div>
      </div>
    </div>
  );
}
