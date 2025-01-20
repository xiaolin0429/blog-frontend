export interface Post {
  id: string
  title: string
  content: string
  summary: string
  cover?: string
  author: {
    id: string
    username: string
    avatar?: string
  }
  category: {
    id: string
    name: string
  }
  tags: Array<{
    id: string
    name: string
  }>
  viewCount: number
  commentCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
}

export interface PostList {
  items: Post[]
  total: number
}

export interface PostQuery {
  page?: number
  pageSize?: number
  categoryId?: string
  tagId?: string
  keyword?: string
  orderBy?: 'createdAt' | 'viewCount' | 'commentCount' | 'likeCount'
  order?: 'asc' | 'desc'
} 