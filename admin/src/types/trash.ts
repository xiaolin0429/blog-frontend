import type { Post } from './post'

// 回收站中的文章类型
export interface TrashPost extends Post {
  deleted_at: string
} 