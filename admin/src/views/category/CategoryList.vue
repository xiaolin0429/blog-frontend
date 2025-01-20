<template>
  <div class="category-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <el-button type="primary" @click="handleCreate">新建分类</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="categories"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
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
      :title="dialogType === 'create' ? '新建分类' : '编辑分类'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
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
import { getCategories, createCategory } from '@/api/post'
import type { Category } from '@/types/post'

// 表格数据
const categories = ref<Category[]>([])
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
  name: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 加载分类列表
const loadCategories = async () => {
  try {
    loading.value = true
    const res = await getCategories({
      page: currentPage.value,
      size: pageSize.value,
      ordering: '-created_at'
    })
    categories.value = res.items
    total.value = res.total
  } catch (error) {
    console.error('加载分类列表失败:', error)
    ElMessage.error('加载分类列表失败')
  } finally {
    loading.value = false
  }
}

// 新建分类
const handleCreate = () => {
  dialogType.value = 'create'
  form.value = {
    name: '',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row: Category) => {
  dialogType.value = 'edit'
  form.value = {
    name: row.name,
    description: row.description || ''
  }
  dialogVisible.value = true
}

// 删除分类
const handleDelete = (row: Category) => {
  ElMessageBox.confirm(
    '确定要删除这个分类吗？删除后不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 实现删除分类的 API 调用
      ElMessage.success('删除成功')
      loadCategories()
    } catch (error) {
      console.error('删除分类失败:', error)
      ElMessage.error('删除分类失败')
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
      const { code, message } = await createCategory(form.value)
      if (code === 200 || code === 201) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        loadCategories()
      } else {
        ElMessage.error(message || '创建失败')
      }
    } else {
      // TODO: 实现编辑分类的 API 调用
      ElMessage.success('编辑成功')
      dialogVisible.value = false
      loadCategories()
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
  loadCategories()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadCategories()
}

// 生命周期钩子
onMounted(() => {
  loadCategories()
})
</script>

<style lang="scss" scoped>
.category-list {
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