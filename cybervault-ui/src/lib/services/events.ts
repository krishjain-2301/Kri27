import { db } from '@/lib/db/client';
import { activityEvents } from '@/lib/db/schema';
import { randomUUID } from 'crypto';
import { eq, and, desc, sql } from 'drizzle-orm';

type EventType = 
  | 'machine_started'
  | 'machine_rooted'
  | 'challenge_completed'
  | 'journal_created'
  | 'journal_updated'
  | 'sync_completed'
  | 'screenshot_added'
  | 'daily_note_created';

type EntityType = 'machine' | 'challenge' | 'journal' | 'sync' | 'daily_note';

interface LogEventParams {
  eventType: EventType;
  entityType: EntityType;
  entityId: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

export async function logActivityEvent(params: LogEventParams) {
  // Specialized debouncing for 'journal_updated'
  if (params.eventType === 'journal_updated') {
    // Check if there is an existing 'journal_updated' event for this entity in the last 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentEvent = await db.select()
      .from(activityEvents)
      .where(
        and(
          eq(activityEvents.eventType, 'journal_updated'),
          eq(activityEvents.entityId, params.entityId),
          sql`${activityEvents.createdAt} > strftime('%s', ${oneHourAgo.toISOString()})`
        )
      )
      .orderBy(desc(activityEvents.createdAt))
      .limit(1);
      
    if (recentEvent.length > 0) {
      // We found a recent update event. We will just update it instead of creating a new one.
      // E.g., we can update the metadata to reflect total words added across the session.
      const existingMetadata = recentEvent[0].metadata ? JSON.parse(recentEvent[0].metadata) : {};
      const newMetadata = params.metadata || {};
      
      const mergedMetadata = {
        ...existingMetadata,
        ...newMetadata,
        words_added: (existingMetadata.words_added || 0) + (newMetadata.words_added || 0),
        last_edited: new Date().toISOString()
      };
      
      await db.update(activityEvents)
        .set({
          description: 'Updated journal multiple times today',
          metadata: JSON.stringify(mergedMetadata),
          createdAt: sql`(strftime('%s', 'now'))` // Bump the timestamp to latest
        })
        .where(eq(activityEvents.id, recentEvent[0].id));
        
      return;
    }
  }

  // Default: Insert new event
  await db.insert(activityEvents).values({
    id: randomUUID(),
    eventType: params.eventType,
    entityType: params.entityType,
    entityId: params.entityId,
    title: params.title,
    description: params.description,
    metadata: params.metadata ? JSON.stringify(params.metadata) : null,
  });
}
