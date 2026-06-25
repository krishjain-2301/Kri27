'use server';

import { saveJournalEntry } from '@/lib/queries/journal';

export async function autoSaveJournal(id: string, content: string) {
  return await saveJournalEntry(id, content);
}
