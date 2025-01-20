// API 响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: string
  requestId: string
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}

// 分页查询参数
export interface PageQuery {
  page: number
  size: number
  ordering: string
}

// 文章查询参数
export interface PostQuery extends PageQuery {
  keyword?: string
  category?: string
  tag?: string
  status?: string
  startDate?: string
  endDate?: string
}

// 创建文章请求
export interface CreatePostRequest {
  title: string
  content: string
  category: string
  tags: string[]
  summary?: string
  pinned?: boolean
  allowComment?: boolean
  publishTime?: string
  password?: string
  status: 'draft' | 'published'
}

// 更新文章请求
export interface UpdatePostRequest extends Partial<CreatePostRequest> {} 