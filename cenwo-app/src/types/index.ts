/* ═══════════════════════════════════════════
   CenWo — Type Definitions
   ═══════════════════════════════════════════ */

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';
export type Platform = 'Hack The Box' | 'TryHackMe' | 'PortSwigger' | 'PicoCTF' | 'OverTheWire' | 'Other';
export type OS = 'Linux' | 'Windows' | 'macOS' | 'FreeBSD' | 'Other';
export type ReviewStatus = 'Not Started' | 'In Progress' | 'Needs Review' | 'Reviewed' | 'Mastered';
export type ChallengeCategory = 'Machine' | 'Challenge' | 'Sherlock' | 'Fortress' | 'Endgame' | 'Pro Lab' | 'CTF';
export type PayloadCategory = 'SQLi' | 'XSS' | 'SSTI' | 'LFI' | 'RFI' | 'XXE' | 'SSRF' | 'Command Injection' | 'JWT' | 'LDAP' | 'XML' | 'Template Injection' | 'Other';

export interface Challenge {
  id: string;
  name: string;
  difficulty: Difficulty;
  category: ChallengeCategory;
  os: OS;
  platform: Platform;
  dateCompleted: string;
  timeSpentMinutes: number;
  skills: string[];
  tools: string[];
  commands: string[];
  enumeration: string;
  notes: string;
  mistakesMade: string;
  lessonsLearned: string;
  alternativeApproaches: string;
  externalUrl: string;
  tags: string[];
  isFavorite: boolean;
  reviewStatus: ReviewStatus;
  nextReviewDate?: string;
  reviewInterval?: number;
  screenshots: Screenshot[];
  relatedChallenges: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LearningEntry {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
  detailedNotes: string;
  conceptExplanation: string;
  examples: string;
  realWorldApplications: string;
  commands: string[];
  payloads: string[];
  relatedChallenges: string[];
  relatedCVEs: string[];
  owaspCategory: string;
  mitreAttackTechniques: string[];
  confidenceLevel: number; // 1-5
  needsRevision: boolean;
  flashcards: Flashcard[];
  resources: Resource[];
  tags: string[];
  nextReviewDate?: string;
  reviewInterval?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Command {
  id: string;
  name: string;
  description: string;
  examples: string;
  options: string;
  usedInChallenges: string[];
  usedInLearning: string[];
  tags: string[];
  frequencyUsed: number;
  createdAt: string;
}

export interface Payload {
  id: string;
  name: string;
  category: PayloadCategory;
  content: string;
  explanation: string;
  whenToUse: string;
  risks: string;
  references: string;
  relatedChallenges: string[];
  tags: string[];
  createdAt: string;
}

export interface Screenshot {
  id: string;
  filename: string;
  filepath: string;
  ocrText: string;
  challengeId?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  lastReviewed?: string;
  nextReview?: string;
  ease: number;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'article' | 'tool' | 'documentation' | 'other';
}

export interface Achievement {
  id: string;
  badgeType: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  current: number;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface ActivityLog {
  id: string;
  activityType: 'challenge_completed' | 'learning_added' | 'note_created' | 'command_added' | 'payload_added' | 'review_completed';
  entityType: string;
  entityId: string;
  description: string;
  durationMinutes?: number;
  timestamp: string;
}

export interface DashboardStats {
  currentStreak: number;
  hoursLearned: number;
  machinesCompleted: number;
  academyModules: number;
  sherlocksCompleted: number;
  challengesCompleted: number;
  activeGoals: number;
  knowledgeScore: number;
  totalCommands: number;
  totalPayloads: number;
  totalNotes: number;
}

export interface UserSettings {
  displayName: string;
  email: string;
  avatar?: string;
  htbUsername?: string;
  htbApiToken?: string;
  githubRepo?: string;
  githubToken?: string;
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
}
