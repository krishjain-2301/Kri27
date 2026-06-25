'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Flame, Clock, Monitor, BookOpen, Search as SearchIcon, Swords,
  Target, Brain, Terminal, FileText, TrendingUp, Star,
  ArrowUpRight, Calendar, Zap, Award, Shield,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { formatRelativeTime, formatDuration, getDifficultyColor, getOSIcon } from '@/lib/utils';
import { generateContributionData } from '@/lib/mock-data';
import Link from 'next/link';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <span className="tabular-nums">
      {value}{suffix}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  trend?: string;
}) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: '#042f2e', text: '#10b981' },
    cyan: { bg: '#164e63', text: '#06b6d4' },
    indigo: { bg: '#312e81', text: '#6366f1' },
    purple: { bg: '#3b0764', text: '#d946ef' },
    amber: { bg: '#451a03', text: '#f59e0b' },
    rose: { bg: '#4c0519', text: '#f43f5e' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div variants={item} className="stat-card group border-[var(--color-border)] hover:border-indigo-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-3xl font-bold text-[var(--color-text-primary)]">
          <AnimatedCounter value={value} suffix={suffix} />
        </p>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ background: c.bg }}
        >
          <Icon className="w-5 h-5" style={{ color: c.text }} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</p>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function ContributionGraph() {
  const data = useMemo(() => generateContributionData(), []);
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const getColor = (count: number) => {
    if (count === 0) return '#111827';
    if (count === 1) return '#064e3b';
    if (count === 2) return '#065f46';
    if (count === 3) return '#047857';
    if (count >= 4) return '#10b981';
    return '#111827';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <motion.div variants={item} className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Contribution Graph</h3>
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {data.filter(d => d.count > 0).length} active days
        </span>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px] min-w-[720px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="w-[11px] h-[11px] rounded-[2px] transition-all duration-150 hover:ring-1 hover:ring-emerald-400/50 cursor-pointer"
                  style={{ background: getColor(day.count) }}
                  title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
        {/* Month labels */}
        <div className="flex mt-1.5 min-w-[720px]">
          {months.map((m, i) => (
            <span key={i} className="text-[10px] text-[var(--color-text-muted)]" style={{ width: `${100/12}%` }}>
              {m}
            </span>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-[var(--color-text-muted)]">Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div
            key={level}
            className="w-[11px] h-[11px] rounded-[2px]"
            style={{ background: getColor(level) }}
          />
        ))}
        <span className="text-[10px] text-[var(--color-text-muted)]">More</span>
      </div>
    </motion.div>
  );
}

function RecentActivity() {
  const { activities, challenges, learningEntries } = useAppStore();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'challenge_completed': return <Swords className="w-4 h-4 text-emerald-400" />;
      case 'learning_added': return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'note_created': return <FileText className="w-4 h-4 text-purple-400" />;
      case 'command_added': return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'payload_added': return <Target className="w-4 h-4 text-rose-400" />;
      default: return <Zap className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <motion.div variants={item} className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Recent Activity</h3>
        <Link href="/analytics" className="text-xs text-[var(--color-text-tertiary)] hover:text-emerald-400 transition-colors flex items-center gap-1">
          View all <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-1">
        {activities.slice(0, 8).map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--color-bg-tertiary)]/50 transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center flex-shrink-0">
              {getActivityIcon(activity.activityType)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--color-text-primary)] truncate group-hover:text-emerald-400 transition-colors">
                {activity.description}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {formatRelativeTime(activity.timestamp)}
                {activity.durationMinutes && ` · ${formatDuration(activity.durationMinutes)}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RecentChallenges() {
  const { challenges } = useAppStore();

  return (
    <motion.div variants={item} className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Recent Challenges</h3>
        <Link href="/challenges" className="text-xs text-[var(--color-text-tertiary)] hover:text-emerald-400 transition-colors flex items-center gap-1">
          View all <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-2">
        {challenges.slice(0, 5).map((challenge) => (
          <Link
            key={challenge.id}
            href={`/challenges/${challenge.id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-bg-tertiary)]/50 transition-all group border border-transparent hover:border-[var(--color-border)]"
          >
            <span className="text-lg">{getOSIcon(challenge.os)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-emerald-400 transition-colors">
                  {challenge.name}
                </p>
                {challenge.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {challenge.platform}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--color-text-muted)]">
                {formatDuration(challenge.timeSpentMinutes)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function SkillsOverview() {
  const { challenges } = useAppStore();
  const skillCounts: Record<string, number> = {};
  challenges.forEach(c => c.skills.forEach(s => {
    skillCounts[s] = (skillCounts[s] || 0) + 1;
  }));
  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCount = Math.max(...topSkills.map(([, count]) => count), 1);

  return (
    <motion.div variants={item} className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Top Skills</h3>
        <Link href="/analytics" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
          View Details
        </Link>
      </div>
      <div className="space-y-5">
        {topSkills.map(([skill, count]) => (
          <div key={skill}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">{skill}</span>
              <span className="text-xs font-medium text-[var(--color-text-primary)]">{Math.round((count / maxCount) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${(count / maxCount) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WeakAreas() {
  const { learningEntries } = useAppStore();
  const weak = learningEntries
    .filter(e => e.confidenceLevel <= 3 || e.needsRevision)
    .slice(0, 5);

  return (
    <motion.div variants={item} className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Needs Review</h3>
        <span className="badge badge-hard">{weak.length} topics</span>
      </div>
      <div className="space-y-2">
        {weak.map(entry => (
          <Link
            key={entry.id}
            href={`/learning/${entry.id}`}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--color-bg-tertiary)]/50 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--color-text-primary)] group-hover:text-emerald-400 transition-colors truncate">
                {entry.title}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">{entry.category}</p>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`w-1.5 h-4 rounded-full ${i <= entry.confidenceLevel ? 'bg-amber-400' : 'bg-[var(--color-bg-secondary)]'}`}
                />
              ))}
            </div>
          </Link>
        ))}
        {weak.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
            All topics mastered! 🎉
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { stats } = useAppStore();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
            Welcome back. Here's your learning progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Pro Active</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Left Column - Main Content */}
        <div className="space-y-8">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">My Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard icon={Flame} label="Current Streak" value={stats.currentStreak} suffix=" days" color="amber" trend="+3" />
              <StatCard icon={Monitor} label="Machines Pwned" value={stats.machinesCompleted} color="indigo" />
              <StatCard icon={Swords} label="Challenges Done" value={stats.challengesCompleted} color="emerald" trend="+12%" />
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">Activity Timeline</h2>
            <ContributionGraph />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">Recent Engagements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecentChallenges />
              <RecentActivity />
            </div>
          </div>
        </div>

        {/* Right Column - Profile & Insights */}
        <div className="space-y-8">
          {/* Profile Card Mock */}
          <motion.div variants={item} className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 mb-4">
              <div className="w-full h-full rounded-full bg-[var(--color-bg-card)] flex items-center justify-center border-2 border-[var(--color-bg-card)]">
                <Shield className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">CyberLearner</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">@hacker_0x1</p>
            
            <div className="grid grid-cols-3 w-full gap-4 pt-6 border-t border-[var(--color-border)]">
              <div>
                <p className="text-xl font-bold text-[var(--color-text-primary)]">125</p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-1">Rank</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--color-text-primary)]">4.2h</p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-1">Average</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--color-text-primary)]">8</p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-1">Modules</p>
              </div>
            </div>
          </motion.div>

          <SkillsOverview />
          <WeakAreas />
        </div>
      </div>
    </motion.div>
  );
}
