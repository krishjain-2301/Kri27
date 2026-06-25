'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Swords,
  GraduationCap,
  BookOpen,
  Terminal,
  Target,
  StickyNote,
  Search,
  BarChart3,
  Trophy,
  GitBranch,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Command,
  Nfc // Mocking the Notion N icon using an N icon from lucide
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const navSections = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Learning', href: '/learning', icon: GraduationCap },
      { label: 'Challenges', href: '/challenges', icon: Swords },
    ]
  },
  {
    label: 'Tools',
    items: [
      { label: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
      { label: 'Commands', href: '/commands', icon: Terminal },
      { label: 'Payloads', href: '/payloads', icon: Target },
      { label: 'Notes', href: '/notes', icon: StickyNote },
      { label: 'Search', href: '/search', icon: Search },
    ]
  },
  {
    label: 'Account',
    items: [
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { label: 'Achievements', href: '/achievements', icon: Trophy },
      { label: 'GitHub Sync', href: '/github-sync', icon: GitBranch },
      { label: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Brand Block */}
      <div className="h-16 flex items-center px-4 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
        <div 
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #8b6cf0, #6c3ef5)', borderRadius: '8px' }}
        >
          <Terminal className="w-4 h-4 text-white" />
        </div>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 flex flex-col"
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#e8e8f0', letterSpacing: '-0.01em' }}>CyberVault</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-6 px-3">
          {navSections.map((section, idx) => (
            <div key={idx} className="flex flex-col space-y-1">
              {!sidebarCollapsed && (
                <span 
                  className="px-2 pb-1"
                  style={{ 
                    fontSize: '9px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.08em', 
                    color: 'rgba(255,255,255,0.25)',
                    fontWeight: 600
                  }}
                >
                  {section.label}
                </span>
              )}
              
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="group relative flex items-center gap-2.5 transition-colors"
                      style={{
                        padding: '7px 10px',
                        borderRadius: '7px',
                        backgroundColor: isActive ? 'rgba(108,62,245,0.15)' : 'transparent',
                        color: isActive ? '#b89cff' : 'rgba(255,255,255,0.45)',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                        }
                      }}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-[3px] top-1/2 -translate-y-1/2 rounded-full"
                          style={{ width: '5px', height: '5px', backgroundColor: '#6c3ef5' }}
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      
                      <div className="flex items-center justify-center w-4 h-4">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                      </div>
                      
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                      
                      {/* Keyboard shortcut hint for Search */}
                      {item.href === '/search' && !sidebarCollapsed && (
                        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <kbd style={{ fontSize: '9px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 4px', borderRadius: '4px', color: 'rgba(255,255,255,0.4)' }} className="flex items-center font-mono">
                            <Command className="w-2.5 h-2.5 inline mr-0.5" /> K
                          </kbd>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer Area: Notion Icon & Collapse */}
      <div className="flex flex-col flex-shrink-0 border-t border-[rgba(255,255,255,0.06)]">
        <div className="px-3 py-3 flex items-center justify-between">
          <div 
            className="flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors rounded-md relative"
            style={{ width: '28px', height: '28px', color: 'rgba(255,255,255,0.45)' }}
            title="Notion Workspace"
          >
            <div className="w-6 h-6 rounded bg-[#eb5757] flex items-center justify-center text-white font-bold text-xs" style={{fontFamily: 'serif'}}>
              N
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white border border-[#0d0d14] rounded-full" />
          </div>
          
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center p-1.5 rounded-md transition-colors"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
            }}
            title="Collapse Sidebar"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-md border text-gray-400"
        style={{ backgroundColor: '#0d0d14', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          relative flex-shrink-0 flex flex-col h-full
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'}
          hidden lg:flex
        `}
        style={{ backgroundColor: '#0d0d14', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-[240px] flex flex-col lg:hidden"
            style={{ backgroundColor: '#0d0d14', borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
