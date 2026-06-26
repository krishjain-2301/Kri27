import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './CyberVault_Data/vault.db',
  },
  tablesFilter: ["!journal_fts*"],
} satisfies Config;
