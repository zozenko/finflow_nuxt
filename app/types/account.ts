import { z } from "zod";

export const AccountSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  type: z.enum(["cash", "card", "savings", "credit"]),
  currency: z.string(),
  balance: z.coerce.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Account = z.infer<typeof AccountSchema>;

export const CreateAccountSchema = AccountSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export type CreateAccountData = z.infer<typeof CreateAccountSchema>;

export const UpdateAccountSchema = CreateAccountSchema.partial();

export type UpdateAccountData = z.infer<typeof UpdateAccountSchema>;

export interface DeleteAccountPayload {
  reassign_to_account_id?: number | null;
}
