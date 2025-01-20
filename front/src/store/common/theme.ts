import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 主题模式：light/dark
  const mode = ref<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 'light'
  )

  // 切换主题模式
  const toggleMode = () => {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', mode.value)
    applyTheme()
  }

  // 设置主题模式
  const setMode = (newMode: 'light' | 'dark') => {
    mode.value = newMode
    localStorage.setItem('theme', newMode)
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    // 移除现有主题类
    document.documentElement.classList.remove('light', 'dark')
    // 添加新主题类
    document.documentElement.classList.add(mode.value)
    // 更新meta主题色
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        'content',
        mode.value === 'light' ? '#ffffff' : '#1a1a1a'
      )
  }

  // 初始化主题
  const initTheme = () => {
    // 如果没有主题设置，跟随系统
    if (!localStorage.getItem('theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setMode(prefersDark ? 'dark' : 'light')
    } else {
      applyTheme()
    }

    // 监听系统主题变化
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          setMode(e.matches ? 'dark' : 'light')
        }
      })
  }

  return {
    mode,
    toggleMode,
    setMode,
    initTheme
  }
}) 