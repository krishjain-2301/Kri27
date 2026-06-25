'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { generateId } from '@/lib/utils';
import Link from 'next/link';
import type { Challenge, Difficulty, OS, Platform, ChallengeCategory, ReviewStatus } from '@/types';

export default function NewChallengePage() {
  const router = useRouter();
  const { addChallenge, addActivity } = useAppStore();

  const [form, setForm] = useState({
    name: '',
    difficulty: 'Easy' as Difficulty,
    category: 'Machine' as ChallengeCategory,
    os: 'Linux' as OS,
    platform: 'Hack The Box' as Platform,
    dateCompleted: new Date().toISOString().split('T')[0],
    timeSpentMinutes: 60,
    enumeration: '',
    notes: '',
    mistakesMade: '',
    lessonsLearned: '',
    alternativeApproaches: '',
    externalUrl: '',
    reviewStatus: 'Not Started' as ReviewStatus,
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [commands, setCommands] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newCommand, setNewCommand] = useState('');
  const [newTag, setNewTag] = useState('');

  const addToList = (list: string[], setList: (v: string[]) => void, value: string, setValue: (v: string) => void) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setValue('');
    }
  };

  const removeFromList = (list: string[], setList: (v: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const id = generateId();
    const challenge: Challenge = {
      id,
      ...form,
      dateCompleted: new Date(form.dateCompleted).toISOString(),
      skills,
      tools,
      commands,
      tags,
      isFavorite: false,
      screenshots: [],
      relatedChallenges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addChallenge(challenge);
    addActivity({
      id: generateId(),
      activityType: 'challenge_completed',
      entityType: 'challenge',
      entityId: id,
      description: `Completed ${form.name} (${form.difficulty})`,
      durationMinutes: form.timeSpentMinutes,
      timestamp: new Date().toISOString(),
    });
    router.push(`/challenges/${id}`);
  };

  const TagInput = ({
    label, items, newItem, setNewItem, onAdd, onRemove, placeholder, color = 'emerald',
  }: {
    label: string; items: string[]; newItem: string; setNewItem: (v: string) => void;
    onAdd: () => void; onRemove: (i: number) => void; placeholder: string; color?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd(); } }}
          placeholder={placeholder}
          className="input flex-1"
        />
        <button type="button" onClick={onAdd} className="btn-secondary px-3">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
            {item}
            <button type="button" onClick={() => onRemove(i)} className="hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link href="/challenges" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] hover:text-emerald-400 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </Link>

      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">New Challenge</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Basic Info */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Challenge Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input" placeholder="e.g. Lame" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => setForm({...form, difficulty: e.target.value as Difficulty})} className="input">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Insane">Insane</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value as ChallengeCategory})} className="input">
                <option value="Machine">Machine</option>
                <option value="Challenge">Challenge</option>
                <option value="Sherlock">Sherlock</option>
                <option value="Fortress">Fortress</option>
                <option value="Endgame">Endgame</option>
                <option value="Pro Lab">Pro Lab</option>
                <option value="CTF">CTF</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Operating System</label>
              <select value={form.os} onChange={(e) => setForm({...form, os: e.target.value as OS})} className="input">
                <option value="Linux">Linux</option>
                <option value="Windows">Windows</option>
                <option value="macOS">macOS</option>
                <option value="FreeBSD">FreeBSD</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Platform</label>
              <select value={form.platform} onChange={(e) => setForm({...form, platform: e.target.value as Platform})} className="input">
                <option value="Hack The Box">Hack The Box</option>
                <option value="TryHackMe">TryHackMe</option>
                <option value="PortSwigger">PortSwigger</option>
                <option value="PicoCTF">PicoCTF</option>
                <option value="OverTheWire">OverTheWire</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Date Completed</label>
              <input type="date" value={form.dateCompleted} onChange={(e) => setForm({...form, dateCompleted: e.target.value})} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Time Spent (minutes)</label>
              <input type="number" value={form.timeSpentMinutes} onChange={(e) => setForm({...form, timeSpentMinutes: parseInt(e.target.value) || 0})} className="input" min="0" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">External URL</label>
              <input type="url" value={form.externalUrl} onChange={(e) => setForm({...form, externalUrl: e.target.value})} className="input" placeholder="https://app.hackthebox.com/machines/..." />
            </div>
          </div>
        </div>

        {/* Skills, Tools, Commands, Tags */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Skills & Tools</h2>
          <TagInput label="Skills" items={skills} newItem={newSkill} setNewItem={setNewSkill}
            onAdd={() => addToList(skills, setSkills, newSkill, setNewSkill)}
            onRemove={(i) => removeFromList(skills, setSkills, i)}
            placeholder="e.g. SMB, Nmap, Metasploit" />
          <TagInput label="Tools" items={tools} newItem={newTool} setNewItem={setNewTool}
            onAdd={() => addToList(tools, setTools, newTool, setNewTool)}
            onRemove={(i) => removeFromList(tools, setTools, i)}
            placeholder="e.g. nmap, gobuster, burpsuite" color="purple" />
          <TagInput label="Commands" items={commands} newItem={newCommand} setNewItem={setNewCommand}
            onAdd={() => addToList(commands, setCommands, newCommand, setNewCommand)}
            onRemove={(i) => removeFromList(commands, setCommands, i)}
            placeholder="e.g. nmap -sV -sC 10.10.10.1" color="amber" />
          <TagInput label="Tags" items={tags} newItem={newTag} setNewItem={setNewTag}
            onAdd={() => addToList(tags, setTags, newTag, setNewTag)}
            onRemove={(i) => removeFromList(tags, setTags, i)}
            placeholder="e.g. smb, cve, beginner" color="cyan" />
        </div>

        {/* Notes */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Documentation</h2>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Enumeration Process (Markdown)</label>
            <textarea value={form.enumeration} onChange={(e) => setForm({...form, enumeration: e.target.value})} className="textarea font-mono text-sm" rows={8} placeholder="Document your enumeration process here..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Personal Notes (Markdown)</label>
            <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="textarea font-mono text-sm" rows={5} placeholder="Your personal notes..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Mistakes Made</label>
              <textarea value={form.mistakesMade} onChange={(e) => setForm({...form, mistakesMade: e.target.value})} className="textarea" rows={3} placeholder="What went wrong?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Lessons Learned</label>
              <textarea value={form.lessonsLearned} onChange={(e) => setForm({...form, lessonsLearned: e.target.value})} className="textarea" rows={3} placeholder="What did you learn?" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Alternative Approaches</label>
            <textarea value={form.alternativeApproaches} onChange={(e) => setForm({...form, alternativeApproaches: e.target.value})} className="textarea" rows={3} placeholder="Other ways to solve this..." />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" /> Save Challenge
          </button>
          <Link href="/challenges" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </motion.div>
  );
}
