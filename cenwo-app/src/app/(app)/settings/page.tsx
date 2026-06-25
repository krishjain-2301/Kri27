'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, GitBranch, Monitor } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();

  const CardHeader = ({ title, icon: Icon, iconBg, iconColor, isIntegration = false }: any) => (
    <div 
      className="flex items-center justify-between"
      style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.015)' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center" style={{ width: '28px', height: '28px', backgroundColor: iconBg, borderRadius: '7px' }}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#e8e8f0' }}>{title}</h2>
      </div>
      {isIntegration && (
        <span 
          style={{ 
            fontSize: '9px', textTransform: 'uppercase', padding: '2px 6px', 
            borderRadius: '4px', backgroundColor: 'rgba(108,62,245,0.2)', color: '#8b6cf0', fontWeight: 600, letterSpacing: '0.04em'
          }}
        >
          Integration
        </span>
      )}
    </div>
  );

  const SaveBar = ({ connected, hintText, buttonText }: any) => (
    <div 
      className="flex items-center justify-between"
      style={{ padding: '12px 18px', backgroundColor: 'rgba(108,62,245,0.06)', borderTop: '1px solid rgba(108,62,245,0.15)' }}
    >
      <div className="flex items-center gap-2">
        <div 
          className="rounded-full" 
          style={{ width: '5px', height: '5px', backgroundColor: connected ? '#10b981' : '#f59e0b' }} 
        />
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{hintText}</span>
      </div>
      <button 
        className="flex items-center justify-center transition-colors"
        style={{ height: '30px', padding: '0 16px', backgroundColor: '#6c3ef5', borderRadius: '7px', fontSize: '12px', fontWeight: 600, color: '#fff' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#7d52f7'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6c3ef5'}
      >
        {buttonText}
      </button>
    </div>
  );

  const Label = ({ children }: any) => (
    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.03em', marginBottom: '6px', fontWeight: 500 }}>
      {children}
    </label>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="max-w-4xl w-full"
    >
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: '#e8e8f0', marginBottom: '4px' }}>Settings</h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Manage your profile, integrations, and preferences</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
          <CardHeader title="Profile" icon={User} iconBg="rgba(108,62,245,0.2)" iconColor="#8b6cf0" />
          <div style={{ padding: '18px' }}>
            <div className="grid grid-cols-2 gap-[14px]">
              <div>
                <Label>Display Name</Label>
                <input 
                  type="text" 
                  value={settings.displayName} 
                  onChange={e => updateSettings({ displayName: e.target.value })} 
                  className="input" 
                  placeholder="CyberLearner"
                />
              </div>
              <div>
                <Label>Email</Label>
                <input 
                  type="email" 
                  value={settings.email} 
                  onChange={e => updateSettings({ email: e.target.value })} 
                  className="input" 
                  placeholder="user@example.com"
                />
              </div>
            </div>
          </div>
          <SaveBar connected={true} hintText="Changes auto-save automatically" buttonText="Save profile" />
        </div>

        {/* HTB Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
          <CardHeader title="Hack The Box" icon={Shield} iconBg="rgba(16,185,129,0.15)" iconColor="#10b981" isIntegration={true} />
          <div style={{ padding: '18px' }}>
            <div className="grid grid-cols-2 gap-[14px]">
              <div>
                <Label>HTB Username</Label>
                <input 
                  type="text" 
                  value={settings.htbUsername || ''} 
                  onChange={e => updateSettings({ htbUsername: e.target.value })} 
                  className="input" 
                  placeholder="Your HTB username" 
                />
              </div>
              <div>
                <Label>HTB API Token</Label>
                <input 
                  type="password" 
                  value={settings.htbApiToken || ''} 
                  onChange={e => updateSettings({ htbApiToken: e.target.value })} 
                  className="input" 
                  placeholder="Bearer token from HTB settings" 
                />
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', marginTop: '6px' }}>Find your token at app.hackthebox.com/profile/settings</p>
              </div>
            </div>
          </div>
          <SaveBar 
            connected={!!settings.htbApiToken} 
            hintText={settings.htbApiToken ? "Connected to HTB API" : "Not connected to Hack The Box"} 
            buttonText="Connect HTB" 
          />
        </div>

        {/* GitHub Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
          <CardHeader title="GitHub Sync" icon={GitBranch} iconBg="rgba(59,130,246,0.15)" iconColor="#60a5fa" isIntegration={true} />
          <div style={{ padding: '18px' }}>
            <div className="grid grid-cols-2 gap-[14px]">
              <div>
                <Label>Repository</Label>
                <input 
                  type="text" 
                  value={settings.githubRepo || ''} 
                  onChange={e => updateSettings({ githubRepo: e.target.value })} 
                  className="input font-mono" 
                  placeholder="username/repo" 
                />
              </div>
              <div>
                <Label>Personal Access Token</Label>
                <input 
                  type="password" 
                  value={settings.githubToken || ''} 
                  onChange={e => updateSettings({ githubToken: e.target.value })} 
                  className="input font-mono" 
                  placeholder="ghp_..." 
                />
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', marginTop: '6px' }}>Generate at github.com/settings/tokens with repo scope</p>
              </div>
            </div>
          </div>
          <SaveBar 
            connected={!!settings.githubToken} 
            hintText={settings.githubToken ? "Sync active" : "Not connected"} 
            buttonText="Connect GitHub" 
          />
        </div>

        {/* Appearance Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
          <CardHeader title="Appearance" icon={Monitor} iconBg="rgba(245,158,11,0.15)" iconColor="#f59e0b" />
          <div style={{ padding: '18px' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#c8c8d8' }}>Dark mode</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Optimized for low-light</p>
              </div>
              <div 
                className="relative cursor-pointer transition-colors"
                style={{ width: '38px', height: '21px', borderRadius: '999px', backgroundColor: '#6c3ef5' }}
              >
                <div 
                  className="absolute bg-white rounded-full shadow-sm" 
                  style={{ width: '15px', height: '15px', right: '3px', top: '3px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} 
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
