'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/stores/app-store';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Sidebar />
      <div className="flex-1 overflow-y-auto min-w-0 relative">
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
