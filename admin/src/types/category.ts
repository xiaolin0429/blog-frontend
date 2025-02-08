// 分类实体
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent: number | null
  level: number
  order: number
  children: Category[]
  created_at: string
  updated_at: string
}

// 创建分类请求
export interface CreateCategoryRequest {
  name: string
  description?: string
  parent?: number
  order?: number
}

// 更新分类请求
export interface UpdateCategoryRequest {
  name?: string
  description?: string
  parent?: number
  order?: number
} 