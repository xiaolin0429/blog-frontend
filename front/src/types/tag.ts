export interface Tag {
  id: string
  name: string
  count?: number // 该标签下文章数量
  color?: string // 可选的标签颜色
}

export interface TagList {
  items: Tag[]
  total: number
}

export interface TagQuery {
  keyword?: string
  page?: number
  pageSize?: number
  orderBy?: 'name' | 'count'
  order?: 'asc' | 'desc'
} 