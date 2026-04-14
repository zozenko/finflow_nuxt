export interface Group {
  id: number
  user_id: number
  name: string
  icon_key: string
  color: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type CreateGroupData = Omit<Group, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export type UpdateGroupData = Partial<CreateGroupData>
