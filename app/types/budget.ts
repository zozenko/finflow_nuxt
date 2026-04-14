export interface Budget {
  id: number
  user_id: number
  category_id: number | null
  group_id: number | null
  amount: number
  period: 'monthly' | 'weekly' | 'yearly'
  start_date: string
  created_at: string
  updated_at: string
}

export type CreateBudgetData = Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export type UpdateBudgetData = Partial<CreateBudgetData>
