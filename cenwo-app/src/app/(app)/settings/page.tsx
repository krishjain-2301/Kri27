'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Shield, GitBranch, Monitor, Save } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">Configure your CenWo experience</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" /> Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Display Name</label>
              <input type="text" value={settings.displayName} onChange={e => updateSettings({ displayName: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
              <input type="email" value={settings.email} onChange={e => updateSettings({ email: e.target.value })} className="input" />
            </div>
          </div>
        </div>

        {/* HTB Integration */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#9fef00]" /> Hack The Box
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">HTB Username</label>
              <input type="text" value={settings.htbUsername || ''} onChange={e => updateSettings({ htbUsername: e.target.value })} className="input" placeholder="Your HTB username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">HTB API Token</label>
              <input type="password" value={settings.htbApiToken || ''} onChange={e => updateSettings({ htbApiToken: e.target.value })} className="input" placeholder="Bearer token from HTB settings" />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Find your token at app.hackthebox.com/profile/settings</p>
            </div>
          </div>
        </div>

        {/* GitHub Integration */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[var(--color-text-primary)]" /> GitHub Sync
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Repository</label>
              <input type="text" value={settings.githubRepo || ''} onChange={e => updateSettings({ githubRepo: e.target.value })} className="input" placeholder="username/repo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Personal Access Token</label>
              <input type="password" value={settings.githubToken || ''} onChange={e => updateSettings({ githubToken: e.target.value })} className="input" placeholder="ghp_..." />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Generate at github.com/settings/tokens with repo scope</p>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-purple-400" /> Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Dark Mode</p>
                <p className="text-xs text-[var(--color-text-muted)]">Currently active</p>
              </div>
              <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--color-text-muted)] text-center">
          Settings are saved automatically to local storage.
        </p>
      </div>
    </motion.div>
  );
}
