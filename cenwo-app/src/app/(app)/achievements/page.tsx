'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { mockAchievements } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { duration: 0.35 } } };

export default function AchievementsPage() {
  const unlocked = mockAchievements.filter(a => a.isUnlocked);
  const locked = mockAchievements.filter(a => !a.isUnlocked);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Achievements</h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          {unlocked.length}/{mockAchievements.length} unlocked
        </p>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Unlocked
          </h2>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {unlocked.map(achievement => (
              <motion.div key={achievement.id} variants={item}
                className="glass-card p-5 border-emerald-500/20 glow-green text-center">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{achievement.title}</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mb-2">{achievement.description}</p>
                <div className="w-full h-1.5 bg-emerald-500/20 rounded-full mb-2">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }} />
                </div>
                <p className="text-[10px] text-emerald-400">
                  Unlocked {achievement.unlockedAt ? formatDate(achievement.unlockedAt) : ''}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Locked */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Locked
        </h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {locked.map(achievement => (
            <motion.div key={achievement.id} variants={item}
              className="glass-card p-5 opacity-60 hover:opacity-80 transition-opacity text-center">
              <div className="text-4xl mb-3 grayscale">{achievement.icon}</div>
              <h3 className="font-semibold text-[var(--color-text-secondary)] mb-1">{achievement.title}</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-2">{achievement.description}</p>
              <div className="w-full h-1.5 bg-[var(--color-bg-secondary)] rounded-full mb-2">
                <motion.div
                  className="h-full bg-[var(--color-text-muted)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievement.current / achievement.requirement) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                {achievement.current}/{achievement.requirement}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
