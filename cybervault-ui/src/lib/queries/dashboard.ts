import { db } from '@/lib/db/client';
import { htbItems, journal } from '@/lib/db/schema';
import { eq, desc, and, or, sql } from 'drizzle-orm';

export async function getDashboardStats() {
  const allItems = await db.select().from(htbItems);
  
  return {
    machines: allItems.filter(i => i.type === 'Machine').length,
    academyModules: allItems.filter(i => i.type === 'Academy').length,
    challenges: allItems.filter(i => i.type === 'Challenge' || i.type === 'Sherlock').length,
    totalSessions: allItems.length // Placeholder for total sessions
  };
}

export async function getTodaysRecommendation() {
  // Find a machine that is completed or root owned, but journal is Not Started or In Progress
  const recommendation = await db.select({
    machine: htbItems,
    journal: journal
  })
  .from(htbItems)
  .leftJoin(journal, eq(htbItems.id, journal.itemId))
  .where(
    and(
      eq(htbItems.type, 'Machine'),
      or(eq(htbItems.status, 'Completed'), eq(htbItems.status, 'Root Owned')),
      or(eq(journal.journalStatus, 'Not Started'), eq(journal.journalStatus, 'In Progress'))
    )
  )
  .limit(1);

  if (recommendation.length === 0) return null;

  const charCount = recommendation[0].journal?.contentMarkdown?.length || 0;
  let status = 'Not Started';
  if (charCount > 3000) status = 'Complete';
  else if (charCount > 1200) status = 'Detailed';
  else if (charCount > 300) status = 'Started';

  return {
    ...recommendation[0].machine,
    journalStatus: status,
    journalId: recommendation[0].journal?.id,
    charCount
  };
}

export async function getRecentActivity() {
  // Fetch the last 3 items that were updated
  return await db.select().from(htbItems).orderBy(desc(htbItems.updatedAt)).limit(3);
}
