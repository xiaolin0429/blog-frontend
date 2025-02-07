// 标签实体
export interface Tag {
  id: number
  name: string
  description?: string
  post_count: number
  created_at: string
  updated_at: string
}

// 创建标签请求
export interface CreateTagRequest {
  name: string
  description?: string
}

// 更新标签请求
export interface UpdateTagRequest {
  name?: string
  description?: string
} 