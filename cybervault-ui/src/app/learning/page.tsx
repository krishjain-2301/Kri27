'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Layers } from 'lucide-react';
import { getLearningModules } from '@/lib/db/queries';

export default function LearningPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearningModules().then(setModules).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading modules...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" /> Learning
          </h1>
          <p className="text-gray-500 text-sm">HTB Academy modules and TryHackMe training paths.</p>
        </div>
      </div>

      {modules.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="mb-6">No learning modules found. Complete a module on HTB or room on THM to get started.</p>
          <a href="/settings" className="stakent-btn-primary mx-auto !py-3 !px-6 inline-flex">
            Sync Settings
          </a>
        </div>
      )}

      <div className="space-y-4">
        {modules.map((m: any) => {
          const isTHM = m.provider === 'THM' || m.htbId?.startsWith('thm_') || m.id?.startsWith('thm_');

          const iconContainer = isTHM
            ? 'bg-red-500/10 border-red-500/20'
            : 'bg-green-500/10 border-green-500/20';

          const iconColor = isTHM ? 'text-red-400' : 'text-green-400';
          const badgeStyle = isTHM
            ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : 'bg-green-500/10 text-green-400 border-green-500/20';

          return (
            <div key={m.id} className="stakent-glass p-6 flex items-center justify-between group hover:border-[#333] transition">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${iconContainer}`}>
                  {isTHM ? (
                    <Layers className={`w-6 h-6 ${iconColor}`} />
                  ) : (
                    <CheckCircle className={`w-6 h-6 ${iconColor}`} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg mb-1">{m.title}</h3>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badgeStyle}`}>
                      {isTHM ? 'THM' : 'HTB'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.difficulty === 'Easy' || m.difficulty === 'Info' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                    }`}>{m.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right hidden md:block">
                  <p className={`text-xs font-bold ${isTHM ? 'text-red-400' : 'text-green-400'}`}>
                    {m.status}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Points: {m.points}</p>
                </div>
                {m.journalId && (
                  <a href={`/journal/${m.journalId}`} className="stakent-btn-primary !py-2.5">
                    {m.journalStatus === 'Not Started' ? 'Start Notes →' : 'View Notes →'}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
