import { z } from 'zod';
import { 
  HTBUserResponseSchema, 
  HTBItemsListSchema,
  HTBUserResponse,
  HTBItemsListResponse
} from './types';

export class HTBClient {
  private token: string;
  private baseUrl = 'https://labs.hackthebox.com/api/v4';

  constructor(token: string) {
    this.token = token;
  }

  private async fetch<T>(endpoint: string, schema: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Defensive fetching
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json, text/plain, */*'
      },
      // Cache controls to ensure fresh sync
      cache: 'no-store'
    });

    // Debug logging
    console.log("URL:", url);
    console.log("Status:", response.status);

    const body = await response.text();
    console.log("Response:", body);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('HTB API Error: Unauthorized. Your App Token may be invalid or expired.');
      }
      if (response.status === 429) {
        throw new Error('HTB API Error: 429 RateLimited');
      }
      throw new Error(`HTB API Error: ${response.status} ${response.statusText}`);
    }

    let rawData;
    try {
      rawData = JSON.parse(body);
    } catch (e) {
      throw new Error('Failed to parse response JSON');
    }
    
    // Runtime validation!
    try {
      const validatedData = schema.parse(rawData);
      return validatedData as T;
    } catch (error) {
      console.warn(`Zod Validation Error on ${endpoint}:`, error);
      throw new Error(`HTB API Schema Changed. Failed to parse response from ${endpoint}.`);
    }
  }

  async getUserInfo(): Promise<HTBUserResponse> {
    // First we get the user ID from the /user/info endpoint (which is actually basic now)
    // Wait, the HAR showed `user/profile/basic/{id}` for the profile!
    // But we need the ID first. So we call /user/info first.
    const infoData: any = await this.fetch('/user/info', z.any());
    const id = infoData.info?.id || infoData.id;
    return this.fetch<HTBUserResponse>(`/user/profile/basic/${id}`, HTBUserResponseSchema);
  }

  async getMachineOwns(): Promise<HTBItemsListResponse> {
    return this.fetch<HTBItemsListResponse>('/machines?per_page=100', HTBItemsListSchema);
  }

  async getChallengeOwns(): Promise<HTBItemsListResponse> {
    return this.fetch<HTBItemsListResponse>('/challenges?per_page=100', HTBItemsListSchema);
  }
}
