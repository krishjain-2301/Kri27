import { db } from '@/lib/db/client';
import { htbItems, journal, syncHistory, settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { LearningProvider, SyncPreview } from '../providers/base/contract';
import { CyberVaultItem } from '../providers/base/models';

export async function generateSyncPreview(provider: LearningProvider): Promise<SyncPreview> {
  const remoteItems = await provider.fetchLearningState();
  const localItems = await db.select().from(htbItems);
  
  const preview: SyncPreview = { newItems: [], updatedItems: [] };

  for (const remote of remoteItems) {
    const local = localItems.find(l => l.name === remote.name && l.type === remote.type);
    
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
        name: item.name,
        type: item.type,
        difficulty: item.difficulty,
        status: item.status,
        os: item.os,
      });

      // Never overwrite existing journals, but since this is a new item, we create a fresh one
      await db.insert(journal).values({
        id: randomUUID(),
        itemId: itemId,
        journalType: item.type,
        journalStatus: 'Not Started',
        title: item.name,
        content: '',
      });

      itemsImported++;
    }

    // Update Existing Items
    for (const item of preview.updatedItems) {
      await db.update(htbItems)
        .set({ status: item.status, difficulty: item.difficulty })
        .where(eq(htbItems.name, item.name));
      itemsUpdated++;
    }

    const durationMs = Date.now() - startTime;

    // Log to Sync History
    await db.insert(syncHistory).values({
      id: randomUUID(),
      status: 'Success',
      newEntries: itemsImported,
      updatedEntries: itemsUpdated,
      // Store duration as note for now
      notes: `Provider: ${provider.name} ${provider.version} | Duration: ${(durationMs/1000).toFixed(2)}s`
    });

    return { success: true, newEntries: itemsImported, updatedEntries: itemsUpdated, durationMs };

  } catch (error: any) {
    console.error('Commit Sync Error:', error);
    
    await db.insert(syncHistory).values({
      id: randomUUID(),
      status: 'Failed',
      newEntries: itemsImported,
      updatedEntries: itemsUpdated,
      notes: error.message || 'Unknown error during sync commit'
    });

    return { success: false, error: error.message };
  }
}
