'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, BookOpen, Brain } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { getDifficultyColor, formatDate } from '@/lib/utils';
import Link from 'next/link';
import type { Difficulty } from '@/types';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function LearningPage() {
  const { learningEntries } = useAppStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');

  const categories = useMemo(() => {
    const cats = new Set(learningEntries.map(e => e.category));
    return ['All', ...Array.from(cats)];
  }, [learningEntries]);

  const filtered = useMemo(() => {
    let result = learningEntries;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q)) ||
        e.summary.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'All') result = result.filter(e => e.category === categoryFilter);
    if (difficultyFilter !== 'All') result = result.filter(e => e.difficulty === difficultyFilter);
    return result;
  }, [learningEntries, search, categoryFilter, difficultyFilter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Learning</h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">{learningEntries.length} topics documented</p>
        </div>
        <Link href="/learning/new" className="btn-primary w-fit"><Plus className="w-4 h-4" /> New Topic</Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input type="text" placeholder="Search topics..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input w-auto">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'All')} className="input w-auto">
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Insane">Insane</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-[var(--color-text-tertiary)]">No learning entries found</p>
          <Link href="/learning/new" className="btn-primary mt-4 inline-flex"><Plus className="w-4 h-4" /> Add your first topic</Link>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((entry) => (
            <motion.div key={entry.id} variants={item}>
              <Link href={`/learning/${entry.id}`} className="block">
                <div className="glass-card p-5 group cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-emerald-400 transition-colors">{entry.title}</h3>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{entry.category}</p>
                    </div>
                    {entry.needsRevision && (
                      <span className="badge badge-hard text-[10px]">Needs Review</span>
                    )}
                  </div>

                  <p className="text-sm text-[var(--color-text-tertiary)] line-clamp-2 mb-3 flex-1">{entry.summary}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${getDifficultyColor(entry.difficulty)}`}>{entry.difficulty}</span>
                    {entry.owaspCategory && (
                      <span className="px-2 py-0.5 text-[10px] rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {entry.owaspCategory.split(' - ')[1] || entry.owaspCategory}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      <div className="flex gap-0.5 ml-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-1.5 h-3 rounded-full ${i <= entry.confidenceLevel ? 'bg-emerald-400' : 'bg-[var(--color-bg-secondary)]'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 text-[9px] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
                          {tag}
                        </span>
                      ))}
                    </div>
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
