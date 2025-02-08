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
            <el-form :inline="true" class="search-form">
              <el-form-item>
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
              </el-form-item>
              
              <el-form-item>
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
              </el-form-item>

              <el-form-item label="评论时间">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  :shortcuts="[
                    {
                      text: '最近一周',
                      value: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        return [start, end]
                      }
                    },
                    {
                      text: '最近一个月',
                      value: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        return [start, end]
                      }
                    },
                    {
                      text: '最近三个月',
                      value: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        return [start, end]
                      }
                    }
                  ]"
                  @change="handleDateRangeChange"
                  class="date-range"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
              </el-form-item>
            </el-form>
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
                <router-link :to="'/posts/' + row.post.id" class="link-type">
                  {{ row.post.title }}
                </router-link>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="author.nickname" label="评论者" width="120">
          <template #default="{ row }">
            {{ row.author.nickname || row.author.username }}
          </template>
        </el-table-column>
        <el-table-column prop="likes" label="点赞数" width="100" align="center" />
        <el-table-column prop="replyCount" label="回复数" width="100" align="center" />
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
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          hide-on-single-page
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Search } from '@element-plus/icons-vue'
import {
  getComments,
  deleteComment,
  batchDeleteComments,
  updateCommentStatus,
  batchUpdateCommentStatus,
  type Comment,
  type CommentQuery
} from '@/api/comment'

const loading = ref(false)
const comments = ref<Comment[]>([])
const selectedComments = ref<Comment[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dateRange = ref<[string, string] | undefined>(undefined)

const searchForm = ref<CommentQuery>({
  page: 1,
  size: 10,
  ordering: '-created_at',
  keyword: '',
  status: undefined,
  startDate: undefined,
  endDate: undefined
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

// 处理日期范围变化
const handleDateRangeChange = (val: [string, string] | null) => {
  if (val) {
    searchForm.value.startDate = val[0]
    searchForm.value.endDate = val[1]
  } else {
    searchForm.value.startDate = undefined
    searchForm.value.endDate = undefined
  }
}

// 获取评论列表
const fetchComments = async () => {
  loading.value = true
  try {
    const res = await getComments({
      ...searchForm.value,
      page: currentPage.value,
      size: pageSize.value
    })
    comments.value = res.data.data.results
    total.value = res.data.data.count
  } catch (error) {
    console.error('获取评论列表失败:', error)
    ElMessage.error('获取评论列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchComments()
}

// 重置搜索
const handleReset = () => {
  dateRange.value = undefined
  searchForm.value = {
    page: 1,
    size: 10,
    ordering: '-created_at',
    keyword: '',
    status: undefined,
    startDate: undefined,
    endDate: undefined
  }
  currentPage.value = 1
  pageSize.value = 10
}

// 处理选择
const handleSelectionChange = (val: Comment[]) => {
  selectedComments.value = val
}

// 处理审核通过
const handleApprove = async (row: Comment) => {
  try {
    await updateCommentStatus(row.id, 'approved')
    ElMessage.success('审核通过成功')
    fetchComments()
  } catch (error) {
    console.error('审核通过失败:', error)
    ElMessage.error('审核通过失败')
  }
}

// 处理审核拒绝
const handleReject = async (row: Comment) => {
  try {
    await updateCommentStatus(row.id, 'rejected')
    ElMessage.success('审核拒绝成功')
    fetchComments()
  } catch (error) {
    console.error('审核拒绝失败:', error)
    ElMessage.error('审核拒绝失败')
  }
}

// 处理删除
const handleDelete = async (row: Comment) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteComment(row.id)
    ElMessage.success('删除成功')
    fetchComments()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
      ElMessage.error('删除评论失败')
    }
  }
}

// 处理批量删除
const handleBatchDelete = async () => {
  if (!selectedComments.value.length) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedComments.value.length} 条评论吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await batchDeleteComments(selectedComments.value.map(item => item.id))
    ElMessage.success('批量删除成功')
    fetchComments()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除评论失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 初始化
onMounted(() => {
  fetchComments()
})

// 监听分页参数变化
watch([currentPage, pageSize], () => {
  fetchComments()
})
</script>

<style lang="scss">
@use '@/styles/views/comment/comment-list.scss';
</style> 