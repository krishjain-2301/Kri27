import { CyberVaultItem, UserProfile } from './models';

export interface SyncPreview {
  newItems: CyberVaultItem[];
  updatedItems: CyberVaultItem[];
}

export type ConnectionResult =
  | { ok: true; username: string }
  | { ok: false; reason: string };

export interface LearningProvider {
  name: string;
  version: string;

  /** Validates the current connection and returns true if healthy */
  validateConnection(): Promise<ConnectionResult>;

  /** Retrieves the core user profile from the remote source */
  getProfile(): Promise<UserProfile | null>;

  /** 
   * Fetches the full learning state from the provider, mapped to CyberVault models. 
   * Useful for Sync Previews before committing to the database.
   */
  fetchLearningState(): Promise<CyberVaultItem[]>;
}
