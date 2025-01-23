// 文章状态
export type PostStatus = 'draft' | 'published' | 'private'

// 文章创建请求
export interface CreatePostRequest {
  title: string
  content: string
  category: number | string
  tags: string[]
  excerpt?: string
  pinned?: boolean
  allowComment?: boolean
  publishTime?: string
  password?: string
  status: PostStatus
  cover?: string
  meta_description?: string
  meta_keywords?: string
}

// 文章更新请求
export interface UpdatePostRequest {
  title?: string
  content?: string
  category?: number | string
  tags?: string[]
  excerpt?: string
  pinned?: boolean
  allowComment?: boolean
  publishTime?: string
  password?: string
  status?: PostStatus
  cover?: string
  meta_description?: string
  meta_keywords?: string
}

// 文章响应
export interface PostResponse {
  id: number
  title: string
  content: string
  excerpt: string | null
  author: {
    id: number
    username: string
    nickname: string | null
  }
  category: {
    id: number
    name: string
  }
  tags: Array<{
    id: number
    name: string
  }>
  status: PostStatus
  views: number
  likes: number
  comments: number
  created_at: string
  updated_at: string
  published_at: string | null
  meta_description?: string
  meta_keywords?: string
}

// 分类
export interface Category {
  id: number
  name: string
  description?: string
  parent?: number | null
  parent_name?: string
  children?: Category[]
  created_at: string
  updated_at: string
}

// 标签
export interface Tag {
  id: number
  name: string
  description?: string
  post_count: number
  created_at: string
  updated_at: string
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  totalPages: number
} 