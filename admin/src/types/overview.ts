// 系统信息
export interface SystemInfo {
  version: string
  status: 'running' | 'unknown'
  uptime: number
  system_load: {
    cpu: number
    memory: number
    disk: number
  }
  timestamp: number
}

// 内容统计
export interface ContentStats {
  total_users: number
  active_users: number
  total_posts: number
  published_posts: number
  total_comments: number
  recent_comments: number
  timestamp: number
}

// 存储统计
export interface StorageStats {
  total_files: number
  total_size: number
  backup_count: number
  last_backup: {
    id: number
    name: string
    created_at: string
    status: string
    status_display: string
  } | null
  timestamp: number
}

// 最近活动
export interface RecentActivities {
  recent_posts: Array<{
    id: number
    title: string
    author: string
    created_at: string
    status: string
    status_display: string
  }>
  recent_backups: Array<{
    id: number
    name: string
    created_at: string
    status: string
    status_display: string
  }>
  timestamp: number
}

// 系统概览
export interface Overview {
  system_info: SystemInfo
  content_stats: ContentStats
  storage_stats: StorageStats
  recent_activities: RecentActivities
} 