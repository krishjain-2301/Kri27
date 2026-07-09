/**
 * Client-side database queries — all run in the browser via Dexie (IndexedDB).
 * These replace the server-side drizzle-orm queries from src/lib/queries/*.
 */

import { getDb, HtbItem, Journal, JournalHistory, ActivityEvent, Settings, SyncHistory } from './dexie';
const randomUUID = () => crypto.randomUUID();
import { format, subDays } from 'date-fns';

// ── Settings ─────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings | null> {
  const db = getDb();
  const all = await db.settings.toArray();
  return all[0] ?? null;
}

export async function saveConnectionSettings(username: string, token: string) {
  const db = getDb();
  const existing = await db.settings.toArray();
  const now = new Date();
  if (existing.length === 0) {
    await db.settings.add({
      id: 'default',
      htbUsername: username,
      htbAppToken: token,
      autoSync: true,
      syncInterval: '15 min',
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await db.settings.update(existing[0].id, {
      htbUsername: username,
      htbAppToken: token,
      updatedAt: now,
    });
  }
}

export async function saveCredentials(username: string, appToken: string) {
  return saveConnectionSettings(username, appToken);
}

export async function disconnectCredentials() {
  const db = getDb();
  const existing = await db.settings.toArray();
  if (existing.length > 0) {
    await db.settings.update(existing[0].id, {
      htbUsername: null,
      htbAppToken: null,
      updatedAt: new Date(),
    });
  }
}

export async function updateSyncPreferences(autoSync: boolean, syncInterval: string) {
  const db = getDb();
  const existing = await db.settings.toArray();
  const now = new Date();
  if (existing.length > 0) {
    await db.settings.update(existing[0].id, { autoSync, syncInterval, updatedAt: now });
  } else {
    await db.settings.add({ id: 'default', autoSync, syncInterval, createdAt: now, updatedAt: now });
  }
}

// ── Dashboard Queries ─────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const db = getDb();
  const allItems = await db.htbItems.toArray();
  return {
    machines: allItems.filter(i => i.type === 'Machine').length,
    academyModules: allItems.filter(i => i.type === 'Academy').length,
    challenges: allItems.filter(i => i.type === 'Challenge').length,
    sherlocks: allItems.filter(i => i.type === 'Sherlock').length,
    totalSessions: allItems.length,
  };
}

export async function getTodaysRecommendation() {
  const db = getDb();
  const machines = await db.htbItems
    .where('type').equals('Machine')
    .and(item => item.status === 'Completed' || item.status === 'Root Owned')
    .toArray();

  for (const machine of machines) {
    const j = await db.journal.where('itemId').equals(machine.id).first();
    if (j && (j.journalStatus === 'Not Started' || j.journalStatus === 'In Progress')) {
      const charCount = j.contentMarkdown?.length || 0;
      let status = 'Not Started';
      if (charCount > 3000) status = 'Complete';
      else if (charCount > 1200) status = 'Detailed';
      else if (charCount > 300) status = 'Started';

      return {
        ...machine,
        journalStatus: status,
        journalId: j.id,
        charCount,
      };
    }
  }
  return null;
}

export async function getRecentActivity() {
  const db = getDb();
  const items = await db.htbItems.orderBy('updatedAt').reverse().limit(3).toArray();
  const results = [];
  for (const item of items) {
    const j = await db.journal.where('itemId').equals(item.id).first();
    results.push({ ...item, journalId: j?.id });
  }
  return results;
}

export async function getActivityStats() {
  const db = getDb();
  const events = await db.activityEvents
    .where('entityType').notEqual('sync')
    .toArray();

  events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const oneWeekAgo = subDays(new Date(), 7);
  const actionsThisWeek = events.filter(e => new Date(e.createdAt) >= oneWeekAgo).length;

  const activeDays = new Set(events.map(e => format(new Date(e.createdAt), 'yyyy-MM-dd')));
  let streak = 0;
  let currentDate = new Date();

  if (!activeDays.has(format(currentDate, 'yyyy-MM-dd'))) {
    const yesterday = format(subDays(currentDate, 1), 'yyyy-MM-dd');
    if (!activeDays.has(yesterday)) {
      return { streak: 0, actionsThisWeek };
    }
    currentDate = subDays(currentDate, 1);
  }

  while (activeDays.has(format(currentDate, 'yyyy-MM-dd'))) {
    streak++;
    currentDate = subDays(currentDate, 1);
  }

  return { streak, actionsThisWeek };
}

// ── Journals List ─────────────────────────────────────────────────────────────

export type JournalHubEntry = {
  id: string;
  title: string;
  journalType: string | null;
  journalStatus: string | null;
  mood: string | null;
  wordCount: number | null;
  isFavorite: number | null;
  needsReview: number | null;
  perceivedDifficulty: number | null;
  updatedAt: Date;
  createdAt: Date;
  itemType: string | null;
  itemDifficulty: string | null;
  itemStatus: string | null;
  screenshotCount: number;
};

export async function getAllJournals(): Promise<JournalHubEntry[]> {
  const db = getDb();
  const journals = await db.journal.orderBy('updatedAt').reverse().toArray();

  const results: JournalHubEntry[] = [];
  for (const j of journals) {
    let item: HtbItem | undefined;
    if (j.itemId) {
      item = await db.htbItems.get(j.itemId);
    }
    const screenshotCount = await db.screenshots.where('journalId').equals(j.id).count();
    results.push({
      id: j.id,
      title: j.title,
      journalType: j.journalType ?? null,
      journalStatus: j.journalStatus ?? null,
      mood: j.mood ?? null,
      wordCount: j.wordCount ?? null,
      isFavorite: j.isFavorite ?? null,
      needsReview: j.needsReview ?? null,
      perceivedDifficulty: j.perceivedDifficulty ?? null,
      updatedAt: j.updatedAt,
      createdAt: j.createdAt,
      itemType: item?.type ?? null,
      itemDifficulty: item?.difficulty ?? null,
      itemStatus: item?.status ?? null,
      screenshotCount,
    });
  }
  return results;
}

export async function toggleJournalPin(id: string, pinned: boolean) {
  const db = getDb();
  await db.journal.update(id, { isFavorite: pinned ? 1 : 0, updatedAt: new Date() });
  return { success: true };
}

// ── Single Journal ─────────────────────────────────────────────────────────────

export async function getJournalEntry(id: string) {
  const db = getDb();
  const j = await db.journal.get(id);
  if (!j) return null;
  let machine: HtbItem | undefined;
  if (j.itemId) {
    machine = await db.htbItems.get(j.itemId);
  }
  return { journal: j, machine: machine ?? null };
}

export async function saveJournalEntryWithWordCount(
  id: string,
  contentJson: string,
  contentMarkdown: string,
  wordCount: number
) {
  const db = getDb();
  let status = 'Not Started';
  if (contentMarkdown.length > 3000) status = 'Completed';
  else if (contentMarkdown.length > 300) status = 'In Progress';

  await db.journal.update(id, {
    contentJson,
    contentMarkdown,
    journalStatus: status,
    wordCount,
    updatedAt: new Date(),
  });

  await logActivityEvent({
    eventType: 'journal_updated',
    entityType: 'journal',
    entityId: id,
    title: 'Journal',
    metadata: { total_words: wordCount },
  });

  return { success: true, savedAt: new Date() };
}

export async function updatePersonalMetadata(id: string, data: any) {
  const db = getDb();
  await db.journal.update(id, {
    perceivedDifficulty: data.perceivedDifficulty,
    personalConfidence: data.personalConfidence,
    needsReview: data.needsReview ? 1 : 0,
    isFavorite: data.isFavorite ? 1 : 0,
    mood: data.mood,
    journalStatus: data.journalStatus,
    updatedAt: new Date(),
  });
  return { success: true };
}

export async function getJournalHistory(journalId: string): Promise<JournalHistory[]> {
  const db = getDb();
  const items = await db.journalHistory.where('journalId').equals(journalId).toArray();
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);
}

export async function createJournalHistorySnapshot(
  journalId: string,
  contentJson: string,
  contentMarkdown: string
) {
  const db = getDb();
  await db.journalHistory.add({
    id: randomUUID(),
    journalId,
    contentJson,
    contentMarkdown,
    createdAt: new Date(),
  });
  return { success: true };
}

export async function deleteJournal(id: string) {
  const db = getDb();
  await db.journal.delete(id);
  await db.journalHistory.where('journalId').equals(id).delete();
  await db.screenshots.where('journalId').equals(id).delete();
  return { success: true };
}

export async function createDailyNote(): Promise<string> {
  const db = getDb();
  const journalId = randomUUID();
  const title = `Daily Note: ${format(new Date(), 'dd MMM yyyy')}`;
  const now = new Date();

  await db.journal.add({
    id: journalId,
    itemId: null,
    journalType: 'Daily',
    journalStatus: 'In Progress',
    title,
    content: '',
    createdAt: now,
    updatedAt: now,
  });

  await logActivityEvent({
    eventType: 'daily_note_created',
    entityType: 'daily_note',
    entityId: journalId,
    title,
    metadata: {},
  });

  return journalId;
}

// ── Challenges / Engagements ──────────────────────────────────────────────────

export async function getChallenges() {
  const db = getDb();
  const items = await db.htbItems
    .where('type').anyOf(['Machine', 'Challenge', 'Sherlock'])
    .toArray();

  items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const results = [];
  for (const item of items) {
    const j = await db.journal.where('itemId').equals(item.id).first();
    results.push({
      ...item,
      journalId: j?.id,
      journalStatus: j?.journalStatus || 'Not Started',
    });
  }
  return results;
}

// ── Academy / Learning ────────────────────────────────────────────────────────

export async function getLearningModules() {
  const db = getDb();
  const items = await db.htbItems.where('type').equals('Academy').toArray();
  items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const results = [];
  for (const item of items) {
    const j = await db.journal.where('itemId').equals(item.id).first();
    results.push({
      ...item,
      journalId: j?.id,
      journalStatus: j?.journalStatus || 'Not Started',
    });
  }
  return results;
}

// ── Activity Events ───────────────────────────────────────────────────────────

export async function logActivityEvent(params: {
  eventType: string;
  entityType: string;
  entityId: string;
  title: string;
  description?: string;
  metadata?: any;
}) {
  const db = getDb();
  await db.activityEvents.add({
    id: randomUUID(),
    eventType: params.eventType,
    entityType: params.entityType,
    entityId: params.entityId,
    title: params.title,
    description: params.description,
    metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    createdAt: new Date(),
  });
}

export async function getAllActivityEvents(): Promise<ActivityEvent[]> {
  const db = getDb();
  const events = await db.activityEvents.toArray();
  return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ── Sync History ──────────────────────────────────────────────────────────────

export async function getSyncHistory(limit = 5): Promise<SyncHistory[]> {
  const db = getDb();
  const all = await db.syncHistory.toArray();
  return all
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getLatestSync(): Promise<SyncHistory | null> {
  const history = await getSyncHistory(1);
  return history[0] ?? null;
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  type: 'Journal' | 'DailyNote' | 'Command';
  title: string;
  snippet: string;
  journalId?: string;
  updatedAt?: string;
}

export async function searchVault(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  const db = getDb();
  const q = query.toLowerCase();

  const journals = await db.journal.toArray();
  const results: SearchResult[] = [];

  for (const j of journals) {
    const titleMatch = j.title.toLowerCase().includes(q);
    const contentMatch = j.contentMarkdown?.toLowerCase().includes(q);

    if (titleMatch || contentMatch) {
      const isDaily = j.journalType === 'Daily' || !j.itemId;
      let snippet = '';
      if (contentMatch && j.contentMarkdown) {
        const idx = j.contentMarkdown.toLowerCase().indexOf(q);
        snippet = j.contentMarkdown.slice(Math.max(0, idx - 40), idx + 100);
      }

      results.push({
        id: `j-${j.id}`,
        type: isDaily ? 'DailyNote' : 'Journal',
        title: j.title,
        snippet,
        journalId: j.id,
        updatedAt: j.updatedAt?.toString(),
      });

      // Extract matching commands from code blocks
      if (j.contentMarkdown && contentMatch) {
        const codeBlockRegex = /```(?:bash|sh|powershell|cmd|txt)?\n([\s\S]*?)```/gi;
        let match;
        while ((match = codeBlockRegex.exec(j.contentMarkdown)) !== null) {
          const code = match[1];
          if (code.toLowerCase().includes(q)) {
            const lines = code.split('\n');
            const matchingLine = lines.find(l => l.toLowerCase().includes(q)) || code.substring(0, 50);
            results.push({
              id: `cmd-${j.id}-${match.index}`,
              type: 'Command',
              title: matchingLine.trim().substring(0, 80),
              snippet: `Found in: ${j.title}`,
              journalId: j.id,
            });
          }
        }
      }
    }
  }

  return results.slice(0, 20);
}

// ── Sync: Import from HTB API ─────────────────────────────────────────────────

export interface CyberVaultItem {
  providerId: string;
  name: string;
  type: 'Machine' | 'Challenge' | 'Sherlock' | 'Academy';
  difficulty: string;
  status: string;
  os?: string | null;
  points?: number;
}

export interface SyncPreview {
  newItems: CyberVaultItem[];
  updatedItems: CyberVaultItem[];
}

export async function generateSyncPreview(remoteItems: CyberVaultItem[]): Promise<SyncPreview> {
  const db = getDb();
  const localItems = await db.htbItems.toArray();
  const preview: SyncPreview = { newItems: [], updatedItems: [] };

  for (const remote of remoteItems) {
    const local = localItems.find(l => l.htbId === remote.providerId);
    if (!local) {
      preview.newItems.push(remote);
    } else if (local.status !== remote.status || local.difficulty !== remote.difficulty) {
      preview.updatedItems.push(remote);
    }
  }
  return preview;
}

export async function commitSync(preview: SyncPreview) {
  const db = getDb();
  const startTime = Date.now();
  let itemsImported = 0;
  let itemsUpdated = 0;

  try {
    for (const item of preview.newItems) {
      const itemId = randomUUID();
      const now = new Date();
      await db.htbItems.add({
        id: itemId,
        htbId: item.providerId,
        title: item.name,
        type: item.type,
        difficulty: item.difficulty,
        status: item.status,
        createdAt: now,
        updatedAt: now,
      });

      const journalId = randomUUID();
      await db.journal.add({
        id: journalId,
        itemId,
        journalType: item.type,
        journalStatus: 'Not Started',
        title: item.name,
        content: '',
        createdAt: now,
        updatedAt: now,
      });

      await logActivityEvent({
        eventType: item.status === 'Root Owned' || item.status === 'Completed' ? 'machine_rooted' : 'machine_started',
        entityType: item.type === 'Challenge' ? 'challenge' : 'machine',
        entityId: itemId,
        title: item.name,
        metadata: { status: item.status, difficulty: item.difficulty },
      });

      itemsImported++;
    }

    for (const item of preview.updatedItems) {
      const local = await db.htbItems.where('htbId').equals(item.providerId).first();
      if (local) {
        await db.htbItems.update(local.id, {
          status: item.status,
          difficulty: item.difficulty,
          updatedAt: new Date(),
        });
        itemsUpdated++;
      }
    }

    const durationMs = Date.now() - startTime;

    await db.syncHistory.add({
      id: randomUUID(),
      newEntries: itemsImported,
      itemsUpdated,
      errors: 0,
      durationMs,
      createdAt: new Date(),
    });

    await logActivityEvent({
      eventType: 'sync_completed',
      entityType: 'sync',
      entityId: randomUUID(),
      title: 'Sync Completed',
      description: `Imported ${itemsImported} items, updated ${itemsUpdated} items`,
      metadata: { itemsImported, itemsUpdated, durationMs },
    });

    return { success: true, newEntries: itemsImported, updatedEntries: itemsUpdated, durationMs };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    await db.syncHistory.add({
      id: randomUUID(),
      newEntries: itemsImported,
      itemsUpdated,
      errors: 1,
      durationMs,
      createdAt: new Date(),
    });
    return { success: false, error: error.message };
  }
}
