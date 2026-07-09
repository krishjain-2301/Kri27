/**
 * Browser-side HTB API client.
 * Calls through /api/htb/... proxy to avoid CORS issues.
 */

import { z } from 'zod';
import {
  HTBUserResponseSchema,
  HTBItemsListSchema,
  HTBUserResponse,
  HTBItemsListResponse,
} from './types';
import { CyberVaultItem } from '../base/models';
import { HTBMapper } from './mapper';

export class HTBBrowserClient {
  private token: string;
  private baseUrl = '/api/htb';

  constructor(token: string) {
    this.token = token;
  }

  private async fetchJson<T>(endpoint: string, schema: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    const body = await response.text();

    if (!response.ok) {
      if (response.status === 401) throw new Error('Unauthorized. Your App Token may be invalid or expired.');
      if (response.status === 429) throw new Error('Rate limited by HTB API. Try again in a moment.');
      throw new Error(`HTB API Error: ${response.status} ${response.statusText}`);
    }

    let rawData;
    try {
      rawData = JSON.parse(body);
    } catch {
      throw new Error('Failed to parse HTB API response');
    }

    try {
      return schema.parse(rawData) as T;
    } catch (err) {
      console.warn(`Zod validation error on ${endpoint}:`, err);
      throw new Error(`HTB API schema changed. Failed to parse response from ${endpoint}.`);
    }
  }

  async getUserInfo(): Promise<HTBUserResponse> {
    const infoData: any = await this.fetchJson('/user/info', z.any());
    const id = infoData.info?.id || infoData.id;
    return this.fetchJson<HTBUserResponse>(`/user/profile/basic/${id}`, HTBUserResponseSchema);
  }

  async getMachineOwns(): Promise<HTBItemsListResponse> {
    return this.fetchJson<HTBItemsListResponse>('/machines?per_page=100', HTBItemsListSchema);
  }

  async getChallengeOwns(): Promise<HTBItemsListResponse> {
    return this.fetchJson<HTBItemsListResponse>('/challenges?per_page=100', HTBItemsListSchema);
  }

  async getSherlockOwns(): Promise<HTBItemsListResponse> {
    return this.fetchJson<HTBItemsListResponse>('/sherlocks?per_page=100', HTBItemsListSchema);
  }

  async validateConnection(): Promise<{ ok: boolean; username?: string; reason?: string }> {
    try {
      const data = await this.getUserInfo();
      return { ok: true, username: data.profile.name };
    } catch (e: any) {
      const msg = e.message || '';
      if (msg.includes('Unauthorized')) return { ok: false, reason: 'Unauthorized' };
      if (msg.includes('Rate limit') || msg.includes('429')) return { ok: false, reason: 'RateLimited' };
      if (msg.includes('schema changed')) return { ok: false, reason: 'ValidationError' };
      return { ok: false, reason: 'NetworkError' };
    }
  }

  async fetchLearningState(): Promise<CyberVaultItem[]> {
    const items: CyberVaultItem[] = [];

    try {
      const machines = await this.getMachineOwns();
      items.push(...HTBMapper.toMachineItems(machines));
    } catch (e) {
      console.warn('Could not fetch HTB machines:', e);
    }

    try {
      const challenges = await this.getChallengeOwns();
      items.push(...HTBMapper.toChallengeItems(challenges));
    } catch (e) {
      console.warn('Could not fetch HTB challenges:', e);
    }

    try {
      const sherlocks = await this.getSherlockOwns();
      items.push(...HTBMapper.toSherlockItems(sherlocks));
    } catch (e) {
      console.warn('Could not fetch HTB sherlocks:', e);
    }

    return items;
  }
}
