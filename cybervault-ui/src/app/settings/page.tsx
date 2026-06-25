import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, RefreshCw, Key, User, Unplug, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { db } from '@/lib/db/client';
import { settings, syncHistory } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { HackTheBoxProvider } from '@/lib/providers/htb/provider';
import { formatDistanceToNow, format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const userSettings = await db.select().from(settings).limit(1);
  const isConnected = userSettings.length > 0 && !!userSettings[0].htbAppToken;

  let isHealthy = false;
  if (isConnected) {
    const provider = new HackTheBoxProvider(userSettings[0].htbAppToken as string);
    isHealthy = await provider.validateConnection();
  }

  const historyLogs = await db.select().from(syncHistory).orderBy(desc(syncHistory.createdAt)).limit(10);

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
        
        {/* Connection Settings & Health Check */}
        <div className="stakent-glass p-8 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" /> Connection
            </h2>
            {isConnected && (
              <div className="flex items-center gap-2 bg-[#0c0c0e] border border-[#1a1a20] px-3 py-1.5 rounded-lg text-sm">
                <span className="text-gray-500">API Status:</span>
                {isHealthy ? (
                  <span className="text-green-400 font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Healthy</span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4"/> Failing</span>
                )}
              </div>
            )}
          </div>
          
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

        {/* Sync History Logs */}
        <div className="stakent-glass p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" /> Sync History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase text-gray-500 bg-[#0c0c0e] border-b border-[#1a1a20]">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Imported</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 rounded-tr-lg">Notes</th>
                </tr>
              </thead>
              <tbody>
                {historyLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500 italic">No syncs recorded yet.</td>
                  </tr>
                ) : (
                  historyLogs.map(log => (
                    <tr key={log.id} className="border-b border-[#1a1a20] hover:bg-white/5 transition">
                      <td className="px-4 py-3 font-mono">{format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.status === 'Success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-green-400">+{log.newEntries}</td>
                      <td className="px-4 py-3 font-bold text-purple-400">^{log.updatedEntries}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[200px]">{log.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
