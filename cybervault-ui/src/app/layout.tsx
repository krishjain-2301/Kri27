import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  LayoutDashboard,
  Swords,
  BookOpen,
  Terminal,
  Activity,
  Database,
  Search,
  Bell,
  Settings,
  ChevronDown,
  Target,
  User
} from "lucide-react";
import SidebarNav from "@/components/SidebarNav";
import SyncManager from "@/components/SyncManager";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyberVault - Stakent Theme",
  description: "Advanced Cybersecurity OS",
};

import { db } from '@/lib/db/client';
import { settings, syncHistory } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSettings = await db.select().from(settings).limit(1);
  const latestSync = await db.select().from(syncHistory).orderBy(desc(syncHistory.createdAt)).limit(1);

  const isConnected = userSettings.length > 0 && userSettings[0].htbAppToken;
  const username = userSettings[0]?.htbUsername || '';
  const autoSync = userSettings[0]?.autoSync === 1 || userSettings[0]?.autoSync === true;
  const syncIntervalStr = userSettings[0]?.syncInterval || '15 min';
  
  let syncText = 'Never synced';
  if (latestSync.length > 0 && latestSync[0].createdAt) {
    // SQLite timestamps might need parsing
    syncText = `Synced ${formatDistanceToNow(new Date(latestSync[0].createdAt), { addSuffix: true })}`;
  }
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#050507] text-white overflow-hidden`}>
        <div className="flex h-screen w-full">
          
          {/* SIDEBAR */}
          <aside className="w-[280px] flex-shrink-0 border-r border-[#1a1a20] flex flex-col h-full bg-[#050507]">
            {/* Logo area */}
            <div className="h-[80px] flex items-center px-6 border-b border-[#1a1a20]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-purple-400 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-wide">CyberVault<sup className="text-gray-500 text-xs ml-1">®</sup></span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="p-4 flex-1 overflow-y-auto">
              <SidebarNav />
            </div>

            <div className="p-4 border-t border-[#1a1a20]">
              <a href="/settings" className="sidebar-link w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            
            {/* TOP NAVBAR */}
            <header className="h-[80px] flex items-center justify-end px-8 border-b border-[#1a1a20]">
              {isConnected ? (
                <div className="flex items-center gap-4 text-sm bg-[#0c0c0e] border border-[#1a1a20] px-4 py-2 rounded-xl">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <User className="w-4 h-4 text-green-400" /> {username}
                  </div>
                  <div className="w-px h-4 bg-[#1a1a20]"></div>
                  <SyncManager initialSyncText={syncText} autoSync={autoSync} syncIntervalStr={syncIntervalStr} />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-[#0c0c0e] border border-[#1a1a20] px-4 py-2 rounded-xl">
                  <User className="w-4 h-4" /> Not Connected
                </div>
              )}
            </header>

            {/* SCROLLABLE PAGE CONTENT */}
            <main className="flex-1 overflow-y-auto p-8 relative">
              {children}
            </main>

          </div>
        </div>
      </body>
    </html>
  );
}
