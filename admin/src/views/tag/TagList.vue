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
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
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
          @current-change="handleCurrentChange"
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
import { getTags, createTag } from '@/api/post'
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
const form = ref({
  name: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 加载标签列表
const loadTags = async () => {
  try {
    loading.value = true
    const res = await getTags({
      page: currentPage.value,
      size: pageSize.value,
      ordering: '-created_at'
    })
    tags.value = res.items
    total.value = res.total
  } catch (error) {
    console.error('加载标签列表失败:', error)
    ElMessage.error('加载标签列表失败')
  } finally {
    loading.value = false
  }
}

// 新建标签
const handleCreate = () => {
  dialogType.value = 'create'
  form.value = {
    name: ''
  }
  dialogVisible.value = true
}

// 编辑标签
const handleEdit = (row: Tag) => {
  dialogType.value = 'edit'
  form.value = {
    name: row.name
  }
  dialogVisible.value = true
}

// 删除标签
const handleDelete = (row: Tag) => {
  ElMessageBox.confirm(
    '确定要删除这个标签吗？删除后不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 实现删除标签的 API 调用
      ElMessage.success('删除成功')
      loadTags()
    } catch (error) {
      console.error('删除标签失败:', error)
      ElMessage.error('删除标签失败')
    }
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    if (dialogType.value === 'create') {
      const { code, message } = await createTag(form.value)
      if (code === 200 || code === 201) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        loadTags()
      } else {
        ElMessage.error(message || '创建失败')
      }
    } else {
      // TODO: 实现编辑标签的 API 调用
      ElMessage.success('编辑成功')
      dialogVisible.value = false
      loadTags()
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
  loadTags()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadTags()
}

// 生命周期钩子
onMounted(() => {
  loadTags()
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
}
</style> 