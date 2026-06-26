'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, Target, Clock, Calendar, Hash, Image as ImageIcon, Terminal, BookOpen, Save, Star, AlertTriangle, Heart, History, Download, Copy, RefreshCcw } from 'lucide-react';
import { autoSaveJournal, updatePersonalMetadata, fetchJournalHistory } from '@/actions/journal';
import { formatDistanceToNow } from 'date-fns';

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

  const [metadata, setMetadata] = useState({
    perceivedDifficulty: initialData.journal.perceivedDifficulty || 0,
    personalConfidence: initialData.journal.personalConfidence || 0,
    needsReview: initialData.journal.needsReview === 1,
    isFavorite: initialData.journal.isFavorite === 1,
    mood: initialData.journal.mood || '',
    journalStatus: initialData.journal.journalStatus || 'Not Started'
  });

  const handleMetadataChange = async (key: string, value: any) => {
    const newMetadata = { ...metadata, [key]: value };
    setMetadata(newMetadata);
    try {
      await updatePersonalMetadata(initialData.journal.id, newMetadata);
    } catch (e) {
      console.error("Failed to save metadata", e);
    }
  };

  const [saveStatus, setSaveStatus] = useState<string>('');
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [snapshotToRestoreJson, setSnapshotToRestoreJson] = useState<string>();
  const [showHistory, setShowHistory] = useState(false);

  React.useEffect(() => {
    fetchJournalHistory(initialData.journal.id).then(setHistoryItems);
  }, [initialData.journal.id]);

  const handleAutoSave = async (contentJson: string, contentMarkdown: string, wordCount: number) => {
    try {
      const res = await autoSaveJournal(initialData.journal.id, contentJson, contentMarkdown, wordCount);
      if (res.success) {
        setSaveStatus(`Saved just now`);
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (e) {
      setSaveStatus('Error saving');
    }
  };

  const handleSnapshot = async (contentJson: string, contentMarkdown: string) => {
    try {
      const { createJournalHistorySnapshot } = await import('@/actions/journal');
      await createJournalHistorySnapshot(initialData.journal.id, contentJson, contentMarkdown);
      setSaveStatus('Snapshot saved');
      setTimeout(() => setSaveStatus(''), 3000);
      
      // Refresh history list
      fetchJournalHistory(initialData.journal.id).then(setHistoryItems);
    } catch (e) {
      console.error('Failed to create snapshot', e);
    }
  };

  const htbItem = initialData.machine || {
    type: 'Daily Note',
    title: initialData.journal.title || 'Daily Note',
    difficulty: 'N/A',
    status: initialData.journal.journalStatus || 'Not Started'
  };

  return (
    <div className="max-w-5xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      


      {/* METADATA HEADER */}
      <div className="mb-12 border-b border-[#1a1a20] pb-8 pt-6">
        <div className="flex items-start justify-between mb-8">
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
          
          <div className="flex flex-col items-end gap-8 pt-1">
            <div className="flex items-center gap-3">
              {saveStatus && (
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-[#0c0c0e] px-3 py-1.5 rounded-full border border-[#1a1a20] shadow-sm">
                  <Save className="w-3 h-3" /> {saveStatus}
                </div>
              )}
              <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 text-xs font-bold text-gray-300 bg-[#151518] hover:bg-[#22222a] transition px-3 py-1.5 rounded-full border border-[#2a2a35]">
                <History className="w-3 h-3" /> History
              </button>
              <button onClick={() => {
                  navigator.clipboard.writeText(initialData.journal.contentMarkdown || '');
                  setSaveStatus('Copied MD');
                  setTimeout(() => setSaveStatus(''), 3000);
                }} 
                className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition px-3 py-1.5 rounded-full border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                <Copy className="w-3 h-3" /> Copy Markdown
              </button>
              <button onClick={() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                  setSaveStatus('Saved manually!');
                  setTimeout(() => setSaveStatus(''), 3000);
                }} 
                className="flex items-center gap-2 text-xs font-bold text-green-400 bg-green-500/10 hover:bg-green-500/20 transition px-4 py-1.5 rounded-full border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <Save className="w-3 h-3" /> Save Journal
              </button>
            </div>
            <span className={`stakent-pill !px-3 !py-1 flex items-center gap-2 ${
              htbItem.status === 'Completed' || htbItem.status === 'Root Owned' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
            }`}>
              <ShieldCheck className="w-4 h-4" /> {htbItem.status}
            </span>
          </div>
        </div>

        <div className="flex gap-12 text-sm mt-8 border-t border-[#1a1a20] pt-6">
          <div>
            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold block mb-1">Status</span>
            <select 
              value={metadata.journalStatus}
              onChange={(e) => handleMetadataChange('journalStatus', e.target.value)}
              className="bg-transparent font-semibold text-white outline-none cursor-pointer border-b border-transparent hover:border-[#1a1a20] pb-1 -ml-1 pl-1"
            >
              <option value="Not Started" className="bg-[#0c0c0e]">Not Started</option>
              <option value="In Progress" className="bg-[#0c0c0e]">In Progress</option>
              <option value="Completed" className="bg-[#0c0c0e]">Completed</option>
            </select>
          </div>

          <div>
            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold block mb-2">Mood</span>
            <div className="flex gap-2">
              {['🤩', '😊', '😐', '😫', '🤬'].map(m => (
                <button key={m} onClick={() => handleMetadataChange('mood', m)} className={`text-xl hover:scale-110 transition ${metadata.mood === m ? 'scale-125 drop-shadow-lg opacity-100' : 'opacity-40 grayscale'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold block mb-2">Perceived Difficulty</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => handleMetadataChange('perceivedDifficulty', star)} className="hover:scale-110 transition">
                  <Star className={`w-5 h-5 ${star <= metadata.perceivedDifficulty ? 'fill-orange-400 text-orange-400' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-gray-500 uppercase tracking-wider text-xs font-bold block mb-2">Confidence</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => handleMetadataChange('personalConfidence', star)} className="hover:scale-110 transition">
                  <Star className={`w-5 h-5 ${star <= metadata.personalConfidence ? 'fill-blue-400 text-blue-400' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button onClick={() => handleMetadataChange('needsReview', !metadata.needsReview)} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition ${metadata.needsReview ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-transparent border-[#1a1a20] text-gray-500 hover:bg-white/5'}`}>
              <AlertTriangle className="w-4 h-4" /> Need Review
            </button>
            <button onClick={() => handleMetadataChange('isFavorite', !metadata.isFavorite)} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition ${metadata.isFavorite ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' : 'bg-transparent border-[#1a1a20] text-gray-500 hover:bg-white/5'}`}>
              <Heart className={`w-4 h-4 ${metadata.isFavorite ? 'fill-pink-400' : ''}`} /> Favorite
            </button>
          </div>
        </div>
      </div>

      {/* THE EDITOR */}
      <div className="mb-8 flex gap-8">
        <div className="flex-1">
          <CyberEditor 
            journalId={initialData.journal.id}
            initialContentJson={initialData.journal.contentJson || undefined}
            snapshotToRestoreJson={snapshotToRestoreJson}
            markdownTemplate={machineTemplate}
            onStatsChange={setStats} 
            onAutoSave={handleAutoSave}
            onSnapshot={handleSnapshot}
          />
        </div>

        {/* VERSION HISTORY SIDEBAR */}
        {showHistory && (
          <div className="w-64 bg-[#0c0c0e] border border-[#1a1a20] rounded-xl p-4 self-start sticky top-4 max-h-[80vh] overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-4 flex items-center gap-2">
              <History className="w-4 h-4" /> Version History
            </h3>
            <div className="space-y-3">
              {historyItems.map((snap) => (
                <div key={snap.id} className="p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition group">
                  <div className="text-xs text-gray-400 mb-2 font-mono">
                    {formatDistanceToNow(new Date(snap.createdAt))} ago
                  </div>
                  <button 
                    onClick={() => {
                      setSnapshotToRestoreJson(snap.contentJson);
                      setSaveStatus('Restored Snapshot');
                      setTimeout(() => setSaveStatus(''), 3000);
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition w-full"
                  >
                    <RefreshCcw className="w-3 h-3" /> Restore Version
                  </button>
                </div>
              ))}
              {historyItems.length === 0 && (
                <p className="text-xs text-gray-500 italic">No snapshots saved yet.</p>
              )}
            </div>
          </div>
        )}
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
