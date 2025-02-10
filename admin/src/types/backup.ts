// 备份类型
export type BackupType = 'full' | 'db' | 'files' | 'settings'

// 备份状态
export type BackupStatus = 'pending' | 'running' | 'completed' | 'failed'

// 备份频率
export type BackupFrequency = 'daily' | 'weekly' | 'monthly'

// 备份查询参数
export interface BackupQuery {
  page?: number
  page_size?: number
  backup_type?: BackupType
  status?: BackupStatus
  is_auto?: boolean
  start_date?: string | undefined
  end_date?: string | undefined
}

// 创建备份请求
export interface CreateBackupRequest {
  name: string
  backup_type: BackupType
  description?: string
}

// 备份配置
export interface BackupConfig {
  id: number
  enabled: boolean
  backup_type: BackupType
  backup_type_display: string
  frequency: BackupFrequency
  frequency_display: string
  retention_days: number
  backup_time: string
  last_backup: string | null
  next_backup: string | null
  created_at: string
  updated_at: string
}

// 更新备份配置请求
export interface UpdateBackupConfigRequest {
  enabled: boolean
  backup_type: BackupType
  frequency: BackupFrequency
  backup_time: string
  retention_days: number
}

// 备份记录
export interface Backup {
  id: number
  name: string
  backup_type: BackupType
  backup_type_display: string
  description: string
  file_path: string
  file_size: number
  status: BackupStatus
  status_display: string
  error_message: string
  is_auto: boolean
  created_at: string
  started_at: string | null
  completed_at: string | null
  created_by: number
  created_by_name: string
} 