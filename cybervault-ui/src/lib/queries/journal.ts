import { db } from '@/lib/db/client';
import { htbItems, journal } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

export async function saveJournalEntry(id: string, content: string) {
  // Calculate status based on content length
  let status = 'Not Started';
  if (content.length > 3000) status = 'Completed';
  else if (content.length > 300) status = 'In Progress';

  await db.update(journal)
    .set({ 
      content, 
      journalStatus: status,
      updatedAt: new Date()
    })
    .where(eq(journal.id, id));
    
  return { success: true, savedAt: new Date() };
}
