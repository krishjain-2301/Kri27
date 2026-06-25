import { 
  HTBUserResponseSchema, 
  HTBMachineOwnsResponseSchema, 
  HTBChallengeOwnsResponseSchema,
  HTBUserResponse,
  HTBMachineOwnsResponse,
  HTBChallengeOwnsResponse
} from './types';

export class HTBClient {
  private token: string;
  private baseUrl = 'https://www.hackthebox.com/api/v4';

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

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('HTB API Error: Unauthorized. Your App Token may be invalid or expired.');
      }
      throw new Error(`HTB API Error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();
    
    // Runtime validation!
    try {
      const validatedData = schema.parse(rawData);
      return validatedData as T;
    } catch (error) {
      console.error(`Zod Validation Error on ${endpoint}:`, error);
      // We log but don't strictly crash the entire app if HTB adds new fields.
      // Zod `.passthrough()` on objects helps.
      // But if the core structure is completely broken, we fail safely here.
      throw new Error(`HTB API Schema Changed. Failed to parse response from ${endpoint}.`);
    }
  }

  async getUserInfo(): Promise<HTBUserResponse> {
    return this.fetch<HTBUserResponse>('/user/info', HTBUserResponseSchema);
  }

  async getMachineOwns(): Promise<HTBMachineOwnsResponse> {
    // This endpoint may not exist in this exact structure. 
    // If it fails, our Provider will catch it and log a warning.
    return this.fetch<HTBMachineOwnsResponse>('/machine/owns', HTBMachineOwnsResponseSchema);
  }

  async getChallengeOwns(): Promise<HTBChallengeOwnsResponse> {
    return this.fetch<HTBChallengeOwnsResponse>('/challenge/owns', HTBChallengeOwnsResponseSchema);
  }
}
