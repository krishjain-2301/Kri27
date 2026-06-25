'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { generateId } from '@/lib/utils';
import Link from 'next/link';
import type { Difficulty, LearningEntry } from '@/types';

export default function NewLearningPage() {
  const router = useRouter();
  const { addLearningEntry, addActivity } = useAppStore();
  const [form, setForm] = useState({
    title: '', category: 'Web Security', difficulty: 'Medium' as Difficulty,
    summary: '', detailedNotes: '', conceptExplanation: '', examples: '',
    realWorldApplications: '', owaspCategory: '', confidenceLevel: 3,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [commands, setCommands] = useState<string[]>([]);
  const [mitreAttack, setMitreAttack] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newCmd, setNewCmd] = useState('');
  const [newMitre, setNewMitre] = useState('');

  const addItem = (list: string[], setList: (v: string[]) => void, val: string, setVal: (v: string) => void) => {
    const t = val.trim();
    if (t && !list.includes(t)) { setList([...list, t]); setVal(''); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const id = generateId();
    const entry: LearningEntry = {
      id, ...form, commands, tags, mitreAttackTechniques: mitreAttack,
      payloads: [], relatedChallenges: [], relatedCVEs: [],
      needsRevision: form.confidenceLevel < 3,
      flashcards: [], resources: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    addLearningEntry(entry);
    addActivity({ id: generateId(), activityType: 'learning_added', entityType: 'learning', entityId: id,
      description: `Added ${form.title} notes`, timestamp: new Date().toISOString() });
    router.push(`/learning/${id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Link href="/learning" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] hover:text-emerald-400 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Learning
      </Link>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">New Learning Topic</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Topic Title *</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" placeholder="e.g. SQL Injection" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
                <option>Web Security</option><option>Network Security</option><option>Privilege Escalation</option>
                <option>Cryptography</option><option>Forensics</option><option>Reverse Engineering</option>
                <option>Active Directory</option><option>Cloud Security</option><option>Mobile Security</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value as Difficulty})} className="input">
                <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option><option value="Insane">Insane</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">OWASP Category</label>
              <input type="text" value={form.owaspCategory} onChange={e => setForm({...form, owaspCategory: e.target.value})} className="input" placeholder="e.g. A03:2021 - Injection" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Confidence Level</label>
              <div className="flex items-center gap-3">
                <input type="range" min={1} max={5} value={form.confidenceLevel} onChange={e => setForm({...form, confidenceLevel: parseInt(e.target.value)})}
                  className="flex-1 accent-emerald-500" />
                <span className="text-sm font-mono text-emerald-400 w-6 text-center">{form.confidenceLevel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Content</h2>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Summary</label>
            <textarea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} className="textarea" rows={2} placeholder="Brief summary of this topic..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Detailed Notes (Markdown)</label>
            <textarea value={form.detailedNotes} onChange={e => setForm({...form, detailedNotes: e.target.value})} className="textarea font-mono text-sm" rows={10} placeholder="Write detailed notes in Markdown..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Concept Explanation</label>
            <textarea value={form.conceptExplanation} onChange={e => setForm({...form, conceptExplanation: e.target.value})} className="textarea" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Examples (Markdown)</label>
            <textarea value={form.examples} onChange={e => setForm({...form, examples: e.target.value})} className="textarea font-mono text-sm" rows={5} />
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Tags & References</h2>
          {[
            { label: 'Tags', items: tags, val: newTag, setVal: setNewTag, set: setTags, ph: 'e.g. sqli, web, injection' },
            { label: 'Commands', items: commands, val: newCmd, setVal: setNewCmd, set: setCommands, ph: 'e.g. sqlmap, burpsuite' },
            { label: 'MITRE ATT&CK', items: mitreAttack, val: newMitre, setVal: setNewMitre, set: setMitreAttack, ph: 'e.g. T1190 - Exploit Public-Facing Application' },
          ].map(({ label, items, val, setVal, set, ph }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">{label}</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={val} onChange={e => setVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(items, set, val, setVal); } }}
                  className="input flex-1" placeholder={ph} />
                <button type="button" onClick={() => addItem(items, set, val, setVal)} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {t} <button type="button" onClick={() => set(items.filter((_, j) => j !== i))}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Topic</button>
          <Link href="/learning" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </motion.div>
  );
}
