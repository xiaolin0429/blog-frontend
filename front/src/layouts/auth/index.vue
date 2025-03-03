<template>
  <div class="min-h-screen flex items-center justify-center bg-background text-text py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <!-- 返回主页链接 -->
      <div class="text-center mb-4">
        <router-link to="/" class="text-primary hover:underline flex items-center justify-center">
          <span class="mr-2">←</span> 返回主页
        </router-link>
      </div>
      
      <!-- 主内容区域 -->
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
// Auth 布局不需要特殊逻辑
</script> 