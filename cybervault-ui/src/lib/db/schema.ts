import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Timestamps helper
const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
};

export const htbItems = sqliteTable('htb_items', {
  id: text('id').primaryKey(), // We'll generate standard UUIDs
  htbId: text('htb_id').unique(), // The ID from HTB API
  title: text('title').notNull(),
  type: text('type', { enum: ['Machine', 'Challenge', 'Sherlock', 'Academy'] }).notNull(),
  difficulty: text('difficulty'),
  status: text('status').notNull().default('Not Started'), // Not Started, In Progress, User Owned, Root Owned, Completed
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  url: text('url'),
  
  // Sync state
  syncState: text('sync_state').default('pending'), // synced, modified, pending, conflict
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
  
  ...timestamps
});

export const journal = sqliteTable('journal', {
  id: text('id').primaryKey(),
  itemId: text('item_id').references(() => htbItems.id, { onDelete: 'cascade' }), // Nullable for Daily Journals
  journalType: text('journal_type'), // 'Academy', 'Machine', or 'Daily'
  journalStatus: text('journal_status').default('Not Started'), // 'Not Started', 'In Progress', 'Completed'
  
  title: text('title').notNull(),
  content: text('content'), // Legacy
  contentJson: text('content_json'),
  contentMarkdown: text('content_markdown'),
  perceivedDifficulty: integer('perceived_difficulty'),
  personalConfidence: integer('personal_confidence'),
  needsReview: integer('needs_review').default(0),
  isFavorite: integer('is_favorite').default(0),
  mood: text('mood'),
  
  wordCount: integer('word_count').default(0),
  lastOpenedAt: integer('last_opened_at', { mode: 'timestamp' }),
  
  ...timestamps
});

export const journalHistory = sqliteTable('journal_history', {
  id: text('id').primaryKey(),
  journalId: text('journal_id').notNull().references(() => journal.id, { onDelete: 'cascade' }),
  contentJson: text('content_json'),
  contentMarkdown: text('content_markdown'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const settings = sqliteTable('settings', {
  id: text('id').primaryKey(),
  htbAppToken: text('htb_app_token'),
  htbUsername: text('htb_username'),
  autoSync: integer('auto_sync', { mode: 'boolean' }).default(false),
  syncInterval: text('sync_interval').default('Manual'), // 'Manual', '15 min', '30 min'
  ...timestamps
});

export const syncHistory = sqliteTable('sync_history', {
  id: text('id').primaryKey(),
  durationMs: integer('duration_ms').notNull(),
  itemsUpdated: integer('items_updated').notNull().default(0),
  newEntries: integer('new_entries').notNull().default(0),
  errors: integer('errors').notNull().default(0),
  ...timestamps
});

export const progressHistory = sqliteTable('progress_history', {
  date: text('date').primaryKey(), // YYYY-MM-DD
  points: integer('points').default(0),
  rank: integer('rank'),
  machinesOwned: integer('machines_owned').default(0),
  academyModules: integer('academy_modules').default(0),
  challengesOwned: integer('challenges_owned').default(0),
  streak: integer('streak').default(0),
  
  ...timestamps
});

export const screenshots = sqliteTable('screenshots', {
  id: text('id').primaryKey(),
  journalId: text('journal_id').notNull().references(() => journal.id, { onDelete: 'cascade' }),
  imagePath: text('image_path').notNull(),
  caption: text('caption'),
  
  ...timestamps
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const itemTags = sqliteTable('item_tags', {
  itemId: text('item_id').notNull().references(() => htbItems.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
});

export const activityEvents = sqliteTable('activity_events', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(), // 'machine_started', 'machine_rooted', 'journal_created', 'journal_updated', 'sync_completed', 'screenshot_added', 'daily_note_created'
  entityType: text('entity_type').notNull(), // 'machine', 'challenge', 'journal', 'sync'
  entityId: text('entity_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  metadata: text('metadata'), // JSON string
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});
