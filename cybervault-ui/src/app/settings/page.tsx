'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon, ShieldCheck, RefreshCw, Key, User,
  Unplug, CheckCircle, AlertCircle, Activity, Layers, Edit3
} from 'lucide-react';
import {
  getSettings, saveCredentials, disconnectCredentials,
  saveTHMCredentials, disconnectTHMCredentials,
  updateDisplayName,
  updateSyncPreferences, getSyncHistory
} from '@/lib/db/queries';
import { HTBBrowserClient } from '@/lib/providers/htb/browser-client';
import { THMBrowserClient } from '@/lib/providers/thm/browser-client';
import { format } from 'date-fns';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [username, setUsername] = useState('');
  const [appToken, setAppToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ ok: boolean; message: string; username?: string } | null>(null);

  const [thmUsername, setThmUsername] = useState('');
  const [isTHMConnected, setIsTHMConnected] = useState(false);
  const [thmConnectionStatus, setTHMConnectionStatus] = useState<{ ok: boolean; message: string; username?: string } | null>(null);

  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [autoSync, setAutoSync] = useState(false);
  const [syncInterval, setSyncInterval] = useState('Manual');
  const [savingHTB, setSavingHTB] = useState(false);
  const [savingTHM, setSavingTHM] = useState(false);

  useEffect(() => {
    async function load() {
      const settings = await getSettings();
      if (settings?.displayName) {
        setDisplayName(settings.displayName);
      }

      if (settings?.htbAppToken) {
        setIsConnected(true);
        setUsername(settings.htbUsername || '');
        setAppToken(settings.htbAppToken || '');

        try {
          const client = new HTBBrowserClient(settings.htbAppToken);
          const result = await client.validateConnection();
          setConnectionStatus(result.ok
            ? { ok: true, message: 'Healthy', username: result.username }
            : { ok: false, message: result.reason === 'Unauthorized' ? 'Invalid API token' : result.reason || 'Failing' }
          );
        } catch {
          setConnectionStatus({ ok: false, message: 'Network unavailable' });
        }
      }

      if (settings?.thmUsername) {
        setIsTHMConnected(true);
        setThmUsername(settings.thmUsername);

        try {
          const thmClient = new THMBrowserClient();
          const thmResult = await thmClient.validateConnection(settings.thmUsername);
          setTHMConnectionStatus(thmResult.ok
            ? { ok: true, message: 'Healthy', username: thmResult.username }
            : { ok: false, message: thmResult.reason === 'UserNotFound' ? 'User not found' : thmResult.reason || 'Failing' }
          );
        } catch {
          setTHMConnectionStatus({ ok: false, message: 'Network unavailable' });
        }
      }

      if (settings) {
        setAutoSync(settings.autoSync ?? false);
        setSyncInterval(settings.syncInterval || 'Manual');
      }

      const history = await getSyncHistory(5);
      setHistoryLogs(history);
    }
    load();
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    await updateDisplayName(displayName.trim() || null);
    setSavingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSaveHTB = async () => {
    setSavingHTB(true);
    await saveCredentials(username, appToken);
    setIsConnected(!!appToken);
    setSavingHTB(false);
    window.location.reload();
  };

  const handleDisconnectHTB = async () => {
    await disconnectCredentials();
    setIsConnected(false);
    setUsername('');
    setAppToken('');
    setConnectionStatus(null);
    window.location.reload();
  };

  const handleSaveTHM = async () => {
    setSavingTHM(true);
    await saveTHMCredentials(thmUsername);
    setIsTHMConnected(!!thmUsername);
    setSavingTHM(false);
    window.location.reload();
  };

  const handleDisconnectTHM = async () => {
    await disconnectTHMCredentials();
    setIsTHMConnected(false);
    setThmUsername('');
    setTHMConnectionStatus(null);
    window.location.reload();
  };

  const handleSyncPrefs = async () => {
    await updateSyncPreferences(autoSync, syncInterval);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-gray-400" /> Settings
          </h1>
          <p className="text-gray-500 text-sm">Manage your platform connections and application preferences.</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* Profile & Display Name */}
        <div className="stakent-glass p-8 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" /> Profile & Display Name
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Customize the username shown in your greeting and dashboard.
              </p>
            </div>
            {profileSaved && (
              <span className="text-green-400 font-bold text-xs bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Saved
              </span>
            )}
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2 block">
                Display Username
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition text-sm"
                  placeholder={username || thmUsername || "Enter your display username"}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {username || thmUsername
                  ? `Defaults to your connected account name (${username || thmUsername}) if left empty.`
                  : "Sets your greeting name across CyberVault."}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="stakent-btn-primary flex items-center gap-2 disabled:opacity-50 !bg-purple-600 hover:!bg-purple-500"
              >
                <RefreshCw className={`w-4 h-4 ${savingProfile ? 'animate-spin' : ''}`} />
                {savingProfile ? 'Saving...' : 'Save Display Name'}
              </button>

              {username && displayName !== username && (
                <button
                  onClick={() => setDisplayName(username)}
                  type="button"
                  className="px-3 py-2 bg-[#0c0c0e] border border-[#1a1a20] hover:bg-white/5 text-xs font-semibold text-gray-300 rounded-xl transition"
                >
                  Use HTB ({username})
                </button>
              )}

              {thmUsername && displayName !== thmUsername && (
                <button
                  onClick={() => setDisplayName(thmUsername)}
                  type="button"
                  className="px-3 py-2 bg-[#0c0c0e] border border-[#1a1a20] hover:bg-white/5 text-xs font-semibold text-gray-300 rounded-xl transition"
                >
                  Use THM ({thmUsername})
                </button>
              )}

              {displayName && (
                <button
                  onClick={async () => {
                    setDisplayName('');
                    await updateDisplayName(null);
                    setProfileSaved(true);
                    setTimeout(() => setProfileSaved(false), 3000);
                  }}
                  type="button"
                  className="px-3 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold text-red-400 rounded-xl transition"
                >
                  Reset to Default
                </button>
              )}
            </div>
          </div>
        </div>

        {/* HTB Connection */}
        <div className="stakent-glass p-8 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" /> Hack The Box Connection
            </h2>
            {isConnected && connectionStatus && (
              <div className="flex items-center gap-2 bg-[#0c0c0e] border border-[#1a1a20] px-3 py-1.5 rounded-lg text-sm">
                <span className="text-gray-500">Status:</span>
                {connectionStatus.ok ? (
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Connected as {connectionStatus.username}
                  </span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {connectionStatus.message}
                  </span>
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
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-green-500/50 transition text-sm"
                  placeholder="Enter your HTB username"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2 block">App Token</label>
              <div className="relative">
                <Key className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={appToken}
                  onChange={e => setAppToken(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-green-500/50 transition text-sm"
                  placeholder="Enter your HTB App Token (eyJ...)"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">Your token is stored in your browser only — never sent to our servers.</p>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                onClick={handleSaveHTB}
                disabled={savingHTB}
                className="stakent-btn-primary flex items-center gap-2 disabled:opacity-50 !bg-green-500"
              >
                <RefreshCw className="w-4 h-4" /> {savingHTB ? 'Saving...' : 'Update HTB Credentials'}
              </button>
              {isConnected && (
                <button
                  onClick={handleDisconnectHTB}
                  className="stakent-pill px-6 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-bold"
                >
                  <Unplug className="w-4 h-4" /> Disconnect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* THM Connection */}
        <div className="stakent-glass p-8 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-400" /> TryHackMe Connection
            </h2>
            {isTHMConnected && thmConnectionStatus && (
              <div className="flex items-center gap-2 bg-[#0c0c0e] border border-[#1a1a20] px-3 py-1.5 rounded-lg text-sm">
                <span className="text-gray-500">Status:</span>
                {thmConnectionStatus.ok ? (
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Connected as {thmConnectionStatus.username}
                  </span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {thmConnectionStatus.message}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6 max-w-lg">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2 block">TryHackMe Username</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={thmUsername}
                  onChange={e => setThmUsername(e.target.value)}
                  className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-red-500/50 transition text-sm"
                  placeholder="Enter your THM username"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">Public profile sync automatically imports completed THM rooms.</p>
            </div>

            <div className="pt-2 flex gap-4">
              <button
                onClick={handleSaveTHM}
                disabled={savingTHM}
                className="stakent-btn-primary flex items-center gap-2 disabled:opacity-50 !bg-red-500"
              >
                <RefreshCw className="w-4 h-4" /> {savingTHM ? 'Saving...' : 'Update THM Account'}
              </button>
              {isTHMConnected && (
                <button
                  onClick={handleDisconnectTHM}
                  className="stakent-pill px-6 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-bold"
                >
                  <Unplug className="w-4 h-4" /> Disconnect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sync Preferences */}
        <div className="stakent-glass p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" /> Sync Preferences
          </h2>
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Auto Sync</p>
                <p className="text-xs text-gray-500">Automatically sync progress across connected platforms</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoSync}
                onClick={() => {
                  const nextState = !autoSync;
                  setAutoSync(nextState);
                  updateSyncPreferences(nextState, syncInterval);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoSync ? 'bg-green-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoSync ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {autoSync && (
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2 block">Sync Interval</label>
                <select
                  value={syncInterval}
                  onChange={e => { setSyncInterval(e.target.value); setTimeout(handleSyncPrefs, 0); }}
                  className="bg-[#0c0c0e] border border-[#1a1a20] rounded-xl py-2 px-4 text-white focus:outline-none text-sm"
                >
                  <option value="Manual">Manual Only</option>
                  <option value="15 min">Every 15 minutes</option>
                  <option value="30 min">Every 30 minutes</option>
                  <option value="1 hour">Every hour</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Sync History */}
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
                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.errors === 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {log.errors === 0 ? 'Success' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-green-400">+{log.newEntries}</td>
                      <td className="px-4 py-3 font-bold text-purple-400">^{log.itemsUpdated}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[200px]">
                        {log.errors > 0 ? `${log.errors} errors` : `Took ${log.durationMs}ms`}
                      </td>
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
