'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, Target, Clock, Calendar, Hash, Image as ImageIcon, Terminal, BookOpen } from 'lucide-react';

// Dynamically import the editor since it relies on browser APIs and can't be SSR'd
const CyberEditor = dynamic(() => import('@/components/CyberEditor'), { ssr: false });

export default function JournalPage({ params }: { params: { id: string } }) {
  // In reality, fetch this from local SQLite DB using params.id
  const htbItem = {
    title: 'Crocodile',
    type: 'Machine',
    difficulty: 'Easy',
    status: 'Root Owned',
    started: '26 June',
    completed: '26 June',
    time: '2h 14m'
  };

  const machineTemplate = `# Summary
---
# Enumeration
## Nmap
\`\`\`bash
\`\`\`
## Interesting Findings
---
# Exploitation
---
# Privilege Escalation
---
# Timeline
08:20 Started
---
# Mistakes
---
# Lessons Learned
---
# Commands Used
\`\`\`bash
\`\`\`
---
# References
---
# Screenshots
`;

  const [stats, setStats] = useState({
    words: 0,
    readTime: 1,
    codeBlocks: 0,
    images: 0,
    commands: 0
  });

  const handleAutoSave = (content: string) => {
    // Actually hit the local API to save to SQLite here
    // Autosaving happens silently in the background
  };

  return (
    <div className="max-w-5xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* METADATA HEADER */}
      <div className="mb-12 border-b border-[#1a1a20] pb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              {htbItem.type === 'Machine' ? <Target className="w-8 h-8 text-green-400" /> : <BookOpen className="w-8 h-8 text-blue-400" />}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1 flex items-center gap-3">
                {htbItem.type === 'Machine' ? '🐊' : ''} {htbItem.title}
              </h1>
              <p className="text-gray-500 font-mono text-sm">{htbItem.type} • {htbItem.difficulty}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="stakent-pill !px-3 !py-1 text-green-400 bg-green-500/10 border-green-500/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> {htbItem.status}
            </span>
          </div>
        </div>

        <div className="flex gap-12 text-sm">
          <div>
            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold block mb-1">Started</span>
            <span className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {htbItem.started}</span>
          </div>
          <div>
            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold block mb-1">Completed</span>
            <span className="font-semibold flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {htbItem.completed}</span>
          </div>
          <div>
            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold block mb-1">Time</span>
            <span className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {htbItem.time}</span>
          </div>
        </div>
      </div>

      {/* THE EDITOR */}
      <div className="mb-8">
        <CyberEditor 
          markdownTemplate={machineTemplate}
          onStatsChange={setStats} 
          onAutoSave={handleAutoSave} 
        />
      </div>

      {/* WRITING STATS FOOTER (Fixed to bottom) */}
      <div className="fixed bottom-0 left-[280px] right-0 bg-[#050507]/90 backdrop-blur-xl border-t border-[#1a1a20] p-4 flex items-center justify-center z-50">
        <div className="flex items-center gap-8 text-sm font-semibold">
          <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-gray-400" /> {stats.words} Words</span>
          <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {stats.readTime} min read</span>
          <span className="flex items-center gap-2"><Hash className="w-4 h-4 text-gray-400" /> {stats.codeBlocks} Code Blocks</span>
          <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-gray-400" /> {stats.images} Images</span>
          <span className="flex items-center gap-2"><Terminal className="w-4 h-4 text-gray-400" /> {stats.commands} Commands</span>
        </div>
      </div>

    </div>
  );
}

// Quick stub for CheckCircle
function CheckCircle(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
}
