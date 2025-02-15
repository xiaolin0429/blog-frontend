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

        <el-radio-group v-model="viewMode" class="view-mode">
          <el-radio-button value="grid">
            <el-icon><Grid /></el-icon>
          </el-radio-button>
          <el-radio-button value="list">
            <el-icon><List /></el-icon>
          </el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="right">
        <!-- 批量操作按钮 -->
        <el-button-group v-if="selectedFiles.length > 0" class="mr-2">
          <el-button 
            type="danger" 
            :icon="Delete" 
            @click="handleBatchDelete"
            :loading="loading"
          >
            删除选中({{ selectedFiles.length }})
          </el-button>
        </el-button-group>

        <el-upload
          :show-file-list="false"
          :http-request="handleUpload"
          :disabled="loading"
          :multiple="true"
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,.json,.xml,.zip,.rar,.7z,video/*,audio/*"
        >
          <el-button type="primary" :icon="Upload" :loading="loading">
            上传文件
          </el-button>
        </el-upload>
      </div>
    </div>
    
    <el-card class="file-list" v-loading="loading">
      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="file-grid">
        <div
          v-for="file in files"
          :key="file.id"
          class="file-item"
          :class="{ 'is-selected': selectedFiles.includes(file.id) }"
          @click="handleItemClick(file, $event)"
        >
          <!-- 选择框 -->
          <el-checkbox
            v-model:value="selectedFiles"
            :label="file.id"
            @click.stop
            class="file-checkbox"
          />
          
          <!-- 预览图/图标 -->
          <div class="file-preview">
            <template v-if="file.type === 'image'">
              <img
                v-if="imageUrls[file.id]"
                :src="imageUrls[file.id]"
                :alt="file.name"
                class="preview-image"
                @error="() => handleImageError(file)"
              />
              <div v-else class="image-placeholder">
                <el-icon class="is-loading"><Loading /></el-icon>
              </div>
            </template>
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

      <!-- 列表视图 -->
      <div v-else class="file-list-view">
        <el-table 
          :data="files" 
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          
          <el-table-column width="60">
            <template #default="{ row }">
              <el-icon :size="20"><component :is="getFileIcon(row)" /></el-icon>
            </template>
          </el-table-column>
          
          <el-table-column prop="original_name" label="文件名" min-width="200">
            <template #default="{ row }">
              <span 
                class="file-name-cell"
                @click="handlePreview(row)"
              >
                <el-icon class="mr-1"><component :is="getFileIcon(row)" /></el-icon>
                {{ row.original_name || row.name }}
              </span>
            </template>
          </el-table-column>
          
          <el-table-column prop="size" label="大小" width="120">
            <template #default="{ row }">
              {{ formatFileSize(row.size) }}
            </template>
          </el-table-column>
          
          <el-table-column prop="upload_time" label="上传时间" width="180">
            <template #default="{ row }">
              {{ new Date(row.upload_time).toLocaleString() }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button
                type="warning"
                :icon="Edit"
                circle
                @click.stop="handleRename(row)"
              />
              <el-button
                type="danger"
                :icon="Delete"
                circle
                @click.stop="handleDelete(row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    
    <!-- 分页组件 -->
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
    
    <!-- 图片预览组件 -->
    <el-image-viewer
      v-if="previewVisible && previewType === 'image'"
      :url-list="previewUrlList"
      :initial-index="previewIndex"
      :hide-on-click-modal="false"
      @close="closePreview"
    />

    <!-- 文本预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      :title="currentFile?.original_name || currentFile?.name"
      width="80%"
      :destroy-on-close="true"
      @close="closePreview"
      v-if="previewType === 'text' || previewType === 'markdown' || previewType === 'code' || previewType === 'csv' || previewType === 'json'"
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">{{ currentFile?.original_name || currentFile?.name }}</span>
          <div class="dialog-actions">
            <div v-if="showSearch" class="search-toolbar">
            <el-input
              v-model="searchKeyword"
                placeholder="搜索文本..."
              clearable
                @clear="clearSearch"
                @keyup.enter="searchText"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
                <template #append>
                  <el-button @click="searchText">
                    搜索
                  </el-button>
                </template>
            </el-input>
              <el-button-group class="search-actions" v-if="searchResults.length > 0">
                <el-button @click="prevSearchResult">
                  <el-icon><ArrowUp /></el-icon>
                </el-button>
                <el-button @click="nextSearchResult">
                  <el-icon><ArrowDown /></el-icon>
                </el-button>
              </el-button-group>
              <span v-if="searchResults.length > 0" class="search-info">
                {{ currentSearchIndex + 1 }}/{{ searchResults.length }}
              </span>
            </div>
          </div>
        </div>
      </template>
      
      <div v-loading="textLoading" class="text-preview">
        <!-- CSV表格视图 -->
        <template v-if="previewType === 'csv' && !textLoading">
          <el-table
            :data="csvData.slice(1)"
            style="width: 100%"
            max-height="60vh"
            size="small"
            border
          >
            <el-table-column
              v-for="(header, index) in csvData[0]"
              :key="index"
              :prop="String(index)"
              :label="header"
              min-width="150"
            >
              <template #default="{ row }">
                {{ row[index] }}
              </template>
            </el-table-column>
          </el-table>
        </template>
        
        <!-- JSON预览 -->
        <div 
          v-else-if="previewType === 'json' && !textLoading"
          class="text-content json-content"
          v-html="processedContent"
          @click="handleFoldClick"
        ></div>
        
        <!-- 其他文本内容 -->
        <div 
          v-else-if="!textLoading"
          :class="[
            'text-content',
            { 'markdown-content': previewType === 'markdown' },
            { 'code-content': previewType === 'code' }
          ]"
          v-html="processedContent"
          @click="handleFoldClick"
        ></div>
      </div>
      <template #footer>
        <el-button @click="closePreview">关闭</el-button>
        <el-button type="primary" @click="downloadFile">下载</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Delete, Upload, Document, Picture, VideoPlay, Edit, 
  Grid, List, Loading, Search, ArrowUp, ArrowDown
} from '@element-plus/icons-vue'
import type { FileInfo, FileQuery, FileType } from '@/types/storage'
import { getFiles, deleteFile, uploadFile, renameFile } from '@/api/storage'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

// 在其他状态变量之前添加
const router = useRouter()
const userStore = useUserStore()

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

// 添加视图模式变量
const viewMode = ref<'grid' | 'list'>('grid')

// 图片URL缓存
const imageUrls = ref<Record<string, string>>({})

// 预览相关的状态
const previewVisible = ref(false)
const previewUrlList = ref<string[]>([])
const previewIndex = ref(0)

// 文本预览相关的状态
const previewType = ref<'image' | 'text' | 'markdown' | 'code' | 'csv' | 'json' | null>(null)
const currentFile = ref<FileInfo | null>(null)
const textContent = ref('')
const textLoading = ref(false)
const csvData = ref<string[][]>([])
const foldedLines = ref<Set<number>>(new Set())
const foldedJsonPaths = ref<Set<string>>(new Set())

// 搜索相关状态
const searchKeyword = ref('')
const searchResults = ref<number[]>([])
const currentSearchIndex = ref(-1)
const showSearch = computed(() => {
  return ['text', 'markdown', 'code', 'json'].includes(previewType.value || '')
})

// 添加选中文件的状态
const selectedFiles = ref<string[]>([])

// 计算属性：处理后的文本内容
const processedContent = computed(() => {
  if (!textContent.value) return ''
  
  switch (previewType.value) {
    case 'markdown': {
      try {
        const rawContent = textContent.value
        // 预处理代码块
        const processedContent = rawContent.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
          try {
            const validLang = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
            const highlighted = hljs.highlight(code.trim(), { language: validLang }).value
            return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`
          } catch (e) {
            console.error('代码高亮失败:', e)
            return `<pre><code class="hljs">${code.trim()}</code></pre>`
          }
        })
        const markedContent = String(marked.parse(processedContent))
        return searchKeyword.value ? 
          highlightSearchResults(markedContent) : 
          markedContent
      } catch (e) {
        console.error('Markdown 渲染失败:', e)
        return textContent.value
      }
    }
      case 'json':
      try {
        const parsed = JSON.parse(textContent.value)
        const formatted = JSON.stringify(parsed, null, 2)
        const highlighted = hljs.highlight(formatted, { language: 'json' }).value
        return addLineNumbers(renderJsonWithFolding(parsed, '', 0, highlighted))
      } catch (e) {
        console.error('JSON 解析失败:', e)
        return textContent.value
      }
    case 'code':
      try {
        const ext = currentFile.value?.name.split('.').pop()?.toLowerCase() || ''
        const language = getLanguageFromExt(ext)
    const highlighted = language ? 
          hljs.highlight(textContent.value, { language }).value : 
          hljs.highlightAuto(textContent.value).value
        return addLineNumbers(addCodeFolding(highlighted))
      } catch (e) {
        console.error('代码高亮失败:', e)
        return addLineNumbers(addCodeFolding(textContent.value))
      }
    default:
      return textContent.value
  }
})

// 添加行号和搜索高亮
const addLineNumbers = (content: string) => {
  const lines = content.split('\n')
  const maxLineNumber = lines.length.toString().length
  
  // 获取当前搜索结果所在的行号
  const currentResultLine = searchResults.value.length > 0 ? 
    textContent.value.substring(0, searchResults.value[currentSearchIndex.value]).split('\n').length - 1 : 
    -1
  
  return lines.map((line, index) => {
    const lineNumber = (index + 1).toString().padStart(maxLineNumber, ' ')
    const highlightedLine = searchKeyword.value ? 
      highlightSearchResults(line) : 
      line
    const isCurrentLine = index === currentResultLine
    
    return `<div class="code-line${isCurrentLine ? ' current-line' : ''}">
      <span class="line-number">${lineNumber}</span>
      <span class="line-content">${highlightedLine || ' '}</span>
    </div>`
  }).join('')
}

// 高亮搜索结果
const highlightSearchResults = (text: string): string => {
  if (!searchKeyword.value) return text
  
  // 转义特殊字符，避免正则表达式错误
  const escapedKeyword = searchKeyword.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeyword})`, 'gi')
  
  // 对于代码内容，需要先解码 HTML 实体
  const decodedText = text.replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&quot;/g, '"')
                         .replace(/&#39;/g, "'")
                         .replace(/&amp;/g, '&')
  
  // 获取当前行的文本位置
  const currentLine = textContent.value.substring(0, searchResults.value[currentSearchIndex.value] || 0).split('\n').length
  const thisLine = decodedText.split('\n').length
  
  // 高亮匹配的文本，并重新编码 HTML 实体
  let matchCount = 0
  const highlightedText = decodedText.replace(regex, (match) => {
    const encodedMatch = match.replace(/[<>&"']/g, (c) => {
      switch (c) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '"': return '&quot;'
        case "'": return '&#39;'
        case '&': return '&amp;'
        default: return c
      }
    })
    
    // 检查是否是当前选中的搜索结果
    const isCurrent = currentLine === thisLine && 
                     matchCount === searchResults.value.findIndex(
                       pos => textContent.value.substring(0, pos).split('\n').length === thisLine
                     )
    matchCount++
    
    return `<span class="search-highlight${isCurrent ? ' current' : ''}">${encodedMatch}</span>`
  })
  
  return highlightedText
}

// 修改 renderJsonWithFolding 函数
const renderJsonWithFolding = (obj: any, path: string = '', level: number = 0, highlightedStr: string = ''): string => {
  const indent = '  '.repeat(level)
  const isFolded = foldedJsonPaths.value.has(path)
  
  if (typeof obj !== 'object' || obj === null) {
    const jsonStr = JSON.stringify(obj)
    const highlighted = hljs.highlight(jsonStr, { language: 'json' }).value
    return searchKeyword.value ? highlightSearchResults(highlighted) : highlighted
  }
  
  const isArray = Array.isArray(obj)
  const isEmpty = Object.keys(obj).length === 0
  const openBracket = isArray ? '[' : '{'
  const closeBracket = isArray ? ']' : '}'
  
  if (isEmpty) {
    const emptyStr = `${openBracket}${closeBracket}`
    const highlighted = hljs.highlight(emptyStr, { language: 'json' }).value
    return searchKeyword.value ? highlightSearchResults(highlighted) : highlighted
  }
  
  const foldingIcon = isFolded ? 
    `<span class="fold-icon" data-path="${path}">▶</span>` : 
    `<span class="fold-icon" data-path="${path}">▼</span>`
  
  if (isFolded) {
    const foldedStr = `${openBracket}...${closeBracket}`
    const highlighted = hljs.highlight(foldedStr, { language: 'json' }).value
    return `${foldingIcon}${searchKeyword.value ? highlightSearchResults(highlighted) : highlighted}`
  }
  
  const entries = isArray ? 
    Array.from(obj as any[]).map((item, index) => [String(index), item]) : 
    Object.entries(obj)
  
  const content = entries.map((entry) => {
    const [key, value] = entry
    const childPath = path ? `${path}.${key}` : String(key)
    const renderedValue = renderJsonWithFolding(value, childPath, level + 1)
    const keyStr = isArray ? '' : `"${key}": `
    const highlightedKey = isArray ? '' : hljs.highlight(keyStr, { language: 'json' }).value
    const processedKey = searchKeyword.value ? highlightSearchResults(highlightedKey) : highlightedKey
    return `${indent}  ${processedKey}${renderedValue}`
  }).join(',\n')
  
  const openStr = hljs.highlight(openBracket, { language: 'json' }).value
  const closeStr = hljs.highlight(closeBracket, { language: 'json' }).value
  
  return `${foldingIcon}${openStr}\n${content}\n${indent}${closeStr}`
}

// 修改 addCodeFolding 函数
const addCodeFolding = (code: string): string => {
  const lines = code.split('\n')
  let result = ''
  let currentBlock: number[] = []
  let indentLevel = 0
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNumber = i + 1
    const trimmedLine = line.trim()
    
    // 检测可折叠的代码块开始
    if (trimmedLine.match(/[{([]/) || trimmedLine.match(/\b(function|class|if|for|while|switch)\b/)) {
      currentBlock.push(lineNumber)
      indentLevel++
    }
    
    // 添加折叠图标和高亮
    if (currentBlock.includes(lineNumber)) {
      const isFolded = foldedLines.value.has(lineNumber)
      const foldingIcon = isFolded ? 
        `<span class="fold-icon" data-line="${lineNumber}">▶</span>` : 
        `<span class="fold-icon" data-line="${lineNumber}">▼</span>`
      const highlightedLine = searchKeyword.value ? highlightSearchResults(line) : line
      result += `${foldingIcon}${highlightedLine}\n`
    } else {
      const shouldHide = Array.from(foldedLines.value).some(foldedLine => {
        const blockStart = currentBlock.indexOf(foldedLine)
        return blockStart !== -1 && lineNumber > foldedLine
      })
      
      if (!shouldHide) {
        const highlightedLine = searchKeyword.value ? highlightSearchResults(line) : line
        result += `${highlightedLine}\n`
      }
    }
    
    // 检测代码块结束
    if (trimmedLine.match(/[}\])]/) && indentLevel > 0) {
      indentLevel--
      if (indentLevel === 0) {
        currentBlock = []
      }
    }
  }
  
  return result.trimEnd()
}

// 处理折叠点击
const handleFoldClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.classList.contains('fold-icon')) return
  
  if (target.dataset.path) {
    // JSON 折叠
    const path = target.dataset.path
    if (foldedJsonPaths.value.has(path)) {
      foldedJsonPaths.value.delete(path)
    } else {
      foldedJsonPaths.value.add(path)
    }
  } else if (target.dataset.line) {
    // 代码块折叠
    const lineNumber = parseInt(target.dataset.line)
    if (foldedLines.value.has(lineNumber)) {
      foldedLines.value.delete(lineNumber)
    } else {
      foldedLines.value.add(lineNumber)
    }
  }
}

// 解析CSV数据
const parseCSV = (text: string) => {
  const lines = text.split(/\r\n|\n|\r/).filter(line => line.trim())
  return lines.map(line => {
    // 处理带引号的字段
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []
    return matches.map(field => field.replace(/^"|"$/g, '').trim())
  })
}

// 获取文件类型
const getFileType = (file: FileInfo): 'image' | 'text' | 'markdown' | 'code' | 'csv' | 'json' | null => {
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
  
  if (file.type === 'image') return 'image'
  if (ext === '.md') return 'markdown'
  if (ext === '.csv') return 'csv'
  if (ext === '.json') return 'json'
  if (['.xml', '.yml', '.yaml', '.js', '.ts', '.css', '.scss', '.html', '.vue'].includes(ext)) return 'code'
  if (['.txt', '.log'].includes(ext)) return 'text'
  
  return null
}

// 从文件扩展名获取语言
const getLanguageFromExt = (ext: string): string => {
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'json': 'json',
    'xml': 'xml',
    'yml': 'yaml',
    'yaml': 'yaml',
    'css': 'css',
    'scss': 'scss',
    'html': 'html',
    'vue': 'vue'
  }
  return languageMap[ext] || ''
}

// 加载文件列表
const loadFiles = async () => {
  try {
    loading.value = true
    console.debug('[开始加载文件列表]', {
      page: currentPage.value,
      size: pageSize.value,
      type: queryParams.value.type,
      token: userStore.token?.substring(0, 10) + '...',
      timestamp: new Date().toISOString()
    })
    
    const response = await getFiles({
      ...queryParams.value,
      page: currentPage.value,
      size: pageSize.value
    })
    
    if (response.data.code === 200) {
      console.debug('[文件列表加载成功]', {
        itemCount: response.data.data.items.length,
        total: response.data.data.total,
        timestamp: new Date().toISOString()
      })
      files.value = response.data.data.items
      total.value = response.data.data.total
    } else {
      console.error('[文件列表加载失败]', {
        code: response.data.code,
        message: response.data.message,
        timestamp: new Date().toISOString()
      })
      ElMessage.error(response.data.message || '加载文件列表失败')
    }
  } catch (error: any) {
    console.error('[文件列表加载错误]', {
      error: error.message,
      status: error.response?.status,
      timestamp: new Date().toISOString()
    })
    ElMessage.error('加载文件列表失败')
  } finally {
    loading.value = false
  }
}

// 处理文件上传
const handleUpload = async (options: any) => {
  try {
    loading.value = true
    const response = await uploadFile({
      file: options.file,
      type: queryParams.value.type === 'all' ? undefined : queryParams.value.type
    })
    
    if (response.data.code === 200) {
      ElMessage.success('上传成功')
      loadFiles()
      options.onSuccess(response.data)
    } else {
      ElMessage.error(response.data.message || '上传失败')
      options.onError(new Error(response.data.message || '上传失败'))
    }
  } catch (error: any) {
    console.error('上传失败:', error)
    ElMessage.error(error.message || '上传失败')
    options.onError(error)
  } finally {
    loading.value = false
  }
}

// 处理文件删除
const handleDelete = async (file: FileInfo) => {
  try {
    // 检查文件信息
    if (!file || !file.id) {
      ElMessage.error('文件信息不完整')
      return
    }

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
      const response = await deleteFile(file.id)
      
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

// 处理文件重命名
const handleRename = async (file: FileInfo) => {
  try {
    // 检查文件信息
    if (!file || !file.id) {
      ElMessage.error('文件信息不完整')
      return
    }

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
      const response = await renameFile(file.id, newName)
      
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

// 加载图片
const loadImage = async (file: FileInfo) => {
  if (!file.id || !file.url || imageUrls.value[file.id]) return

  try {
    console.debug('[开始加载图片]', {
      fileId: file.id,
      url: file.url
    })

    // 从file.url中移除可能存在的/api/v1前缀
    const cleanUrl = file.url.replace(/^\/api\/v1/, '')

    const response = await request.get(cleanUrl, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })

    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    const url = URL.createObjectURL(blob)
    imageUrls.value[file.id] = url

    console.debug('[图片加载成功]', {
      fileId: file.id
    })
  } catch (error) {
    console.error('[图片加载失败]', {
      fileId: file.id,
      error
    })
  }
}

// 处理图片加载错误
const handleImageError = (file: FileInfo) => {
  if (file.id) {
    const url = imageUrls.value[file.id]
    if (url) {
      URL.revokeObjectURL(url)
      delete imageUrls.value[file.id]
    }
  }
}

// 监听文件列表变化，自动加载图片
watch(() => files.value, (newFiles) => {
  newFiles.forEach(file => {
    if (file.type === 'image') {
      loadImage(file)
    }
  })
}, { immediate: true })

// 组件卸载时清理URL
onBeforeUnmount(() => {
  Object.values(imageUrls.value).forEach(url => {
    URL.revokeObjectURL(url)
  })
  imageUrls.value = {}
})

// 生命周期钩子
onMounted(async () => {
  console.debug('[组件挂载]', {
    token: userStore.token?.substring(0, 10) + '...',
    timestamp: new Date().toISOString()
  })
  
  // 检查用户是否已登录
  if (!userStore.token) {
    console.warn('[未登录]', {
      timestamp: new Date().toISOString()
    })
    ElMessage.error('请先登录')
    router.push('/login')
    return
  }
  
  await loadFiles()
})

// 判断是否是文本文件
const isTextFile = (file: FileInfo) => {
  const textExtensions = ['.txt', '.md', '.json', '.xml', '.csv', '.log', '.yml', '.yaml']
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
  return textExtensions.includes(ext)
}

// 加载文本内容
const loadTextContent = async (file: FileInfo) => {
  if (!file.url) return

  try {
    textLoading.value = true
    const cleanUrl = file.url.replace(/^\/api\/v1/, '')
    
    const response = await request.get(cleanUrl, {
      responseType: 'text',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })

    textContent.value = response.data
    
    // 如果是CSV文件，解析数据
    if (previewType.value === 'csv') {
      csvData.value = parseCSV(response.data)
    }
  } catch (error) {
    console.error('[文本加载失败]', {
      fileId: file.id,
      error
    })
    ElMessage.error('文本加载失败')
  } finally {
    textLoading.value = false
  }
}

// 搜索文本
const searchText = () => {
  if (!searchKeyword.value) {
    searchResults.value = []
    currentSearchIndex.value = -1
    return
  }

  const content = textContent.value
  const results: number[] = []
  const regex = new RegExp(searchKeyword.value, 'gi')
  let match

  while ((match = regex.exec(content)) !== null) {
    results.push(match.index)
  }

  searchResults.value = results
  currentSearchIndex.value = results.length > 0 ? 0 : -1
  
  // 触发重新渲染以显示高亮
  if (results.length > 0) {
    scrollToSearchResult()
  }
}

// 跳转到下一个搜索结果
const nextSearchResult = () => {
  if (searchResults.value.length === 0) return
  
  currentSearchIndex.value = (currentSearchIndex.value + 1) % searchResults.value.length
  scrollToSearchResult()
}

// 跳转到上一个搜索结果
const prevSearchResult = () => {
  if (searchResults.value.length === 0) return
  
  currentSearchIndex.value = currentSearchIndex.value - 1
  if (currentSearchIndex.value < 0) {
    currentSearchIndex.value = searchResults.value.length - 1
  }
  scrollToSearchResult()
}

// 滚动到当前搜索结果
const scrollToSearchResult = () => {
  const index = searchResults.value[currentSearchIndex.value]
  if (typeof index !== 'number') return

  const content = document.querySelector('.text-content')
  if (!content) return

  const text = textContent.value.substring(0, index)
  const lines = text.split('\n')
  const lineNumber = lines.length
  const lineHeight = parseInt(getComputedStyle(content).lineHeight || '20')
  
  content.scrollTop = (lineNumber - 1) * lineHeight
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  searchResults.value = []
  currentSearchIndex.value = -1
}

// 关闭预览
const closePreview = () => {
  previewVisible.value = false
  previewType.value = null
  currentFile.value = null
  textContent.value = ''
  csvData.value = []
  clearSearch()
  foldedLines.value.clear()
  foldedJsonPaths.value.clear()
}

// 下载文件
const downloadFile = () => {
  if (currentFile.value?.url) {
    window.open(currentFile.value.url, '_blank')
  }
}

// 修改预览处理函数
const handlePreview = async (file: FileInfo) => {
  currentFile.value = file
  const type = getFileType(file)
  
  if (!type) {
    // 不支持预览的文件直接下载
    window.open(file.url, '_blank')
    return
  }
  
  previewType.value = type
  previewVisible.value = true

  if (type === 'image') {
    // 收集当前可见的所有图片URL
    const urls = files.value
      .filter(f => f.type === 'image' && imageUrls.value[f.id])
      .map(f => imageUrls.value[f.id])
    
    // 找到当前图片的索引
    const index = files.value.findIndex(f => f.id === file.id)
    
    previewUrlList.value = urls
    previewIndex.value = index
  } else {
    // 加载文本内容
    await loadTextContent(file)
  }
}

// 处理文件项点击
const handleItemClick = (file: FileInfo, event: MouseEvent) => {
  // 如果按住Ctrl键，则切换选中状态
  if (event.ctrlKey || event.metaKey) {
    const index = selectedFiles.value.indexOf(file.id)
    if (index === -1) {
      selectedFiles.value.push(file.id)
    } else {
      selectedFiles.value.splice(index, 1)
    }
  } else {
    // 否则预览文件
    handlePreview(file)
  }
}

// 处理表格选择变化
const handleSelectionChange = (selection: FileInfo[]) => {
  selectedFiles.value = selection.map(file => file.id)
}

// 处理批量删除
const handleBatchDelete = async () => {
  if (selectedFiles.value.length === 0) return
  
  try {
    const result = await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedFiles.value.length} 个文件吗？`,
      '批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (result === 'confirm') {
      loading.value = true
      
      // 并行执行删除操作
      const deletePromises = selectedFiles.value.map(fileId => deleteFile(fileId))
      const results = await Promise.allSettled(deletePromises)
      
      // 统计成功和失败的数量
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value.data.code === 200).length
      const failCount = selectedFiles.value.length - successCount
      
      // 显示结果消息
      if (successCount > 0) {
        ElMessage.success(`成功删除 ${successCount} 个文件`)
      }
      if (failCount > 0) {
        ElMessage.error(`${failCount} 个文件删除失败`)
      }
      
      // 重新加载文件列表
      selectedFiles.value = []
      await loadFiles()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
@use '@/styles/views/attachment/attachment-list.scss';
</style> 