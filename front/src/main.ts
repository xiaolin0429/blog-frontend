import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/tailwind.css'
import './styles/main.css'

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 声明 HTMLElement 类型扩展
declare global {
  interface HTMLElement {
    _clickOutside?: (event: MouseEvent) => void
  }
}

const app = createApp(App)

// 注册点击外部区域指令
app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutside = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside)
    }
  }
})

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(createPinia())

app.mount('#app') 