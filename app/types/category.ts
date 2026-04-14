export interface Category {
  id: number
  user_id: number
  name: string
  icon_key: string
  color: string | null
  group_id: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type CreateCategoryData = Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export type UpdateCategoryData = Partial<CreateCategoryData>
