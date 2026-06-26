import { LearningProvider, ConnectionResult } from '../base/contract';
import { CyberVaultItem, UserProfile } from '../base/models';
import { HTBClient } from './client';
import { HTBMapper } from './mapper';

export const SUPPORTED_API_VERSION = '2026-06';

export class HackTheBoxProvider implements LearningProvider {
  name = 'Hack The Box';
  version = SUPPORTED_API_VERSION;
  
  private client: HTBClient;

  constructor(token: string) {
    this.client = new HTBClient(token);
  }

  async validateConnection(): Promise<ConnectionResult> {
    try {
      const data = await this.client.getUserInfo();
      return { ok: true, username: data.profile.name };
    } catch (e: any) {
      console.warn('Provider Validation Failed:', e);
      const msg = e.message || '';
      if (msg.includes('Unauthorized')) return { ok: false, reason: 'Unauthorized' };
      if (msg.includes('429')) return { ok: false, reason: 'RateLimited' };
      if (msg.includes('Schema Changed') || msg.includes('Validation')) return { ok: false, reason: 'ValidationError' };
      return { ok: false, reason: 'NetworkError' };
    }
  }

  async getProfile(): Promise<UserProfile | null> {
    try {
      const data = await this.client.getUserInfo();
      return HTBMapper.toUserProfile(data);
    } catch (e) {
      return null;
    }
  }

  async fetchLearningState(): Promise<CyberVaultItem[]> {
    const items: CyberVaultItem[] = [];

    // 1. Fetch Machines safely
    try {
      const machines = await this.client.getMachineOwns();
      items.push(...HTBMapper.toMachineItems(machines));
    } catch (e) {
      console.warn('Could not fetch HTB machines:', e);
    }

    // 2. Fetch Challenges safely
    try {
      const challenges = await this.client.getChallengeOwns();
      items.push(...HTBMapper.toChallengeItems(challenges));
    } catch (e) {
      console.warn('Could not fetch HTB challenges:', e);
    }

    // 3. Academy is skipped for now, as it requires a different host/scope

    return items;
  }
}
