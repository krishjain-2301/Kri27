import Database from 'better-sqlite3';
import path from 'path';

// Connect to the database
const dbPath = path.resolve(process.cwd(), 'cybervault.db');
const db = new Database(dbPath);

console.log('Starting Phase 3 Migration...');

try {
  // 1. Add new columns to the journal table
  const columnsToAdd = [
    { name: 'content_json', type: 'text' },
    { name: 'content_markdown', type: 'text' },
    { name: 'perceived_difficulty', type: 'integer' },
    { name: 'personal_confidence', type: 'integer' },
    { name: 'needs_review', type: 'integer DEFAULT 0' },
    { name: 'is_favorite', type: 'integer DEFAULT 0' },
    { name: 'mood', type: 'text' },
  ];

  for (const col of columnsToAdd) {
    try {
      db.prepare(`ALTER TABLE journal ADD COLUMN ${col.name} ${col.type}`).run();
      console.log(`Added column ${col.name} to journal table.`);
    } catch (e: any) {
      if (e.message.includes('duplicate column name')) {
        console.log(`Column ${col.name} already exists. Skipping.`);
      } else {
        throw e;
      }
    }
  }

  // 2. Create the journal_history table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS journal_history (
      id TEXT PRIMARY KEY,
      journal_id TEXT NOT NULL,
      content_json TEXT,
      content_markdown TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY(journal_id) REFERENCES journal(id) ON DELETE CASCADE
    )
  `).run();
  console.log('Created journal_history table.');

  // 3. Data Migration: Copy legacy 'content' -> 'content_markdown' if content_markdown is null
  // We'll leave content_json empty so the rich editor knows to initialize an empty block or convert the markdown
  const updateStmt = db.prepare(`
    UPDATE journal 
    SET content_markdown = content 
    WHERE content_markdown IS NULL AND content IS NOT NULL
  `);
  const info = updateStmt.run();
  console.log(`Migrated legacy content to content_markdown for ${info.changes} journals.`);

  console.log('Migration completed successfully.');
} catch (error) {
  console.error('Migration failed:', error);
} finally {
  db.close();
}
