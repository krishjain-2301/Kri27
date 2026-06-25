import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { getLearningModules } from '@/lib/queries/learning';

export const dynamic = 'force-dynamic';

export default async function LearningPage() {
  const modules = await getLearningModules();

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" /> Learning
          </h1>
          <p className="text-gray-500 text-sm">HTB Academy modules and fundamental training.</p>
        </div>
      </div>

      {modules.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="mb-6">No Academy modules found. Once you complete a module it will appear here.</p>
          <form action="/settings">
            <button className="stakent-btn-primary mx-auto !py-3 !px-6 text-white border border-[#1a1a20] hover:bg-[#1a1a20]">
              Sync
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {modules.map((m: any) => (
          <div key={m.id} className="stakent-glass p-6 flex items-center justify-between group hover:border-[#333] transition">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                m.status === 'Completed' ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20'
              }`}>
                {m.status === 'Completed' ? <CheckCircle className="w-6 h-6 text-green-400" /> : <BookOpen className="w-6 h-6 text-blue-400" />}
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-1">{m.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                  }`}>{m.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right hidden md:block">
                <p className={`text-xs font-bold ${m.status === 'Completed' ? 'text-green-500' : 'text-blue-400'}`}>
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
        ))}
      </div>
    </div>
  );
}
