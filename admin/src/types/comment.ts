// 评论实体
export interface Comment {
  id: number
  content: string
  author: {
    id: number
    username: string
    nickname?: string
  }
  post: {
    id: number
    title: string
  }
  post_id: number
  parent_id?: number
  status: 'visible' | 'hidden'
  created_at: string
  updated_at?: string
}

// 评论查询参数
export interface CommentQuery {
  search?: string
  status?: 'visible' | 'hidden'
  page?: number
  size?: number
  ordering?: string
}

// 创建评论请求
export interface CreateCommentRequest {
  content: string
  parent_id?: number
}

// 更新评论请求
export interface UpdateCommentRequest {
  content?: string
  status?: 'visible' | 'hidden'
} 