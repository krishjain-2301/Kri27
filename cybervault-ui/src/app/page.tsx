'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, Target, Flame, Activity, Shield, 
  Terminal, Play, Plus, BookOpen
} from 'lucide-react';
import {
  LineChart, Line, ResponsiveContainer
} from 'recharts';

// Minimal sparkline data for the cards
const sparklineData1 = [{ v: 10 }, { v: 15 }, { v: 8 }, { v: 22 }, { v: 18 }, { v: 30 }, { v: 25 }, { v: 40 }];
const sparklineData2 = [{ v: 30 }, { v: 25 }, { v: 35 }, { v: 20 }, { v: 40 }, { v: 35 }, { v: 50 }, { v: 45 }];
const sparklineData3 = [{ v: 50 }, { v: 40 }, { v: 45 }, { v: 30 }, { v: 20 }, { v: 15 }, { v: 25 }, { v: 10 }];

export default function DashboardPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto pb-20"
    >
      
      {/* HEADER ROW */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-semibold text-gray-400 flex items-center gap-2">
          Recommended targets for you 
          <span className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center text-[10px]">ℹ</span>
        </span>
        <span className="stakent-pill bg-[#1a1a20] border border-[#2a2a30]">3 Active</span>
      </div>

      <div className="flex items-end justify-between mb-8">
        <h1 className="text-3xl font-bold">Top Active Targets</h1>
        <div className="flex gap-2">
          <button className="stakent-pill px-4 py-2 border border-[#1a1a20] hover:bg-[#2a2a30]">Recent ▾</button>
          <button className="stakent-pill px-4 py-2 border border-[#1a1a20] hover:bg-[#2a2a30]">Difficulty ▾</button>
          <button className="stakent-pill px-4 py-2 border border-[#1a1a20] hover:bg-[#2a2a30]">OS ▾</button>
        </div>
      </div>

      {/* TOP CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1 */}
        <div className="stakent-glass p-6 relative overflow-hidden group hover:border-[#333] transition">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center border border-green-500/20">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Active Machine</p>
                <p className="font-semibold text-sm">Optimum (Linux)</p>
              </div>
            </div>
            <button className="w-6 h-6 rounded-full bg-[#1a1a20] flex items-center justify-center group-hover:bg-[#2a2a30]">
              <ArrowUpRight className="w-3 h-3 text-gray-400" />
            </button>
          </div>
          
          <div className="mb-2">
            <p className="text-xs text-gray-500 font-semibold mb-1">Completion Rate</p>
            <p className="text-3xl font-bold">13.62%</p>
            <p className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> 6.25%
            </p>
          </div>
          
          <div className="h-[80px] w-full absolute bottom-0 left-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData1}>
                <Line type="monotone" dataKey="v" stroke="#a78bfa" strokeWidth={2} dot={false} 
                  style={{ filter: 'drop-shadow(0px 10px 10px rgba(167, 139, 250, 0.4))' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2 */}
        <div className="stakent-glass p-6 relative overflow-hidden group hover:border-[#333] transition">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-600/10 flex items-center justify-center border border-yellow-500/20">
                <Flame className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Academy Path</p>
                <p className="font-semibold text-sm">Bug Bounty Hunter</p>
              </div>
            </div>
            <button className="w-6 h-6 rounded-full bg-[#1a1a20] flex items-center justify-center group-hover:bg-[#2a2a30]">
              <ArrowUpRight className="w-3 h-3 text-gray-400" />
            </button>
          </div>
          
          <div className="mb-2">
            <p className="text-xs text-gray-500 font-semibold mb-1">Module Progress</p>
            <p className="text-3xl font-bold">12.72%</p>
            <p className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> 5.67%
            </p>
          </div>
          
          <div className="h-[80px] w-full absolute bottom-0 left-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData2}>
                <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} 
                  style={{ filter: 'drop-shadow(0px 10px 10px rgba(59, 130, 246, 0.4))' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3 */}
        <div className="stakent-glass p-6 relative overflow-hidden group hover:border-[#333] transition">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center border border-purple-500/20">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Active Challenge</p>
                <p className="font-semibold text-sm">Pwn (Stack Pivot)</p>
              </div>
            </div>
            <button className="w-6 h-6 rounded-full bg-[#1a1a20] flex items-center justify-center group-hover:bg-[#2a2a30]">
              <ArrowUpRight className="w-3 h-3 text-gray-400" />
            </button>
          </div>
          
          <div className="mb-2">
            <p className="text-xs text-gray-500 font-semibold mb-1">Solve Rate</p>
            <p className="text-3xl font-bold">6.29%</p>
            <p className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> 1.89%
            </p>
          </div>
          
          <div className="h-[80px] w-full absolute bottom-0 left-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData3}>
                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false} 
                  style={{ filter: 'drop-shadow(0px 10px 10px rgba(239, 68, 68, 0.4))' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Purple Gradient Hero Card */}
        <div className="stakent-gradient-card p-6 flex flex-col justify-between stakent-glow-purple relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">CyberVault®</span>
            </div>
            <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded">PRO</span>
          </div>
          
          <div className="mt-8 z-10">
            <h3 className="text-2xl font-bold mb-2">Global Hacker Portfolio</h3>
            <p className="text-sm text-purple-200/80 mb-6 leading-relaxed max-w-[200px]">
              An all-in-one portfolio that helps you track smarter exploits and flag submissions.
            </p>
            
            <div className="space-y-3">
              <button className="w-full stakent-btn-primary flex justify-center items-center gap-2">
                Connect HackTheBox <Terminal className="w-4 h-4" />
              </button>
              <button className="w-full py-2.5 px-4 rounded-xl border border-purple-400/30 bg-purple-900/20 text-purple-200 text-sm font-semibold hover:bg-purple-900/40 transition flex justify-center items-center gap-2">
                Enter API Token <span className="opacity-50">🔒</span>
              </button>
            </div>
          </div>

          {/* Decorative glows */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-40 mix-blend-screen pointer-events-none"></div>
        </div>
      </div>

      {/* MAIN DATA PANEL */}
      <div className="stakent-glass p-8">
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-semibold text-gray-400">Your active operations</span>
          <div className="flex gap-4 border-b border-[#1a1a20] pb-2">
            <button className="text-gray-400 hover:text-white"><Activity className="w-4 h-4" /></button>
            <button className="text-gray-400 hover:text-white"><Terminal className="w-4 h-4" /></button>
            <button className="text-gray-400 hover:text-white"><BookOpen className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Main Metric */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 bg-[#1a1a20] px-2 py-1 rounded-full">
                Last Update - 45 minutes ago <span className="w-3 h-3 rounded-full bg-purple-500 flex items-center justify-center text-[8px] text-white">L</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold">Target IP: 10.10.11.230</h2>
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                <Target className="w-5 h-5" />
              </div>
              <button className="w-8 h-8 rounded-full border border-[#2a2a30] flex items-center justify-center hover:bg-[#1a1a20]">
                🔗
              </button>
              <button className="stakent-pill border border-[#2a2a30] hover:bg-[#1a1a20] !text-xs !py-1.5 ml-2">
                View Machine ↗
              </button>
            </div>
            
            <p className="text-xs text-gray-500 font-semibold mb-2">Current Exploit Progress / Points</p>
            <div className="flex items-center gap-6 mb-12">
              <span className="text-6xl font-light tracking-tight">1,250 <span className="text-2xl text-purple-500 font-bold">PTS</span></span>
              <div className="flex gap-3">
                <button className="stakent-btn-primary !py-2 !px-6 !text-sm">Submit Flag</button>
                <button className="stakent-btn-dark !py-2 !px-6 !text-sm border-[#333]">Save Note</button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-sm font-semibold mb-1 flex justify-between">Footprint <ChevronDown className="w-4 h-4 text-gray-600" /></p>
                <p className="text-xs text-gray-500">Nmap Scans</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1 flex justify-between">PrivEsc <ChevronDown className="w-4 h-4 text-gray-600" /></p>
                <p className="text-xs text-gray-500">Local Enumeration</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1 flex justify-between">Vulnerabilities <ChevronDown className="w-4 h-4 text-gray-600" /></p>
                <p className="text-xs text-gray-500">CVEs found</p>
              </div>
            </div>
          </div>

          {/* Right Sub-Panel */}
          <div className="flex-[0.8] border border-[#1a1a20] rounded-2xl p-6 bg-gradient-to-b from-[#0c0c0e] to-[#08080a] relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Recent Terminal Activity</h3>
              <span className="bg-[#1a1a20] text-purple-400 text-xs px-3 py-1 rounded-full font-semibold border border-purple-500/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> Live Sync
              </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              <div className="p-3 bg-[#111114] border border-[#222] rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 font-mono">10:45 AM</span>
                  <span className="text-purple-400 font-semibold">Nmap</span>
                </div>
                <p className="font-mono text-sm text-green-400 truncate">nmap -sC -sV -p- 10.10.11.230</p>
              </div>
              
              <div className="p-3 bg-[#111114] border border-[#222] rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 font-mono">11:02 AM</span>
                  <span className="text-blue-400 font-semibold">Gobuster</span>
                </div>
                <p className="font-mono text-sm text-green-400 truncate">gobuster dir -u http://10.10.11.230 -w...</p>
              </div>

              <div className="p-3 bg-[#111114] border border-[#222] rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 font-mono">11:15 AM</span>
                  <span className="text-red-400 font-semibold">Exploit</span>
                </div>
                <p className="font-mono text-sm text-green-400 truncate">python3 exploit.py -t 10.10.11.230 -p...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Row */}
        <div className="grid grid-cols-4 gap-6 mt-12 pt-8 border-t border-[#1a1a20]">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2 flex justify-between">
              Global Rank Trend <span className="stakent-pill !px-2 !py-0.5">30D</span>
            </p>
            <p className="text-2xl font-semibold text-green-500">+12.4%</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2 flex justify-between">
              Total Points <span className="stakent-pill !px-2 !py-0.5">ALL</span>
            </p>
            <p className="text-2xl font-semibold flex items-center gap-2">
              8,450 <span className="text-[10px] text-green-500 bg-green-500/10 px-1 rounded">+120 ↗</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2 flex justify-between">
              Payloads Saved <span className="stakent-pill !px-2 !py-0.5">7D</span>
            </p>
            <p className="text-2xl font-semibold">14</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2">Accuracy Rate</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="w-16 h-1 bg-[#1a1a20] rounded relative"><div className="absolute left-0 w-[92%] h-full bg-purple-500 rounded"></div></div>
                <span className="text-gray-300">92.3% <span className="text-gray-600">Flags</span></span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="w-16 h-1 bg-[#1a1a20] rounded relative"><div className="absolute left-0 w-[84%] h-full bg-gray-500 rounded"></div></div>
                <span className="text-gray-300">84.6% <span className="text-gray-600">Trivia</span></span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}

// Quick stub for missing lucide icon
function ChevronDown(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>;
}
