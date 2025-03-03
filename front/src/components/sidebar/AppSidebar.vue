<template>
  <div class="space-y-6">
    <!-- 搜索框 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">搜索</h3>
      <div class="relative">
        <input 
          type="text" 
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="搜索文章..."
        />
        <button 
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
        >
          <svg 
            class="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 推荐阅读 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">推荐阅读</h3>
      <div class="space-y-4">
        <!-- 这里将来会动态加载推荐文章 -->
        <div v-for="i in 4" :key="i" class="flex items-start space-x-3">
          <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0"></div>
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100">推荐文章标题占位</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">2023-01-01</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 文章分类 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">分类</h3>
      <div class="flex flex-wrap gap-2">
        <!-- 这里将来会动态加载分类标签 -->
        <a 
          v-for="i in 8" 
          :key="i" 
          href="#" 
          class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-full text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors"
        >
          分类标签
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 暂无逻辑
</script> 