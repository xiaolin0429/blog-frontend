<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-8">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row md:justify-between items-center">
        <div class="mb-4 md:mb-0">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {{ new Date().getFullYear() }} My Blog. All rights reserved.
          </p>
        </div>
        <div class="flex space-x-4">
          <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">
            关于我们
          </a>
          <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">
            隐私政策
          </a>
          <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">
            联系我们
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 暂无逻辑
</script> 