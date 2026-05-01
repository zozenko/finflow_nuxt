import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string().min(1),
  icon_key: z.string(),
  color: z.string().nullable(),
  group_id: z.coerce.number().nullable(),
  sort_order: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  user_id: true,
  sort_order: true,
  created_at: true,
  updated_at: true,
});

export type CreateCategoryData = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type UpdateCategoryData = z.infer<typeof UpdateCategorySchema>;

export interface DeleteCategoryPayload {
  reassign_to_category_id?: number | null;
}
