// 系统信息
export interface SystemInfo {
  version: string
  start_time: number
  python_version: string
  cpu_usage: {
    percent: number
    cores: number
    physical_cores: number
  }
  memory_usage: {
    percent: number
    total: number
    available: number
    used: number
  }
  disk_usage: {
    percent: number
    total: number
    used: number
    free: number
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
export interface RecentActivity {
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
  recent_activities: RecentActivity
} 