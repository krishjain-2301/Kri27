import { db } from '@/lib/db/client';
import { htbItems, journal, syncHistory, settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { HackTheBoxProvider, SyncProvider } from './providers/htb';

export async function executeSync() {
  const startTime = Date.now();
  let itemsUpdated = 0;
  let newEntries = 0;
  let errors = 0;

  try {
    const userSettings = await db.select().from(settings).limit(1);
    const token = userSettings[0]?.htbAppToken || '';

    // Initialize Provider
    const provider: SyncProvider = new HackTheBoxProvider(token);
    const htbActivity = await provider.fetchActivity();

    // Additive Idempotent Sync
    for (const item of htbActivity) {
      const existingItem = await db.select().from(htbItems).where(eq(htbItems.name, item.name)).limit(1);
      
      if (existingItem.length === 0) {
        const newItemId = randomUUID();
        
        await db.insert(htbItems).values({
          id: newItemId,
          name: item.name,
          type: item.type,
          difficulty: item.difficulty,
          status: item.status,
          os: item.os,
          points: 0,
        });

        // CREATE BLANK JOURNAL ENTRY IDEMPOTENTLY
        await db.insert(journal).values({
          id: randomUUID(),
          itemId: newItemId,
          journalType: item.type,
          journalStatus: 'Not Started',
          title: item.name,
          content: '', // BLANK ROW AS REQUESTED
        });

        newEntries++;
        itemsUpdated++;
      } else {
        // Update metadata, do NOT touch journal
        await db.update(htbItems)
          .set({ status: item.status, difficulty: item.difficulty })
          .where(eq(htbItems.id, existingItem[0].id));
        
        itemsUpdated++;
      }
    }

  } catch (error) {
    console.error('Sync Error:', error);
    errors++;
  }

  const durationMs = Date.now() - startTime;

  await db.insert(syncHistory).values({
    id: randomUUID(),
    durationMs,
    itemsUpdated,
    newEntries,
    errors
  });

  return { success: true, durationMs, itemsUpdated, newEntries, errors };
}
