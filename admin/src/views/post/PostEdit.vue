<template>
  <div class="post-edit">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="left">
        <el-button class="back-button" text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>返回
        </el-button>
        <span>{{ isEdit ? '编辑文章' : '新建文章' }}</span>
        <span v-if="lastSavedTime" class="last-saved">
          {{ autoSaving ? '正在自动保存...' : `上次保存时间：${lastSavedTime}` }}
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
        <el-button @click="handleSaveDraft" :loading="loading">存为草稿</el-button>
        <el-button type="primary" @click="handlePublish" :loading="loading">发布文章</el-button>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-container">
      <!-- 主编辑区 -->
      <div class="main-editor">
        <el-form
          ref="formRef"
          :model="postForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item prop="title">
            <el-input
              v-model="postForm.title"
              placeholder="请输入文章标题"
              class="title-input"
              :maxlength="100"
              show-word-limit
              :disabled="loading"
            />
          </el-form-item>

          <el-form-item prop="content" class="content-editor">
            <MdEditor
              v-model="postForm.content"
              :config="editorConfig"
              :disabled="loading"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <!-- 文章设置 -->
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

        <!-- 发布设置 -->
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import {
  getPost,
  createPost,
  updatePost,
  getCategories,
  getTags,
  uploadImage,
  quickCreateCategory,
  createTag
} from '@/api/post'
import type { CreatePostRequest, Category, Tag, PostStatus } from '@/types/post'
import type { FormInstance } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isEdit = route.params.id !== undefined

// 编辑器配置
const editorConfig = {
  toolbars: [
    'bold',
    'underline',
    'italic',
    'strikeThrough',
    'title',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    'revoke',
    'next',
    'save',
    'prettier'
  ],
  toolbarsExclude: [],
  preview: true,
  previewOnly: false,
  language: 'zh-CN',
  onUploadImg: async (files: File[], callback: (urls: string[]) => void) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('image', file)

      try {
        // 显示上传进度提示
        ElMessage({
          message: `正在上传图片 ${file.name}...`,
          duration: 0,
          showClose: true
        })

        const { code, message, data: url } = await uploadImage(formData)

        // 关闭进度提示
        ElMessage.closeAll()
        if (code === 200) {
          ElMessage.success(`图片 ${file.name} 上传成功`)
          return url
        } else {
          ElMessage.error(message || `图片 ${file.name} 上传失败`)
          return null
        }
      } catch (error) {
        console.error('上传图片失败:', error)
        ElMessage.error(`图片 ${file.name} 上传失败`)
        return null
      }
    })

    try {
      const urls = await Promise.all(uploadPromises)
      callback(urls.filter((url): url is string => url !== null))
    } catch (error) {
      console.error('上传图片失败:', error)
      ElMessage.error('上传图片失败')
      callback([])
    }
  }
}

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
const rules = {
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

// 自动保存定时器
let autoSaveTimer: ReturnType<typeof setInterval> | null = null

// 自动保存功能
const startAutoSave = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
  
  autoSaveTimer = setInterval(async () => {
    if (!isFormModified.value || loading.value || !postForm.value.title) {
      return
    }
    
    try {
      autoSaving.value = true
      await handleSaveDraft()
      
      // 添加到历史记录
      saveHistory.value.unshift({
        time: new Date().toISOString(),
        content: postForm.value.content,
        title: postForm.value.title
      })
      
      // 最多保留10条历史记录
      if (saveHistory.value.length > 10) {
        saveHistory.value.pop()
      }
      
      lastSavedTime.value = new Date().toLocaleString()
      ElMessage.success('自动保存成功')
    } catch (error) {
      console.error('自动保存失败:', error)
      ElMessage.error('自动保存失败')
    } finally {
      autoSaving.value = false
    }
  }, 60000) // 每分钟自动保存一次
}

// 恢复历史版本
const restoreHistory = (index: number) => {
  ElMessageBox.confirm(
    '确定要恢复这个版本吗？当前未保存的内容将会丢失。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const history = saveHistory.value[index]
    postForm.value.content = history.content
    postForm.value.title = history.title
    ElMessage.success('恢复成功')
  }).catch(() => {})
}

// 显示历史记录对话框
const showHistoryDialog = () => {
  if (!saveHistory.value.length) {
    ElMessage.info('暂无历史记录')
    return
  }
  
  ElMessageBox.alert(
    `<div class="history-list">
      ${saveHistory.value.map((item, index) => `
        <div class="history-item">
          <div class="history-info">
            <div class="history-title">${item.title}</div>
            <div class="history-time">${new Date(item.time).toLocaleString()}</div>
          </div>
          <el-button type="primary" size="small" onclick="restoreHistory(${index})">恢复此版本</el-button>
        </div>
      `).join('')}
    </div>`,
    '历史版本',
    {
      dangerouslyUseHTMLString: true,
      showConfirmButton: false
    }
  )
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
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 处理表单数据，只包含API文档中定义的字段
    const formData = {
      title: postForm.value.title,
      content: postForm.value.content,
      excerpt: postForm.value.excerpt || undefined,
      category: Number(postForm.value.category) || 0,  // 转换为数字
      tags: postForm.value.tags.length > 0 ? postForm.value.tags : [],  // 保持为字符串数组
      status: 'draft' as PostStatus
    }
    
    // 打印请求数据
    console.log('发送的请求数据:', JSON.stringify(formData, null, 2))
    
    if (isEdit) {
      const { code, message } = await updatePost(Number(route.params.id), formData)
      if (code === 200 || code === 201) {
        ElMessage.success('保存成功')
        originalForm.value = { ...postForm.value }
      } else {
        ElMessage.error(message || '保存失败')
      }
    } else {
      const { code, message, data } = await createPost(formData)
      if (code === 200 || code === 201) {
        ElMessage.success('保存成功')
        router.replace(`/posts/${data.id}/edit`)
      } else {
        ElMessage.error(message || '保存失败')
      }
    }
  } catch (error) {
    console.error('保存草稿失败:', error)
    if (error !== 'cancel') {
      ElMessage.error('保存草稿失败')
    }
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
    
    // 处理表单数据，只包含API文档中定义的字段
    const formData = {
      title: postForm.value.title,
      content: postForm.value.content,
      excerpt: postForm.value.excerpt || undefined,
      category: Number(postForm.value.category) || 0,  // 转换为数字
      tags: postForm.value.tags.length > 0 ? postForm.value.tags : [],  // 保持为字符串数组
      status: 'published' as PostStatus
    }
    
    // 打印请求数据
    console.log('发送的请求数据:', JSON.stringify(formData, null, 2))
    
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
    console.error('发布文章失败:', error)
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
  if (!isEdit) return
  
  try {
    loading.value = true
    const { code, message, data } = await getPost(Number(route.params.id))
    if (code === 200) {
      postForm.value = {
        title: data.title,
        content: data.content,
        category: data.category.id,
        tags: data.tags.map(t => t.id.toString()),
        excerpt: data.excerpt || '',
        pinned: false,
        allowComment: true,
        publishTime: data.published_at || new Date().toISOString(),
        password: '',
        status: data.status,
        cover: '',
        meta_description: data.meta_description || '',
        meta_keywords: data.meta_keywords || ''
      }
      originalForm.value = { ...postForm.value }
    } else {
      ElMessage.error(message || '加载文章失败')
      router.push('/posts')
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.error('加载文章失败')
    router.push('/posts')
  } finally {
    loading.value = false
  }
}

// 加载分类和标签
const loadCategoriesAndTags = async () => {
  try {
    const [categoriesRes, tagsRes] = await Promise.all([
      getCategories({ page: 1, size: 100, ordering: 'name' }),
      getTags({ page: 1, size: 100, ordering: 'name' })
    ])
    categories.value = categoriesRes.items
    tags.value = tagsRes.items
  } catch (error) {
    console.error('加载分类和标签失败:', error)
    ElMessage.error('加载分类和标签失败')
    categories.value = []
    tags.value = []
  }
}

// 创建分类
const handleCategoryCreate = async (categoryName: string) => {
  console.log('开始创建分类:', categoryName)
  try {
    loading.value = true
    // 调用快速创建分类 API
    const { code, message, data } = await quickCreateCategory({ name: categoryName })
    console.log('创建分类响应:', { code, message, data })
    
    if (code === 200 || code === 201) {
      // 将新分类添加到选项列表中
      categories.value.push(data)
      // 直接使用返回的分类ID
      postForm.value.category = data.id
      ElMessage.success('创建分类成功')
    } else {
      ElMessage.error(message || '创建分类失败')
      // 创建失败时，清空当前选择
      postForm.value.category = 0
    }
  } catch (error) {
    console.error('创建分类失败:', error)
    ElMessage.error('创建分类失败')
    // 发生错误时，清空当前选择
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

// 生命周期钩子
onMounted(async () => {
  await Promise.all([
    loadPost(),
    loadCategoriesAndTags()
  ])
  startAutoSave()
})

onBeforeUnmount(() => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
})
</script>

<style lang="scss">
@use '@/styles/views/post/post-edit';

.post-edit {
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    height: 56px;
    background-color: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-light);

    .left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .center {
      display: flex;
      align-items: center;
      gap: 8px;

      .el-divider--vertical {
        margin: 0;
        height: 16px;
      }
    }

    .right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .w-full {
    width: 100%;
  }
}
</style> 