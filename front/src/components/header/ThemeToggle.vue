<template>
  <button 
    @click="toggleTheme" 
    class="p-2 rounded-full focus:outline-none transition-colors"
    :title="isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
  >
    <!-- 深色模式图标 -->
    <svg 
      v-if="!isDarkMode" 
      class="w-5 h-5 text-gray-700 dark:text-gray-300" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      ></path>
    </svg>
    
    <!-- 浅色模式图标 -->
    <svg 
      v-else 
      class="w-5 h-5 text-yellow-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      ></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/store/common/theme'

const themeStore = useThemeStore()

// 计算当前是否为深色模式
const isDarkMode = computed(() => themeStore.mode === 'dark')

// 切换主题
const toggleTheme = () => {
  themeStore.toggleMode()
}
</script> 