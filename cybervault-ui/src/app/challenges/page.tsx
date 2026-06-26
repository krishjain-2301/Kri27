import React from 'react';
import { Swords, Target, ShieldCheck, BookOpen, Search } from 'lucide-react';
import { getChallenges } from '@/lib/queries/challenges';

export const dynamic = 'force-dynamic';

export default async function ChallengesPage() {
  const targets = await getChallenges();

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Swords className="w-8 h-8 text-red-500" /> Challenges
          </h1>
          <p className="text-gray-500 text-sm">Your practical targets: Machines, Challenges, and Sherlocks.</p>
        </div>
        <div className="flex gap-2">
          <button className="stakent-pill px-4 py-2 border border-[#1a1a20] hover:bg-[#2a2a30]">Type ▾</button>
          <button className="stakent-pill px-4 py-2 border border-[#1a1a20] hover:bg-[#2a2a30]">Status ▾</button>
        </div>
      </div>

      {targets.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="mb-6">No challenges yet. Complete your first HTB challenge or sync your account.</p>
          <form action="/settings">
            <button className="stakent-btn-primary mx-auto !py-3 !px-6 text-white border border-[#1a1a20] hover:bg-[#1a1a20]">
              Sync Now
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targets.map((t: any) => (
          <div key={t.id} className="stakent-glass p-6 group hover:border-[#333] transition relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  t.status.includes('Owned') || t.status === 'Completed' ? 'bg-green-500/10 border-green-500/20' : 
                  t.type === 'Sherlock' ? 'bg-blue-500/10 border-blue-500/20' :
                  'bg-purple-500/10 border-purple-500/20'
                }`}>
                  {t.status.includes('Owned') || t.status === 'Completed' ? <ShieldCheck className="w-6 h-6 text-green-400" /> : 
                   t.type === 'Sherlock' ? <Search className="w-6 h-6 text-blue-400" /> :
                   t.type === 'Machine' ? <Target className="w-6 h-6 text-purple-400" /> :
                   <BookOpen className="w-6 h-6 text-purple-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t.title}</h3>
                  <p className="text-xs text-gray-500 font-mono">{t.type} • {t.os || 'Unknown'}</p>
                </div>
              </div>
              <span className={`stakent-pill !px-2 !py-0.5 text-[10px] ${
                t.difficulty === 'Easy' ? 'text-green-400 border-green-900/30' : 
                t.difficulty === 'Medium' ? 'text-yellow-400 border-yellow-900/30' : 'text-red-400 border-red-900/30'
              }`}>{t.difficulty}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
              <span>Points: {t.points}</span>
            </div>

            <div className="mt-auto border-t border-[#1a1a20] pt-4 flex justify-between items-center z-10 relative">
              <div className={`text-xs font-bold ${t.status.includes('Owned') || t.status === 'Completed' ? 'text-green-500' : 'text-purple-400'}`}>
                {t.status}
              </div>
              {t.journalId && (
                <a href={`/journal/${t.journalId}`} className="text-xs font-bold text-white hover:text-purple-400 transition">
                  {t.journalStatus === 'Not Started' ? 'Start Journal →' : 'View Journal →'}
                </a>
              )}
            </div>

            {(t.status.includes('Owned') || t.status === 'Completed') && (
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none"></div>
            )}
            {t.status === 'In Progress' && (
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
