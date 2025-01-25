// API响应基础接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: string
  requestId: string
}

// 分页请求参数
export interface PageParams {
  page?: number
  size?: number
  sort?: string
  order?: 'asc' | 'desc'
}

// 分页响应数据
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  size: number
}

// 列表查询参数
export interface ListParams extends PageParams {
  keyword?: string
  status?: string | number
  startTime?: string
  endTime?: string
  [key: string]: any
}

// 通用响应状态码
export enum ApiCode {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  INTERNAL_ERROR = 500
}

// 文件上传响应
export interface UploadResult {
  url: string
  name: string
  size: number
  type: string
}

// 下拉选项接口
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  children?: SelectOption[]
}

// 分页响应类型
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
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