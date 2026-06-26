'use server';

import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';
import { generateSyncPreview, commitSync } from '@/lib/services/sync';
import { HackTheBoxProvider } from '@/lib/providers/htb/provider';
import { SyncPreview } from '@/lib/providers/base/contract';

async function getProvider() {
  const userSettings = await db.select().from(settings).limit(1);
  if (userSettings.length === 0 || !userSettings[0].htbAppToken) {
    throw new Error("No App Token configured");
  }
  return new HackTheBoxProvider(userSettings[0].htbAppToken);
}

export async function runSyncPreview(): Promise<SyncPreview> {
  const provider = await getProvider();
  return await generateSyncPreview(provider);
}

export async function runSyncCommit(preview: SyncPreview) {
  const provider = await getProvider();
  return await commitSync(provider, preview);
}

export async function triggerManualSync() {
  const preview = await runSyncPreview();
  await runSyncCommit(preview);
  return { success: true };
}
