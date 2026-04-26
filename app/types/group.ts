import { z } from "zod";

export const GroupSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string().min(1),
  icon_key: z.string(),
  color: z.string(),
  sort_order: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Group = z.infer<typeof GroupSchema>;

export const CreateGroupSchema = GroupSchema.omit({
  id: true,
  user_id: true,
  sort_order: true,
  created_at: true,
  updated_at: true,
});

export type CreateGroupData = z.infer<typeof CreateGroupSchema>;

export const UpdateGroupSchema = CreateGroupSchema.partial();

export type UpdateGroupData = z.infer<typeof UpdateGroupSchema>;
