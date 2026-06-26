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
  const [saved, setSaved] = useState(false);

  const hasChanges = autoSync !== initialAutoSync || interval !== initialInterval;

  const handleApply = () => {
    startTransition(() => {
      updateSyncPreferences(autoSync, interval);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="stakent-glass p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-400" /> Sync Preferences
        </h2>
        
        {/* Apply Button */}
        <button 
          onClick={handleApply}
          disabled={!hasChanges || isPending}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
            saved 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : hasChanges 
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' 
                : 'bg-[#1a1a20] text-gray-500 cursor-not-allowed'
          }`}
        >
          {saved ? 'Saved!' : isPending ? 'Saving...' : 'Apply'}
        </button>
      </div>
      
      <div className="space-y-6 max-w-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Auto-Sync</p>
            <p className="text-xs text-gray-500">Automatically sync progress in the background while the app is open.</p>
          </div>
          <div 
            onClick={() => { setAutoSync(!autoSync); setSaved(false); }}
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${autoSync ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoSync ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2 block">Sync Interval</label>
          <select 
            value={interval}
            onChange={(e) => { setIntervalVal(e.target.value); setSaved(false); }}
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
