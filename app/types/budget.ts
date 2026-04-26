import { z } from "zod";

export const BudgetSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  category_id: z.number().nullable(),
  group_id: z.number().nullable(),
  amount: z.coerce.number(),
  period: z.enum(["monthly", "weekly", "yearly"]),
  start_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Budget = z.infer<typeof BudgetSchema>;

export const CreateBudgetSchema = BudgetSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export type CreateBudgetData = z.infer<typeof CreateBudgetSchema>;

export const UpdateBudgetSchema = CreateBudgetSchema.partial();

export type UpdateBudgetData = z.infer<typeof UpdateBudgetSchema>;
