import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-easy';
    case 'medium': return 'badge-medium';
    case 'hard': return 'badge-hard';
    case 'insane': return 'badge-insane';
    default: return 'badge-easy';
  }
}

export function getOSIcon(os: string): string {
  switch (os.toLowerCase()) {
    case 'linux': return '🐧';
    case 'windows': return '🪟';
    case 'macos': return '🍎';
    case 'freebsd': return '😈';
    default: return '💻';
  }
}

export function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'Hack The Box': return '#9fef00';
    case 'TryHackMe': return '#e9283e';
    case 'PortSwigger': return '#ff6633';
    case 'PicoCTF': return '#3b82f6';
    case 'OverTheWire': return '#f59e0b';
    default: return '#94a3b8';
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
