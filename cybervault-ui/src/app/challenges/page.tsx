import React from 'react';
import { Swords, Target } from 'lucide-react';
import { getChallenges } from '@/lib/queries/challenges';
import EngagementsGrid from './EngagementsGrid';

export const dynamic = 'force-dynamic';

export default async function ChallengesPage() {
  const targets = await getChallenges();

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Swords className="w-8 h-8 text-red-500" /> Engagements
          </h1>
          <p className="text-gray-500 text-sm">Your practical targets: Machines, Challenges, and Sherlocks.</p>
        </div>
      </div>

      {targets.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="mb-6">No engagements yet. Complete your first HTB engagement or sync your account.</p>
          <form action="/settings">
            <button className="stakent-btn-primary mx-auto !py-3 !px-6 text-white border border-[#1a1a20] hover:bg-[#1a1a20]">
              Sync Now
            </button>
          </form>
        </div>
      ) : (
        <EngagementsGrid initialTargets={targets} />
      )}
    </div>
  );
}
