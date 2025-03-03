<template>
  <div class="home-container">
    <!-- 技术栈展示区 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Program</h2>
        <span class="text-lg text-gray-600 dark:text-gray-400">Hello world</span>
      </div>
      
      <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
        <!-- 技术图标 -->
        <div class="tech-icon bg-red-500 rounded-xl p-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 text-white">
            <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div class="tech-icon bg-purple-500 rounded-xl p-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 text-white">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <div class="tech-icon bg-orange-500 rounded-xl p-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 text-white">
            <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
          </svg>
        </div>
        <div class="tech-icon bg-blue-500 rounded-xl p-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 text-white">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <div class="tech-icon bg-yellow-400 rounded-xl p-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 text-white">
            <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <div class="tech-icon bg-red-600 rounded-xl p-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 text-white">
            <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </div>
      </div>
      
      <div class="flex mt-4 space-x-3">
        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          必备
        </span>
        <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          入门
        </span>
      </div>
    </div>
    
    <!-- 分类导航 -->
    <div class="flex flex-wrap gap-2 mb-6">
      <a href="#" class="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-medium">首页</a>
      <a href="#" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">Java</a>
      <a href="#" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">数据库</a>
      <a href="#" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">Git</a>
      <a href="#" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">Python</a>
      <a href="#" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">测试</a>
      <a href="#" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">LeetCode</a>
      <a href="#" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">工具</a>
      <a href="#" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">运维</a>
      <a href="#" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">更多</a>
    </div>
    
    <!-- 文章列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 文章卡片 1 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img src="https://picsum.photos/id/237/600/300" alt="文章封面" class="w-full h-48 object-cover" />
          <div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            置顶
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span class="mr-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">数据库</span>
            <span>2023-08-25</span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">MySQL学习笔记 (不断更新中)</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">#SQL</span>
            <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">#MySQL</span>
          </div>
        </div>
      </div>
      
      <!-- 文章卡片 2 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img src="https://picsum.photos/id/238/600/300" alt="文章封面" class="w-full h-48 object-cover" />
          <div class="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            推荐
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span class="mr-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">测试</span>
            <span>2023-08-14</span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">使用 pytest 框架进行 Web 项目的 UI 自动化测试流程</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">#Python</span>
            <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">#selenium</span>
            <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">#pytest</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载更多按钮 -->
    <div class="flex justify-center mt-8">
      <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
        加载更多
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页组件逻辑
</script>

<style scoped>
/* 所有样式通过 Tailwind 类实现 */
</style> 