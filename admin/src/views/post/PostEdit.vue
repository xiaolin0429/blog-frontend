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
  InfoFilled,
  Loading,
  Select,
  ArrowRight
} from '@element-plus/icons-vue'

// WangEditor 相关
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

// Prism.js 语法高亮
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
  autoSavePost,
  getAutoSavePost,
  uploadImage
} from '@/api/post'
import { getCategories, quickCreateCategory } from '@/api/category'
import { getTags, createTag } from '@/api/tag'
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
  category_id: 0,
  tag_ids: [],
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
  category_id: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ],
  tag_ids: [
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
  category_id: 0,
  tag_ids: [],
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
  if (!editor) return
  postForm.value.content = editor.getHtml()
  triggerAutoSave()
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
    
    const formData: CreatePostRequest = {
      title: postForm.value.title || '无标题',
      content: postForm.value.content || '',
      category_id: postForm.value.category_id || 0,
      tag_ids: postForm.value.tag_ids?.length ? postForm.value.tag_ids : [],
      status: 'draft',
      excerpt: postForm.value.excerpt || '',
      pinned: postForm.value.pinned,
      allowComment: postForm.value.allowComment,
      publishTime: postForm.value.publishTime,
      password: postForm.value.password || '',
      cover: postForm.value.cover || '',
      meta_description: postForm.value.meta_description || '',
      meta_keywords: postForm.value.meta_keywords || ''
    }
    
    // 根据是否有 ID 来判断是新建还是更新
    const postId = route.params.id ? Number(route.params.id) : null
    
    if (postId) {
      // 更新已有文章
      const response = await updatePost(postId, formData)
      if (response.data.code === 200 || response.data.code === 201) {
        ElMessage.success('草稿保存成功')
        // 更新原始表单数据，避免重复提示保存
        originalForm.value = { ...postForm.value }
        // 清理本地存储的自动保存内容，并标记为已保存
        const draftKey = `draft_${postId}`
        const historyKey = `history_${postId}`
        localStorage.setItem(draftKey, JSON.stringify({
          content: formData,
          timestamp: new Date().toISOString(),
          saved: true
        }))
        localStorage.removeItem(historyKey)
      } else {
        ElMessage.error(response.data.message || '保存失败')
      }
    } else {
      // 创建新文章
      const response = await createPost(formData)
      if (response.data.code === 200 || response.data.code === 201) {
        ElMessage.success('草稿保存成功')
        // 清理本地存储的自动保存内容
        const draftKey = 'draft_new'
        const historyKey = 'history_new'
        localStorage.removeItem(draftKey)
        localStorage.removeItem(historyKey)
        // 跳转到编辑页面
        await router.replace(`/posts/${response.data.data.id}/edit`)
      } else {
        ElMessage.error(response.data.message || '保存失败')
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
      category_id: Number(postForm.value.category_id) || 0,
      tag_ids: postForm.value.tag_ids?.length ? postForm.value.tag_ids : undefined,
      status: 'published' as PostStatus
    }
    
    if (isEdit) {
      const response = await updatePost(Number(route.params.id), formData)
      if (response.data.code === 200 || response.data.code === 201) {
        ElMessage.success('发布成功')
        await router.push('/posts')
      } else {
        ElMessage.error(response.data.message || '发布失败')
      }
    } else {
      const response = await createPost(formData)
      if (response.data.code === 200 || response.data.code === 201) {
        ElMessage.success('发布成功')
        await router.push('/posts')
      } else {
        ElMessage.error(response.data.message || '发布失败')
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
    const response = await createTag({ name: tagName })
    
    if (response.data.code === 200) {
      tags.value.push(response.data.data)
      if (postForm.value.tag_ids) {
        postForm.value.tag_ids.push(Number(response.data.data.id))
      } else {
        postForm.value.tag_ids = [Number(response.data.data.id)]
      }
      ElMessage.success('创建标签成功')
    } else {
      ElMessage.error(response.data.message || '创建标签失败')
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

    const response = await uploadImage(formData)
    
    if (response.data.code === 200) {
      postForm.value.cover = response.data.data
      ElMessage.success('封面上传成功')
    } else {
      ElMessage.error(response.data.message || '上传封面失败')
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
    
    if (!isEdit) {
      // 新建文章时，使用默认值，不读取本地缓存
      postForm.value = {
        title: '',
        content: '',
        category_id: 0,
        tag_ids: [],
        excerpt: '',
        pinned: false,
        allowComment: true,
        publishTime: new Date().toISOString(),
        password: '',
        status: 'draft',
        cover: '',
        meta_description: '',
        meta_keywords: ''
      }
      // 设置原始表单数据
      originalForm.value = JSON.parse(JSON.stringify(postForm.value))
      // 清空历史记录
      saveHistory.value = []
      // 清除所有相关的本地存储
      localStorage.removeItem('draft_new')
      localStorage.removeItem('history_new')
      loading.value = false
      return
    }
    
    // 编辑模式：尝试从本地存储恢复内容
    const draftKey = `draft_${route.params.id}`
    const historyKey = `history_${route.params.id}`
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
    
    const response = await getPost(Number(route.params.id))
    if (response.data.code === 200) {
      const data = response.data.data
      const formData = {
        title: data.title,
        content: data.content,
        category_id: data.category?.id || 0,
        tag_ids: data.tags?.map(tag => tag.id) || [],
        excerpt: data.excerpt || '',
        pinned: data.pinned || false,
        allowComment: data.allowComment ?? true,
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
          category_id: Number(localContent.category_id) || formData.category_id,
          tag_ids: localContent.tag_ids?.map(Number) || formData.tag_ids
        }
        
        postForm.value = mergedData
        ElMessage.info('已恢复本地未保存的内容，可以通过历史记录查看或恢复服务器版本')
        
        saveHistory.value.unshift({
          time: data.updated_at,
          content: data.content,
          title: data.title
        })
      } else {
        postForm.value = formData
      }
      
      originalForm.value = JSON.parse(JSON.stringify(formData))
    } else {
      ElMessage.error(response.data.message || '加载文章失败')
      await router.push('/posts')
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.error('加载文章失败')
    await router.push('/posts')
  } finally {
    loading.value = false
  }
}

// 在 setup 中添加
const categoryStates = ref(new Map())

// 加载分类列表
const loadCategories = async () => {
  try {
    const response = await getCategories({ tree: true })
    if (response.data.code === 200) {
      categories.value = response.data.data
      // 初始化每个分类的显示状态
      categories.value.forEach(category => {
        categoryStates.value.set(category.id, {
          showChildren: false
        })
        if (category.children) {
          category.children.forEach(child => {
            categoryStates.value.set(child.id, {
              showChildren: false
            })
          })
        }
      })
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
    if (response.data.code === 200) {
      tags.value = response.data.data.results
      total.value = response.data.data.count
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
    const response = await quickCreateCategory(categoryName)
    
    if (response.data.code === 200 || response.data.code === 201) {
      categories.value.push(response.data.data)
      postForm.value.category_id = response.data.data.id
      ElMessage.success('创建分类成功')
    } else {
      ElMessage.error(response.data.message || '创建分类失败')
      postForm.value.category_id = 0
    }
  } catch (error) {
    console.error('创建分类失败:', error)
    ElMessage.error('创建分类失败')
    postForm.value.category_id = 0
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
  editor.value = editorInstance
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
      category_id: postForm.value.category_id,
      tag_ids: postForm.value.tag_ids || []
    }
    
    // 保存当前内容，添加 saved 标记为 false，表示这是未保存的草稿
    localStorage.setItem(draftKey, JSON.stringify({
      content: contentToSave,
      timestamp: new Date().toISOString(),
      saved: false
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
      const response = await autoSavePost(Number(route.params.id), {
        ...contentToSave,
        title: contentToSave.title || '无标题',
        category_id: Number(contentToSave.category_id) || 0
      })
      
      if (response.data.code === 200 || response.data.code === 201) {
        currentVersion.value = response.data.data.version
        nextSaveTime.value = response.data.data.next_save_time
      }
    }
    
    lastSavedTime.value = new Date().toISOString()
  } catch (error) {
    ElMessage.error('自动保存失败')
  } finally {
    autoSaving.value = false
  }
}

// 格式化分类数据为树形结构
const formatCategories = computed(() => {
  const formatCategoryNode = (category: any) => ({
    value: category.id,
    label: category.name,
    children: category.children?.map(formatCategoryNode) || undefined
  })
  
  return categories.value.map(formatCategoryNode)
})
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
          ref="formRef"
          :model="postForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="分类" prop="category_id">
            <el-tree-select
              v-model="postForm.category_id"
              :data="formatCategories"
              placeholder="请选择分类"
              :disabled="loading"
              check-strictly
              node-key="value"
              :render-after-expand="false"
              :props="{
                label: 'label',
                children: 'children',
                value: 'value'
              }"
            />
          </el-form-item>

          <el-form-item label="标签" prop="tag_ids">
            <el-select
              v-model="postForm.tag_ids"
              placeholder="请选择标签"
              :disabled="loading"
              multiple
              filterable
              allow-create
              default-first-option
              @create="handleTagCreate"
            >
              <el-option
                v-for="tag in tags"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
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