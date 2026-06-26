import { db } from '@/lib/db/client';
import { htbItems, journal, syncHistory, settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { LearningProvider, SyncPreview } from '../providers/base/contract';
import { CyberVaultItem } from '../providers/base/models';
import { logActivityEvent } from './events';

export async function generateSyncPreview(provider: LearningProvider): Promise<SyncPreview> {
  const remoteItems = await provider.fetchLearningState();
  const localItems = await db.select().from(htbItems);
  
  const preview: SyncPreview = { newItems: [], updatedItems: [] };

  for (const remote of remoteItems) {
    const local = localItems.find(l => l.htbId === remote.providerId);
    
    if (!local) {
      preview.newItems.push(remote);
    } else if (local.status !== remote.status || local.difficulty !== remote.difficulty) {
      preview.updatedItems.push(remote);
    }
  }

  return preview;
}

export async function commitSync(provider: LearningProvider, preview: SyncPreview) {
  const startTime = Date.now();
  let itemsImported = 0;
  let itemsUpdated = 0;

  try {
    // Upsert New Items
    for (const item of preview.newItems) {
      const itemId = randomUUID();
      await db.insert(htbItems).values({
        id: itemId,
        htbId: item.providerId,
        title: item.name,
        type: item.type,
        difficulty: item.difficulty,
        status: item.status,
      });

      const journalId = randomUUID();
      // Never overwrite existing journals, but since this is a new item, we create a fresh one
      await db.insert(journal).values({
        id: journalId,
        itemId: itemId,
        journalType: item.type,
        journalStatus: 'Not Started',
        title: item.name,
        content: '',
      });

      // Emit Event based on status
      const entityType = item.type === 'Challenge' ? 'challenge' : 'machine';
      let eventType: any = item.type === 'Challenge' ? 'machine_started' : 'machine_started'; // generic fallback
      if (item.status === 'Root Owned' || item.status === 'Completed') {
        eventType = item.type === 'Challenge' ? 'challenge_completed' : 'machine_rooted';
      }
      
      await logActivityEvent({
        eventType,
        entityType,
        entityId: itemId,
        title: item.name,
        metadata: { status: item.status, difficulty: item.difficulty }
      });

      itemsImported++;
    }

    // Update Existing Items
    for (const item of preview.updatedItems) {
      await db.update(htbItems)
        .set({ status: item.status, difficulty: item.difficulty })
        .where(eq(htbItems.htbId, item.providerId));
        
      // Fetch local ID to log event
      const localItem = await db.select().from(htbItems).where(eq(htbItems.htbId, item.providerId)).limit(1);
      
      if (localItem.length > 0 && (item.status === 'Root Owned' || item.status === 'Completed')) {
        const entityType = item.type === 'Challenge' ? 'challenge' : 'machine';
        const eventType = item.type === 'Challenge' ? 'challenge_completed' : 'machine_rooted';
        await logActivityEvent({
          eventType,
          entityType,
          entityId: localItem[0].id,
          title: item.name,
          metadata: { status: item.status, difficulty: item.difficulty }
        });
      }
        
      itemsUpdated++;
    }

    const durationMs = Date.now() - startTime;

    // Log to Sync History
    await db.insert(syncHistory).values({
      id: randomUUID(),
      newEntries: itemsImported,
      itemsUpdated: itemsUpdated,
      errors: 0,
      durationMs: durationMs,
    });

    await logActivityEvent({
      eventType: 'sync_completed',
      entityType: 'sync',
      entityId: randomUUID(),
      title: 'Sync Completed',
      description: `Imported ${itemsImported} items, updated ${itemsUpdated} items in ${durationMs}ms`,
      metadata: { itemsImported, itemsUpdated, durationMs }
    });

    return { success: true, newEntries: itemsImported, updatedEntries: itemsUpdated, durationMs };

  } catch (error: any) {
    console.error('Commit Sync Error:', error);
    
    await db.insert(syncHistory).values({
      id: randomUUID(),
      newEntries: itemsImported,
      itemsUpdated: itemsUpdated,
      errors: 1,
      durationMs: Date.now() - startTime,
    });

    return { success: false, error: error.message };
  }
}
