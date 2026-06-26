import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { journal } from '@/lib/db/schema';
import { randomUUID } from 'crypto';
import { format } from 'date-fns';
import { logActivityEvent } from '@/lib/services/events';

export async function POST() {
  try {
    const journalId = randomUUID();
    const title = `Daily Note: ${format(new Date(), 'dd MMM yyyy')}`;
    
    await db.insert(journal).values({
      id: journalId,
      itemId: null, // Null because it's a daily note not attached to a machine
      journalType: 'Daily',
      journalStatus: 'In Progress',
      title: title,
      content: '', // Start empty
    });

    await logActivityEvent({
      eventType: 'daily_note_created',
      entityType: 'daily_note',
      entityId: journalId,
      title: title,
      metadata: {}
    });

    return NextResponse.json({ id: journalId });
  } catch (error) {
    console.error('Failed to create daily note', error);
    return NextResponse.json({ error: 'Failed to create daily note' }, { status: 500 });
  }
}
