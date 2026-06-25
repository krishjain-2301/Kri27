'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Swords } from 'lucide-react';

export default function SidebarNav() {
  const pathname = usePathname();

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
    </div>
  );
}
