<template>
  <div class="default-layout dark:bg-gray-900 min-h-screen">
    <!-- 顶部导航栏 -->
    <header-component />
    
    <!-- 主内容区 -->
    <main class="main-content container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧内容区 -->
        <div class="lg:w-3/4">
          <router-view />
        </div>
        
        <!-- 右侧边栏 -->
        <div class="lg:w-1/4">
          <sidebar-component />
        </div>
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer-component />
  </div>
</template>

<script setup lang="ts">
import SidebarComponent from '@/components/sidebar/index.vue';
import HeaderComponent from '@/components/header/index.vue';
import FooterComponent from '@/components/footer/index.vue';
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style> 