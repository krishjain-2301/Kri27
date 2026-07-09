'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search, Target, Flag, BookOpen, FileText, Star,
  AlertTriangle, Clock, BarChart2, Image as ImageIcon,
  ChevronRight, Filter, SlidersHorizontal, Plus, Shield, Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { JournalHubEntry } from '@/lib/db/queries';

// ── helpers ────────────────────────────────────────────────────────────────

function getTypeIcon(journalType: string | null, itemType: string | null) {
  const t = journalType || itemType;
  if (t === 'Machine') return <Target className="w-4 h-4 text-purple-400" />;
  if (t === 'Challenge') return <Flag className="w-4 h-4 text-red-400" />;
  if (t === 'Sherlock') return <Shield className="w-4 h-4 text-blue-400" />;
  return <FileText className="w-4 h-4 text-gray-400" />;
}

function getTypeEmoji(journalType: string | null, itemType: string | null) {
  const t = journalType || itemType;
  if (t === 'Machine') return '🐧';
  if (t === 'Challenge') return '🚩';
  if (t === 'Sherlock') return '🕵️';
  return '📝';
}

function getTypeBadgeColor(journalType: string | null, itemType: string | null) {
  const t = journalType || itemType;
  if (t === 'Machine') return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
  if (t === 'Challenge') return 'text-red-400 bg-red-500/10 border-red-500/20';
  if (t === 'Sherlock') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
}

function getProgress(journalStatus: string | null, wordCount: number | null): number {
  if (journalStatus === 'Completed') return 100;
  if (!wordCount || wordCount === 0) return 0;
  // In Progress: rough estimate, cap at 90%
  return Math.min(90, Math.floor((wordCount / 600) * 60));
}

function getProgressColor(pct: number) {
  if (pct >= 100) return 'bg-green-400';
  if (pct >= 50) return 'bg-purple-400';
  return 'bg-gray-600';
}

// ── Progress Bar removed ──────────────────────────────────────────────────

// ── Journal Row ─────────────────────────────────────────────────────────────
function JournalRow({
  entry,
  onHover,
  onLeave,
  onDelete,
  isHovered,
}: {
  entry: JournalHubEntry;
  onHover: (e: JournalHubEntry) => void;
  onLeave: () => void;
  onDelete: (id: string) => void;
  isHovered: boolean;
}) {
  const pct = getProgress(entry.journalStatus, entry.wordCount);
  const type = entry.journalType || entry.itemType;

  return (
    <a
      href={`/journal/${entry.id}`}
      onMouseEnter={() => onHover(entry)}
      onMouseLeave={onLeave}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all group cursor-pointer ${
        isHovered
          ? 'bg-white/5 border-white/10'
          : 'border-transparent hover:bg-white/3 hover:border-white/5'
      }`}
    >
      {/* Type icon */}
      <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-[#0c0c0e] border border-[#1a1a20] flex items-center justify-center">
        {getTypeIcon(entry.journalType, entry.itemType)}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {entry.isFavorite === 1 && (
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
          )}
          {entry.needsReview === 1 && (
            <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
          )}
          <span className="font-semibold text-sm text-white truncate">
            {entry.title}
          </span>
        </div>
      </div>

      {/* Type badge */}
      <span
        className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${getTypeBadgeColor(
          entry.journalType,
          entry.itemType
        )}`}
      >
        {type || 'Daily'}
      </span>

      {/* Difficulty */}
      {entry.itemDifficulty && (
        <span className="hidden md:inline text-xs text-gray-500 flex-shrink-0 w-14 text-right">
          {entry.itemDifficulty}
        </span>
      )}

      {/* Mood */}
      <span className="text-base flex-shrink-0 w-6 text-center">
        {entry.mood || ''}
      </span>

      {/* Progress Removed */}

      {/* Word count */}
      <div className="hidden lg:flex items-center gap-1 text-xs text-gray-600 flex-shrink-0 w-20 justify-end">
        <BookOpen className="w-3 h-3" />
        {(entry.wordCount ?? 0).toLocaleString()}w
      </div>

      {/* Screenshots */}
      {entry.screenshotCount > 0 && (
        <div className="hidden lg:flex items-center gap-1 text-xs text-gray-600 flex-shrink-0 w-10 justify-end">
          <ImageIcon className="w-3 h-3" />
          {entry.screenshotCount}
        </div>
      )}

      {/* Time */}
      <span className="text-xs text-gray-600 flex-shrink-0 w-24 text-right">
        {formatDistanceToNow(new Date(entry.updatedAt), { addSuffix: true })}
      </span>

      {/* Delete Button */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(entry.id); }}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition flex-shrink-0" />
    </a>
  );
}

// ── Preview Panel ───────────────────────────────────────────────────────────
function PreviewPanel({ entry }: { entry: JournalHubEntry | null }) {
  if (!entry) {
    return (
      <div className="w-64 flex-shrink-0 hidden xl:block">
        <div className="sticky top-4 bg-[#0c0c0e] border border-[#1a1a20] rounded-2xl p-5 flex items-center justify-center h-64 text-center">
          <p className="text-gray-500 text-sm font-medium">Hover over a journal to see details</p>
        </div>
      </div>
    );
  }
  const pct = getProgress(entry.journalStatus, entry.wordCount);

  return (
    <div className="w-64 flex-shrink-0 hidden xl:block">
      <div className="sticky top-4 bg-[#0c0c0e] border border-[#1a1a20] rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
        {/* Type + emoji */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#050507] border border-[#1a1a20] flex items-center justify-center text-lg">
            {getTypeEmoji(entry.journalType, entry.itemType)}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-mono">
              {entry.journalType || entry.itemType || 'Daily'}
            </p>
            <p className="text-sm font-bold text-white truncate max-w-[160px]">
              {entry.title}
            </p>
          </div>
        </div>

        <div className="border-t border-[#1a1a20]" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Words</p>
            <p className="text-sm font-bold text-white">{(entry.wordCount ?? 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Screenshots</p>
            <p className="text-sm font-bold text-white">{entry.screenshotCount}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Status</p>
            <p className={`text-sm font-bold ${pct >= 100 ? 'text-green-400' : pct > 0 ? 'text-purple-400' : 'text-gray-500'}`}>
              {entry.journalStatus || 'Not Started'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Mood</p>
            <p className="text-lg">{entry.mood || '—'}</p>
          </div>
        </div>

        {/* Progress bar Removed */}

        {/* Difficulty */}
        {entry.itemDifficulty && (
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Difficulty</p>
            <p className={`text-sm font-bold ${
              entry.itemDifficulty === 'Easy' ? 'text-green-400' :
              entry.itemDifficulty === 'Medium' ? 'text-yellow-400' :
              entry.itemDifficulty === 'Hard' ? 'text-red-400' :
              'text-orange-400'
            }`}>{entry.itemDifficulty}</p>
          </div>
        )}

        {/* Last edited */}
        <p className="text-[10px] text-gray-600">
          Last edited {formatDistanceToNow(new Date(entry.updatedAt), { addSuffix: true })}
        </p>

        {/* Open button */}
        <a
          href={`/journal/${entry.id}`}
          className="w-full text-center text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 block transition"
        >
          Open Journal →
        </a>
      </div>
    </div>
  );
}

// ── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{label}</span>
      <span className="text-xs text-gray-700">({count})</span>
      <div className="flex-1 h-px bg-[#1a1a20]" />
    </div>
  );
}

import { useSearchParams } from 'next/navigation';

export default function JournalHubClient({ journals }: { journals: JournalHubEntry[] }) {
  const searchParams = useSearchParams();
  const isDailyNotesPage = searchParams.get('type') === 'Daily';

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [hoveredEntry, setHoveredEntry] = useState<JournalHubEntry | null>(null);

  // Keyboard shortcut: J to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire when typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        (document.getElementById('journal-search') as HTMLInputElement)?.focus();
      }
      if (e.key === 'Escape') {
        (document.getElementById('journal-search') as HTMLInputElement)?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = useMemo(() => {
    return journals.filter((j) => {
      const type = j.journalType || j.itemType || 'Daily';
      
      // Core isolation: Daily Notes page shows ONLY Daily notes. Journals page shows ONLY HTB items.
      if (isDailyNotesPage) {
        if (type !== 'Daily') return false;
      } else {
        if (type === 'Daily') return false;
      }

      if (typeFilter && type !== typeFilter) return false;
      if (statusFilter && j.journalStatus !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!j.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [journals, search, typeFilter, statusFilter, isDailyNotesPage]);

  const pinned = filtered.filter((j) => j.isFavorite === 1);
  const unpinned = filtered.filter((j) => j.isFavorite !== 1);
  const recent = unpinned.slice(0, 5);
  const older = unpinned.slice(5);

  const handleHover = useCallback((e: JournalHubEntry) => setHoveredEntry(e), []);
  const handleLeave = useCallback(() => setHoveredEntry(null), []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this journal? This cannot be undone.')) {
      const { deleteJournal } = await import('@/lib/db/queries');
      await deleteJournal(id);
      window.location.reload();
    }
  };

  const typeOptions = isDailyNotesPage ? [] : ['Machine', 'Challenge', 'Sherlock'];
  const statusOptions = ['Not Started', 'In Progress', 'Completed'];

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex items-end justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-400" />
            {isDailyNotesPage ? 'Daily Notes' : 'Journal Hub'}
          </h1>
          <p className="text-gray-500 text-sm">
            {filtered.length} {isDailyNotesPage ? 'note' : 'journal'}{filtered.length !== 1 ? 's' : ''} • Your complete {isDailyNotesPage ? 'daily note' : 'write-up'} history.
            <span className="ml-2 text-gray-700 font-mono text-xs">Press J to search</span>
          </p>
        </div>
        {isDailyNotesPage && (
          <button
            onClick={() => {
              import('@/lib/db/queries').then(({ createDailyNote }) =>
                createDailyNote().then(id => (window.location.href = `/journal/${id}`))
              );
            }}
            className="px-4 py-2 bg-[#0c0c0e] border border-[#1a1a20] hover:bg-white/5 hover:border-white/10 active:scale-95 transition-all cursor-pointer flex items-center gap-2 font-bold rounded-xl text-white"
          >
            <Plus className="w-4 h-4" /> Daily Note
          </button>
        )}
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            id="journal-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${isDailyNotesPage ? 'notes' : 'journals'}...`}
            className="w-full bg-[#0c0c0e] border border-[#1a1a20] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition"
          />
        </div>

        {/* Type filter */}
        {typeOptions.length > 0 && (
          <div className="flex items-center gap-1">
            {typeOptions.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                  typeFilter === t
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-transparent border-[#1a1a20] text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {typeOptions.length > 0 && <div className="w-px h-6 bg-[#1a1a20]" />}

        {/* Status filter */}
        <div className="flex items-center gap-1">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? null : s)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                statusFilter === s
                  ? 'bg-green-500/20 border-green-500/40 text-green-300'
                  : 'bg-transparent border-[#1a1a20] text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {(typeFilter || statusFilter || search) && (
          <button
            onClick={() => { setTypeFilter(null); setStatusFilter(null); setSearch(''); }}
            className="text-xs text-gray-500 hover:text-white transition"
          >
            × Clear
          </button>
        )}
      </div>

      {/* Main layout: list + preview */}
      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 min-w-0 space-y-1">

          {filtered.length === 0 && (
            <div className="text-center text-gray-600 py-20">
              <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p className="font-bold mb-1">No journals found.</p>
              <p className="text-sm">
                {search || typeFilter || statusFilter
                  ? 'Try clearing your filters.'
                  : 'Complete a machine or challenge on HTB to get started.'}
              </p>
            </div>
          )}

          {/* Pinned */}
          {pinned.length > 0 && (
            <div className="mb-4">
              <SectionHeader label="⭐ Pinned" count={pinned.length} />
              {pinned.map((j) => (
                <JournalRow
                  key={j.id}
                  entry={j}
                  onHover={handleHover}
                  onLeave={handleLeave}
                  onDelete={handleDelete}
                  isHovered={hoveredEntry?.id === j.id}
                />
              ))}
            </div>
          )}

          {/* Recent */}
          {recent.length > 0 && (
            <div className="mb-4">
              <SectionHeader label="Recent" count={recent.length} />
              {recent.map((j) => (
                <JournalRow
                  key={j.id}
                  entry={j}
                  onHover={handleHover}
                  onLeave={handleLeave}
                  onDelete={handleDelete}
                  isHovered={hoveredEntry?.id === j.id}
                />
              ))}
            </div>
          )}

          {/* Older */}
          {older.length > 0 && (
            <div>
              <SectionHeader label="All Journals" count={older.length} />
              {older.map((j) => (
                <JournalRow
                  key={j.id}
                  entry={j}
                  onHover={handleHover}
                  onLeave={handleLeave}
                  onDelete={handleDelete}
                  isHovered={hoveredEntry?.id === j.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Preview panel */}
        <PreviewPanel entry={hoveredEntry} />
      </div>
    </div>
  );
}
