'use server';

import { saveJournalEntry, updatePersonalMetadata as _updatePersonalMetadata } from '@/lib/queries/journal';

export async function autoSaveJournal(id: string, contentJson: string, contentMarkdown: string) {
  return await saveJournalEntry(id, contentJson, contentMarkdown);
}

export async function updatePersonalMetadata(id: string, data: any) {
  return await _updatePersonalMetadata(id, data);
}

export async function fetchJournalHistory(id: string) {
  const { getJournalHistory } = await import('@/lib/queries/journal');
  return await getJournalHistory(id);
}
