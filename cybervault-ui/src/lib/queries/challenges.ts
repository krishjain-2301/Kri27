import { db } from '@/lib/db/client';
import { htbItems, journal } from '@/lib/db/schema';
import { eq, inArray, desc } from 'drizzle-orm';

export async function getChallenges() {
  const items = await db.select({
    machine: htbItems,
    journal: journal
  })
  .from(htbItems)
  .leftJoin(journal, eq(htbItems.id, journal.itemId))
  .where(inArray(htbItems.type, ['Machine', 'Challenge', 'Sherlock']))
  .orderBy(desc(htbItems.updatedAt));

  return items.map(i => ({
    ...i.machine,
    journalId: i.journal?.id,
    journalStatus: i.journal?.journalStatus || 'Not Started'
  }));
}
