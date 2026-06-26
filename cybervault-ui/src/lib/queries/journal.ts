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
  // Get old content for word count diff
  const oldJournal = await db.select({ contentMarkdown: journal.contentMarkdown, title: journal.title }).from(journal).where(eq(journal.id, id)).limit(1);
  const oldWords = oldJournal[0]?.contentMarkdown ? oldJournal[0].contentMarkdown.split(/\s+/).length : 0;
  const newWords = contentMarkdown.split(/\s+/).length;
  const wordsAdded = newWords - oldWords;

  // Calculate status based on content length
  let status = 'Not Started';
  if (contentMarkdown.length > 3000) status = 'Completed';
  else if (contentMarkdown.length > 300) status = 'In Progress';

  await db.update(journal)
    .set({ 
      contentJson,
      contentMarkdown,
      journalStatus: status,
      wordCount: newWords,
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

  const { logActivityEvent } = await import('@/lib/services/events');
  await logActivityEvent({
    eventType: 'journal_updated',
    entityType: 'journal',
    entityId: id,
    title: oldJournal[0]?.title || 'Journal',
    metadata: { words_added: wordsAdded > 0 ? wordsAdded : 0, total_words: newWords }
  });
    
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
