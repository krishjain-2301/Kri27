import React, { Suspense } from 'react';
import JournalHubClient from './JournalHubClient';
import { getAllJournals } from '@/lib/queries/journals';

export const dynamic = 'force-dynamic';

export default async function JournalsPage() {
  const journals = await getAllJournals();
  
  return (
    <Suspense fallback={<div className="p-8">Loading journals...</div>}>
      <JournalHubClient journals={journals} />
    </Suspense>
  );
}
