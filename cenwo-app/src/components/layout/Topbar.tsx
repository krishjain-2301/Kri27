'use client';

import React from 'react';
import { Search, Bell, User, Command } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export default function Topbar() {
  const { settings, setSearchOpen } = useAppStore();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 backdrop-blur-xl">
      {/* Search */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-tertiary)] transition-all duration-200 w-full max-w-md"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search everything...</span>
        <div className="ml-auto flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded text-[var(--color-text-muted)]">
            <Command className="w-3 h-3 inline" />
          </kbd>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded text-[var(--color-text-muted)]">
            K
          </kbd>
        </div>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-all duration-200">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
            {settings.displayName?.charAt(0) || <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{settings.displayName}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
