/// <reference types="vite/client" />

declare module '@wangeditor/editor-for-vue' {
  import { DefineComponent } from 'vue'
  export const Editor: DefineComponent<{}, {}, any>
  export const Toolbar: DefineComponent<{}, {}, any>
}

declare module '@wangeditor/editor' {
  export interface IDomEditor {
    getHtml: () => string
    destroy: () => void
  }
  
  export interface IEditorConfig {
    placeholder?: string
    autoFocus?: boolean
    MENU_CONF?: Record<string, any>
  }
  
  export interface IToolbarConfig {
    excludeKeys?: string[]
  }
} 