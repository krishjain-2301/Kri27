'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Monitor, Swords, BookOpen, Target, Terminal } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const fadeIn = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#3b82f6', '#ec4899', '#14b8a6'];

export default function AnalyticsPage() {
  const { challenges, learningEntries, commands, payloads, stats } = useAppStore();

  const difficultyDist = useMemo(() => {
    const dist: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0, Insane: 0 };
    challenges.forEach(c => { dist[c.difficulty] = (dist[c.difficulty] || 0) + 1; });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [challenges]);

  const osDist = useMemo(() => {
    const dist: Record<string, number> = {};
    challenges.forEach(c => { dist[c.os] = (dist[c.os] || 0) + 1; });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [challenges]);

  const skillDist = useMemo(() => {
    const dist: Record<string, number> = {};
    challenges.forEach(c => c.skills.forEach(s => { dist[s] = (dist[s] || 0) + 1; }));
    return Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }));
  }, [challenges]);

  const monthlyProgress = useMemo(() => {
    const months: Record<string, number> = {};
    challenges.forEach(c => {
      const month = new Date(c.dateCompleted).toLocaleDateString('en', { month: 'short', year: '2-digit' });
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [challenges]);

  const topCommands = useMemo(() =>
    [...commands].sort((a, b) => b.frequencyUsed - a.frequencyUsed).slice(0, 6).map(c => ({ name: c.name, value: c.frequencyUsed })),
  [commands]);

  const radarData = useMemo(() => {
    const categories: Record<string, number> = {};
    challenges.forEach(c => { categories[c.category] = (categories[c.category] || 0) + 1; });
    learningEntries.forEach(e => { categories[e.category] = (categories[e.category] || 0) + 1; });
    return Object.entries(categories).map(([subject, value]) => ({ subject, value }));
  }, [challenges, learningEntries]);

  const customTooltip = { contentStyle: { background: '#141c2e', border: '1px solid #1e293b', borderRadius: '10px', color: '#f1f5f9', fontSize: '12px' } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeIn} className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Analytics</h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">Your cybersecurity learning insights</p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Clock, label: 'Total Hours', value: `${stats.hoursLearned}h`, color: '#06b6d4' },
          { icon: Monitor, label: 'Machines', value: stats.machinesCompleted, color: '#10b981' },
          { icon: BookOpen, label: 'Topics', value: learningEntries.length, color: '#8b5cf6' },
          { icon: Terminal, label: 'Commands', value: commands.length, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': s.color } as React.CSSProperties}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--color-text-primary)]">{s.value}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress */}
        <motion.div variants={fadeIn} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Monthly Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
              <Tooltip {...customTooltip} />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Difficulty Distribution */}
        <motion.div variants={fadeIn} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Difficulty Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={difficultyDist} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}>
                {difficultyDist.map((_, i) => <Cell key={i} fill={['#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'][i]} />)}
              </Pie>
              <Tooltip {...customTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Skills */}
        <motion.div variants={fadeIn} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Top Skills</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillDist} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={100} axisLine={{ stroke: '#1e293b' }} />
              <Tooltip {...customTooltip} />
              <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* OS Distribution */}
        <motion.div variants={fadeIn} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">OS Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={osDist} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}>
                {osDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...customTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Most Used Commands */}
        <motion.div variants={fadeIn} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Most Used Commands</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topCommands}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
              <Tooltip {...customTooltip} />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Knowledge Radar */}
        <motion.div variants={fadeIn} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Knowledge Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 9 }} />
              <Radar dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
