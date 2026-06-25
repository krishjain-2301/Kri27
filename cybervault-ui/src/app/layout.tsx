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
  ChevronDown
} from "lucide-react";

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
              <div className="mb-6 flex gap-2 p-1 bg-[#0c0c0e] rounded-2xl border border-[#1a1a20]">
                <button className="flex-1 py-1.5 px-3 bg-[#1a1a20] rounded-xl text-sm font-semibold text-white">Vault</button>
                <button className="flex-1 py-1.5 px-3 text-gray-400 rounded-xl text-sm font-semibold hover:text-white transition">Academy</button>
              </div>

              <div className="space-y-1 relative">
                <a href="/" className="sidebar-link active w-full relative">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </a>
                <a href="/targets" className="sidebar-link w-full">
                  <Swords className="w-5 h-5" />
                  <span>Targets</span>
                </a>
                <a href="/knowledge" className="sidebar-link w-full">
                  <BookOpen className="w-5 h-5" />
                  <span>Knowledge Base</span>
                </a>
                <a href="/payloads" className="sidebar-link w-full">
                  <Terminal className="w-5 h-5" />
                  <span>Payloads</span>
                </a>
                
                <div className="mt-8 mb-2 px-4 text-xs font-bold text-[#555] uppercase tracking-wider">Analytics</div>
                <button className="sidebar-link w-full justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5" />
                    <span>Active Sessions</span>
                  </div>
                  <span className="bg-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-bold">6</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-[#1a1a20]">
              <button className="w-full flex items-center gap-3 p-3 rounded-2xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition">
                <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs font-bold">●</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">HTB VPN</p>
                  <p className="text-xs text-green-500/70">Connected (US-EAST)</p>
                </div>
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            
            {/* TOP BAR */}
            <header className="h-[80px] flex items-center justify-between px-8 border-b border-[#1a1a20] flex-shrink-0">
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-[#1a1a20] bg-[#0c0c0e]">
                  <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                    <img src="https://github.com/shadcn.png" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-semibold text-gray-300">@rakazaka <span className="bg-[#1a1a20] text-xs px-1.5 py-0.5 rounded ml-1 text-gray-500">PRO</span></span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
                
                <button className="stakent-btn-primary flex items-center gap-2 py-2 px-4 rounded-full">
                  Spawn Machine <span className="text-xs opacity-60">☁️</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full border border-[#1a1a20] bg-[#0c0c0e] flex items-center justify-center relative">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#0c0c0e]"></span>
                </button>
                
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1a1a20] bg-[#0c0c0e]">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-transparent border-none outline-none text-sm text-gray-300 w-32 placeholder-gray-600"
                  />
                  <span className="text-xs text-gray-600 border border-[#222] rounded px-1.5">⌘K</span>
                </div>

                <button className="w-10 h-10 rounded-full border border-[#1a1a20] bg-[#0c0c0e] flex items-center justify-center">
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>
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
