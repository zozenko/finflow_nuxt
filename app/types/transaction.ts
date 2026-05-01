import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  account_id: z.number(),
  parent_id: z.number().nullable().optional(),
  to_account_id: z.number().nullable(),
  group_id: z.number().nullable(),
  category_id: z.number().nullable(),
  planned_transaction_id: z.number().nullable().optional(),
  title: z.string(),
  amount: z.coerce.number(),
  type: z.enum(["income", "expense", "transfer"]),
  description: z.string().nullable().optional(),
  transaction_date: z.string(),
  is_favorite: z.boolean().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export type CreateTransactionData = z.infer<typeof CreateTransactionSchema>;

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

export type UpdateTransactionData = z.infer<typeof UpdateTransactionSchema>;

export interface GetTransactionsParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}
export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
  last_page: number;
  current_page: number;
}

// --- ТИПИ ТА СХЕМИ ДЛЯ СТАТИСТИКИ ---
export interface BaseStatsParams {
  date_from?: string;
  date_to?: string;
  account_id?: number | null;
  type?: "expense" | "income";
}

export interface SumByGroupsParams extends BaseStatsParams {}

export interface SumByCategoriesParams extends BaseStatsParams {
  group_id: number | null;
}

export const PeriodSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const TransactionGroupStatSchema = z.object({
  groupId: z.number(),
  amount: z.coerce.number(),
});

export const TransactionCategoryStatSchema = z.object({
  categoryId: z.number(),
  amount: z.coerce.number(),
});

export const SumByGroupsResponseSchema = z.object({
  period: PeriodSchema,
  stats: z.array(TransactionGroupStatSchema),
});

export type SumByGroupsResponse = z.infer<typeof SumByGroupsResponseSchema>;

export const SumByCategoriesResponseSchema = z.object({
  period: PeriodSchema,
  stats: z.array(TransactionCategoryStatSchema),
});

export type SumByCategoriesResponse = z.infer<
  typeof SumByCategoriesResponseSchema
>;
