'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, BookOpen, Swords } from 'lucide-react';

function SidebarNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');

  return (
    <div className="space-y-1 relative">
      <Link 
        href="/" 
        className={`sidebar-link w-full relative ${pathname === '/' ? 'active' : ''}`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </Link>
      <Link 
        href="/challenges" 
        className={`sidebar-link w-full ${pathname === '/challenges' ? 'active' : ''}`}
      >
        <Swords className="w-5 h-5" />
        <span>Challenges</span>
      </Link>
      <Link 
        href="/journals" 
        className={`sidebar-link w-full ${pathname === '/journals' && typeParam !== 'Daily' ? 'active' : ''}`}
      >
        <BookOpen className="w-5 h-5" />
        <span>Journals</span>
      </Link>
      <Link 
        href="/journals?type=Daily" 
        className={`sidebar-link w-full text-left ${pathname === '/journals' && typeParam === 'Daily' ? 'active' : ''}`}
      >
        <BookOpen className="w-5 h-5" />
        <span>Daily Notes</span>
      </Link>
    </div>
  );
}

export default function SidebarNav() {
  return (
    <Suspense fallback={<div className="p-4">Loading nav...</div>}>
      <SidebarNavContent />
    </Suspense>
  );
}
