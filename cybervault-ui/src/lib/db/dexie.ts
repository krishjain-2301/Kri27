import Dexie, { Table } from 'dexie';

// ── Types matching the original SQLite schema ───────────────────────────────

export interface HtbItem {
  id: string;
  htbId?: string | null;
  title: string;
  type: 'Machine' | 'Challenge' | 'Sherlock' | 'Academy';
  difficulty?: string | null;
  status: string;
  startedAt?: Date | null;
  completedAt?: Date | null;
  url?: string | null;
  syncState?: string | null;
  lastSyncedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Journal {
  id: string;
  itemId?: string | null;
  journalType?: string | null;
  journalStatus?: string | null;
  title: string;
  content?: string | null;
  contentJson?: string | null;
  contentMarkdown?: string | null;
  perceivedDifficulty?: number | null;
  personalConfidence?: number | null;
  needsReview?: number | null;
  isFavorite?: number | null;
  mood?: string | null;
  wordCount?: number | null;
  lastOpenedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalHistory {
  id: string;
  journalId: string;
  contentJson?: string | null;
  contentMarkdown?: string | null;
  createdAt: Date;
}

export interface Settings {
  id: string;
  htbAppToken?: string | null;
  htbUsername?: string | null;
  autoSync?: boolean | null;
  syncInterval?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncHistory {
  id: string;
  durationMs: number;
  itemsUpdated: number;
  newEntries: number;
  errors: number;
  createdAt: Date;
}

export interface ProgressHistory {
  date: string; // YYYY-MM-DD primary key
  points?: number | null;
  rank?: number | null;
  machinesOwned?: number | null;
  academyModules?: number | null;
  challengesOwned?: number | null;
  streak?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Screenshot {
  id: string;
  journalId: string;
  imagePath: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ItemTag {
  itemId: string;
  tagId: string;
}

export interface ActivityEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  title: string;
  description?: string | null;
  metadata?: string | null;
  createdAt: Date;
}

// ── Dexie Database class ────────────────────────────────────────────────────

class PlethoraDB extends Dexie {
  htbItems!: Table<HtbItem>;
  journal!: Table<Journal>;
  journalHistory!: Table<JournalHistory>;
  settings!: Table<Settings>;
  syncHistory!: Table<SyncHistory>;
  progressHistory!: Table<ProgressHistory>;
  screenshots!: Table<Screenshot>;
  tags!: Table<Tag>;
  itemTags!: Table<ItemTag>;
  activityEvents!: Table<ActivityEvent>;

  constructor() {
    super('PlethoraDB');

    this.version(1).stores({
      htbItems: 'id, htbId, type, status, updatedAt',
      journal: 'id, itemId, journalType, journalStatus, updatedAt, createdAt, isFavorite, needsReview',
      journalHistory: 'id, journalId, createdAt',
      settings: 'id',
      syncHistory: 'id, createdAt',
      progressHistory: 'date',
      screenshots: 'id, journalId',
      tags: 'id, name',
      itemTags: '[itemId+tagId], itemId, tagId',
      activityEvents: 'id, entityType, entityId, createdAt',
    });
  }
}

// Singleton — only created on the client side
let _db: PlethoraDB | null = null;

export function getDb(): PlethoraDB {
  if (typeof window === 'undefined') {
    throw new Error('PlethoraDB can only be used on the client side');
  }
  if (!_db) {
    _db = new PlethoraDB();
  }
  return _db;
}

// Convenience export
export { PlethoraDB };
