import { pgTable, serial, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

// Users Table (Extendable for NextAuth/BetterAuth later)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  htbUsername: text('htb_username'),
  htbToken: text('htb_token'), // Consider encrypting this before storage
  githubRepo: text('github_repo'),
  githubToken: text('github_token'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Challenges Table (For tracking HTB machines and learning)
export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(), // e.g. "Lame"
  platform: text('platform').notNull().default('Hack The Box'),
  difficulty: text('difficulty').notNull(), // "Easy", "Medium", "Hard", "Insane"
  isCompleted: boolean('is_completed').default(false).notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notes Table (Markdown writeups for challenges)
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  challengeId: serial('challenge_id').references(() => challenges.id),
  title: text('title').notNull(),
  content: text('content').notNull(), // Markdown string
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Commands/Payloads Table (Saved command snippets)
export const commands = pgTable('commands', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(), // e.g. "Reverse Shell Bash"
  command: text('command').notNull(), // The actual payload
  category: text('category').notNull(), // e.g. "Privilege Escalation", "Reverse Shell"
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
