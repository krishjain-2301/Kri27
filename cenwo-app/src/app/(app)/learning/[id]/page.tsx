'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Brain, BookOpen, Shield, Terminal, Tag, Link as LinkIcon, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { getDifficultyColor } from '@/lib/utils';
import Link from 'next/link';

const fadeIn = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function LearningDetailPage() {
  const params = useParams();
  const { learningEntries } = useAppStore();
  const entry = learningEntries.find(e => e.id === params.id);

  if (!entry) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Topic not found</h2>
        <Link href="/learning" className="btn-primary">Back to Learning</Link>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeIn} className="mb-6">
        <Link href="/learning" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] hover:text-emerald-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Learning
        </Link>
      </motion.div>

      <motion.div variants={fadeIn} className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{entry.title}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`badge ${getDifficultyColor(entry.difficulty)}`}>{entry.difficulty}</span>
          <span className="text-sm text-[var(--color-text-muted)]">{entry.category}</span>
          {entry.owaspCategory && (
            <span className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
              {entry.owaspCategory}
            </span>
          )}
          {entry.needsRevision && <span className="badge badge-hard">Needs Review</span>}
        </div>
      </motion.div>

      {/* Confidence */}
      <motion.div variants={fadeIn} className="glass-card p-4 mb-6 flex items-center gap-4">
        <Brain className="w-5 h-5 text-emerald-400" />
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">Confidence Level</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`w-8 h-2 rounded-full ${i <= entry.confidenceLevel ? 'bg-emerald-400' : 'bg-[var(--color-bg-secondary)]'}`} />
              ))}
            </div>
            <span className="text-sm text-[var(--color-text-tertiary)]">{entry.confidenceLevel}/5</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeIn} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Summary</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{entry.summary}</p>
          </motion.div>

          {entry.detailedNotes && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Detailed Notes</h3>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.detailedNotes}</ReactMarkdown>
              </div>
            </motion.div>
          )}

          {entry.conceptExplanation && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Concept Explanation</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{entry.conceptExplanation}</p>
            </motion.div>
          )}

          {entry.examples && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Examples</h3>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.examples}</ReactMarkdown>
              </div>
            </motion.div>
          )}

          {entry.flashcards.length > 0 && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Flashcards</h3>
              <div className="space-y-3">
                {entry.flashcards.map((fc) => (
                  <details key={fc.id} className="group">
                    <summary className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] cursor-pointer text-sm text-[var(--color-text-primary)] hover:border-emerald-500/30 transition-colors">
                      <span className="ml-1">{fc.question}</span>
                    </summary>
                    <div className="mt-1 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-sm text-[var(--color-text-secondary)]">
                      {fc.answer}
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          {entry.tags.length > 0 && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" /> Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 text-xs rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">#{tag}</span>
                ))}
              </div>
            </motion.div>
          )}

          {entry.commands.length > 0 && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" /> Related Commands
              </h3>
              <div className="space-y-1.5">
                {entry.commands.map((cmd, i) => (
                  <div key={i} className="px-3 py-2 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border-subtle)] font-mono text-xs text-emerald-400">
                    {cmd}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {entry.mitreAttackTechniques.length > 0 && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-400" /> MITRE ATT&CK
              </h3>
              <div className="space-y-1.5">
                {entry.mitreAttackTechniques.map((t, i) => (
                  <div key={i} className="px-3 py-2 text-xs rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">{t}</div>
                ))}
              </div>
            </motion.div>
          )}

          {entry.resources.length > 0 && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-purple-400" /> Resources
              </h3>
              <div className="space-y-2">
                {entry.resources.map(r => (
                  <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors group">
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-400" />
                    <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-emerald-400 truncate">{r.title}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
