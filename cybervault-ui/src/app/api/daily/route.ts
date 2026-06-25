import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { journal } from '@/lib/db/schema';
import { randomUUID } from 'crypto';
import { format } from 'date-fns';

export async function POST() {
  try {
    const id = randomUUID();
    const title = `Daily Note: ${format(new Date(), 'dd MMM yyyy')}`;
    
    await db.insert(journal).values({
      id,
      itemId: null, // Null because it's a daily note not attached to a machine
      journalType: 'Daily',
      journalStatus: 'In Progress',
      title: title,
      content: '', // Start empty
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Failed to create daily note', error);
    return NextResponse.json({ error: 'Failed to create daily note' }, { status: 500 });
  }
}
