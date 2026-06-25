'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { StickyNote, Plus, Pin, Search, Edit2, Trash2, Save, X, Folder } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { generateId, formatRelativeTime } from '@/lib/utils';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newFolder, setNewFolder] = useState('General');

  const filtered = notes.filter(n => {
    if (!search) return true;
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q));
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const activeNote = notes.find(n => n.id === selectedNote);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const id = generateId();
    addNote({ id, title: newTitle, content: newContent, folder: newFolder, tags: [], isPinned: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setNewTitle(''); setNewContent(''); setShowNew(false); setSelectedNote(id);
  };

  const startEdit = () => {
    if (!activeNote) return;
    setEditTitle(activeNote.title);
    setEditContent(activeNote.content);
    setEditing(true);
  };

  const saveEdit = () => {
    if (!selectedNote) return;
    updateNote(selectedNote, { title: editTitle, content: editContent });
    setEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Notes</h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">{notes.length} notes</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary"><Plus className="w-4 h-4" /> New Note</button>
      </div>

      <div className="flex gap-6 h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filtered.map(note => (
              <button key={note.id} onClick={() => { setSelectedNote(note.id); setEditing(false); }}
                className={`w-full text-left p-3 rounded-lg transition-all ${selectedNote === note.id ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-[var(--color-bg-tertiary)] border border-transparent'}`}>
                <div className="flex items-center gap-2">
                  {note.isPinned && <Pin className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                  <h3 className={`text-sm font-medium truncate ${selectedNote === note.id ? 'text-emerald-400' : 'text-[var(--color-text-primary)]'}`}>
                    {note.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Folder className="w-3 h-3 text-[var(--color-text-muted)]" />
                  <span className="text-[10px] text-[var(--color-text-muted)]">{note.folder}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">·</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{formatRelativeTime(note.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 glass-card overflow-hidden flex flex-col">
          {showNew ? (
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">New Note</h2>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="input" placeholder="Note title..." />
              <input type="text" value={newFolder} onChange={e => setNewFolder(e.target.value)} className="input" placeholder="Folder..." />
              <textarea value={newContent} onChange={e => setNewContent(e.target.value)} className="textarea font-mono text-sm flex-1" rows={15} placeholder="Write in Markdown..." />
              <div className="flex gap-2">
                <button onClick={handleCreate} className="btn-primary"><Save className="w-4 h-4" /> Save</button>
                <button onClick={() => setShowNew(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          ) : activeNote ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                <div>
                  {editing ? (
                    <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="input py-1 text-lg font-semibold" />
                  ) : (
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{activeNote.title}</h2>
                  )}
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{activeNote.folder} · Updated {formatRelativeTime(activeNote.updatedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {editing ? (
                    <>
                      <button onClick={saveEdit} className="btn-primary py-1.5 px-3 text-xs"><Save className="w-3.5 h-3.5" /> Save</button>
                      <button onClick={() => setEditing(false)} className="btn-secondary py-1.5 px-3 text-xs">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => updateNote(activeNote.id, { isPinned: !activeNote.isPinned })} className={`btn-ghost p-2 ${activeNote.isPinned ? 'text-amber-400' : ''}`}>
                        <Pin className="w-4 h-4" />
                      </button>
                      <button onClick={startEdit} className="btn-ghost p-2"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => { deleteNote(activeNote.id); setSelectedNote(null); }} className="btn-ghost p-2 text-rose-400"><Trash2 className="w-4 h-4" /></button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {editing ? (
                  <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm text-[var(--color-text-secondary)]" />
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeNote.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <StickyNote className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
                <p className="text-[var(--color-text-tertiary)]">Select a note or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
