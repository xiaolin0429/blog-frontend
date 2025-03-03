<template>
  <header class="header bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold flex items-center">
          <span class="mr-2">Lin的Blog日记</span>
        </router-link>
        
        <div class="flex items-center space-x-4">
          <button class="text-gray-600 dark:text-gray-300 hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <button class="text-gray-600 dark:text-gray-300 hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          
          <router-link to="/auth/login" class="text-gray-600 dark:text-gray-300 hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// 头部组件逻辑
</script>

<style scoped>
/* 所有样式通过 Tailwind 类实现 */
</style> 