import { db } from '@/lib/db/client';
import { htbItems, journal } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getLearningModules() {
  const items = await db.select({
    module: htbItems,
    journal: journal
  })
  .from(htbItems)
  .leftJoin(journal, eq(htbItems.id, journal.itemId))
  .where(eq(htbItems.type, 'Academy'))
  .orderBy(desc(htbItems.updatedAt));

  return items.map(i => ({
    ...i.module,
    journalId: i.journal?.id,
    journalStatus: i.journal?.journalStatus || 'Not Started'
  }));
}
