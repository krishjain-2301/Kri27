'use server';

import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

export async function saveConnectionSettings(username: string, token: string) {
  const existingSettings = await db.select().from(settings).limit(1);
  
  if (existingSettings.length === 0) {
    await db.insert(settings).values({
      id: randomUUID(),
      htbUsername: username,
      htbAppToken: token,
      autoSync: true,
      syncInterval: '15 min'
    });
  } else {
    await db.update(settings).set({
      htbUsername: username,
      htbAppToken: token
    }).where(eq(settings.id, existingSettings[0].id));
  }
}

