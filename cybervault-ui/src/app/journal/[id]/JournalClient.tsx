'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, Target, Clock, Calendar, Hash, Image as ImageIcon, Terminal, BookOpen, Save } from 'lucide-react';
import { autoSaveJournal } from '@/actions/journal';

// Dynamically import the editor since it relies on browser APIs and can't be SSR'd
const CyberEditor = dynamic(() => import('@/components/CyberEditor'), { ssr: false });

export default function JournalClient({ initialData, machineTemplate }: any) {
  const [stats, setStats] = useState({
    words: 0,
    readTime: 1,
    codeBlocks: 0,
    images: 0,
    commands: 0
  });

  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleAutoSave = async (content: string) => {
    try {
      const res = await autoSaveJournal(initialData.journal.id, content);
      if (res.success) {
        setSaveStatus(`Saved just now`);
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (e) {
      setSaveStatus('Error saving');
    }
  };

  const htbItem = initialData.machine;

  return (
    <div className="max-w-5xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Auto-Save Indicator */}
      {saveStatus && (
        <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center gap-2 text-xs font-bold text-gray-500 bg-[#0c0c0e] px-3 py-1.5 rounded-full border border-[#1a1a20]">
          <Save className="w-3 h-3" /> {saveStatus}
        </div>
      )}

      {/* METADATA HEADER */}
      <div className="mb-12 border-b border-[#1a1a20] pb-8 pt-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              {htbItem.type === 'Machine' ? <Target className="w-8 h-8 text-green-400" /> : <BookOpen className="w-8 h-8 text-blue-400" />}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1 flex items-center gap-3">
                {htbItem.type === 'Machine' ? '🐊' : ''} {htbItem.name}
              </h1>
              <p className="text-gray-500 font-mono text-sm">{htbItem.type} • {htbItem.difficulty}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={`stakent-pill !px-3 !py-1 flex items-center gap-2 ${
              htbItem.status === 'Completed' || htbItem.status === 'Root Owned' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
            }`}>
              <ShieldCheck className="w-4 h-4" /> {htbItem.status}
            </span>
          </div>
        </div>

        <div className="flex gap-12 text-sm">
          <div>
            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold block mb-1">Status</span>
            <span className="font-semibold flex items-center gap-2 text-white">{initialData.journal.journalStatus}</span>
          </div>
        </div>
      </div>

      {/* THE EDITOR */}
      <div className="mb-8">
        <CyberEditor 
          initialContent={initialData.journal.content || undefined}
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
