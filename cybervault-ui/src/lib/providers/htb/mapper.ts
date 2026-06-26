import { CyberVaultItem, UserProfile } from '../base/models';
import { HTBUserResponse, HTBItemsListResponse } from './types';

export class HTBMapper {
  
  static toUserProfile(data: HTBUserResponse): UserProfile {
    return {
      username: data.profile.name,
      avatarUrl: data.profile.avatar || null,
      rank: data.profile.rank || null,
      points: data.profile.points,
      respect: data.profile.respects,
    };
  }

  static toMachineItems(data: HTBItemsListResponse): CyberVaultItem[] {
    if (!data.data) return [];
    
    // Only return owned items
    return data.data.filter(m => m.is_owned).map(m => ({
      providerId: `htb_m_${m.id}`,
      name: m.name,
      type: 'Machine',
      difficulty: m.difficulty || 'Unknown',
      status: 'Root Owned', // Or whatever default is best since HTB list doesn't distinguish user vs root easily in basic list
      os: m.os || null,
      points: m.points || 0,
    }));
  }

  static toChallengeItems(data: HTBItemsListResponse): CyberVaultItem[] {
    if (!data.data) return [];

    return data.data.filter(c => c.is_owned).map(c => ({
      providerId: `htb_c_${c.id}`,
      name: c.name,
      type: 'Challenge',
      difficulty: c.difficulty || 'Unknown',
      status: 'Completed',
      os: null,
      points: c.points || 0,
    }));
  }

  static toSherlockItems(data: HTBItemsListResponse): CyberVaultItem[] {
    if (!data.data) return [];

    return data.data.filter(s => s.is_owned).map(s => ({
      providerId: `htb_s_${s.id}`,
      name: s.name,
      type: 'Sherlock',
      difficulty: s.difficulty || 'Unknown',
      status: 'Completed',
      os: null,
      points: s.points || 0,
    }));
  }
}
