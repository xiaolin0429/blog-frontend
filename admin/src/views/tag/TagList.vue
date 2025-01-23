<template>
  <div class="tag-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>标签管理</span>
          <el-button type="primary" @click="handleCreate">新建标签</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tags"
        style="width: 100%"
        :highlight-current-row="true"
        @current-change="handleCurrentChange"
        :row-class-name="tableRowClassName"
        @row-click="handleRowClick"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="post_count" label="文章数" width="100" align="center" />
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新建标签' : '编辑标签'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入标签描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getTags, createTag, updateTag, deleteTag } from '@/api/post'
import type { Tag } from '@/types/post'

// 表格数据
const tags = ref<Tag[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框数据
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const currentEditId = ref<number | null>(null)
const form = ref({
  name: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
  ]
}

// 当前选中的行
const currentRow = ref<Tag | null>(null)

// 表格行的 class 名称
const tableRowClassName = ({ row }: { row: Tag }) => {
  return row.id === currentRow.value?.id ? 'selected-row' : ''
}

// 点击行时的处理
const handleRowClick = (row: Tag) => {
  currentRow.value = row
}

// 表格当前行变化的处理
const handleCurrentChange = (val: Tag | null) => {
  currentRow.value = val
}

// 加载标签列表
const loadTags = async (resetPage = false) => {
  try {
    loading.value = true
    // 如果需要重置分页，则重置参数
    if (resetPage) {
      currentPage.value = 1
      pageSize.value = 10
    }

    const response = await getTags({
      page: currentPage.value,
      size: pageSize.value,
      ordering: '-created_at'
    })
    
    if (response.code === 200 && response.data) {
      tags.value = response.data.results
      total.value = response.data.count
    } else {
      tags.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载标签列表失败:', error)
    ElMessage.error('加载标签列表失败')
    tags.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 新建标签
const handleCreate = () => {
  dialogType.value = 'create'
  currentEditId.value = null
  form.value = {
    name: '',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑标签
const handleEdit = (row: Tag) => {
  dialogType.value = 'edit'
  currentEditId.value = row.id
  currentRow.value = row
  form.value = {
    name: row.name,
    description: row.description || ''
  }
  dialogVisible.value = true
}

// 删除标签
const handleDelete = (row: Tag) => {
  currentRow.value = row
  const warningMessage = row.post_count > 0
    ? `该标签下有${row.post_count}篇文章，确定要删除吗？`
    : '确定要删除这个标签吗？删除后不可恢复。'

  ElMessageBox.confirm(
    warningMessage,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteTag(row.id)
      ElMessage.success('删除成功')
      currentRow.value = null
      await loadTags(true)
    } catch (error) {
      console.error('删除标签失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    currentRow.value = null
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    if (dialogType.value === 'create') {
      const response = await createTag(form.value)
      if (response.code === 200 || response.code === 201) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        await loadTags(true)
      } else {
        ElMessage.error(response.message || '创建失败')
      }
    } else {
      const response = await updateTag(currentEditId.value!, form.value)
      if (response.code === 200) {
        ElMessage.success('编辑成功')
        dialogVisible.value = false
        await loadTags(true)
      } else {
        ElMessage.error(response.message || '编辑失败')
      }
    }
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error('提交失败')
  } finally {
    submitting.value = false
  }
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadTags(false)
}

// 重命名分页处理函数，避免与 current-change 事件冲突
const handlePageChange = (val: number) => {
  currentPage.value = val
  currentRow.value = null
  loadTags(false)
}

// 生命周期钩子
onMounted(() => {
  loadTags(true)
})
</script>

<style lang="scss" scoped>
.tag-list {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-table) {
    .selected-row {
      background-color: var(--el-color-primary-light-8);
    }

    .el-table__row {
      cursor: pointer;
      transition: background-color 0.1s ease-in-out;

      &:hover {
        background-color: var(--el-fill-color);
      }
    }
  }
}
</style> 