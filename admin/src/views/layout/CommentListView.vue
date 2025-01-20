<template>
  <div class="comment-manage-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="left">
            <el-button
              type="danger"
              :disabled="!selectedComments.length"
              @click="handleBatchDelete"
            >
              <el-icon><Delete /></el-icon>批量删除
            </el-button>
          </div>
          
          <div class="right">
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索评论内容"
              clearable
              class="search-input"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            
            <el-select
              v-model="searchForm.status"
              placeholder="评论状态"
              clearable
              class="status-select"
            >
              <el-option label="已审核" value="approved" />
              <el-option label="待审核" value="pending" />
              <el-option label="已拒绝" value="rejected" />
            </el-select>
            
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
      </template>
      
      <!-- 评论列表 -->
      <el-table
        v-loading="loading"
        :data="comments"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="评论内容" min-width="300">
          <template #default="{ row }">
            <div class="comment-content">
              <div class="content">{{ row.content }}</div>
              <div class="article-info">
                评论文章：
                <router-link :to="'/article/' + row.post.id" class="link-type">
                  {{ row.post.title }}
                </router-link>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="author.nickname" label="评论者" width="120" />
        <el-table-column prop="likes" label="点赞数" width="100" align="center" />
        <el-table-column prop="createdAt" label="评论时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <template v-if="row.status === 'pending'">
                <el-button type="success" link @click="handleApprove(row)">
                  通过
                </el-button>
                <el-button type="danger" link @click="handleReject(row)">
                  拒绝
                </el-button>
              </template>
              <el-button type="danger" link @click="handleDelete(row)">
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Search } from '@element-plus/icons-vue'
import type { Comment } from '@/types'

const loading = ref(false)
const comments = ref<Comment[]>([])
const selectedComments = ref<Comment[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = ref({
  keyword: '',
  status: undefined as string | undefined
})

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'approved':
      return '已审核'
    case 'pending':
      return '待审核'
    case 'rejected':
      return '已拒绝'
    default:
      return '未知'
  }
}

// 待实现获取评论列表的功能
const fetchComments = async () => {
  // 实现获取评论列表的逻辑
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchComments()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    keyword: '',
    status: undefined
  }
  handleSearch()
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchComments()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchComments()
}

// 处理选择
const handleSelectionChange = (val: Comment[]) => {
  selectedComments.value = val
}

// 处理审核通过
const handleApprove = async (row: Comment) => {
  // 实现审核通过的逻辑
}

// 处理审核拒绝
const handleReject = async (row: Comment) => {
  // 实现审核拒绝的逻辑
}

// 处理删除
const handleDelete = async (row: Comment) => {
  // 实现删除的逻辑
}

// 处理批量删除
const handleBatchDelete = async () => {
  // 实现批量删除的逻辑
}

// 初始化
onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comment-manage-container {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .left {
    display: flex;
    gap: 10px;
  }
  
  .right {
    display: flex;
    gap: 10px;
    
    .search-input {
      width: 200px;
    }
    
    .status-select {
      width: 150px;
    }
  }
}

.comment-content {
  .content {
    color: #303133;
    margin-bottom: 5px;
  }
  
  .article-info {
    font-size: 12px;
    color: #909399;
    
    .link-type {
      color: #409eff;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 