import { z } from "zod";

export const PlannedTransactionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  account_id: z.number(),
  to_account_id: z.number().nullable(),
  group_id: z.number().nullable(),
  category_id: z.number().nullable(),
  title: z.string(),
  amount: z.coerce.number(),
  type: z.enum(["income", "expense", "transfer"]),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  next_payment_date: z.string(),
  auto_execute: z.boolean(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type PlannedTransaction = z.infer<typeof PlannedTransactionSchema>;

export const CreatePlannedTransactionSchema = PlannedTransactionSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export type CreatePlannedTransactionData = z.infer<
  typeof CreatePlannedTransactionSchema
>;

export const UpdatePlannedTransactionSchema =
  CreatePlannedTransactionSchema.partial();

export type UpdatePlannedTransactionData = z.infer<
  typeof UpdatePlannedTransactionSchema
>;
