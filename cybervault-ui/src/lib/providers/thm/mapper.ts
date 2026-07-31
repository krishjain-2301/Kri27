import { CyberVaultItem, UserProfile } from '../base/models';
import { THMProfileResponse, THMCompletedRoomsResponse, THMRoom } from './types';

export class THMMapper {
  static toUserProfile(data: THMProfileResponse): UserProfile {
    return {
      username: data.username,
      avatarUrl: data.avatar || null,
      rank: data.rank ? `Rank #${data.rank}` : 'Member',
      points: data.points || 0,
      respect: 0,
    };
  }

  private static formatDifficulty(diff?: string | null): string {
    if (!diff) return 'Easy';
    const lower = diff.toLowerCase();
    if (lower === 'info') return 'Info';
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  static toVaultItem(room: THMRoom): CyberVaultItem {
    let itemType: 'Machine' | 'Challenge' | 'Academy' | 'Sherlock' = 'Machine';

    if (room.typeCategory === 'module') {
      itemType = 'Academy';
    } else if (room.type === 'challenge') {
      itemType = 'Challenge';
    } else {
      itemType = 'Machine';
    }

    return {
      providerId: `thm_room_${room.code}`,
      name: room.title,
      type: itemType,
      difficulty: this.formatDifficulty(room.difficulty),
      status: 'Completed',
      os: null,
      points: 10,
      provider: 'THM',
    };
  }

  static toVaultItems(rooms: THMCompletedRoomsResponse): CyberVaultItem[] {
    if (!Array.isArray(rooms)) return [];
    return rooms.map(room => this.toVaultItem(room));
  }
}
