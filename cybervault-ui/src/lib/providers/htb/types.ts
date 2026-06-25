import { z } from 'zod';

export const HTBUserResponseSchema = z.object({
  profile: z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string().nullable().optional(),
    rank: z.string().nullable().optional(),
    points: z.number().default(0),
    respects: z.number().default(0),
  }).passthrough()
}).passthrough();

export type HTBUserResponse = z.infer<typeof HTBUserResponseSchema>;

export const HTBItemsListSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      difficulty: z.string(),
      is_owned: z.boolean(),
      os: z.string().optional(),
      points: z.number().optional()
    }).passthrough()
  )
}).passthrough();

export type HTBItemsListResponse = z.infer<typeof HTBItemsListSchema>;

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
