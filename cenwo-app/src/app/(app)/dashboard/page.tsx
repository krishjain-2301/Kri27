'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Flame, Monitor, BookOpen, Brain, Bell, Search,
  Award, Shield, CheckCircle2, Circle, Clock, TrendingUp, AlertCircle, Terminal, Swords, FileText, Zap
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

/* -------------------------------------------------------------------------- */
/* Top Header Elements                                                        */
/* -------------------------------------------------------------------------- */
function TopHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
          Good Evening,<br/>Rakazaka
        </h1>
        <p className="text-sm text-gray-400">
          Keep building your cyber knowledge. <span className="text-white font-medium">Day 62 of learning.</span>
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search CyberVault..." 
            className="w-64 bg-[#111113] border border-[#232329] text-white text-sm rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        {/* Notifications */}
        <button className="w-10 h-10 rounded-full bg-[#111113] border border-[#232329] flex items-center justify-center text-gray-400 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        {/* Profile */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-[2px] cursor-pointer">
          <div className="w-full h-full rounded-full bg-[#09090b] flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Premium Stat Cards                                                         */
/* -------------------------------------------------------------------------- */
function PremiumStatCard({ title, value, trend, trendLabel, icon: Icon, colorClass, glowColor }: any) {
  return (
    <motion.div variants={item} className="glass-card p-5 group relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right">
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">{trendLabel}</span>
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Area Components                                                       */
/* -------------------------------------------------------------------------- */
function LearningHeatmap() {
  // Generate mock heatmap data
  const weeks = Array.from({ length: 52 }, () => 
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
  );

  const getColor = (level: number) => {
    switch(level) {
      case 0: return '#111113'; // Empty
      case 1: return '#1a2e23'; // L1
      case 2: return '#1e4c31'; // L2
      case 3: return '#228243'; // L3
      case 4: return '#22c55e'; // L4 (Success green)
      default: return '#111113';
    }
  };

  return (
    <motion.div variants={item} className="glass-card p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">365-Day Learning Heatmap</h2>
          <p className="text-sm text-gray-400">Current Streak: <span className="text-white font-medium">62 Days</span> • Longest: <span className="text-white font-medium">84 Days</span></p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">94%</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Consistency</p>
        </div>
      </div>
      
      <div className="flex gap-[3px] overflow-hidden mb-6 opacity-90 hover:opacity-100 transition-opacity">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {week.map((day, j) => (
              <div 
                key={j} 
                className="w-3 h-3 rounded-[2px] transition-all duration-200 hover:ring-1 hover:ring-white/50 cursor-pointer"
                style={{ backgroundColor: getColor(day) }}
                title={`Level ${day} activity`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[#232329] pt-4">
        <h3 className="text-sm font-semibold text-white">Today's Summary</h3>
        <div className="flex gap-6">
          <div className="text-center"><p className="text-white font-bold">3h</p><p className="text-[10px] text-gray-400 uppercase tracking-wider">Time</p></div>
          <div className="text-center"><p className="text-white font-bold">2</p><p className="text-[10px] text-gray-400 uppercase tracking-wider">Machines</p></div>
          <div className="text-center"><p className="text-white font-bold">1</p><p className="text-[10px] text-gray-400 uppercase tracking-wider">Module</p></div>
          <div className="text-center"><p className="text-white font-bold">12</p><p className="text-[10px] text-gray-400 uppercase tracking-wider">Notes</p></div>
        </div>
      </div>
    </motion.div>
  );
}

function CircularProgress({ value, label, color }: { value: number, label: string, color: string }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 mb-2">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle cx="32" cy="32" r={radius} stroke="#232329" strokeWidth="4" fill="transparent" />
          <circle 
            cx="32" cy="32" r={radius} 
            stroke={color} strokeWidth="4" fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 text-center leading-tight">{label}</span>
    </div>
  );
}

function ProgressSection() {
  return (
    <motion.div variants={item} className="glass-card p-6 mb-8">
      <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Completion Progress</h2>
      <div className="flex justify-between px-4">
        <CircularProgress value={68} label="Machines" color="#7c3aed" />
        <CircularProgress value={42} label="Academy" color="#3b82f6" />
        <CircularProgress value={91} label="Sherlocks" color="#22c55e" />
        <CircularProgress value={55} label="Challenges" color="#f59e0b" />
      </div>
    </motion.div>
  );
}

function LearningPath() {
  const paths = [
    { name: 'Privilege Escalation', progress: 72, color: 'bg-purple-500' },
    { name: 'Active Directory', progress: 35, color: 'bg-blue-500' },
    { name: 'Web Exploitation', progress: 81, color: 'bg-emerald-500' },
  ];

  return (
    <motion.div variants={item} className="glass-card p-6 mb-8">
      <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Current Learning Path</h2>
      <div className="space-y-5">
        {paths.map(path => (
          <div key={path.name} className="group cursor-pointer">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">{path.name}</span>
              <span className="text-sm font-bold text-gray-400">{path.progress}%</span>
            </div>
            <div className="h-2 w-full bg-[#232329] rounded-full overflow-hidden">
              <div className={`h-full ${path.color} rounded-full`} style={{ width: `${path.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ActivityTimeline() {
  const activities = [
    { type: 'machine', title: 'Completed Lame', time: '2 hours ago', icon: Monitor, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'note', title: 'Added PrivEsc Notes', time: '4 hours ago', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { type: 'learning', title: 'Learned SMB', time: 'Yesterday', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { type: 'command', title: 'Added Reverse Shell', time: 'Yesterday', icon: Terminal, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <motion.div variants={item} className="glass-card p-6">
      <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Recent Activity Timeline</h2>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#232329] before:via-[#232329] before:to-transparent">
        {activities.map((act, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Timeline Dot/Icon */}
            <div className={`flex items-center justify-center w-9 h-9 rounded-full border-4 border-[#09090b] ${act.bg} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_1px_#232329] relative z-10`}>
              <act.icon className={`w-3.5 h-3.5 ${act.color}`} />
            </div>
            {/* Content */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl border border-[#232329] bg-[#111113] hover:border-purple-500/30 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white">{act.title}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{act.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Right Sidebar Widgets                                                      */
/* -------------------------------------------------------------------------- */
function CyberProfile() {
  return (
    <motion.div variants={item} className="glass-card p-6 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-1 mb-4 relative">
        <div className="w-full h-full rounded-full bg-[#09090b] flex items-center justify-center border-[3px] border-[#111113]">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-[#111113] rounded-full flex items-center justify-center">
          <Award className="w-3 h-3 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-1">Rakazaka</h3>
      <p className="text-sm text-purple-400 font-medium mb-6">Pro Hacker • Level 42</p>
      
      <div className="w-full grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#09090b] rounded-lg p-3 text-center border border-[#232329]">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rank</p>
          <p className="text-lg font-bold text-white">#1,402</p>
        </div>
        <div className="bg-[#09090b] rounded-lg p-3 text-center border border-[#232329]">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">XP</p>
          <p className="text-lg font-bold text-white">12.4k</p>
        </div>
        <div className="bg-[#09090b] rounded-lg p-3 text-center border border-[#232329]">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Hours</p>
          <p className="text-lg font-bold text-white">420h</p>
        </div>
        <div className="bg-[#09090b] rounded-lg p-3 text-center border border-[#232329]">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Score</p>
          <p className="text-lg font-bold text-white">84%</p>
        </div>
      </div>
      
      <button className="w-full py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">
        View Full Profile
      </button>
    </motion.div>
  );
}

function TopSkillsWidget() {
  const skills = [
    { name: 'Linux', val: 95 },
    { name: 'Web', val: 82 },
    { name: 'SMB', val: 64 },
    { name: 'AD', val: 45 },
    { name: 'Buffer Overflow', val: 20 },
  ];
  return (
    <motion.div variants={item} className="glass-card p-6">
      <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Top Skills</h2>
      <div className="space-y-4">
        {skills.map(s => (
          <div key={s.name} className="group">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-gray-300">{s.name}</span>
              <span className="text-gray-500">{s.val}%</span>
            </div>
            <div className="flex gap-0.5 h-1.5">
              {Array.from({length: 10}).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-sm ${i < (s.val/10) ? 'bg-purple-500' : 'bg-[#232329]'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function NeedsReviewWidget() {
  return (
    <motion.div variants={item} className="glass-card p-6">
      <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex justify-between">
        Needs Review
        <span className="text-[10px] bg-[#232329] px-2 py-0.5 rounded text-gray-400">3 Due</span>
      </h2>
      <div className="space-y-3">
        <div className="p-3 border border-red-500/20 bg-red-500/5 rounded-lg flex justify-between items-center cursor-pointer hover:bg-red-500/10 transition-colors">
          <span className="text-sm font-bold text-red-400">XSS</span>
          <span className="text-[10px] text-red-500/70 uppercase font-bold">3 days overdue</span>
        </div>
        <div className="p-3 border border-orange-500/20 bg-orange-500/5 rounded-lg flex justify-between items-center cursor-pointer hover:bg-orange-500/10 transition-colors">
          <span className="text-sm font-bold text-orange-400">SQLi</span>
          <span className="text-[10px] text-orange-500/70 uppercase font-bold">Review Today</span>
        </div>
        <div className="p-3 border border-[#232329] bg-[#111113] rounded-lg flex justify-between items-center cursor-pointer hover:border-gray-600 transition-colors">
          <span className="text-sm font-bold text-gray-300">Kerberos</span>
          <span className="text-[10px] text-gray-500 uppercase font-bold">Tomorrow</span>
        </div>
      </div>
    </motion.div>
  );
}

function TodaysMission() {
  return (
    <motion.div variants={item} className="glass-card p-6">
      <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Today's Mission</h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3 group cursor-pointer">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500 line-through">Finish HTB Lame</p>
          </div>
        </div>
        <div className="flex items-start gap-3 group cursor-pointer">
          <Circle className="w-5 h-5 text-[#232329] group-hover:text-purple-500 transition-colors mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Review XSS Notes</p>
          </div>
        </div>
        <div className="flex items-start gap-3 group cursor-pointer">
          <Circle className="w-5 h-5 text-[#232329] group-hover:text-purple-500 transition-colors mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Learn SSTI</p>
          </div>
        </div>
        <div className="flex items-start gap-3 group cursor-pointer">
          <Circle className="w-5 h-5 text-[#232329] group-hover:text-purple-500 transition-colors mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Add screenshots</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bottom Analytics                                                           */
/* -------------------------------------------------------------------------- */
function AnalyticsSection() {
  const lineData = [
    { name: 'Mon', hours: 2 }, { name: 'Tue', hours: 3.5 }, { name: 'Wed', hours: 1.5 },
    { name: 'Thu', hours: 4 }, { name: 'Fri', hours: 2.5 }, { name: 'Sat', hours: 6 }, { name: 'Sun', hours: 5 }
  ];
  const pieData = [
    { name: 'Easy', value: 40, color: '#22c55e' },
    { name: 'Medium', value: 35, color: '#f59e0b' },
    { name: 'Hard', value: 15, color: '#ef4444' },
    { name: 'Insane', value: 10, color: '#7c3aed' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-8">
      <motion.div variants={item} className="glass-card p-6 h-64 flex flex-col">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Learning Hours</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232329" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#111113', borderColor: '#232329', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="hours" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#09090b', stroke: '#7c3aed', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6 h-64 flex flex-col">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Difficulty Spread</h3>
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: '#111113', borderColor: '#232329', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6 h-64 flex flex-col lg:col-span-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Platform Usage</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232329" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <RechartsTooltip cursor={{ fill: '#232329', opacity: 0.4 }} contentStyle={{ backgroundColor: '#111113', borderColor: '#232329', borderRadius: '8px' }} />
              <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page Layout                                                           */
/* -------------------------------------------------------------------------- */
export default function DashboardPage() {
  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="max-w-[1600px] mx-auto min-h-screen pb-12"
    >
      <TopHeader />

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <PremiumStatCard 
          title="Learning Streak" value="62 Days" trend="+4" trendLabel="this week" 
          icon={Flame} colorClass="bg-orange-500/10 text-orange-500"
        />
        <PremiumStatCard 
          title="Machines" value="48 Completed" trend="+2" trendLabel="today" 
          icon={Terminal} colorClass="bg-blue-500/10 text-blue-500"
        />
        <PremiumStatCard 
          title="Knowledge Base" value="713 Notes" trend="+18" trendLabel="added" 
          icon={BookOpen} colorClass="bg-emerald-500/10 text-emerald-500"
        />
        <PremiumStatCard 
          title="Knowledge Score" value="84%" trend="Top 20%" trendLabel="global" 
          icon={Brain} colorClass="bg-purple-500/10 text-purple-500"
        />
      </div>

      {/* Main Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-8">
        {/* Left Column (Main Content) */}
        <div className="space-y-8 min-w-0">
          <LearningHeatmap />
          <ProgressSection />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LearningPath />
            <ActivityTimeline />
          </div>
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="space-y-8 min-w-0">
          <CyberProfile />
          <TopSkillsWidget />
          <NeedsReviewWidget />
          <TodaysMission />
        </div>
      </div>

      <AnalyticsSection />
      
    </motion.div>
  );
}
