import type { PageQuery } from './api'

// 文章作者
export interface PostAuthor {
  id: number
  username: string
  nickname?: string
}

// 文章分类
export interface PostCategory {
  id: number
  name: string
  level: number
}

// 文章标签
export interface PostTag {
  id: number
  name: string
}

// 文章状态
export type PostStatus = 'draft' | 'published' | 'private' | 'archived'

// 文章实体
export interface Post {
  id: number
  title: string
  content: string
  excerpt: string
  category: PostCategory
  tags: PostTag[]
  status: PostStatus
  published_at: string | null
  author: number
  author_username: string
  created_at: string
  updated_at: string
  view_count: number
  comment_count: number
  like_count: number
  pinned: boolean
  allowComment: boolean
  password: string
  cover: string
  meta_description: string
  meta_keywords: string
}

// 文章列表项
export interface PostListItem {
  id: number
  title: string
  excerpt: string
  author: number
  author_username: string
  category: number
  category_name: string
  tags: Array<{
    id: number
    name: string
    description?: string
    post_count: number
    created_at: string
    posts: any[] | null
  }>
  status: PostStatus
  comments_count: number
  created_at: string
  updated_at: string
  published_at: string | null
}

// 文章查询参数
export interface PostQuery extends PageQuery {
  status?: 'draft' | 'published' | 'archived'
  category?: number
  tags?: number[]
  search?: string
  ordering?: string // created_at|published_at|view_count|comment_count|like_count，前缀-表示降序
  date_start?: string
  date_end?: string
}

// 创建文章请求
export interface CreatePostRequest {
  title: string
  content: string
  excerpt?: string
  category_id: number
  tag_ids?: number[]
  status?: PostStatus
  pinned?: boolean
  allowComment?: boolean
  published_at?: string
  password?: string
  cover?: string
  meta_description?: string
  meta_keywords?: string
}

// 更新文章请求
export interface UpdatePostRequest {
  title?: string
  content?: string
  excerpt?: string
  category_id?: number
  tag_ids?: number[]
  status?: PostStatus
}

// 自动保存文章请求
export interface AutoSavePostRequest {
  title: string
  content: string
  excerpt?: string
  category_id?: number
  tag_ids?: number[]
  force_save?: boolean
}

// 自动保存文章响应
export interface AutoSavePostResponse {
  id: number
  title: string
  content: string
  excerpt?: string
  category_id?: number
  tag_ids?: number[]
  version: number
  next_save_time: string
}

// 文章点赞响应
export interface PostLikeResponse {
  liked: boolean
  like_count: number
}

// 文章浏览响应
export interface PostViewResponse {
  view_count: number
}

// 相关文章响应
export interface RelatedPost {
  id: number
  title: string
  excerpt?: string
  created_at: string
}

// 分类
export interface Category {
  id: number
  name: string
  description?: string
  parent: number | null
  level: number
  order: number
  children: Category[]
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

export interface TagDetail extends Tag {
  posts: Array<{
    id: number
    title: string
    created_at: string
  }>
}

// 分页响应
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// API 响应
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: string
  requestId: string
} 