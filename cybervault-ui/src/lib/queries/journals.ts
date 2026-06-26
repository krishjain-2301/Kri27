import { db } from '@/lib/db/client';
import { htbItems, journal, screenshots } from '@/lib/db/schema';
import { eq, desc, sql, count } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export type JournalHubEntry = {
  id: string;
  title: string;
  journalType: string | null;
  journalStatus: string | null;
  mood: string | null;
  wordCount: number | null;
  isFavorite: number | null;
  needsReview: number | null;
  perceivedDifficulty: number | null;
  updatedAt: Date;
  createdAt: Date;
  // From htb_items
  itemType: string | null;
  itemDifficulty: string | null;
  itemStatus: string | null;
  screenshotCount: number;
};

export async function getAllJournals(): Promise<JournalHubEntry[]> {
  const rows = await db
    .select({
      id: journal.id,
      title: journal.title,
      journalType: journal.journalType,
      journalStatus: journal.journalStatus,
      mood: journal.mood,
      wordCount: journal.wordCount,
      isFavorite: journal.isFavorite,
      needsReview: journal.needsReview,
      perceivedDifficulty: journal.perceivedDifficulty,
      updatedAt: journal.updatedAt,
      createdAt: journal.createdAt,
      itemType: htbItems.type,
      itemDifficulty: htbItems.difficulty,
      itemStatus: htbItems.status,
    })
    .from(journal)
    .leftJoin(htbItems, eq(journal.itemId, htbItems.id))
    .orderBy(desc(journal.updatedAt));

  // Get screenshot counts per journal
  const screenshotCounts = await db
    .select({
      journalId: screenshots.journalId,
      cnt: count(screenshots.id),
    })
    .from(screenshots)
    .groupBy(screenshots.journalId);

  const screenshotMap = new Map(
    screenshotCounts.map((s) => [s.journalId, Number(s.cnt)])
  );

  return rows.map((r) => ({
    ...r,
    screenshotCount: screenshotMap.get(r.id) ?? 0,
  }));
}

export async function toggleJournalPin(id: string, pinned: boolean) {
  await db
    .update(journal)
    .set({ isFavorite: pinned ? 1 : 0, updatedAt: new Date() })
    .where(eq(journal.id, id));
  return { success: true };
}

export async function saveJournalEntryWithWordCount(
  id: string,
  contentJson: string,
  contentMarkdown: string,
  wordCount: number
) {
  let status = 'Not Started';
  if (contentMarkdown.length > 3000) status = 'Completed';
  else if (contentMarkdown.length > 300) status = 'In Progress';

  await db
    .update(journal)
    .set({
      contentJson,
      contentMarkdown,
      journalStatus: status,
      wordCount,
      updatedAt: new Date(),
    })
    .where(eq(journal.id, id));

  return { success: true, savedAt: new Date() };
}

export async function createJournalHistorySnapshot(
  journalId: string,
  contentJson: string,
  contentMarkdown: string
) {
  await db.insert(require('@/lib/db/schema').journalHistory).values({
    id: randomUUID(),
    journalId,
    contentJson,
    contentMarkdown,
  });
  return { success: true };
}
