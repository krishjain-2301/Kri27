import { LearningProvider } from '../base/contract';
import { CyberVaultItem, UserProfile } from '../base/models';
import { HTBClient } from './client';
import { HTBMapper } from './mapper';

export class HackTheBoxProvider implements LearningProvider {
  name = 'Hack The Box';
  version = 'v4';
  
  private client: HTBClient;

  constructor(token: string) {
    this.client = new HTBClient(token);
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.client.getUserInfo();
      return true;
    } catch (e) {
      console.warn('Provider Validation Failed:', e);
      return false;
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
