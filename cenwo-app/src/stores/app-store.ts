import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Challenge, LearningEntry, Command, Payload, Note, ActivityLog, DashboardStats, UserSettings } from '@/types';
import { mockChallenges, mockLearningEntries, mockCommands, mockPayloads, mockNotes, mockActivities, mockDashboardStats } from '@/lib/mock-data';

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  searchOpen: boolean;
  toggleSidebar: () => void;
  setSearchOpen: (open: boolean) => void;

  // Data
  challenges: Challenge[];
  learningEntries: LearningEntry[];
  commands: Command[];
  payloads: Payload[];
  notes: Note[];
  activities: ActivityLog[];
  stats: DashboardStats;
  settings: UserSettings;

  // Challenge Actions
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  deleteChallenge: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // Learning Actions
  addLearningEntry: (entry: LearningEntry) => void;
  updateLearningEntry: (id: string, updates: Partial<LearningEntry>) => void;
  deleteLearningEntry: (id: string) => void;

  // Command Actions
  addCommand: (command: Command) => void;
  updateCommand: (id: string, updates: Partial<Command>) => void;
  deleteCommand: (id: string) => void;

  // Payload Actions
  addPayload: (payload: Payload) => void;
  updatePayload: (id: string, updates: Partial<Payload>) => void;
  deletePayload: (id: string) => void;

  // Note Actions
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Activity Actions
  addActivity: (activity: ActivityLog) => void;

  // Settings
  updateSettings: (updates: Partial<UserSettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // UI State
      sidebarCollapsed: false,
      searchOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSearchOpen: (open) => set({ searchOpen: open }),

      // Data (initialized with mock data)
      challenges: mockChallenges,
      learningEntries: mockLearningEntries,
      commands: mockCommands,
      payloads: mockPayloads,
      notes: mockNotes,
      activities: mockActivities,
      stats: mockDashboardStats,
      settings: {
        displayName: 'CyberLearner',
        email: 'user@cenwo.local',
        theme: 'dark' as const,
        sidebarCollapsed: false,
      },

      // Challenge Actions
      addChallenge: (challenge) =>
        set((state) => ({
          challenges: [challenge, ...state.challenges],
          stats: {
            ...state.stats,
            challengesCompleted: state.stats.challengesCompleted + 1,
            machinesCompleted: challenge.category === 'Machine'
              ? state.stats.machinesCompleted + 1
              : state.stats.machinesCompleted,
          },
        })),
      updateChallenge: (id, updates) =>
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        })),
      deleteChallenge: (id) =>
        set((state) => ({
          challenges: state.challenges.filter((c) => c.id !== id),
        })),
      toggleFavorite: (id) =>
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
          ),
        })),

      // Learning Actions
      addLearningEntry: (entry) =>
        set((state) => ({
          learningEntries: [entry, ...state.learningEntries],
        })),
      updateLearningEntry: (id, updates) =>
        set((state) => ({
          learningEntries: state.learningEntries.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
          ),
        })),
      deleteLearningEntry: (id) =>
        set((state) => ({
          learningEntries: state.learningEntries.filter((e) => e.id !== id),
        })),

      // Command Actions
      addCommand: (command) =>
        set((state) => ({
          commands: [command, ...state.commands],
          stats: { ...state.stats, totalCommands: state.stats.totalCommands + 1 },
        })),
      updateCommand: (id, updates) =>
        set((state) => ({
          commands: state.commands.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteCommand: (id) =>
        set((state) => ({
          commands: state.commands.filter((c) => c.id !== id),
        })),

      // Payload Actions
      addPayload: (payload) =>
        set((state) => ({
          payloads: [payload, ...state.payloads],
          stats: { ...state.stats, totalPayloads: state.stats.totalPayloads + 1 },
        })),
      updatePayload: (id, updates) =>
        set((state) => ({
          payloads: state.payloads.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deletePayload: (id) =>
        set((state) => ({
          payloads: state.payloads.filter((p) => p.id !== id),
        })),

      // Note Actions
      addNote: (note) =>
        set((state) => ({
          notes: [note, ...state.notes],
          stats: { ...state.stats, totalNotes: state.stats.totalNotes + 1 },
        })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      // Activity Actions
      addActivity: (activity) =>
        set((state) => ({
          activities: [activity, ...state.activities].slice(0, 100),
        })),

      // Settings
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
    }),
    {
      name: 'cenwo-storage',
      partialize: (state) => ({
        challenges: state.challenges,
        learningEntries: state.learningEntries,
        commands: state.commands,
        payloads: state.payloads,
        notes: state.notes,
        activities: state.activities,
        stats: state.stats,
        settings: state.settings,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
