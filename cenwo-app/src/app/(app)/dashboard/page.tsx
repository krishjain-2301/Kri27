'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, Shield, Crosshair, BookOpen, 
  Activity, Play, CheckCircle2, Circle, ArrowRight 
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const mockActivityData = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 4 },
  { day: 'Wed', hours: 3 },
  { day: 'Thu', hours: 6 },
  { day: 'Fri', hours: 5 },
  { day: 'Sat', hours: 8 },
  { day: 'Sun', hours: 7 },
];

export default function DashboardPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto py-8 space-y-8"
      style={{ backgroundColor: '#000000', color: '#ffffff' }}
    >
      
      {/* 1. HERO SECTION */}
      <div 
        className="w-full p-10 rounded-3xl relative overflow-hidden"
        style={{ backgroundColor: '#080808', border: '1px solid #1a1a1a' }}
      >
        <div className="relative z-10">
          <h1 className="text-5xl font-black tracking-tight mb-4">Welcome back, <span className="text-purple-500">Rakazaka</span>.</h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl">
            You're currently on a 14-day streak. Your next objective is privilege escalation on the "Optimum" machine.
          </p>
          
          <div className="flex gap-12 mt-10">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Machines Pawned</p>
              <p className="text-4xl font-bold">42</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Global Rank</p>
              <p className="text-4xl font-bold">Hacker</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Notes</p>
              <p className="text-4xl font-bold">128</p>
            </div>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
          <Shield className="w-96 h-96" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Mission Checklist */}
          <div 
            className="p-8 rounded-3xl"
            style={{ backgroundColor: '#080808', border: '1px solid #1a1a1a' }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Crosshair className="w-6 h-6 text-purple-500" /> Today's Mission
              </h2>
              <span className="bg-purple-500/10 text-purple-500 px-4 py-1.5 rounded-full text-sm font-bold">
                2 of 3 Complete
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#111111] border border-[#222222] opacity-60">
                <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-lg font-bold line-through">Review privilege escalation notes</p>
                  <p className="text-sm text-gray-500">Completed 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#111111] border border-[#222222] opacity-60">
                <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-lg font-bold line-through">Pawn HTB Machine: Lame</p>
                  <p className="text-sm text-gray-500">Completed 4 hours ago</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#111111] border border-purple-500/30">
                <Circle className="w-8 h-8 text-purple-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-lg font-bold text-white">Gain User Flag on Optimum</p>
                  <p className="text-sm text-gray-400">Current active target</p>
                </div>
                <button className="bg-white text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition">
                  Resume <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div 
            className="p-8 rounded-3xl"
            style={{ backgroundColor: '#080808', border: '1px solid #1a1a1a' }}
          >
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
              <Activity className="w-6 h-6 text-blue-500" /> Learning Activity
            </h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
                  <XAxis dataKey="day" stroke="#666666" tick={{ fill: '#666666' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111111', border: '1px solid #333333', borderRadius: '12px' }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                  <Line type="monotone" dataKey="hours" stroke="#6c3ef5" strokeWidth={4} dot={{ r: 6, fill: '#000000', stroke: '#6c3ef5', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN (1/3 width) */}
        <div className="space-y-8">
          
          {/* Quick Command Center */}
          <div 
            className="p-8 rounded-3xl"
            style={{ backgroundColor: '#080808', border: '1px solid #1a1a1a' }}
          >
            <h2 className="text-2xl font-bold mb-6">Quick Launch</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-between p-6 rounded-2xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] transition group text-left">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Payloads</p>
                    <p className="text-gray-500 text-sm">Exploits & snippets</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition" />
              </button>

              <button className="flex items-center justify-between p-6 rounded-2xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] transition group text-left">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Knowledge</p>
                    <p className="text-gray-500 text-sm">Your massive brain</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition" />
              </button>

              <button className="flex items-center justify-between p-6 rounded-2xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] transition group text-left">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Challenges</p>
                    <p className="text-gray-500 text-sm">Active HTB boxes</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition" />
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <div 
            className="p-8 rounded-3xl flex flex-col items-center justify-center text-center"
            style={{ backgroundColor: '#080808', border: '1px solid #1a1a1a' }}
          >
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hack The Box Sync</h3>
            <p className="text-gray-500 text-sm mb-6">Your API connection is active and pulling live box data.</p>
            <div className="flex items-center gap-2 text-green-500 font-bold bg-green-500/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Connected
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
