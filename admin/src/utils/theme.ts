import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

// 主题类型
export type Theme = 'light' | 'dark'

// 主题存储key
const THEME_KEY = 'admin_theme'

// 当前主题
export const currentTheme = useStorage<Theme>(THEME_KEY, 'light')

// 是否是暗色主题
export const isDark = ref(currentTheme.value === 'dark')

/**
 * 切换主题
 */
export const toggleTheme = () => {
  const theme = currentTheme.value === 'light' ? 'dark' : 'light'
  setTheme(theme)
}

/**
 * 设置主题
 */
export const setTheme = (theme: Theme) => {
  // 更新主题变量
  currentTheme.value = theme
  isDark.value = theme === 'dark'
  
  // 更新html的class
  const html = document.documentElement
  if (theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  
  // 更新Element Plus主题
  html.setAttribute('data-theme', theme)
}

/**
 * 初始化主题
 */
export const initTheme = () => {
  // 根据系统主题初始化
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark')
  }
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setTheme(e.matches ? 'dark' : 'light')
  })
} 