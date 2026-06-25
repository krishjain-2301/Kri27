'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Search, Plus, Copy, Check, Save, X } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { generateId } from '@/lib/utils';
import type { PayloadCategory } from '@/types';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const categoryColors: Record<string, string> = {
  SQLi: '#f59e0b', XSS: '#f43f5e', SSTI: '#8b5cf6', LFI: '#06b6d4', RFI: '#3b82f6',
  XXE: '#ec4899', SSRF: '#14b8a6', 'Command Injection': '#ef4444', JWT: '#a78bfa',
  LDAP: '#78716c', XML: '#64748b', 'Template Injection': '#c084fc', Other: '#94a3b8',
};

export default function PayloadsPage() {
  const { payloads, addPayload } = useAppStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PayloadCategory | 'All'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'SQLi' as PayloadCategory, content: '', explanation: '', whenToUse: '', risks: '', references: '' });

  const categories = useMemo(() => {
    const cats = new Set(payloads.map(p => p.category));
    return Array.from(cats);
  }, [payloads]);

  const filtered = payloads.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.content.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q))) return false;
    }
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    return true;
  });

  const copyToClipboard = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return;
    addPayload({ id: generateId(), ...form, relatedChallenges: [], tags: [form.category.toLowerCase()], createdAt: new Date().toISOString() });
    setForm({ name: '', category: 'SQLi', content: '', explanation: '', whenToUse: '', risks: '', references: '' });
    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Payload Vault</h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">{payloads.length} payloads stored</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary w-fit">
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Payload</>}
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleSubmit} className="glass-card p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="e.g. Basic Auth Bypass" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value as PayloadCategory})} className="input">
                {Object.keys(categoryColors).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Payload Content *</label>
            <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="textarea font-mono text-sm" rows={3} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Explanation</label>
            <textarea value={form.explanation} onChange={e => setForm({...form, explanation: e.target.value})} className="textarea" rows={2} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">When to Use</label>
              <textarea value={form.whenToUse} onChange={e => setForm({...form, whenToUse: e.target.value})} className="textarea" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Risks</label>
              <textarea value={form.risks} onChange={e => setForm({...form, risks: e.target.value})} className="textarea" rows={2} />
            </div>
          </div>
          <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Payload</button>
        </motion.form>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input type="text" placeholder="Search payloads..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCategoryFilter('All')} className={`tab-item ${categoryFilter === 'All' ? 'active' : ''}`}>All</button>
          {categories.map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)} className={`tab-item ${categoryFilter === c ? 'active' : ''}`}>{c}</button>
          ))}
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(payload => (
          <motion.div key={payload.id} variants={item} className="glass-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)]">{payload.name}</h3>
                <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 text-[10px] rounded-full font-medium"
                  style={{ background: `${categoryColors[payload.category]}15`, color: categoryColors[payload.category], border: `1px solid ${categoryColors[payload.category]}30` }}>
                  <Target className="w-3 h-3" />{payload.category}
                </span>
              </div>
              <button onClick={() => copyToClipboard(payload.id, payload.content)}
                className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-muted)] hover:text-emerald-400">
                {copiedId === payload.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="px-3 py-2 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border-subtle)] mb-3 overflow-x-auto">
              <code className="text-xs font-mono text-rose-400 whitespace-pre">{payload.content}</code>
            </div>
            {payload.explanation && <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">{payload.explanation}</p>}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
