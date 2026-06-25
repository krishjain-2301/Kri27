'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Target, Flame, Activity, Shield, 
  Terminal, Play, Plus, BookOpen, Clock, Calendar,
  CheckCircle, GitCommit
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto pb-20"
    >
      
      {/* HEADER */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back.</h1>
          <p className="text-gray-500 text-sm">Here is what you've accomplished and where you left off.</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-xs uppercase tracking-wider">Current Streak</span>
            <span className="text-xl text-purple-400">18 Days</span>
          </div>
          <div className="w-px h-8 bg-[#1a1a20]"></div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-xs uppercase tracking-wider">Hours This Week</span>
            <span className="text-xl text-green-400">21.4</span>
          </div>
        </div>
      </div>

      {/* TOP: Continue Working & Today's Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Continue Working - TAKES UP 2 COLUMNS */}
        <div className="lg:col-span-2 stakent-gradient-card p-8 flex flex-col justify-between stakent-glow-purple relative overflow-hidden border border-purple-500/20">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">CONTINUE WORKING</span>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-purple-200/60 uppercase tracking-wider font-bold mb-1">Machine</p>
                <h3 className="text-4xl font-bold mb-4">Lame</h3>
                
                <div className="flex gap-6 text-sm text-purple-100/80 mb-6 font-medium">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400"/> Started Yesterday</span>
                  <span className="flex items-center gap-2"><Target className="w-4 h-4 text-green-400"/> User Owned</span>
                </div>
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 p-4 rounded-xl backdrop-blur-md mb-6 max-w-md">
              <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-1">Last Note</p>
              <p className="text-sm font-mono text-gray-300">Found anonymous SMB share containing backup configs. Need to check for credentials inside vsftpd.conf.</p>
            </div>

            <button className="bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition flex items-center gap-2">
              Resume Machine <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-30 mix-blend-screen pointer-events-none"></div>
        </div>

        {/* Today's Activity */}
        <div className="stakent-glass p-6 relative overflow-hidden flex flex-col">
          <h3 className="font-bold text-lg mb-6">Today's Activity</h3>
          
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Linux Fundamentals</p>
                <p className="text-xs text-gray-500">Academy Module Completed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Working on Lame</p>
                <p className="text-xs text-gray-500">Machine Started</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Added 3 Notes</p>
                <p className="text-xs text-gray-500">Enumeration & Privilege Escalation</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="stakent-glass p-6 text-center group hover:border-green-500/30 transition">
          <p className="text-4xl font-bold mb-2">14</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Machines</p>
        </div>
        <div className="stakent-glass p-6 text-center group hover:border-blue-500/30 transition">
          <p className="text-4xl font-bold mb-2">22</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Academy Modules</p>
        </div>
        <div className="stakent-glass p-6 text-center group hover:border-red-500/30 transition">
          <p className="text-4xl font-bold mb-2">9</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Challenges</p>
        </div>
        <div className="stakent-glass p-6 text-center group hover:border-purple-500/30 transition">
          <p className="text-4xl font-bold mb-2">43</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Learning Sessions</p>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="stakent-glass p-8">
        <h3 className="font-bold text-lg mb-8">Journal Timeline</h3>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#333] before:to-transparent">
          
          {/* Day 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0c0c0e] bg-purple-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#0c0c0e]">
              <GitCommit className="w-5 h-5" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-[#2a2a30] bg-[#111114]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm">26 June</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Linux Fundamentals</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Worked on Lame</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Added write-up for Lame</li>
              </ul>
            </div>
          </div>

          {/* Day 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0c0c0e] bg-[#222] text-gray-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <GitCommit className="w-5 h-5" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-[#1a1a20] bg-[#0c0c0e]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-gray-500">25 June</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" /> SQL Fundamentals</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" /> Completed Appointment</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

    </motion.div>
  );
}
