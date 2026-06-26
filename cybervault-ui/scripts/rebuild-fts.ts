import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'CyberVault_Data', 'vault.db');
const db = new Database(dbPath);

console.log('Rebuilding FTS5 tables...');

// Drop existing
db.exec(`
  DROP TRIGGER IF EXISTS journal_fts_insert;
  DROP TRIGGER IF EXISTS journal_fts_update;
  DROP TRIGGER IF EXISTS journal_fts_delete;
  DROP TABLE IF EXISTS journal_fts;
`);

console.log('Dropped old FTS tables and triggers.');

// Create new
db.exec(`
  CREATE VIRTUAL TABLE journal_fts USING fts5(
    id UNINDEXED, 
    title, 
    content, 
    tokenize='trigram'
  );

  CREATE TRIGGER journal_fts_insert AFTER INSERT ON journal BEGIN
    INSERT INTO journal_fts(id, title, content) VALUES (new.id, new.title, new.content_markdown);
  END;

  CREATE TRIGGER journal_fts_delete AFTER DELETE ON journal BEGIN
    DELETE FROM journal_fts WHERE id = old.id;
  END;

  CREATE TRIGGER journal_fts_update AFTER UPDATE ON journal BEGIN
    UPDATE journal_fts SET title = new.title, content = new.content_markdown WHERE id = new.id;
  END;
`);

console.log('Created new FTS tables and triggers.');

// Backfill data
const journals = db.prepare('SELECT id, title, content_markdown FROM journal').all();
const insert = db.prepare('INSERT INTO journal_fts (id, title, content) VALUES (?, ?, ?)');

const backfill = db.transaction((rows: any[]) => {
  for (const row of rows) {
    insert.run(row.id, row.title, row.content_markdown || '');
  }
});

backfill(journals);

console.log(`Successfully backfilled ${journals.length} journals into FTS.`);
