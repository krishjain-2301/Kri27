export type VaultItemType = 'Machine' | 'Challenge' | 'Academy' | 'Sherlock';
export type VaultItemStatus = 'Not Started' | 'In Progress' | 'Completed' | 'User Owned' | 'Root Owned';

export interface CyberVaultItem {
  providerId: string; // The ID from the external provider (e.g. HTB Machine ID)
  name: string;
  type: VaultItemType;
  difficulty: string;
  status: VaultItemStatus;
  os: string | null;
  points: number;
}

export interface UserProfile {
  username: string;
  avatarUrl: string | null;
  rank: string | null;
  points: number;
  respect: number;
}
