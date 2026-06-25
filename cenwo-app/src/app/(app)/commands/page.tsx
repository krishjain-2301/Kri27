'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Terminal, Search, Plus, Hash, ChevronDown, ChevronUp, Save, X } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { generateId } from '@/lib/utils';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function CommandsPage() {
  const { commands, addCommand } = useAppStore();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', examples: '', options: '' });
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const filtered = commands.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q));
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addCommand({
      id: generateId(), ...form, usedInChallenges: [], usedInLearning: [],
      tags: newTags, frequencyUsed: 0, createdAt: new Date().toISOString(),
    });
    setForm({ name: '', description: '', examples: '', options: '' });
    setNewTags([]);
    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Command Vault</h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">{commands.length} commands documented</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary w-fit">
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Command</>}
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleSubmit} className="glass-card p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Command Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input font-mono" placeholder="e.g. nmap" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Options</label>
              <input type="text" value={form.options} onChange={e => setForm({...form, options: e.target.value})} className="input" placeholder="-sV, -sC, -p-, ..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="textarea" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Examples (Markdown)</label>
            <textarea value={form.examples} onChange={e => setForm({...form, examples: e.target.value})} className="textarea font-mono text-sm" rows={5} />
          </div>
          <div className="flex gap-2 items-center">
            <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (tagInput.trim()) { setNewTags([...newTags, tagInput.trim()]); setTagInput(''); } } }}
              className="input flex-1" placeholder="Add tags..." />
            <div className="flex gap-1 flex-wrap">{newTags.map((t,i) => (
              <span key={i} className="px-2 py-1 text-xs rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                {t} <button type="button" onClick={() => setNewTags(newTags.filter((_,j) => j !== i))}><X className="w-3 h-3" /></button>
              </span>
            ))}</div>
          </div>
          <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Command</button>
        </motion.form>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
        <input type="text" placeholder="Search commands..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 max-w-md" />
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {filtered.map(cmd => (
          <motion.div key={cmd.id} variants={item} className="glass-card overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === cmd.id ? null : cmd.id)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--color-bg-card-hover)] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Terminal className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-semibold text-emerald-400">{cmd.name}</h3>
                  <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                    <Hash className="w-3 h-3" />{cmd.frequencyUsed}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-tertiary)] truncate">{cmd.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {cmd.tags.slice(0, 3).map(t => (
                  <span key={t} className="px-2 py-0.5 text-[10px] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hidden sm:inline">{t}</span>
                ))}
                {expandedId === cmd.id ? <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />}
              </div>
            </button>
            {expandedId === cmd.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-[var(--color-border)] p-5">
                {cmd.options && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1.5">Options</h4>
                    <p className="text-sm text-[var(--color-text-secondary)] font-mono">{cmd.options}</p>
                  </div>
                )}
                {cmd.examples && (
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1.5">Examples</h4>
                    <div className="markdown-content"><ReactMarkdown remarkPlugins={[remarkGfm]}>{cmd.examples}</ReactMarkdown></div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
