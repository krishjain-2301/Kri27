import { z } from 'zod';

export const THMProfileSchema = z.object({
  username: z.string(),
  rank: z.union([z.number(), z.string()]).optional().nullable(),
  points: z.number().default(0),
  avatar: z.string().optional().nullable(),
  subscribed: z.boolean().optional(),
  badges: z.array(z.any()).optional(),
}).passthrough();

export type THMProfileResponse = z.infer<typeof THMProfileSchema>;

export const THMRoomSchema = z.object({
  code: z.string(),
  title: z.string(),
  type: z.string().optional().nullable(),
  difficulty: z.string().optional().nullable(),
  typeCategory: z.string().optional().nullable(),
  completedDate: z.string().optional().nullable(),
}).passthrough();

export const THMCompletedRoomsSchema = z.array(THMRoomSchema);

export type THMRoom = z.infer<typeof THMRoomSchema>;
export type THMCompletedRoomsResponse = z.infer<typeof THMCompletedRoomsSchema>;
