'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Target, Flame, Activity, Shield, 
  Terminal, Play, Plus, BookOpen, Clock, Calendar,
  CheckCircle, GitCommit, FileText, Database
} from 'lucide-react';
import ConnectionModal from '@/components/ConnectionModal';

export default function DashboardClient({ stats, recommendation, recentActivity, isConnected }: any) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto pb-20"
    >
      
      {/* HEADER */}
      <div className="flex items-end justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back.</h1>
          <p className="text-gray-500 text-sm">Here is what you've accomplished and where you left off.</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              // We'll create a daily note and redirect to the editor
              fetch('/api/daily', { method: 'POST' })
                .then(r => r.json())
                .then(data => window.location.href = `/journal/${data.id}`);
            }}
            className="stakent-pill px-4 py-2 border border-[#1a1a20] hover:bg-[#1a1a20] flex items-center gap-2 font-bold"
          >
            <Plus className="w-4 h-4" /> Daily Note
          </button>
          <div className="w-px h-8 bg-[#1a1a20]"></div>
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
      </div>

      {/* TODAY'S RECOMMENDATION / ONBOARDING */}
      {!isConnected ? (
        <div className="mb-8 p-8 rounded-2xl border border-green-500/20 bg-green-500/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-4">
              Connect to Hack The Box
            </h2>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl">
              Once connected, we'll automatically import:
            </p>
            <ul className="grid grid-cols-2 gap-4 mb-6 text-gray-300 font-medium">
              <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Machines</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Challenges</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Progress</li>
            </ul>
            <p className="text-sm text-gray-500 max-w-xl">
              ...while leaving all of your personal journals completely under your control.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button onClick={() => setIsModalOpen(true)} className="stakent-btn-primary !py-4 !px-8 text-lg font-bold">
              Connect Hack The Box
            </button>
          </div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
      ) : recommendation ? (
        <div className="mb-8 p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 p-4">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          </div>
          
          <div className="flex-1">
            <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Today's Recommendation</p>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
              Continue writing: {recommendation.title}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              You completed this {recommendation.difficulty} {recommendation.type}. Capture your learning while it's fresh.
            </p>
            
            <div className="flex items-center gap-4 bg-[#0c0c0e] p-3 rounded-xl border border-[#1a1a20] w-fit">
              <div className="text-sm">
                <span className="text-gray-500">Journal: </span>
                <span className={`font-bold ${
                  recommendation.journalStatus === 'Not Started' ? 'text-gray-400' :
                  recommendation.journalStatus === 'Complete' ? 'text-green-400' : 'text-purple-400'
                }`}>{recommendation.journalStatus}</span>
              </div>
              <div className="w-px h-4 bg-[#1a1a20]"></div>
              <div className="text-sm">
                <span className="text-gray-500">Length: </span>
                <span className="font-bold text-white">{recommendation.charCount} chars</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <a href={`/journal/${recommendation.journalId}`} className="stakent-btn-primary !py-3 !px-6 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Continue Writing →
            </a>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-6 rounded-2xl border border-[#1a1a20] bg-[#0c0c0e] text-center text-gray-500">
          <p className="font-bold mb-1">Today's Recommendation</p>
          <p className="text-sm">Nothing yet. Complete a machine on Hack The Box to get started.</p>
        </div>
      )}

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
                <h3 className="text-4xl font-bold mb-4">{recentActivity[0]?.title || 'Nothing yet'}</h3>
                
                {recentActivity[0] && (
                  <div className="flex gap-6 text-sm text-purple-100/80 mb-6 font-medium">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400"/> Started Recently</span>
                    <span className="flex items-center gap-2"><Target className="w-4 h-4 text-green-400"/> {recentActivity[0]?.status}</span>
                  </div>
                )}
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
                <Target className={`w-8 h-8 ${recentActivity.length > 0 ? 'text-green-400' : 'text-gray-600'}`} />
              </div>
            </div>

            {recentActivity[0] && (
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl backdrop-blur-md mb-6 max-w-md">
                <p className="text-xs text-purple-300/60 uppercase tracking-wider font-bold mb-1">Last Note</p>
                <p className="text-sm font-mono text-gray-300">Found anonymous SMB share containing backup configs. Need to check for credentials inside vsftpd.conf.</p>
              </div>
            )}

            {recentActivity[0] ? (
              <a href={`/journal/${recentActivity[0].journalId}`} className="bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition flex items-center gap-2 w-fit">
                Continue Writing <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <div className="h-12"></div>
            )}
          </div>

          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-30 mix-blend-screen pointer-events-none"></div>
        </div>

        {/* Today's Activity */}
        <div className="stakent-glass p-6 relative overflow-hidden flex flex-col">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-gray-400" /> Recent Activity</h3>
          
          <div className="space-y-4 flex-1">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500">No recent sync activity found.</p>
            ) : (
              recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    activity.type === 'Machine' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-green-500/10 border-green-500/20'
                  }`}>
                    {activity.type === 'Machine' ? <Target className="w-5 h-5 text-purple-400" /> : <BookOpen className="w-5 h-5 text-green-400" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.type} • {activity.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="stakent-glass p-6 text-center group hover:border-green-500/30 transition">
          <p className="text-4xl font-bold mb-2">{stats.machines}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Machines</p>
        </div>
        <div className="stakent-glass p-6 text-center group hover:border-red-500/30 transition">
          <p className="text-4xl font-bold mb-2">{stats.challenges}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Challenges</p>
        </div>
        <div className="stakent-glass p-6 text-center group hover:border-purple-500/30 transition">
          <p className="text-4xl font-bold mb-2">{stats.totalSessions}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Syncs</p>
        </div>
      </div>
      
      <ConnectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onComplete={() => window.location.reload()} 
      />
    </motion.div>
  );
}
