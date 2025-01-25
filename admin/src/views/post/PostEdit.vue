<script setup lang="ts">
// Vue 相关
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Element Plus 相关
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  ArrowLeft,
  Plus,
  Edit,
  DocumentCopy,
  List,
  Sort,
  ChatLineSquare,
  Minus,
  Picture,
  Link as LinkIcon,
  Crop,
  VideoCamera,
  Operation,
  Notebook,
  DeleteFilled,
  Grid,
  ArrowDown,
  InfoFilled,
  Loading,
  Select
} from '@element-plus/icons-vue'

// WangEditor 相关
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

// Prism.js 语法高亮
import * as Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-markup'  // HTML
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-nginx'

// 项目内部导入
import { useThemeStore } from '@/store/common/theme'
import {
  getPost,
  createPost,
  updatePost,
  getCategories,
  getTags,
  uploadImage,
  quickCreateCategory,
  createTag,
  autoSavePost
} from '@/api/post'
import type { CreatePostRequest, Category, Tag, PostStatus } from '@/types/post'

const route = useRoute()
const router = useRouter()
const isEdit = route.params.id !== undefined
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.mode === 'dark')

// 编辑器实例和配置
const editor = ref<IDomEditor | null>(null)
const toolbarConfig = {
  excludeKeys: []
} as Partial<IToolbarConfig>

const editorConfig = {
  placeholder: '请输入内容...',
  autoFocus: false,
  scroll: true,
  maxLength: 100000,
  customAlert: (info: string, type: string) => {
    ElMessage({
      message: info,
      type: type === 'success' ? 'success' : type === 'error' ? 'error' : 'warning'
    })
  },
  MENU_CONF: {
    uploadImage: {
      server: '/api/upload/image',
      fieldName: 'image',
      maxFileSize: 10 * 1024 * 1024,
      maxNumberOfFiles: 10,
      allowedFileTypes: ['image/*'],
      metaWithUrl: true,
      customInsert(res: any, insertFn: Function) {
        if (res.code === 200) {
          insertFn(res.data)
        } else {
          ElMessage.error(res.message || '上传图片失败')
        }
      }
    },
    codeBlock: {
      languages: [
        { text: '纯文本', value: 'text' },
        { text: 'JavaScript', value: 'javascript' },
        { text: 'TypeScript', value: 'typescript' },
        { text: 'HTML', value: 'html' },
        { text: 'CSS', value: 'css' },
        { text: 'Python', value: 'python' },
        { text: 'Java', value: 'java' },
        { text: 'Go', value: 'go' },
        { text: 'SQL', value: 'sql' },
        { text: 'Bash', value: 'bash' }
      ]
    },
    insertLink: {
      checkLink: (text: string, url: string): string | boolean | undefined => {
        return true
      }
    }
  },
  parseHtml: (elem: HTMLElement, children: any[], editor: any) => {
    if (elem.tagName === 'PRE') {
      const codeElem = elem.querySelector('code')
      const language = codeElem?.className?.replace('language-', '') || 'text'
      return {
        type: 'pre',
        children: [{
          type: 'code',
          language,
          children: [{ text: codeElem?.innerText || '' }]
        }]
      }
    }
    return false
  }
} as Partial<IEditorConfig>

// 表单引用
const formRef = ref<FormInstance>()
const settingsFormRef = ref<FormInstance>()

// 表单数据
const postForm = ref<CreatePostRequest>({
  title: '',
  content: '',
  category: 0,
  tags: [],
  excerpt: '',
  pinned: false,
  allowComment: true,
  publishTime: new Date().toISOString(),
  password: '',
  status: 'draft',
  cover: '',
  meta_description: '',
  meta_keywords: ''
})

// 表单验证规则
const rules: FormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ],
  tags: [
    { type: 'array', message: '标签必须是数组类型', trigger: 'change' }
  ]
}

// 分类和标签数据
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const total = ref(0)
const loading = ref(false)
const autoSaving = ref(false)
const lastSavedTime = ref<string>('')
const saveHistory = ref<Array<{
  time: string
  content: string
  title: string
}>>([])

// 计算属性：表单是否已修改
const isFormModified = computed(() => {
  return JSON.stringify(postForm.value) !== JSON.stringify(originalForm.value)
})

// 保存原始表单数据，用于比较是否修改
const originalForm = ref<CreatePostRequest>({
  title: '',
  content: '',
  category: 0,
  tags: [],
  excerpt: '',
  pinned: false,
  allowComment: true,
  publishTime: new Date().toISOString(),
  password: '',
  status: 'draft',
  cover: '',
  meta_description: '',
  meta_keywords: ''
})

// 自动保存相关的状态
const MIN_SAVE_INTERVAL = 10000  // 最短保存间隔：10秒
const MAX_SAVE_INTERVAL = 120000 // 最长保存间隔：2分钟
const IDLE_TIMEOUT = 3000        // 空闲超时：3秒
const currentVersion = ref(0)
const nextSaveTime = ref<string | null>(null)
let lastEditTime = Date.now()
let lastSaveTime = Date.now()
let autoSaveTimer: ReturnType<typeof setInterval> | null = null
let idleTimer: ReturnType<typeof setTimeout> | null = null

// 计算下次可保存时间
const nextSaveTimeText = computed(() => {
  if (nextSaveTime.value && new Date(nextSaveTime.value) > new Date()) {
    return `下次保存时间：${new Date(nextSaveTime.value).toLocaleTimeString()}`
  }
  return ''
})

// 编辑器内容变化时的处理函数
const handleEditorChange = (editor: IDomEditor) => {
  if (!editor) {
    return
  }
  
  try {
    const html = editor.getHtml()
    postForm.value.content = html
    triggerAutoSave()
  } catch (error) {
    console.error('编辑器内容更新失败:', error)
  }
}

// 标题输入处理
const handleTitleInput = () => {
  triggerAutoSave()
}

// 返回列表
const handleBack = () => {
  if (isFormModified.value) {
    ElMessageBox.confirm(
      '文章尚未保存，确定要离开吗？',
      '提示',
      {
        type: 'warning'
      }
    ).then(() => {
      router.push('/posts')
    }).catch(() => {})
  } else {
    router.push('/posts')
  }
}

// 保存草稿
const handleSaveDraft = async () => {
  try {
    loading.value = true
    
    const formData: Partial<CreatePostRequest> = {
      title: postForm.value.title || '无标题',
      content: postForm.value.content || '',
      status: 'draft',
      pinned: postForm.value.pinned,
      allowComment: postForm.value.allowComment,
      publishTime: postForm.value.publishTime
    }

    // 只有在有值时才添加可选字段
    if (postForm.value.excerpt) {
      formData.excerpt = postForm.value.excerpt
    }
    
    if (postForm.value.category && postForm.value.category !== 0) {
      formData.category = Number(postForm.value.category)
    }
    
    if (postForm.value.tags && postForm.value.tags.length > 0) {
      formData.tags = postForm.value.tags
    }
    
    if (postForm.value.password) {
      formData.password = postForm.value.password
    }
    
    if (postForm.value.cover) {
      formData.cover = postForm.value.cover
    }
    
    if (postForm.value.meta_description) {
      formData.meta_description = postForm.value.meta_description
    }
    
    if (postForm.value.meta_keywords) {
      formData.meta_keywords = postForm.value.meta_keywords
    }
    
    // 根据是否有 ID 来判断是新建还是更新
    const postId = route.params.id ? Number(route.params.id) : null
    
    if (postId) {
      // 更新已有文章
      const { code, message } = await updatePost(postId, formData)
      if (code === 200 || code === 201) {
        ElMessage.success('草稿保存成功')
        // 更新原始表单数据，避免重复提示保存
        originalForm.value = { ...postForm.value }
        // 清理本地存储的自动保存内容
        const draftKey = `draft_${postId}`
        const historyKey = `history_${postId}`
        localStorage.removeItem(draftKey)
        localStorage.removeItem(historyKey)
      } else {
        ElMessage.error(message || '保存失败')
      }
    } else {
      // 创建新文章
      const formData: CreatePostRequest = {
        title: postForm.value.title,
        content: postForm.value.content,
        category: postForm.value.category || 0,
        tags: postForm.value.tags || [],
        status: postForm.value.status || 'draft',
        excerpt: postForm.value.excerpt,
        pinned: postForm.value.pinned,
        allowComment: postForm.value.allowComment,
        publishTime: postForm.value.publishTime,
        password: postForm.value.password || '',
        cover: postForm.value.cover,
        meta_description: postForm.value.meta_description,
        meta_keywords: postForm.value.meta_keywords
      }
      const { code, message, data } = await createPost(formData)
      if (code === 200 || code === 201) {
        ElMessage.success('草稿保存成功')
        // 清理本地存储的自动保存内容
        const draftKey = 'draft_new'
        const historyKey = 'history_new'
        localStorage.removeItem(draftKey)
        localStorage.removeItem(historyKey)
        // 跳转到编辑页面
        router.replace(`/posts/${data.id}/edit`)
      } else {
        ElMessage.error(message || '保存失败')
      }
    }
  } catch (error: any) {
    console.error('保存草稿失败:', error)
    ElMessage.error(error?.message || '保存草稿失败')
  } finally {
    loading.value = false
  }
}

// 发布文章
const handlePublish = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const formData = {
      title: postForm.value.title,
      content: postForm.value.content,
      excerpt: postForm.value.excerpt || undefined,
      category: Number(postForm.value.category) || 0,
      tags: postForm.value.tags.length > 0 ? postForm.value.tags : [],
      status: 'published' as PostStatus
    }
    
    if (isEdit) {
      const { code, message } = await updatePost(Number(route.params.id), formData)
      if (code === 200 || code === 201) {
        ElMessage.success('发布成功')
        router.push('/posts')
      } else {
        ElMessage.error(message || '发布失败')
      }
    } else {
      const { code, message } = await createPost(formData)
      if (code === 200 || code === 201) {
        ElMessage.success('发布成功')
        router.push('/posts')
      } else {
        ElMessage.error(message || '发布失败')
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('发布文章失败')
    }
  } finally {
    loading.value = false
  }
}

// 创建标签
const handleTagCreate = async (tagName: string) => {
  try {
    loading.value = true
    const { code, message, data } = await createTag({ name: tagName })
    
    if (code === 200) {
      tags.value.push(data)
      postForm.value.tags.push(data.id.toString())
      ElMessage.success('创建标签成功')
    } else {
      ElMessage.error(message || '创建标签失败')
    }
  } catch (error) {
    console.error('创建标签失败:', error)
    ElMessage.error('创建标签失败')
  } finally {
    loading.value = false
  }
}

// 上传封面
const handleUploadCover = async (options: any) => {
  const formData = new FormData()
  formData.append('image', options.file)
  
  try {
    // 显示上传进度提示
    ElMessage({
      message: '正在上传封面...',
      duration: 0,
      showClose: true
    })

    const { code, message, data: url } = await uploadImage(formData)
    
    if (code === 200) {
      postForm.value.cover = url
      ElMessage.success('封面上传成功')
    } else {
      ElMessage.error(message || '上传封面失败')
    }
  } catch (error) {
    console.error('上传封面失败:', error)
    ElMessage.error('上传封面失败')
  }
}

// 移除封面
const handleRemoveCover = () => {
  postForm.value.cover = ''
}

// 加载文章数据
const loadPost = async () => {
  try {
    loading.value = true
    
    // 尝试从本地存储恢复内容
    const draftKey = `draft_${route.params.id || 'new'}`
    const historyKey = `history_${route.params.id || 'new'}`
    const savedContent = localStorage.getItem(draftKey)
    const savedHistory = localStorage.getItem(historyKey)
    let localDraft = null
    
    // 恢复历史记录
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory)
        if (Array.isArray(history)) {
          saveHistory.value = history
        }
      } catch (e) {
        localStorage.removeItem(historyKey)
      }
    }
    
    if (savedContent) {
      try {
        localDraft = JSON.parse(savedContent)
        // 检查本地存储的内容是否在24小时内
        const savedTime = new Date(localDraft.timestamp).getTime()
        const now = Date.now()
        const isExpired = now - savedTime > 24 * 60 * 60 * 1000
        
        if (isExpired) {
          localStorage.removeItem(draftKey)
          localStorage.removeItem(historyKey)
          localDraft = null
          saveHistory.value = []
        }
      } catch (e) {
        localStorage.removeItem(draftKey)
        localStorage.removeItem(historyKey)
      }
    }
    
    if (isEdit) {
      const { code, message, data } = await getPost(Number(route.params.id))
      if (code === 200) {
        const formData = {
          title: data.title,
          content: data.content,
          category: data.category?.id || 0,
          tags: data.tags?.map(t => t.id.toString()) || [],
          excerpt: data.excerpt || '',
          pinned: data.pinned || false,
          allowComment: data.allow_comment ?? true,
          publishTime: data.published_at || new Date().toISOString(),
          password: data.password || '',
          status: data.status || 'draft',
          cover: data.cover || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || ''
        }
        
        // 如果有本地草稿且比服务器版本新，使用本地版本
        if (localDraft && new Date(localDraft.timestamp) > new Date(data.updated_at)) {
          const localContent = localDraft.content
          const mergedData = {
            ...formData,
            title: localContent.title || formData.title,
            content: localContent.content || formData.content,
            excerpt: localContent.excerpt || formData.excerpt,
            category: localContent.category || formData.category,
            tags: localContent.tags || formData.tags
          }
          
          // 先设置除内容外的其他字段
          postForm.value = {
            ...mergedData,
            content: '' // 临时设置为空，等编辑器初始化后再设置
          }
          
          // 等待编辑器实例创建完成后再设置内容
          nextTick(() => {
            if (editor.value) {
              const editorHtml = editor.value.getHtml()
              if (editorHtml !== mergedData.content) {
                const newHtml = mergedData.content || ''
                // @ts-ignore
                editor.value.setHtml(newHtml)
                postForm.value.content = newHtml
              }
            }
          })
          
          ElMessage.info('已恢复本地未保存的内容，可以通过历史记录查看或恢复服务器版本')
          
          // 将服务器版本添加到历史记录
          saveHistory.value.unshift({
            time: data.updated_at,
            content: data.content,
            title: data.title
          })
        } else {
          // 先设置除内容外的其他字段
          postForm.value = {
            ...formData,
            content: '' // 临时设置为空，等编辑器初始化后再设置
          }
          
          // 等待编辑器实例创建完成后再设置内容
          nextTick(() => {
            if (editor.value) {
              const editorHtml = editor.value.getHtml()
              if (editorHtml !== formData.content) {
                const newHtml = formData.content || ''
                // @ts-ignore
                editor.value.setHtml(newHtml)
                postForm.value.content = newHtml
              }
            }
          })
        }
        
        originalForm.value = JSON.parse(JSON.stringify(formData))
      } else {
        ElMessage.error(message || '加载文章失败')
        router.push('/posts')
      }
    } else {
      // 新建文章时，如果有本地草稿则恢复
      if (localDraft) {
        const localContent = localDraft.content
        const mergedData = {
          ...postForm.value,
          title: localContent.title || '',
          content: localContent.content || '',
          excerpt: localContent.excerpt || '',
          category: localContent.category || 0,
          tags: localContent.tags || []
        }
        
        // 先设置除内容外的其他字段
        postForm.value = {
          ...mergedData,
          content: '' // 临时设置为空，等编辑器初始化后再设置
        }
        
        // 等待编辑器实例创建完成后再设置内容
        nextTick(() => {
          if (editor.value) {
            const editorHtml = editor.value.getHtml()
            if (editorHtml !== mergedData.content) {
              const newHtml = mergedData.content || ''
              // @ts-ignore
              editor.value.setHtml(newHtml)
              postForm.value.content = newHtml
            }
          }
        })
        
        ElMessage.info('已恢复本地未保存的内容')
      }
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.error('加载文章失败')
    router.push('/posts')
  } finally {
    loading.value = false
  }
}

// 加载分类列表
const loadCategories = async () => {
  try {
    const response = await getCategories({ page: 1, size: 100, ordering: 'name' })
    if (response.code === 200) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('加载分类列表失败:', error)
    ElMessage.error('加载分类列表失败')
  }
}

// 加载标签列表
const loadTags = async () => {
  try {
    const response = await getTags({ page: 1, size: 100, ordering: 'name' })
    if (response.code === 200) {
      tags.value = response.data.results
      total.value = response.data.count
    }
  } catch (error) {
    console.error('加载标签列表失败:', error)
    ElMessage.error('加载标签列表失败')
  }
}

// 创建分类
const handleCategoryCreate = async (categoryName: string) => {
  try {
    loading.value = true
    const { code, message, data } = await quickCreateCategory({ name: categoryName })
    
    if (code === 200 || code === 201) {
      categories.value.push(data)
      postForm.value.category = data.id
      ElMessage.success('创建分类成功')
    } else {
      ElMessage.error(message || '创建分类失败')
      postForm.value.category = 0
    }
  } catch (error) {
    console.error('创建分类失败:', error)
    ElMessage.error('创建分类失败')
    postForm.value.category = 0
  } finally {
    loading.value = false
  }
}

// 处理路由变更
const handleRouteChange = (path: string) => {
  if (postForm.value.content || postForm.value.title) {
    ElMessageBox.confirm(
      '当前文章尚未保存，确定要离开吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      router.push(path)
    }).catch(() => {})
  } else {
    router.push(path)
  }
}

// 编辑器创建完成的处理函数
const handleCreated = (editorInstance: IDomEditor) => {
  // 保存编辑器实例
  editor.value = editorInstance
  
  // 创建一个隐藏的 textarea 元素
  const textarea = document.createElement('textarea')
  textarea.style.display = 'none'
  
  // 等待 DOM 更新后再添加 textarea
  setTimeout(() => {
    const container = document.querySelector('.w-e-text-container')
    if (container) {
      container.appendChild(textarea)
    }
  }, 0)

  // 启动自动保存
  startAutoSave()
}

// 恢复历史版本
const restoreHistory = async (index: number) => {
  try {
    const version = saveHistory.value[index]
    if (!version) return
    
    const result = await ElMessageBox.confirm(
      `确定要恢复到 ${new Date(version.time).toLocaleString()} 的版本吗？`,
      '恢复历史版本',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (result === 'confirm') {
      postForm.value.content = version.content
      postForm.value.title = version.title
      ElMessage.success('已恢复到历史版本')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('恢复历史版本失败')
    }
  }
}

// 清理过期的草稿
const cleanupDrafts = () => {
  const now = Date.now()
  const expireTime = 24 * 60 * 60 * 1000 // 24小时
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('draft_')) {
      try {
        const draft = JSON.parse(localStorage.getItem(key) || '')
        if (now - new Date(draft.timestamp).getTime() > expireTime) {
          localStorage.removeItem(key)
        }
      } catch (error) {
        localStorage.removeItem(key)
      }
    }
  }
}

// 添加一个响应式变量控制对话框显示
const historyDialogVisible = ref(false)

// 显示历史记录对话框
const showHistoryDialog = () => {
  if (!saveHistory.value.length) {
    ElMessage.info('暂无历史记录')
    return
  }
  historyDialogVisible.value = true
}

// 在组件卸载时清理
onBeforeUnmount(() => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
  if (idleTimer) {
    clearTimeout(idleTimer)
  }
  
  // 如果有未保存的内容，最后保存一次
  if (isFormModified.value) {
    saveContent()
  }
  
  // 清理超过24小时的草稿
  cleanupDrafts()
})

// 生命周期钩子
onMounted(async () => {
  await Promise.all([
    loadPost(),
    loadCategories(),
    loadTags()
  ])
  startAutoSave()
})

// 启动自动保存
const startAutoSave = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
  
  // 设置定期检查，确保长时间不输入时也能保存
  autoSaveTimer = setInterval(async () => {
    const timeSinceLastEdit = Date.now() - lastEditTime
    const timeSinceLastSave = Date.now() - lastSaveTime
    
    // 如果有未保存的修改，且距离上次保存时间超过最长间隔，则触发保存
    if (timeSinceLastSave >= MAX_SAVE_INTERVAL && isFormModified.value) {
      await saveContent()
    }
  }, MAX_SAVE_INTERVAL)
}

// 触发自动保存
const triggerAutoSave = () => {
  lastEditTime = Date.now()
  
  if (idleTimer) {
    clearTimeout(idleTimer)
  }
  
  idleTimer = setTimeout(async () => {
    const timeSinceLastSave = Date.now() - lastSaveTime
    if (timeSinceLastSave >= MIN_SAVE_INTERVAL) {
      await saveContent()
    }
  }, IDLE_TIMEOUT)
}

// 保存内容
const saveContent = async () => {
  if (!postForm.value.content && !postForm.value.title) return
  
  try {
    autoSaving.value = true
    lastSaveTime = Date.now()
    
    // 保存到本地存储
    const draftKey = `draft_${route.params.id || 'new'}`
    const historyKey = `history_${route.params.id || 'new'}`
    
    const contentToSave = {
      title: postForm.value.title,
      content: postForm.value.content,
      excerpt: postForm.value.excerpt,
      category: postForm.value.category,
      tags: postForm.value.tags
    }
    
    // 保存当前内容
    localStorage.setItem(draftKey, JSON.stringify({
      content: contentToSave,
      timestamp: new Date().toISOString()
    }))
    
    // 添加到历史记录
    const newHistory = {
      time: new Date().toISOString(),
      content: postForm.value.content,
      title: postForm.value.title
    }
    saveHistory.value.unshift(newHistory)
    
    // 只保留最近10条记录
    if (saveHistory.value.length > 10) {
      saveHistory.value.pop()
    }
    
    // 保存历史记录到本地存储
    localStorage.setItem(historyKey, JSON.stringify(saveHistory.value))
    
    // 如果是编辑模式，同时保存到服务器
    if (isEdit) {
      const { code, data } = await autoSavePost(Number(route.params.id), {
        ...contentToSave,
        title: contentToSave.title || '无标题',
        category: Number(contentToSave.category) || 0
      })
      
      if (code === 200 || code === 201) {
        currentVersion.value = data.version
        nextSaveTime.value = data.next_save_time
      }
    }
    
    lastSavedTime.value = new Date().toISOString()
  } catch (error) {
    ElMessage.error('自动保存失败')
  } finally {
    autoSaving.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <div class="post-edit">
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="left">
          <el-button class="back-button" text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>返回
          </el-button>
          <span>{{ isEdit ? '编辑文章' : '新建文章' }}</span>
          <span class="save-status">
            <el-tag
              :type="autoSaving ? 'warning' : 'success'"
              size="small"
              effect="light"
            >
              <el-icon v-if="autoSaving"><Loading class="is-loading" /></el-icon>
              <el-icon v-else><Select /></el-icon>
              {{ autoSaving ? '正在保存...' : '已保存' }}
            </el-tag>
            <el-tooltip
              effect="dark"
              placement="bottom"
            >
              <template #content>
                <div>上次保存：{{ lastSavedTime }}</div>
                <div v-if="nextSaveTimeText">{{ nextSaveTimeText }}</div>
              </template>
              <el-icon class="info-icon"><InfoFilled /></el-icon>
            </el-tooltip>
          </span>
          <el-button
            text
            type="info"
            @click="showHistoryDialog"
            :disabled="!saveHistory.length"
          >
            历史版本
          </el-button>
        </div>
        <div class="center">
          <el-button
            type="primary"
            link
            @click="handleRouteChange('/categories')"
          >
            分类管理
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            type="primary"
            link
            @click="handleRouteChange('/tags')"
          >
            标签管理
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            type="primary"
            link
            @click="handleRouteChange('/posts/trash')"
          >
            回收站
          </el-button>
        </div>
        <div class="right">
          <el-button @click="handleSaveDraft" :loading="loading" type="info">存为草稿</el-button>
          <el-button type="primary" @click="handlePublish" :loading="loading">发布文章</el-button>
        </div>
      </div>

      <!-- 编辑区域 -->
      <div class="editor-container">
        <el-input
          v-model="postForm.title"
          placeholder="请输入文章标题"
          :disabled="loading"
          maxlength="100"
          show-word-limit
          class="title-input"
          @input="handleTitleInput"
        />
        <Toolbar
          class="editor-toolbar"
          :editor="editor"
          :defaultConfig="toolbarConfig"
          :mode="isDark ? 'dark' : 'default'"
        />
        <Editor
          class="editor-content"
          v-model="postForm.content"
          :defaultConfig="editorConfig"
          :mode="isDark ? 'dark' : 'default'"
          @onCreated="handleCreated"
          @onChange="handleEditorChange"
          @onFocus="() => {}"
          @onBlur="() => {}"
        />
      </div>
    </div>

    <!-- 文章设置 -->
    <div class="settings-panel">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>文章设置</span>
          </div>
        </template>
        
        <el-form
          ref="settingsFormRef"
          :model="postForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="分类" prop="category">
            <el-select
              v-model="postForm.category"
              placeholder="选择分类"
              :disabled="loading"
              filterable
              allow-create
              default-first-option
              @create="handleCategoryCreate"
              class="w-full"
            >
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="标签">
            <el-select
              v-model="postForm.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="选择或创建标签"
              :disabled="loading"
              @create="handleTagCreate"
              class="w-full"
            >
              <el-option
                v-for="item in tags"
                :key="item.id"
                :label="item.name"
                :value="item.id.toString()"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="封面图">
            <div class="cover-uploader">
              <el-upload
                v-if="!postForm.cover"
                :http-request="handleUploadCover"
                :show-file-list="false"
                accept="image/*"
                :disabled="loading"
              >
                <div class="uploader-icon">
                  <el-icon><Plus /></el-icon>
                </div>
              </el-upload>
              <template v-else>
                <img :src="postForm.cover" class="cover-image" />
                <div class="cover-actions">
                  <el-button
                    type="danger"
                    size="small"
                    @click="handleRemoveCover"
                    :disabled="loading"
                  >
                    移除
                  </el-button>
                </div>
              </template>
            </div>
          </el-form-item>

          <el-form-item label="摘要">
            <el-input
              v-model="postForm.excerpt"
              type="textarea"
              :rows="4"
              placeholder="请输入文章摘要"
              :disabled="loading"
            />
          </el-form-item>

          <el-form-item>
            <el-switch
              v-model="postForm.pinned"
              active-text="置顶文章"
              :disabled="loading"
            />
          </el-form-item>

          <el-form-item>
            <el-switch
              v-model="postForm.allowComment"
              active-text="允许评论"
              :disabled="loading"
            />
          </el-form-item>
        </el-form>
      </el-card>

      <el-card>
        <template #header>
          <div>发布设置</div>
        </template>
        
        <el-form :model="postForm" label-position="top">
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="postForm.publishTime"
              type="datetime"
              placeholder="选择发布时间"
              :disabled="loading"
              value-format="YYYY-MM-DDTHH:mm:ss.SSSZ"
            />
          </el-form-item>

          <el-form-item label="访问密码">
            <el-input
              v-model="postForm.password"
              placeholder="可选，设置后需要密码访问"
              show-password
              :disabled="loading"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 历史版本对话框 -->
    <el-dialog
      v-model="historyDialogVisible"
      title="历史版本"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="history-list">
        <div v-for="(item, index) in saveHistory" :key="index" class="history-item">
          <div class="history-info">
            <div class="history-title">{{ item.title }}</div>
            <div class="history-time">{{ new Date(item.time).toLocaleString() }}</div>
          </div>
          <el-button type="primary" size="small" @click="restoreHistory(index)">
            恢复此版本
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@use '@/styles/views/post/post-edit.scss';
</style> 