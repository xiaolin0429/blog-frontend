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
  page?: number
  size?: number
  ordering?: string
}

// 文章查询参数
export interface PostQuery extends PageQuery {
  category?: number
  tags?: number[]
  author?: number
  status?: 'draft' | 'published' | 'archived'
  search?: string
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

// 业务错误码
export enum ErrorCode {
  // 用户相关 1000-1999
  USER_LOGIN_ERROR = 1001,
  USER_LOCKED = 1002,
  USER_EXISTS = 1003,
  EMAIL_EXISTS = 1004,
  PASSWORD_ERROR = 1005,
  TOKEN_EXPIRED = 1006,
  TOKEN_INVALID = 1007,
  USER_DISABLED = 1008,

  // 文章相关 2000-2999
  POST_TITLE_EXISTS = 2001,
  POST_STATUS_ERROR = 2002,
  POST_PUBLISH_TIME_ERROR = 2003,
  POST_PRIVATE_ERROR = 2004,
  POST_ARCHIVED_ERROR = 2005,
  POST_PUBLISHED_ERROR = 2006,

  // 评论相关 3000-3999
  COMMENT_NOT_FOUND = 3001,
  PARENT_COMMENT_NOT_FOUND = 3002,
  COMMENT_CONTENT_EMPTY = 3003,
  COMMENT_CONTENT_TOO_LONG = 3004,
  COMMENT_DISABLED = 3005,
  COMMENT_PERMISSION_DENIED = 3006,

  // 分类相关 4000-4999
  CATEGORY_EXISTS = 4001,
  PARENT_CATEGORY_NOT_FOUND = 4002,
  CATEGORY_HAS_CHILDREN = 4003,
  CATEGORY_HAS_POSTS = 4004,
  CATEGORY_SELF_PARENT = 4005,
  CATEGORY_PERMISSION_DENIED = 4006,

  // 标签相关 5000-5999
  TAG_EXISTS = 5001,
  TAG_NOT_FOUND = 5002,
  TAG_HAS_POSTS = 5003,
  TAG_PERMISSION_DENIED = 5004,
  TAG_BATCH_CREATE_ERROR = 5005,

  // 文件相关 6000-6999
  FILE_SIZE_LIMIT = 6001,
  FILE_TYPE_ERROR = 6002,
  FILE_UPLOAD_ERROR = 6003,
  FILE_NOT_FOUND = 6004,
  FILE_PERMISSION_DENIED = 6005,

  // 系统相关 9000-9999
  SYSTEM_MAINTENANCE = 9001,
  FEATURE_DISABLED = 9002,
  CONFIG_INVALID = 9003,
  TOO_MANY_REQUESTS = 9004,
  SERVICE_UNAVAILABLE = 9005
}

// 请求频率限制响应
export interface RateLimitResponse {
  waitSeconds: number
  retryAfter: string
}

// HTTP状态码
export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_ERROR = 500
}

// 业务状态码
export enum BusinessCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429
}

// 搜索查询参数
export interface SearchQuery {
  keyword: string
  fields?: string
  category?: number
  tags?: string
  author?: number
  date_start?: string
  date_end?: string
  highlight?: boolean
  page?: number
  page_size?: number
}

// 搜索建议查询参数
export interface SearchSuggestQuery {
  keyword: string
  limit?: number
}

// 搜索建议响应 - 文章类型
export interface PostSuggestion {
  type: 'post'
  id: number
  title: string
  excerpt: string
  category: {
    id: number
    name: string
    level: number
  }
}

// 搜索建议响应 - 分类类型
export interface CategorySuggestion {
  type: 'category'
  id: number
  name: string
  level: number
  post_count: number
}

// 搜索建议响应 - 标签类型
export interface TagSuggestion {
  type: 'tag'
  id: number
  name: string
  post_count: number
}

// 搜索建议响应
export interface SearchSuggestResponse {
  suggestions: Array<PostSuggestion | CategorySuggestion | TagSuggestion>
}

// 标签查询参数
export interface TagQuery extends PageQuery {
  search?: string
  ordering?: 'id' | 'name' | 'post_count' | '-id' | '-name' | '-post_count'
}

// 创建标签请求
export interface CreateTagRequest {
  name: string
  description?: string
}

// 批量创建标签响应
export interface BatchCreateTagsResponse {
  success: number
  failed: number
  items: Array<{
    name: string
    success: boolean
    message?: string
    id?: number
    post_count?: number
  }>
}

// 标签统计响应
export interface TagStatsResponse {
  total: number
  total_used: number
  most_used: Array<{
    id: number
    name: string
    post_count: number
  }>
  recently_created: Array<{
    id: number
    name: string
    created_at: string
  }>
  recently_used: Array<{
    id: number
    name: string
    last_used_at: string
  }>
}

// 回收站文章查询参数
export interface TrashPostQuery extends PageQuery {
  search?: string
  ordering?: 'deleted_at' | '-deleted_at'
}

// 回收站文章响应
export interface TrashPost {
  id: number
  title: string
  excerpt?: string
  author: {
    id: number
    username: string
    nickname?: string
  }
  category: {
    id: number
    name: string
  }
  tags: Array<{
    id: number
    name: string
  }>
  deleted_at: string
}

// 恢复文章响应
export interface RestorePostResponse {
  id: number
  title: string
  status: string
}

// 清空回收站响应
export interface EmptyTrashResponse {
  deleted_count: number
}

// 用户注册请求
export interface RegisterRequest {
  username: string
  password: string
  password2: string
  email: string
  nickname?: string
}

// 用户登录请求
export interface LoginRequest {
  username: string
  password: string
  remember?: boolean
}

// 用户基本信息
export interface UserInfo {
  id: number
  username: string
  email: string
  nickname?: string
  avatar: string
  bio: string
  date_joined: string
  last_login: string
}

// 登录响应中的用户信息
export interface LoginUserInfo {
  id: number
  username: string
  email: string
  nickname?: string
  avatar: string
  date_joined: string
  last_login: string
}

// 登录响应
export interface LoginResponse {
  access: string
  refresh: string
  user: LoginUserInfo
}

// 更新个人信息请求
export interface UpdateProfileRequest {
  nickname?: string
  avatar?: File
  bio?: string
}

// 修改密码请求
export interface ChangePasswordRequest {
  old_password: string
  new_password: string
  confirm_password: string
}

// 登出请求
export interface LogoutRequest {
  refresh: string
} 