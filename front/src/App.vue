<template>
  <router-view />
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/common/theme'

const themeStore = useThemeStore()
themeStore.initTheme()
</script>

<style>
#app {
  min-height: 100vh;
}
</style> 