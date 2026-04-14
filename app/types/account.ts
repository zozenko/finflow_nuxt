export interface Account {
  id: number
  user_id: number
  name: string
  type: 'cash' | 'card' | 'savings' | 'credit'
  currency: string
  balance: number
  created_at: string
  updated_at: string
}

export type CreateAccountData = Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export type UpdateAccountData = Partial<CreateAccountData>
