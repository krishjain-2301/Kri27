import React from 'react';
import { Target, Monitor, Server, ShieldCheck, Flame } from 'lucide-react';

export default function TargetsPage() {
  const machines = [
    { name: "Optimum", os: "Windows", diff: "Easy", status: "Active", ip: "10.10.10.8" },
    { name: "Lame", os: "Linux", diff: "Easy", status: "Owned", ip: "10.10.10.3" },
    { name: "Brainfuck", os: "Linux", diff: "Insane", status: "Active", ip: "10.10.10.17" },
    { name: "Active", os: "Windows", diff: "Easy", status: "Owned", ip: "10.10.10.100" },
    { name: "Forest", os: "Windows", diff: "Easy", status: "Owned", ip: "10.10.10.161" },
    { name: "Hawk", os: "Linux", diff: "Medium", status: "Owned", ip: "10.10.10.102" },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hack The Box Targets</h1>
          <p className="text-gray-500 text-sm">Manage your active instances and view past pwns.</p>
        </div>
        <div className="flex gap-2">
          <button className="stakent-pill px-4 py-2 border border-[#1a1a20] hover:bg-[#2a2a30]">Status ▾</button>
          <button className="stakent-pill px-4 py-2 border border-[#1a1a20] hover:bg-[#2a2a30]">OS ▾</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((m, i) => (
          <div key={i} className="stakent-glass p-6 group hover:border-[#333] transition relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  m.status === 'Owned' ? 'bg-green-500/10 border-green-500/20' : 'bg-purple-500/10 border-purple-500/20'
                }`}>
                  {m.status === 'Owned' ? <ShieldCheck className="w-6 h-6 text-green-400" /> : <Target className="w-6 h-6 text-purple-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{m.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{m.ip}</p>
                </div>
              </div>
              <span className={`stakent-pill !px-2 !py-0.5 text-[10px] ${
                m.diff === 'Easy' ? 'text-green-400 border-green-900/30' : 
                m.diff === 'Medium' ? 'text-yellow-400 border-yellow-900/30' : 'text-red-400 border-red-900/30'
              }`}>{m.diff}</span>
            </div>

            <div className="flex items-center gap-4 border-t border-[#1a1a20] pt-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                {m.os === 'Windows' ? <Monitor className="w-3 h-3" /> : <Server className="w-3 h-3" />}
                {m.os}
              </div>
              <div className="w-px h-3 bg-[#333]"></div>
              <div className={`text-xs font-bold ${m.status === 'Owned' ? 'text-green-500' : 'text-purple-400'}`}>
                {m.status}
              </div>
            </div>

            {m.status === 'Owned' && (
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none"></div>
            )}
            {m.status === 'Active' && (
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
