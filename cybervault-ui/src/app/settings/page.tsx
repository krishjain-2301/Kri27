import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, RefreshCw, Key, User, Unplug } from 'lucide-react';
import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const userSettings = await db.select().from(settings).limit(1);
  const isConnected = userSettings.length > 0 && userSettings[0].htbAppToken;

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-gray-400" /> Settings
          </h1>
          <p className="text-gray-500 text-sm">Manage your connection and application preferences.</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Connection Settings */}
        <div className="stakent-glass p-8 relative overflow-hidden">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" /> Connection
          </h2>
          
          <div className="space-y-6 max-w-lg">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2 block">Hack The Box Username</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  defaultValue={isConnected ? userSettings[0].htbUsername || '' : ''}
                  className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-green-500/50 transition"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2 block">App Token</label>
              <div className="relative">
                <Key className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input 
                  type="password" 
                  defaultValue={isConnected ? '********************' : ''}
                  className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-green-500/50 transition"
                  readOnly
                />
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button className="stakent-btn-primary flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Update Credentials
              </button>
              <button className="stakent-pill px-6 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-bold">
                <Unplug className="w-4 h-4" /> Disconnect
              </button>
            </div>
          </div>
        </div>

        {/* Sync Preferences */}
        <div className="stakent-glass p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" /> Sync Preferences
          </h2>
          
          <div className="space-y-6 max-w-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Auto-Sync</p>
                <p className="text-xs text-gray-500">Automatically sync progress in the background.</p>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2 block">Sync Interval</label>
              <select className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500/50 transition">
                <option>Every 15 minutes</option>
                <option>Every 30 minutes</option>
                <option>Every hour</option>
                <option>Manual only</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
