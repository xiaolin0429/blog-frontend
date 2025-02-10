import request from '@/utils/request'
import type { BackupQuery, CreateBackupRequest, UpdateBackupConfigRequest } from '../types/backup'
import type { PaginatedResponse } from '../types/api'

// 获取备份列表
export const getBackups = (params: BackupQuery) => {
  return request<PaginatedResponse<any>>({
    url: '/backup/backups/',
    method: 'get',
    params
  })
}

// 创建备份
export const createBackup = (data: CreateBackupRequest) => {
  return request<any>({
    url: '/backup/backups/',
    method: 'post',
    data
  })
}

// 删除备份
export const deleteBackup = (id: number) => {
  return request<any>({
    url: `/backup/backups/${id}/`,
    method: 'delete'
  })
}

// 恢复备份
export const restoreBackup = (id: number) => {
  return request<any>({
    url: `/backup/backups/${id}/restore/`,
    method: 'post'
  })
}

// 获取备份配置列表
export const getBackupConfigs = () => {
  return request<PaginatedResponse<any>>({
    url: '/backup/configs/',
    method: 'get'
  })
}

// 更新备份配置
export const updateBackupConfig = (id: number, data: UpdateBackupConfigRequest) => {
  return request<any>({
    url: `/backup/configs/${id}/`,
    method: 'put',
    data
  })
}

// 测试备份配置
export const testBackupConfig = (id: number) => {
  return request<any>({
    url: `/backup/configs/${id}/test/`,
    method: 'post'
  })
} 