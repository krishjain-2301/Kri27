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
  Target
} from "lucide-react";
import SidebarNav from "@/components/SidebarNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyberVault - Stakent Theme",
  description: "Advanced Cybersecurity OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
              <nav className="flex flex-col gap-2">
                <a href="/settings" className="sidebar-link w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </a>
              </nav>
              <div className="w-full flex items-center gap-3 p-3 rounded-2xl border border-green-500/20 bg-green-500/5 mt-4">
                <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs font-bold">●</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Local Vault</p>
                  <p className="text-xs text-green-500/70">Tracking Active</p>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            
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
