import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { validateOnPageRefresh } from '@/utils/auth'
import { initTheme } from '@/utils/theme'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入样式
import '@/styles/index.scss'
import './styles/tailwind.css'
import './styles/main.css'

// 创建应用实例
const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 初始化
initTheme() // 初始化主题
validateOnPageRefresh() // 验证权限

// 挂载应用
app.mount('#app') 