export interface Transaction {
  id: number
  user_id: number
  account_id: number
  to_account_id: number | null
  group_id: number | null
  category_id: number | null
  planned_transaction_id: number | null
  title: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  description: string | null
  transaction_date: string
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export type CreateTransactionData = Omit<
  Transaction,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>

export type UpdateTransactionData = Partial<CreateTransactionData>
