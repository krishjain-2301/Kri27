'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft, Star, Clock, Calendar, ExternalLink, Terminal,
  AlertTriangle, Lightbulb, GitFork, Tag, Edit, Trash2,
  Monitor, Shield, Wrench,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { getDifficultyColor, getOSIcon, formatDuration, formatDate } from '@/lib/utils';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { challenges, toggleFavorite, deleteChallenge } = useAppStore();

  const challenge = challenges.find(c => c.id === params.id);

  if (!challenge) {
    return (
      <div className="text-center py-20">
        <Shield className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Challenge not found</h2>
        <p className="text-[var(--color-text-tertiary)] mb-4">This challenge may have been deleted.</p>
        <Link href="/challenges" className="btn-primary">Back to Challenges</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${challenge.name}"? This cannot be undone.`)) {
      deleteChallenge(challenge.id);
      router.push('/challenges');
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      {/* Back Navigation */}
      <motion.div variants={fadeIn} className="mb-6">
        <Link href="/challenges" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] hover:text-emerald-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Challenges
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeIn} className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{getOSIcon(challenge.os)}</div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{challenge.name}</h1>
              <button onClick={() => toggleFavorite(challenge.id)} className="p-1 rounded-lg hover:bg-[var(--color-bg-tertiary)]">
                <Star className={`w-5 h-5 ${challenge.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-[var(--color-text-muted)]'}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>{challenge.difficulty}</span>
              <span className="badge" style={{ background: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.15)' }}>
                {challenge.category}
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">{challenge.platform}</span>
              <span className="text-sm text-[var(--color-text-muted)]">·</span>
              <span className="text-sm text-[var(--color-text-muted)]">{challenge.os}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/challenges/${challenge.id}/edit`} className="btn-secondary">
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button onClick={handleDelete} className="btn-ghost text-rose-400 hover:bg-rose-500/10">
            <Trash2 className="w-4 h-4" />
          </button>
          {challenge.externalUrl && (
            <a href={challenge.externalUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <ExternalLink className="w-4 h-4" /> View on {challenge.platform}
            </a>
          )}
        </div>
      </motion.div>

      {/* Meta info cards */}
      <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card flex items-center gap-3">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Completed</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{formatDate(challenge.dateCompleted)}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Time Spent</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{formatDuration(challenge.timeSpentMinutes)}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Review Status</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{challenge.reviewStatus}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <Wrench className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Tools Used</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{challenge.tools.length} tools</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills & Tags */}
          <motion.div variants={fadeIn} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-400" /> Skills & Tags
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {challenge.skills.map(skill => (
                <span key={skill} className="px-3 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {challenge.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-[10px] rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] border border-[var(--color-border-subtle)]">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Enumeration */}
          {challenge.enumeration && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-emerald-400" /> Enumeration Process
              </h3>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{challenge.enumeration}</ReactMarkdown>
              </div>
            </motion.div>
          )}

          {/* Notes */}
          {challenge.notes && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">📝 Personal Notes</h3>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{challenge.notes}</ReactMarkdown>
              </div>
            </motion.div>
          )}

          {/* Mistakes & Lessons */}
          <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenge.mistakesMade && (
              <div className="glass-card p-5 border-l-2 border-l-rose-500">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Mistakes Made
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{challenge.mistakesMade}</p>
              </div>
            )}
            {challenge.lessonsLearned && (
              <div className="glass-card p-5 border-l-2 border-l-emerald-500">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400" /> Lessons Learned
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{challenge.lessonsLearned}</p>
              </div>
            )}
          </motion.div>

          {/* Alternative Approaches */}
          {challenge.alternativeApproaches && (
            <motion.div variants={fadeIn} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                <GitFork className="w-4 h-4 text-purple-400" /> Alternative Approaches
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{challenge.alternativeApproaches}</p>
            </motion.div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Commands */}
          <motion.div variants={fadeIn} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" /> Commands Used
            </h3>
            <div className="space-y-1.5">
              {challenge.commands.map((cmd, i) => (
                <div key={i} className="px-3 py-2 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border-subtle)] font-mono text-xs text-emerald-400 overflow-x-auto">
                  <code>{cmd}</code>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tools */}
          <motion.div variants={fadeIn} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-purple-400" /> Tools Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {challenge.tools.map(tool => (
                <span key={tool} className="px-3 py-1.5 text-xs rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
