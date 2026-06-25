'use server';

import { db } from '@/db';
import { htbItems, journal, syncHistory, settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const MACHINE_TEMPLATE = `# Summary
---
# Enumeration
## Nmap
\`\`\`bash
\`\`\`
## Interesting Findings
---
# Exploitation
---
# Privilege Escalation
---
# Timeline
08:20 Started
---
# Mistakes
---
# Lessons Learned
---
# Commands Used
\`\`\`bash
\`\`\`
---
# References
---
# Screenshots
`;

const ACADEMY_TEMPLATE = `# Summary
---
# Key Concepts
---
# Commands Learned
\`\`\`bash
\`\`\`
---
# Things I Didn't Know
---
# Questions I Still Have
---
# Real-world Relevance
---
# Revision Notes
`;

export async function runSyncEngine() {
  const startTime = Date.now();
  let itemsUpdated = 0;
  let newEntries = 0;
  let errors = 0;

  try {
    // 1. Fetch token
    const userSettings = await db.select().from(settings).limit(1);
    const token = userSettings[0]?.htbAppToken;

    // Simulate API Fetching (In production, this is fetch('https://www.hackthebox.com/api/v4/...', { headers: { Authorization: \`Bearer \${token}\` } }))
    // Because this is a local app and HTB v4 endpoints change, we mock the sync payload to prove the idempotent engine works.
    
    // MOCK HTB PAYLOAD
    const htbActivity = [
      { id: '1', name: 'Crocodile', type: 'Machine', difficulty: 'Easy', status: 'Root Owned', startedAt: '26 June', completedAt: '26 June', timeSpent: '2h 14m' },
      { id: '2', name: 'Linux Fundamentals', type: 'Academy', difficulty: 'Easy', status: 'Completed', startedAt: '12 June', completedAt: '14 June', timeSpent: '4h 12m' },
    ];

    // 2. Additive Idempotent Sync
    for (const item of htbActivity) {
      // Check if item exists
      const existingItem = await db.select().from(htbItems).where(eq(htbItems.name, item.name)).limit(1);
      
      if (existingItem.length === 0) {
        // NEW ITEM
        const newItemId = randomUUID();
        
        await db.insert(htbItems).values({
          id: newItemId,
          name: item.name,
          type: item.type,
          difficulty: item.difficulty,
          status: item.status,
          os: item.type === 'Machine' ? 'Linux' : null,
          points: 0,
        });

        // CREATE JOURNAL ENTRY IDEMPOTENTLY
        await db.insert(journal).values({
          id: randomUUID(),
          itemId: newItemId,
          journalType: item.type,
          title: item.name,
          content: null, // Will be hydrated with the rich block template on client side initially, or we can store a raw string.
        });

        newEntries++;
        itemsUpdated++;
      } else {
        // UPDATE METADATA ONLY (NEVER OVERWRITE JOURNAL)
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

  // 3. Log Sync History
  await db.insert(syncHistory).values({
    id: randomUUID(),
    durationMs,
    itemsUpdated,
    newEntries,
    errors
  });

  return { success: true, durationMs, itemsUpdated, newEntries, errors };
}
