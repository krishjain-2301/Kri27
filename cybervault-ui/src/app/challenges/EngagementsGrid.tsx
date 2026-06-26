'use client';

import React, { useState } from 'react';
import { Target, ShieldCheck, BookOpen, Search, ChevronDown } from 'lucide-react';

export default function EngagementsGrid({ initialTargets }: { initialTargets: any[] }) {
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const filteredTargets = initialTargets.filter(t => {
    if (typeFilter !== 'All' && t.type !== typeFilter) return false;
    
    if (statusFilter !== 'All') {
      if (statusFilter === 'Completed' && !t.status.includes('Owned') && t.status !== 'Completed') return false;
      if (statusFilter !== 'Completed' && t.status !== statusFilter) return false;
    }
    
    return true;
  });

  return (
    <>
      <div className="flex gap-4 mb-8">
        {/* Type Filter */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsTypeOpen(!isTypeOpen);
              setIsStatusOpen(false);
            }}
            className="stakent-pill px-4 py-2 border border-[#1a1a20] hover:bg-[#2a2a30] flex items-center gap-2 cursor-pointer text-sm bg-[#0c0c0e] text-gray-300"
          >
            {typeFilter === 'All' ? 'All Types' : typeFilter}
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {isTypeOpen && (
            <div className="absolute top-full mt-2 w-48 bg-[#111] border border-[#222] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
              {['All', 'Machine', 'Challenge', 'Sherlock'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setTypeFilter(type);
                    setIsTypeOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#222] transition ${typeFilter === type ? 'text-purple-400 font-bold' : 'text-gray-400'}`}
                >
                  {type === 'All' ? 'All Types' : type + 's'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsTypeOpen(false);
            }}
            className="stakent-pill px-4 py-2 border border-[#1a1a20] hover:bg-[#2a2a30] flex items-center gap-2 cursor-pointer text-sm bg-[#0c0c0e] text-gray-300"
          >
            {statusFilter === 'All' ? 'All Statuses' : statusFilter}
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isStatusOpen && (
            <div className="absolute top-full mt-2 w-48 bg-[#111] border border-[#222] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
              {['All', 'Not Started', 'In Progress', 'Completed'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setIsStatusOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#222] transition ${statusFilter === status ? 'text-purple-400 font-bold' : 'text-gray-400'}`}
                >
                  {status === 'All' ? 'All Statuses' : status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredTargets.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="mb-6">No engagements match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTargets.map((t: any) => (
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
      )}
    </>
  );
}
