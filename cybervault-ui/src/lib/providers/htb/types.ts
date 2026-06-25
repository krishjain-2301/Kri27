import { z } from 'zod';

// ==========================================
// 1. User Profile Endpoint (/api/v4/user/info)
// ==========================================
export const HTBUserResponseSchema = z.object({
  profile: z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string().nullable().optional(),
    rankId: z.number().nullable().optional(),
    rankText: z.string().nullable().optional(),
    points: z.number().optional().default(0),
    respects: z.number().optional().default(0),
  }).passthrough()
}).passthrough();

export type HTBUserResponse = z.infer<typeof HTBUserResponseSchema>;

// ==========================================
// 2. Machine Owns Endpoint (/api/v4/machine/owns)
// (Note: The actual HTB v4 response might wrap this in 'data' or similar. 
// We are building defensive schemas.)
// ==========================================
export const HTBMachineOwnSchema = z.object({
  id: z.number(),
  name: z.string(),
  os: z.string().nullable().optional(),
  difficultyText: z.string().nullable().optional(),
  points: z.number().optional().default(0),
  ownDate: z.string().optional(),
  status: z.string().optional(), // Inferred status like 'user' or 'root'
}).passthrough();

export const HTBMachineOwnsResponseSchema = z.object({
  // Sometimes wrapped in 'data' or 'items'
  data: z.array(HTBMachineOwnSchema).optional(),
}).passthrough();

export type HTBMachineOwnsResponse = z.infer<typeof HTBMachineOwnsResponseSchema>;

// ==========================================
// 3. Challenge Owns Endpoint (/api/v4/challenge/owns)
// ==========================================
export const HTBChallengeOwnSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  points: z.number().optional().default(0),
  ownDate: z.string().optional(),
}).passthrough();

export const HTBChallengeOwnsResponseSchema = z.object({
  data: z.array(HTBChallengeOwnSchema).optional(),
}).passthrough();

export type HTBChallengeOwnsResponse = z.infer<typeof HTBChallengeOwnsResponseSchema>;
