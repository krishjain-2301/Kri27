import { runSyncPreview, runSyncCommit } from '../src/actions/sync';
import { db } from '../src/lib/db/client';
import { htbItems } from '../src/lib/db/schema';

async function verifySync() {
  console.log("Running Sync Preview...");
  const preview = await runSyncPreview();
  console.log(`Preview: ${preview.newItems.length} new items, ${preview.updatedItems.length} updated items`);
  
  console.log("Committing Sync...");
  await runSyncCommit(preview);
  
  console.log("Checking database...");
  const items = await db.select().from(htbItems);
  console.log(`Successfully synced ${items.length} items to SQLite.`);
  
  if (items.length > 0) {
    console.log("Sample Item:", items[0]);
  }
}

verifySync().then(() => process.exit(0)).catch(e => {
  console.error("Sync failed:", e);
  process.exit(1);
});
