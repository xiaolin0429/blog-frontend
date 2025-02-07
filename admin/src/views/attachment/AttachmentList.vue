<template>
  <div class="page-container">
    <div class="toolbar">
      <div class="left">
        <el-radio-group v-model="queryParams.type" @change="handleTypeChange">
          <el-radio-button value="all">全部</el-radio-button>
          <el-radio-button value="image">图片</el-radio-button>
          <el-radio-button value="document">文档</el-radio-button>
          <el-radio-button value="media">媒体</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="right">
        <el-upload
          :show-file-list="false"
          :before-upload="handleUpload"
          :disabled="loading"
        >
          <el-button type="primary" :icon="Upload" :loading="loading">
            上传文件
          </el-button>
        </el-upload>
      </div>
    </div>
    
    <el-card class="file-list" v-loading="loading">
      <div class="file-grid">
        <div
          v-for="file in files"
          :key="file.path"
          class="file-item"
          @click="handlePreview(file)"
        >
          <!-- 预览图/图标 -->
          <div class="file-preview">
            <img
              v-if="file.type === 'image'"
              :src="file.url"
              :alt="file.name"
              class="preview-image"
            />
            <div v-else class="preview-icon">
              <el-icon><component :is="getFileIcon(file)" /></el-icon>
            </div>
          </div>
          
          <!-- 文件信息 -->
          <div class="file-info">
            <div class="file-name" :title="file.original_name || file.name">
              {{ file.original_name || file.name }}
            </div>
            <div class="file-meta">
              <span>{{ formatFileSize(file.size) }}</span>
              <span>{{ new Date(file.upload_time).toLocaleString() }}</span>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="file-actions">
            <el-button
              v-if="file.type === 'image'"
              type="primary"
              :icon="ZoomIn"
              circle
              @click.stop="handlePreview(file)"
            />
            <el-button
              type="warning"
              :icon="Edit"
              circle
              @click.stop="handleRename(file)"
            />
            <el-button
              type="danger"
              :icon="Delete"
              circle
              @click.stop="handleDelete(file)"
            />
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[12, 24, 36, 48]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    
    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="图片预览"
      width="800px"
      :close-on-click-modal="true"
    >
      <img
        :src="previewUrl"
        style="width: 100%"
        alt="预览图"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Upload, ZoomIn, Document, Picture, VideoPlay, Edit } from '@element-plus/icons-vue'
import type { FileInfo, FileQuery, FileType } from '@/types/storage'
import { getFiles, deleteFile, uploadFile, renameFile } from '@/api/storage'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

// 文件列表数据
const files = ref<FileInfo[]>([])
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)

// 查询参数
const queryParams = ref<FileQuery>({
  page: 1,
  size: 20,
  type: 'all'
})

// 预览对话框
const previewVisible = ref(false)
const previewUrl = ref('')

// 加载文件列表
const loadFiles = async () => {
  try {
    loading.value = true
    const response = await getFiles({
      ...queryParams.value,
      page: currentPage.value,
      size: pageSize.value
    })
    
    if (response.data.code === 200) {
      files.value = response.data.data.items
      total.value = response.data.data.total
    } else {
      ElMessage.error(response.data.message || '加载文件列表失败')
    }
  } catch (error) {
    console.error('加载文件列表失败:', error)
    ElMessage.error('加载文件列表失败')
  } finally {
    loading.value = false
  }
}

// 处理文件上传
const handleUpload = async (file: File) => {
  try {
    loading.value = true
    const response = await uploadFile({
      file,
      type: queryParams.value.type === 'all' ? undefined : queryParams.value.type
    })
    
    if (response.data.code === 200) {
      ElMessage.success('上传成功')
      loadFiles()
    } else {
      ElMessage.error(response.data.message || '上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  } finally {
    loading.value = false
  }
}

// 处理文件删除
const handleDelete = async (file: FileInfo) => {
  try {
    const result = await ElMessageBox.confirm(
      '确定要删除该文件吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (result === 'confirm') {
      loading.value = true
      const response = await deleteFile(file.path)
      
      if (response.data.code === 200) {
        ElMessage.success('删除成功')
        loadFiles()
      } else {
        ElMessage.error(response.data.message || '删除失败')
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  } finally {
    loading.value = false
  }
}

// 处理文件预览
const handlePreview = (file: FileInfo) => {
  if (file.type === 'image') {
    previewUrl.value = file.url
    previewVisible.value = true
  } else {
    window.open(file.url, '_blank')
  }
}

// 处理页码变更
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadFiles()
}

// 处理每页数量变更
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadFiles()
}

// 处理类型筛选
const handleTypeChange = (val: string | number | boolean | undefined) => {
  if (typeof val === 'string') {
    queryParams.value.type = val as FileType
    currentPage.value = 1
    loadFiles()
  }
}

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}

// 获取文件图标
const getFileIcon = (file: FileInfo) => {
  switch (file.type) {
    case 'image':
      return Picture
    case 'media':
      return VideoPlay
    default:
      return Document
  }
}

// 处理文件重命名
const handleRename = async (file: FileInfo) => {
  try {
    const { value: newName } = await ElMessageBox.prompt(
      '请输入新的文件名（不包含扩展名）',
      '重命名文件',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: file.original_name || file.name.split('.').slice(0, -1).join('.'),
        inputValidator: (value) => {
          if (!value) {
            return '文件名不能为空'
          }
          return true
        }
      }
    )
    
    if (newName) {
      loading.value = true
      const response = await renameFile(file.path, newName)
      
      if (response.data.code === 200) {
        ElMessage.success('重命名成功')
        loadFiles()
      } else {
        ElMessage.error(response.data.message || '重命名失败')
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重命名失败:', error)
      ElMessage.error('重命名失败')
    }
  } finally {
    loading.value = false
  }
}

// 生命周期钩子
onMounted(async () => {
  const userStore = useUserStore()
  const router = useRouter()
  
  // 检查用户是否已登录
  if (!userStore.token) {
    ElMessage.error('请先登录')
    router.push('/login')
    return
  }
  
  await loadFiles()
})
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.file-list {
  min-height: 400px;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
}

.file-item {
  position: relative;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .file-actions {
      opacity: 1;
    }
  }
}

.file-preview {
  aspect-ratio: 16/9;
  background-color: var(--el-fill-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .preview-icon {
    font-size: 32px;
    color: var(--el-text-color-secondary);
  }
}

.file-info {
  padding: 8px;
  
  .file-name {
    font-size: 14px;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .file-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.file-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.3s;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4px;
  border-radius: 4px;
  
  .el-button {
    margin-left: 8px;
  }
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style> 