import { CyberVaultItem, UserProfile } from '../base/models';
import { HTBUserResponse, HTBMachineOwnsResponse, HTBChallengeOwnsResponse } from './types';

export class HTBMapper {
  
  static toUserProfile(data: HTBUserResponse): UserProfile {
    return {
      username: data.profile.name,
      avatarUrl: data.profile.avatar || null,
      rank: data.profile.rankText || null,
      points: data.profile.points,
      respect: data.profile.respects,
    };
  }

  static toMachineItems(data: HTBMachineOwnsResponse): CyberVaultItem[] {
    if (!data.data) return [];
    
    return data.data.map(m => ({
      providerId: `htb_m_${m.id}`,
      name: m.name,
      type: 'Machine',
      difficulty: m.difficultyText || 'Unknown',
      status: m.status?.toLowerCase().includes('root') ? 'Root Owned' : 'User Owned',
      os: m.os || null,
      points: m.points,
    }));
  }

  static toChallengeItems(data: HTBChallengeOwnsResponse): CyberVaultItem[] {
    if (!data.data) return [];

    return data.data.map(c => ({
      providerId: `htb_c_${c.id}`,
      name: c.name,
      type: 'Challenge',
      difficulty: c.difficulty || 'Unknown',
      status: 'Completed',
      os: null,
      points: c.points,
    }));
  }
}
