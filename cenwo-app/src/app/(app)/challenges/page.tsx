'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Star, Clock, ArrowUpDown, Grid3X3, List, Monitor } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { getDifficultyColor, getOSIcon, formatDuration, formatDate } from '@/lib/utils';
import Link from 'next/link';
import type { Difficulty, Platform } from '@/types';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ChallengesPage() {
  const { challenges, toggleFavorite } = useAppStore();
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'difficulty'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let result = challenges;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    if (difficultyFilter !== 'All') {
      result = result.filter(c => c.difficulty === difficultyFilter);
    }
    if (platformFilter !== 'All') {
      result = result.filter(c => c.platform === platformFilter);
    }
    result = [...result].sort((a, b) => {
      if (sortBy === 'date') return new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      const order = { Easy: 1, Medium: 2, Hard: 3, Insane: 4 };
      return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
    });
    return result;
  }, [challenges, search, difficultyFilter, platformFilter, sortBy]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Challenges</h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            {challenges.length} challenges documented
          </p>
        </div>
        <Link
          href="/challenges/new"
          className="btn-primary w-fit"
        >
          <Plus className="w-4 h-4" />
          New Challenge
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'All')}
          className="input w-auto"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Insane">Insane</option>
        </select>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value as Platform | 'All')}
          className="input w-auto"
        >
          <option value="All">All Platforms</option>
          <option value="Hack The Box">Hack The Box</option>
          <option value="TryHackMe">TryHackMe</option>
          <option value="PortSwigger">PortSwigger</option>
          <option value="PicoCTF">PicoCTF</option>
          <option value="OverTheWire">OverTheWire</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'difficulty')}
          className="input w-auto"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="difficulty">Sort by Difficulty</option>
        </select>
        <div className="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Challenge Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Monitor className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-[var(--color-text-tertiary)]">No challenges found</p>
          <Link href="/challenges/new" className="btn-primary mt-4 inline-flex">
            <Plus className="w-4 h-4" /> Add your first challenge
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.map((challenge) => (
            <motion.div key={challenge.id} variants={item}>
              <Link href={`/challenges/${challenge.id}`} className="block">
                <div className="glass-card p-5 group cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getOSIcon(challenge.os)}</span>
                      <div>
                        <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-emerald-400 transition-colors">
                          {challenge.name}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)]">{challenge.platform}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); toggleFavorite(challenge.id); }}
                      className="p-1 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                      <Star className={`w-4 h-4 ${challenge.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-[var(--color-text-muted)]'}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="badge" style={{ background: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.15)' }}>
                      {challenge.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {challenge.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="px-2 py-0.5 text-[10px] rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] border border-[var(--color-border-subtle)]">
                        {skill}
                      </span>
                    ))}
                    {challenge.skills.length > 4 && (
                      <span className="px-2 py-0.5 text-[10px] rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
                        +{challenge.skills.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                      <Clock className="w-3 h-3" />
                      {formatDuration(challenge.timeSpentMinutes)}
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {formatDate(challenge.dateCompleted)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
          {filtered.map((challenge) => (
            <motion.div key={challenge.id} variants={item}>
              <Link href={`/challenges/${challenge.id}`}>
                <div className="glass-card p-4 flex items-center gap-4 group cursor-pointer">
                  <span className="text-xl">{getOSIcon(challenge.os)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[var(--color-text-primary)] group-hover:text-emerald-400 transition-colors">
                        {challenge.name}
                      </h3>
                      {challenge.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>{challenge.difficulty}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">{challenge.platform}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">·</span>
                      <span className="text-xs text-[var(--color-text-muted)]">{challenge.os}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(challenge.timeSpentMinutes)}</span>
                    <span>{formatDate(challenge.dateCompleted)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
