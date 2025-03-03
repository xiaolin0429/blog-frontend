<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
    <nav class="container mx-auto px-4 flex items-center justify-between h-16">
      <!-- 左侧：博客Logo -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center">
          <span class="text-xl font-bold text-primary">My Blog</span>
        </router-link>
      </div>
      
      <!-- 中间：导航菜单（桌面端） -->
      <div class="hidden md:flex items-center space-x-4">
        <router-link 
          to="/" 
          class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
          active-class="text-primary dark:text-primary"
        >
          首页
        </router-link>
        
        <!-- 分类菜单（带下拉） -->
        <div class="relative" v-click-outside="closeDropdown">
          <button 
            @click="toggleDropdown"
            class="px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
          >
            分类
            <svg 
              class="ml-1 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <!-- 下拉菜单 -->
          <div 
            v-show="isDropdownOpen"
            class="absolute top-full left-0 w-48 py-2 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10"
          >
            <router-link 
              to="/category"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              全部分类
            </router-link>
            <!-- 这里将来会动态加载分类 -->
          </div>
        </div>
        
        <router-link 
          to="/tag" 
          class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
          active-class="text-primary dark:text-primary"
        >
          标签
        </router-link>
        
        <router-link 
          to="/about" 
          class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
          active-class="text-primary dark:text-primary"
        >
          关于
        </router-link>
      </div>
      
      <!-- 右侧：登录/注册、主题切换 -->
      <div class="flex items-center space-x-2">
        <router-link 
          to="/auth/login"
          class="hidden md:block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
        >
          登录
        </router-link>
        
        <ThemeToggle />
        
        <!-- 移动端菜单按钮 -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg 
            class="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </nav>
    
    <!-- 移动端菜单 -->
    <div 
      v-show="isMobileMenuOpen"
      class="md:hidden bg-white dark:bg-gray-900 shadow-sm"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link 
          to="/" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary"
          @click="isMobileMenuOpen = false"
        >
          首页
        </router-link>
        
        <router-link 
          to="/category" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary"
          @click="isMobileMenuOpen = false"
        >
          分类
        </router-link>
        
        <router-link 
          to="/tag" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary"
          @click="isMobileMenuOpen = false"
        >
          标签
        </router-link>
        
        <router-link 
          to="/about" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary"
          @click="isMobileMenuOpen = false"
        >
          关于
        </router-link>
        
        <router-link 
          to="/auth/login" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary"
          @click="isMobileMenuOpen = false"
        >
          登录
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

// 控制分类下拉菜单
const isDropdownOpen = ref(false)
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
const closeDropdown = () => {
  isDropdownOpen.value = false
}

// 控制移动端菜单
const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 扩展HTMLElement接口，添加_clickOutside属性
declare global {
  interface HTMLElement {
    _clickOutside?: (event: MouseEvent) => void
  }
}

// 需要添加一个 v-click-outside 指令
// 这里仅为定义，实际实现需要在main.ts中注册该指令
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el._clickOutside = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside!)
  },
  unmounted(el: HTMLElement) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside)
    }
  }
}
</script> 