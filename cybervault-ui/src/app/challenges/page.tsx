import React from 'react';
import { Swords, Monitor, Target, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ChallengesPage() {
  const targets = [
    { name: "Lame", type: "Machine", os: "Linux", diff: "Easy", status: "Root Owned", started: "20 June", time: "3h" },
    { name: "Stack Pivot", type: "Challenge", os: "Pwn", diff: "Medium", status: "In Progress", started: "25 June", time: "5h" },
    { name: "Unit42", type: "Sherlock", os: "DFIR", diff: "Easy", status: "Completed", started: "22 June", time: "1h 30m" },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targets.map((t, i) => (
          <div key={i} className="stakent-glass p-6 group hover:border-[#333] transition relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  t.status.includes('Owned') || t.status === 'Completed' ? 'bg-green-500/10 border-green-500/20' : 'bg-purple-500/10 border-purple-500/20'
                }`}>
                  {t.status.includes('Owned') || t.status === 'Completed' ? <ShieldCheck className="w-6 h-6 text-green-400" /> : <Target className="w-6 h-6 text-purple-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{t.type} • {t.os}</p>
                </div>
              </div>
              <span className={`stakent-pill !px-2 !py-0.5 text-[10px] ${
                t.diff === 'Easy' ? 'text-green-400 border-green-900/30' : 
                t.diff === 'Medium' ? 'text-yellow-400 border-yellow-900/30' : 'text-red-400 border-red-900/30'
              }`}>{t.diff}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
              <span>Started: {t.started}</span>
              <span>•</span>
              <span>Time: {t.time}</span>
            </div>

            <div className="mt-auto border-t border-[#1a1a20] pt-4 flex justify-between items-center z-10 relative">
              <div className={`text-xs font-bold ${t.status.includes('Owned') || t.status === 'Completed' ? 'text-green-500' : 'text-purple-400'}`}>
                {t.status}
              </div>
              <a href={`/journal/${t.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs font-bold text-white hover:text-purple-400 transition">View Journal →</a>
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
