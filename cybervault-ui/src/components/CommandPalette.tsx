'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { searchVault, SearchResult } from '@/actions/search';
import { Search, Terminal, BookOpen, FileText, Image as ImageIcon, RefreshCw, LayoutDashboard } from 'lucide-react';
import { triggerManualSync } from '@/actions/sync';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K or Ctrl+K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'q' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    const timeoutId = setTimeout(async () => {
      const res = await searchVault(query);
      setResults(res);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const onSelectResult = useCallback((item: SearchResult) => {
    setOpen(false);
    if (item.journalId) {
      router.push(`/journal/${item.journalId}`);
    }
  }, [router]);

  const commands = results.filter(r => r.type === 'Command');
  const journals = results.filter(r => r.type === 'Journal');
  const dailyNotes = results.filter(r => r.type === 'DailyNote');
  const screenshots = results.filter(r => r.type === 'Screenshot');

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <Command 
        shouldFilter={false}
        className="w-full max-w-2xl bg-[#0c0c0e] border border-[#1a1a20] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-[#1a1a20]">
        <Search className="w-5 h-5 text-gray-500 mr-3" />
        <Command.Input 
          value={query}
          onValueChange={setQuery}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg" 
          placeholder="Search Plethora or type a command..." 
        />
      </div>

      <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#1a1a20]">
        <Command.Empty className="py-10 text-center text-gray-500 text-sm">
          {loading ? 'Searching your vault...' : 'No results found.'}
        </Command.Empty>

        {!query && (
          <>
            <Command.Group heading={<div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase tracking-widest">Navigation</div>}>
              <Command.Item onSelect={() => { setOpen(false); router.push('/'); }} className="flex items-center px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-white/5 aria-selected:text-white text-gray-400 group transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-3" /> Go to Dashboard
              </Command.Item>
              <Command.Item onSelect={() => { setOpen(false); router.push('/journals'); }} className="flex items-center px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-white/5 aria-selected:text-white text-gray-400 group transition-colors">
                <BookOpen className="w-4 h-4 mr-3" /> Go to Journal Hub
              </Command.Item>
              <Command.Item onSelect={() => { setOpen(false); router.push('/journals?type=Daily'); }} className="flex items-center px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-white/5 aria-selected:text-white text-gray-400 group transition-colors">
                <FileText className="w-4 h-4 mr-3" /> Go to Daily Notes
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading={<div className="px-2 py-1 mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</div>}>
              <Command.Item onSelect={async () => { 
                setOpen(false); 
                const d = await fetch('/api/daily', { method: 'POST' }).then(r => r.json());
                router.push(`/journal/${d.id}`);
              }} className="flex items-center px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-white/5 aria-selected:text-white text-gray-400 group transition-colors">
                <FileText className="w-4 h-4 mr-3 text-green-400" /> Create New Daily Note
              </Command.Item>
              <Command.Item onSelect={async () => { 
                setOpen(false); 
                await triggerManualSync();
                window.location.reload();
              }} className="flex items-center px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-white/5 aria-selected:text-white text-gray-400 group transition-colors">
                <RefreshCw className="w-4 h-4 mr-3 text-purple-400" /> Sync with Hack The Box
              </Command.Item>
            </Command.Group>
          </>
        )}

        {journals.length > 0 && (
          <Command.Group heading={<div className="px-2 py-1 mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Journals</div>}>
            {journals.map((res) => (
              <Command.Item key={res.id} value={res.id} onSelect={() => onSelectResult(res)} className="flex items-center px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-white/5 aria-selected:text-white text-gray-400 group transition-colors">
                <BookOpen className="w-4 h-4 mr-3 flex-shrink-0 text-purple-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{res.title}</p>
                  {res.snippet && <p className="text-xs text-gray-500 truncate mt-0.5" dangerouslySetInnerHTML={{ __html: res.snippet }} />}
                </div>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        {dailyNotes.length > 0 && (
          <Command.Group heading={<div className="px-2 py-1 mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Daily Notes</div>}>
            {dailyNotes.map((res) => (
              <Command.Item key={res.id} value={res.id} onSelect={() => onSelectResult(res)} className="flex items-center px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-white/5 aria-selected:text-white text-gray-400 group transition-colors">
                <FileText className="w-4 h-4 mr-3 flex-shrink-0 text-green-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{res.title}</p>
                  {res.snippet && <p className="text-xs text-gray-500 truncate mt-0.5" dangerouslySetInnerHTML={{ __html: res.snippet }} />}
                </div>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        {commands.length > 0 && (
          <Command.Group heading={<div className="px-2 py-1 mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Commands</div>}>
            {commands.map((res) => (
              <Command.Item key={res.id} value={res.id} onSelect={() => onSelectResult(res)} className="flex items-center px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-white/5 aria-selected:text-white text-gray-400 group transition-colors">
                <Terminal className="w-4 h-4 mr-3 flex-shrink-0 text-orange-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-bold text-orange-200 truncate">{res.title}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{res.snippet}</p>
                </div>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        {screenshots.length > 0 && (
          <Command.Group heading={<div className="px-2 py-1 mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Screenshots</div>}>
            {screenshots.map((res) => (
              <Command.Item key={res.id} value={res.id} onSelect={() => onSelectResult(res)} className="flex items-center px-3 py-3 rounded-lg cursor-pointer aria-selected:bg-white/5 aria-selected:text-white text-gray-400 group transition-colors">
                <ImageIcon className="w-4 h-4 mr-3 flex-shrink-0 text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{res.title}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{res.snippet}</p>
                </div>
              </Command.Item>
            ))}
          </Command.Group>
        )}

      </Command.List>
      
      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#1a1a20] flex items-center justify-between text-[10px] text-gray-600 bg-[#050507]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><kbd className="bg-[#1a1a20] px-1.5 py-0.5 rounded border border-[#2a2a30]">↑</kbd> <kbd className="bg-[#1a1a20] px-1.5 py-0.5 rounded border border-[#2a2a30]">↓</kbd> to navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-[#1a1a20] px-1.5 py-0.5 rounded border border-[#2a2a30]">Enter</kbd> to select</span>
        </div>
        <span className="font-bold tracking-widest uppercase">Plethora</span>
      </div>
    </Command>
    </div>
  );
}
