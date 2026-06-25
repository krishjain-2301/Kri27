'use server';

import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function saveCredentials(formData: FormData) {
  const username = formData.get('username') as string;
  const appToken = formData.get('appToken') as string;

  const existing = await db.select().from(settings).limit(1);
  if (existing.length > 0) {
    await db.update(settings).set({
      htbUsername: username || null,
      htbAppToken: appToken || null,
      updatedAt: new Date(),
    }).where(eq(settings.id, existing[0].id));
  } else {
    await db.insert(settings).values({
      id: 'default',
      htbUsername: username || null,
      htbAppToken: appToken || null,
    });
  }

  revalidatePath('/settings');
  revalidatePath('/');
}

export async function disconnectCredentials() {
  const existing = await db.select().from(settings).limit(1);
  if (existing.length > 0) {
    await db.update(settings).set({
      htbUsername: null,
      htbAppToken: null,
      updatedAt: new Date(),
    }).where(eq(settings.id, existing[0].id));
  }
  
  revalidatePath('/settings');
  revalidatePath('/');
}

export async function updateSyncPreferences(autoSync: boolean, syncInterval: string) {
  const existing = await db.select().from(settings).limit(1);
  if (existing.length > 0) {
    await db.update(settings).set({
      autoSync,
      syncInterval,
      updatedAt: new Date(),
    }).where(eq(settings.id, existing[0].id));
  } else {
    await db.insert(settings).values({
      id: 'default',
      autoSync,
      syncInterval,
    });
  }
  revalidatePath('/settings');
}
