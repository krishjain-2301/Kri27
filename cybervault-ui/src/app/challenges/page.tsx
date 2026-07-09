'use client';

import React, { useEffect, useState } from 'react';
import { Swords, Target } from 'lucide-react';
import { getChallenges } from '@/lib/db/queries';
import EngagementsGrid from './EngagementsGrid';

export default function ChallengesPage() {
  const [targets, setTargets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChallenges().then(setTargets).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading engagements...</div>;

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
          <a href="/settings" className="stakent-btn-primary mx-auto !py-3 !px-6 inline-flex">
            Connect HTB
          </a>
        </div>
      ) : (
        <EngagementsGrid initialTargets={targets} />
      )}
    </div>
  );
}
