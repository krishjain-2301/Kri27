'use client';

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import JournalClient from './JournalClient';
import { getJournalEntry } from '@/lib/db/queries';
import { getTemplateForType } from '@/lib/templates';

export default function JournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [template, setTemplate] = useState<string>('');
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const entry = await getJournalEntry(id);
      if (!entry) {
        setNotFound(true);
      } else {
        setData(entry);
        setTemplate(getTemplateForType(entry.machine?.type || entry.journal.journalType));
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="p-8 text-gray-500">Loading journal...</div>;
  if (notFound) return (
    <div className="p-8 text-center text-gray-500">
      <p className="text-xl font-bold mb-2">Journal not found</p>
      <a href="/journals" className="text-purple-400 hover:underline">← Back to journals</a>
    </div>
  );

  return <JournalClient initialData={data} machineTemplate={template} />;
}
