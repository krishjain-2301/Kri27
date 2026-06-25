export interface SyncProvider {
  name: string;
  testConnection(): Promise<boolean>;
  fetchActivity(): Promise<Array<{
    name: string;
    type: string;
    difficulty: string;
    status: string;
    os?: string | null;
  }>>;
}

export class HackTheBoxProvider implements SyncProvider {
  name = 'Hack The Box';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async testConnection(): Promise<boolean> {
    // In a real implementation, we would make a fetch to HTB API.
    // fetch('https://www.hackthebox.com/api/v4/user/profile/activity', { headers: { Authorization: \`Bearer \${this.token}\` } })
    return this.token.length > 5;
  }

  async fetchActivity() {
    // Mocking the HTB Activity endpoint payload
    return [
      { name: 'Crocodile', type: 'Machine', difficulty: 'Easy', status: 'Root Owned', os: 'Linux' },
      { name: 'Linux Fundamentals', type: 'Academy', difficulty: 'Easy', status: 'Completed', os: null },
      { name: 'Lame', type: 'Machine', difficulty: 'Easy', status: 'User Owned', os: 'Linux' },
      { name: 'Appointment', type: 'Machine', difficulty: 'Easy', status: 'Root Owned', os: 'Windows' },
      { name: 'Stack Pivot', type: 'Challenge', difficulty: 'Medium', status: 'In Progress', os: 'Pwn' }
    ];
  }
}
