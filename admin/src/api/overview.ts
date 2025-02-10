import request from '@/utils/request'

// 获取系统概览信息
export const getOverview = () => {
  return request({
    url: '/overview/',
    method: 'get'
  })
}

// 获取系统信息
export const getSystemInfo = () => {
  return request({
    url: '/overview/system/',
    method: 'get'
  })
}

// 获取内容统计
export const getContentStats = () => {
  return request({
    url: '/overview/content/',
    method: 'get'
  })
}

// 获取存储统计
export const getStorageStats = () => {
  return request({
    url: '/overview/storage/',
    method: 'get'
  })
} 