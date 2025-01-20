// 文章类型
export interface Post {
  id: number
  title: string
  content: string
  summary: string
  category: Category
  tags: Tag[]
  pinned: boolean
  allowComment: boolean
  publishTime: string
  password: string | null
  status: 'draft' | 'published'
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

// 分类类型
export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  postCount: number
  createdAt: string
}

// 标签类型
export interface Tag {
  id: number
  name: string
  slug: string
  postCount: number
  createdAt: string
} 