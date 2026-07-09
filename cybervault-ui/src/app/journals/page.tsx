'use client';

import React, { useEffect, useState } from 'react';
import { getAllJournals, JournalHubEntry } from '@/lib/db/queries';
import JournalHubClient from './JournalHubClient';

export default function JournalsPage() {
  const [journals, setJournals] = useState<JournalHubEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllJournals()
      .then(setJournals)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading journals...</div>;

  return <JournalHubClient journals={journals} />;
}
