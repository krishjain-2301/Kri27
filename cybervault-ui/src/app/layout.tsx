import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Settings } from "lucide-react";
import SidebarNav from "@/components/SidebarNav";
import { CommandPalette } from "@/components/CommandPalette";
import NavHeader from "@/components/NavHeader";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plethora — HTB Journal",
  description: "The cybersecurity hacking journal for Hack The Box players. Track machines, challenges, and write up your notes.",
  openGraph: {
    title: "Plethora — HTB Journal",
    description: "Track your Hack The Box progress and write up your hacking notes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2488921740038119"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${inter.className} bg-[#050507] text-white overflow-hidden`}>
        <div className="flex h-screen w-full">
          
          {/* SIDEBAR */}
          <aside className="w-[280px] flex-shrink-0 border-r border-[#1a1a20] flex flex-col h-full bg-[#050507]">
            {/* Logo area */}
            <div className="h-[80px] flex items-center px-6 border-b border-[#1a1a20]">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Plethora Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-lg tracking-wide">Plethora</span>
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
            
            {/* TOP NAVBAR — client component that reads from IndexedDB */}
            <NavHeader />

            {/* SCROLLABLE PAGE CONTENT */}
            <main className="flex-1 overflow-y-auto p-8 relative">
              {children}
            </main>

          </div>
        </div>
        <CommandPalette />
      </body>
    </html>
  );
}
