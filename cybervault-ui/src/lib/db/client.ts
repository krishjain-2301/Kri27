import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Use a local file for the SQLite database
const sqlite = new Database(path.join(process.cwd(), 'cybervault.db'));

// Setup FTS5 Virtual Table for the journal search
sqlite.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS journal_fts USING fts5(
    id UNINDEXED, 
    title, 
    content, 
    tokenize='trigram'
  );
  
  -- Create triggers to keep FTS table in sync
  CREATE TRIGGER IF NOT EXISTS journal_fts_insert AFTER INSERT ON journal BEGIN
    INSERT INTO journal_fts(id, title, content) VALUES (new.id, new.title, new.content);
  END;
  
  CREATE TRIGGER IF NOT EXISTS journal_fts_delete AFTER DELETE ON journal BEGIN
    DELETE FROM journal_fts WHERE id = old.id;
  END;
  
  CREATE TRIGGER IF NOT EXISTS journal_fts_update AFTER UPDATE ON journal BEGIN
    UPDATE journal_fts SET title = new.title, content = new.content WHERE id = new.id;
  END;
`);

export const db = drizzle(sqlite, { schema });
