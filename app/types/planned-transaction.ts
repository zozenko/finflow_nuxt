export interface PlannedTransaction {
  id: number
  user_id: number
  account_id: number
  to_account_id: number | null
  group_id: number | null
  category_id: number | null
  title: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  next_payment_date: string
  auto_execute: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CreatePlannedTransactionData = Omit<
  PlannedTransaction,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>

export type UpdatePlannedTransactionData = Partial<CreatePlannedTransactionData>
