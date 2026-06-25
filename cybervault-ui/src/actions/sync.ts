'use server';

import { executeSync } from '@/lib/services/sync';

export async function runSyncEngine() {
  return await executeSync();
}
