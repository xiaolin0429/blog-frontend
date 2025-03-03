<template>
  <div class="comments-container">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">最新评论</h1>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div class="space-y-6">
        <div v-for="i in 5" :key="i" class="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full overflow-hidden mr-4 flex-shrink-0">
              <img src="https://picsum.photos/id/64/40/40" alt="用户头像" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h3 class="text-md font-medium text-gray-900 dark:text-gray-100">用户名{{ i }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">2023-01-0{{ i }}</p>
                </div>
                <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  文章标题{{ i }}
                </span>
              </div>
              <p class="text-gray-700 dark:text-gray-300">
                这是一条评论内容，展示用户对文章的看法和反馈。这是一条评论内容，展示用户对文章的看法和反馈。
                这是一条评论内容，展示用户对文章的看法和反馈。这是一条评论内容，展示用户对文章的看法和反馈。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="flex justify-center mt-8">
        <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
          加载更多
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 评论页面组件逻辑
</script>

<style scoped>
/* 所有样式通过 Tailwind 类实现 */
</style> 