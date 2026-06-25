'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Swords, BookOpen, Terminal, Target, StickyNote, X } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { getDifficultyColor, getOSIcon } from '@/lib/utils';
import Link from 'next/link';

type ResultType = 'challenge' | 'learning' | 'command' | 'payload' | 'note';

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
}

export default function SearchPage() {
  const { challenges, learningEntries, commands, payloads, notes } = useAppStore();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ResultType | 'all'>('all');

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const all: SearchResult[] = [];

    challenges.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q)) ||
          c.skills.some(s => s.toLowerCase().includes(q)) || c.notes.toLowerCase().includes(q) ||
          c.enumeration.toLowerCase().includes(q)) {
        all.push({ id: c.id, type: 'challenge', title: c.name, subtitle: `${c.difficulty} · ${c.platform} · ${c.os}`, href: `/challenges/${c.id}`,
          icon: <span>{getOSIcon(c.os)}</span> });
      }
    });

    learningEntries.forEach(e => {
      if (e.title.toLowerCase().includes(q) || e.tags.some(t => t.toLowerCase().includes(q)) ||
          e.summary.toLowerCase().includes(q) || e.detailedNotes.toLowerCase().includes(q)) {
        all.push({ id: e.id, type: 'learning', title: e.title, subtitle: `${e.category} · ${e.difficulty}`, href: `/learning/${e.id}`,
          icon: <BookOpen className="w-4 h-4 text-cyan-400" /> });
      }
    });

    commands.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))) {
        all.push({ id: c.id, type: 'command', title: c.name, subtitle: c.description.slice(0, 60), href: '/commands',
          icon: <Terminal className="w-4 h-4 text-amber-400" /> });
      }
    });

    payloads.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)) {
        all.push({ id: p.id, type: 'payload', title: p.name, subtitle: `${p.category} · ${p.content.slice(0, 40)}`, href: '/payloads',
          icon: <Target className="w-4 h-4 text-rose-400" /> });
      }
    });

    notes.forEach(n => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
        all.push({ id: n.id, type: 'note', title: n.title, subtitle: n.folder, href: '/notes',
          icon: <StickyNote className="w-4 h-4 text-purple-400" /> });
      }
    });

    return all;
  }, [query, challenges, learningEntries, commands, payloads, notes]);

  const filtered = typeFilter === 'all' ? results : results.filter(r => r.type === typeFilter);
  const counts = useMemo(() => ({
    all: results.length,
    challenge: results.filter(r => r.type === 'challenge').length,
    learning: results.filter(r => r.type === 'learning').length,
    command: results.filter(r => r.type === 'command').length,
    payload: results.filter(r => r.type === 'payload').length,
    note: results.filter(r => r.type === 'note').length,
  }), [results]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Search</h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">Find anything across your knowledge base</p>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} autoFocus
          className="w-full px-12 py-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-lg text-[var(--color-text-primary)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          placeholder="Search challenges, commands, payloads, notes..." />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {query && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'challenge', 'learning', 'command', 'payload', 'note'] as const).map(type => (
              <button key={type} onClick={() => setTypeFilter(type)}
                className={`tab-item ${typeFilter === type ? 'active' : ''}`}>
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}s
                <span className="ml-1 text-[var(--color-text-muted)]">({counts[type]})</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map(result => (
              <Link key={`${result.type}-${result.id}`} href={result.href}>
                <div className="glass-card p-4 flex items-center gap-4 group cursor-pointer hover:border-emerald-500/20">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center flex-shrink-0">
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--color-text-primary)] group-hover:text-emerald-400 transition-colors">{result.title}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{result.subtitle}</p>
                  </div>
                  <span className="badge text-[10px]" style={{ background: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.15)' }}>
                    {result.type}
                  </span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
                <p className="text-[var(--color-text-tertiary)]">No results found for &ldquo;{query}&rdquo;</p>
              </div>
            )}
          </div>
        </>
      )}

      {!query && (
        <div className="text-center py-20">
          <SearchIcon className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
          <p className="text-[var(--color-text-tertiary)] text-lg">Start typing to search your knowledge base</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Search across challenges, learning, commands, payloads, and notes</p>
        </div>
      )}
    </motion.div>
  );
}
