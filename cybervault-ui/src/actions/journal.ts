'use server';

import { updatePersonalMetadata as _updatePersonalMetadata } from '@/lib/queries/journal';
import { saveJournalEntryWithWordCount, createJournalHistorySnapshot as _createJournalHistorySnapshot } from '@/lib/queries/journals';

export async function autoSaveJournal(id: string, contentJson: string, contentMarkdown: string, wordCount: number) {
  return await saveJournalEntryWithWordCount(id, contentJson, contentMarkdown, wordCount);
}

export async function createJournalHistorySnapshot(id: string, contentJson: string, contentMarkdown: string) {
  return await _createJournalHistorySnapshot(id, contentJson, contentMarkdown);
}

export async function updatePersonalMetadata(id: string, data: any) {
  return await _updatePersonalMetadata(id, data);
}

export async function fetchJournalHistory(id: string) {
  const { getJournalHistory } = await import('@/lib/queries/journal');
  return await getJournalHistory(id);
}

export async function toggleJournalPinAction(id: string, pinned: boolean) {
  const { toggleJournalPin } = await import('@/lib/queries/journals');
  return await toggleJournalPin(id, pinned);
}

export async function deleteJournalAction(id: string) {
  const { db } = await import('@/lib/db/client');
  const { journal } = await import('@/lib/db/schema');
  const { eq } = await import('drizzle-orm');
  await db.delete(journal).where(eq(journal.id, id));
  return { success: true };
}

