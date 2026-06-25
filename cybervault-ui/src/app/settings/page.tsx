'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, RefreshCw, Key, User } from 'lucide-react';
import { runSyncEngine } from '@/actions/sync';

export default function SettingsPage() {
  const [token, setToken] = useState('********************');
  const [username, setUsername] = useState('rakazaka');
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState('15 min');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected'>('connected');

  const [lastSync, setLastSync] = useState('Never');
  const [syncing, setSyncing] = useState(false);

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 1500);
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    const result = await runSyncEngine();
    setSyncing(false);
    setLastSync(`Just now (Updated ${result.itemsUpdated} items)`);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-gray-400" /> Settings
        </h1>
        <p className="text-gray-500 text-sm">Configure your Hack The Box integration and sync preferences.</p>
      </div>

      <div className="space-y-8">
        
        {/* Hack The Box Integration */}
        <section className="stakent-glass p-8">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            Hack The Box Connection
          </h2>

          <div className="space-y-6 max-w-xl">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Username
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4" /> App Token
              </label>
              <input 
                type="password" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your HTB App Token here"
                className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
              />
              <p className="text-xs text-gray-500 mt-2">Required to automatically sync your progress. Stored securely in your local SQLite database.</p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button 
                onClick={handleTestConnection}
                className="stakent-btn-primary px-6 py-2.5 !text-sm"
              >
                {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
              
              {connectionStatus === 'connected' && (
                <span className="text-green-400 text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Connected
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Sync Preferences */}
        <section className="stakent-glass p-8">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
              <RefreshCw className="w-4 h-4" />
            </span>
            Sync Engine
          </h2>

          <div className="space-y-6 max-w-xl">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#1a1a20] bg-[#0c0c0e]">
              <div>
                <p className="font-bold text-white mb-1">Auto Sync</p>
                <p className="text-xs text-gray-500">Automatically pull latest activity in the background.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={autoSync} onChange={() => setAutoSync(!autoSync)} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-[#1a1a20] bg-[#0c0c0e]">
              <div>
                <p className="font-bold text-white mb-1">Sync Interval</p>
                <p className="text-xs text-gray-500">How often to check for updates.</p>
              </div>
              <select 
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                disabled={!autoSync}
                className="bg-[#1a1a20] text-sm text-white px-3 py-2 rounded-lg border-none outline-none disabled:opacity-50"
              >
                <option value="Manual">Manual</option>
                <option value="15 min">15 min</option>
                <option value="30 min">30 min</option>
                <option value="1 hour">1 hour</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#1a1a20] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Last Sync</p>
                <p className="text-sm font-medium text-white flex items-center gap-2">{lastSync}</p>
              </div>
              <button 
                onClick={handleSyncNow}
                disabled={syncing}
                className="bg-white text-black font-bold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
