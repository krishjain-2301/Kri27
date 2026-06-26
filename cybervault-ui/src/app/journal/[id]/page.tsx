import React from 'react';
import JournalClient from './JournalClient';
import { getJournalEntry } from '@/lib/queries/journal';
import { notFound } from 'next/navigation';
import { getTemplateForType } from '@/lib/templates';

export const dynamic = 'force-dynamic';

export default async function JournalPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const data = await getJournalEntry(params.id);

  if (!data) {
    notFound();
  }

  const template = getTemplateForType(data.machine?.type || data.journal.journalType);

  return (
    <JournalClient 
      initialData={data} 
      machineTemplate={template} 
    />
  );
}
