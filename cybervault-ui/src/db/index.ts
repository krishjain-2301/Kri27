import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Use a local file for the SQLite database
const sqlite = new Database(path.join(process.cwd(), 'cybervault.db'));
export const db = drizzle(sqlite, { schema });
