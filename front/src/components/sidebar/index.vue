<template>
  <div class="sidebar space-y-6">
    <!-- 每日推荐区域 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">每日推荐</h3>
        </div>
      </div>
      <div class="p-4">
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-start">
            <div class="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
              <img :src="`https://picsum.photos/id/${30 + i}/48/48`" alt="推荐文章缩略图" class="w-full h-full object-cover" />
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">推荐文章标题 {{ i }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">2023-01-0{{ i }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新评论区域 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">最新评论</h3>
          </div>
          <router-link to="/comments" class="text-sm text-primary hover:underline">
            更多
          </router-link>
        </div>
      </div>
      <div class="p-4">
        <div class="space-y-4">
          <div v-for="i in 2" :key="i" class="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
            <div class="flex items-center mb-2">
              <div class="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img :src="`https://picsum.photos/id/${40 + i}/32/32`" alt="用户头像" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">用户名{{ i }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">2023-01-0{{ i }}</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              这是一条评论内容，展示用户对文章的看法和反馈。这是一条评论内容，展示用户对文章的看法和反馈。
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              来自文章：<a href="#" class="hover:text-primary">文章标题{{ i }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近发布区域 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">最近发布</h3>
        </div>
      </div>
      <div class="p-4">
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-start">
            <div class="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
              <img :src="`https://picsum.photos/id/${50 + i}/48/48`" alt="文章缩略图" class="w-full h-full object-cover" />
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">最新文章标题 {{ i }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">2023-01-0{{ i }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 侧边栏组件
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 