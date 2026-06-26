'use server';

import { db } from '@/lib/db/client';
import { sql } from 'drizzle-orm';

export type SearchResultType = 'Journal' | 'DailyNote' | 'Screenshot' | 'Command';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  snippet: string;
  journalId?: string; // used for navigating
  updatedAt?: string;
}

export async function searchVault(query: string): Promise<SearchResult[]> {
  if (!query || query.trim() === '') return [];

  // 1. Sanitize query for FTS5 (remove quotes to prevent syntax errors, add * for prefix matching)
  const safeQuery = query.replace(/["*]/g, '').trim();
  if (safeQuery.length < 2) return [];

  // FTS query with prefix wildcard for fuzzy-like completion
  const ftsQuery = `"${safeQuery}" *`;

  // 2. Query FTS5 for Journals & Daily Notes
  // We use sqlite snippet() function to highlight and show context
  const res = await db.all(sql`
    SELECT 
      jfts.id as journalId,
      jfts.title as title,
      snippet(journal_fts, 2, '<b>', '</b>', '...', 12) as snippet,
      j.journal_type as journalType,
      h.type as itemType,
      j.updated_at as updatedAt,
      j.content_markdown as contentMarkdown
    FROM journal_fts jfts
    JOIN journal j ON j.id = jfts.id
    LEFT JOIN htb_items h ON j.item_id = h.id
    WHERE journal_fts MATCH ${ftsQuery}
    ORDER BY rank
    LIMIT 20
  `);

  const results: SearchResult[] = [];

  for (const row of res as any[]) {
    const isDaily = row.journalType === 'Daily' || row.itemType === null;
    
    // Add the journal result
    results.push({
      id: `j-${row.journalId}`,
      type: isDaily ? 'DailyNote' : 'Journal',
      title: row.title,
      // The snippet comes back with <b> tags. We'll strip anything else just in case.
      snippet: row.snippet ? row.snippet.replace(/<(?!\/?b>)[^>]+>/g, '') : '',
      journalId: row.journalId,
      updatedAt: row.updatedAt,
    });

    // Dynamic Command Extraction V1
    // If we're looking for commands, extract code blocks from contentMarkdown that match the query
    if (row.contentMarkdown) {
      // Regex matches standard markdown codeblocks
      const codeBlockRegex = /\`\`\`(?:bash|sh|powershell|cmd|txt)?\n([\s\S]*?)\`\`\`/gi;
      let match;
      while ((match = codeBlockRegex.exec(row.contentMarkdown)) !== null) {
        const code = match[1];
        if (code.toLowerCase().includes(safeQuery.toLowerCase())) {
          // Found a command matching the query!
          // Extract the exact line that matched
          const lines = code.split('\n');
          const matchingLine = lines.find((l: string) => l.toLowerCase().includes(safeQuery.toLowerCase())) || code.substring(0, 50);
          
          results.push({
            id: `cmd-${row.journalId}-${match.index}`,
            type: 'Command',
            title: matchingLine.trim().substring(0, 80),
            snippet: `Found in: ${row.title}`,
            journalId: row.journalId,
          });
        }
      }
    }
  }

  // 3. Query Screenshots that match caption
  const screenshots = await db.all(sql`
    SELECT s.id, s.caption, s.image_path as imagePath, s.journal_id as journalId, j.title as journalTitle
    FROM screenshots s
    JOIN journal j ON j.id = s.journal_id
    WHERE s.caption LIKE ${'%' + safeQuery + '%'}
    LIMIT 10
  `);

  for (const row of screenshots as any[]) {
    results.push({
      id: `img-${row.id}`,
      type: 'Screenshot',
      title: row.caption || 'Screenshot',
      snippet: `Found in: ${row.journalTitle}`,
      journalId: row.journalId,
    });
  }

  return results;
}
