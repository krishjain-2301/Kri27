import { db } from '@/lib/db/client';
import { htbItems, journal, journalHistory } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function getJournalEntry(id: string) {
  const result = await db.select({
    machine: htbItems,
    journal: journal
  })
  .from(journal)
  .leftJoin(htbItems, eq(journal.itemId, htbItems.id))
  .where(eq(journal.id, id))
  .limit(1);

  if (result.length === 0) return null;
  
  return result[0];
}

export async function saveJournalEntry(id: string, contentJson: string, contentMarkdown: string) {
  // Calculate status based on content length
  let status = 'Not Started';
  if (contentMarkdown.length > 3000) status = 'Completed';
  else if (contentMarkdown.length > 300) status = 'In Progress';

  await db.update(journal)
    .set({ 
      contentJson,
      contentMarkdown,
      journalStatus: status,
      updatedAt: new Date()
    })
    .where(eq(journal.id, id));
    
  // Save a snapshot to history every time
  await db.insert(journalHistory).values({
    id: randomUUID(),
    journalId: id,
    contentJson,
    contentMarkdown
  });
    
  // Update FTS5 index via triggers or raw sql if needed, but since we are just doing simple text search later, 
  // we'll eventually write an FTS5 sync routine.
    
  return { success: true, savedAt: new Date() };
}

export async function updatePersonalMetadata(id: string, data: any) {
  await db.update(journal).set({
    perceivedDifficulty: data.perceivedDifficulty,
    personalConfidence: data.personalConfidence,
    needsReview: data.needsReview ? 1 : 0,
    isFavorite: data.isFavorite ? 1 : 0,
    mood: data.mood,
    updatedAt: new Date()
  }).where(eq(journal.id, id));
  return { success: true };
}

export async function getJournalHistory(journalId: string) {
  const { desc } = await import('drizzle-orm');
  return await db.select()
    .from(journalHistory)
    .where(eq(journalHistory.journalId, journalId))
    .orderBy(desc(journalHistory.createdAt))
    .limit(20);
}
