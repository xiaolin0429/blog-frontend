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
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="parent_name" label="父分类" width="120">
          <template #default="{ row }">
            {{ row.parent_name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handleAddChild(row)">添加子分类</el-button>
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
      :title="getDialogTitle"
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
        <el-form-item label="父分类" prop="parent">
          <el-select 
            v-model="form.parent" 
            placeholder="请选择父分类"
            clearable
            filterable
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="dialogType === 'edit' && item.id === currentEditId"
            />
          </el-select>
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
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/post'
import type { Category } from '@/types/post'

// 表格数据
const categories = ref<Category[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框数据
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit' | 'addChild'>('create')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const currentEditId = ref<number | null>(null)

const form = ref({
  name: '',
  description: '',
  parent: null as number | null
})

// 计算属性
const getDialogTitle = computed(() => {
  switch (dialogType.value) {
    case 'create':
      return '新建分类'
    case 'edit':
      return '编辑分类'
    case 'addChild':
      return '添加子分类'
    default:
      return '分类'
  }
})

// 分类选项，过滤掉当前编辑的分类及其子分类
const categoryOptions = computed(() => {
  if (dialogType.value === 'edit' && currentEditId.value) {
    return categories.value.filter(item => {
      // 排除自身及其子分类
      const isCurrentOrChild = (category: Category): boolean => {
        if (category.id === currentEditId.value) return true
        if (category.children) {
          return category.children.some(isCurrentOrChild)
        }
        return false
      }
      return !isCurrentOrChild(item)
    })
  }
  return categories.value
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 加载分类列表
const loadCategories = async (resetPage = false) => {
  try {
    loading.value = true
    // 如果需要重置分页，则重置参数
    if (resetPage) {
      currentPage.value = 1
      pageSize.value = 10
    }

    const response = await getCategories({
      page: currentPage.value,
      size: pageSize.value,
      ordering: '-created_at'
    })
    
    if (response.code === 200 && Array.isArray(response.data)) {
      // 构建分类树
      const categoryMap = new Map<number, Category>()
      const rootCategories: Category[] = []
      
      // 第一遍遍历：建立id到分类的映射
      response.data.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] })
      })
      
      // 第二遍遍历：构建树形结构
      response.data.forEach(category => {
        const categoryWithChildren = categoryMap.get(category.id)
        if (categoryWithChildren) {
          if (category.parent) {
            // 如果有父分类，将其添加到父分类的children中
            const parent = categoryMap.get(category.parent)
            if (parent) {
              parent.children = parent.children || []
              parent.children.push(categoryWithChildren)
            }
          } else {
            // 如果没有父分类，则为顶级分类
            rootCategories.push(categoryWithChildren)
          }
        }
      })
      
      categories.value = rootCategories
      total.value = response.data.length // 使用实际的总数
    } else {
      categories.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载分类列表失败:', error)
    ElMessage.error('加载分类列表失败')
    categories.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 新建分类
const handleCreate = () => {
  dialogType.value = 'create'
  currentEditId.value = null
  form.value = {
    name: '',
    description: '',
    parent: null
  }
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row: Category) => {
  dialogType.value = 'edit'
  currentEditId.value = row.id
  form.value = {
    name: row.name,
    description: row.description || '',
    parent: row.parent || null
  }
  dialogVisible.value = true
}

// 添加子分类
const handleAddChild = (row: Category) => {
  dialogType.value = 'addChild'
  currentEditId.value = null
  form.value = {
    name: '',
    description: '',
    parent: row.id
  }
  dialogVisible.value = true
}

// 删除分类
const handleDelete = (row: Category) => {
  const hasChildren = row.children && row.children.length > 0
  const warningMessage = hasChildren 
    ? '该分类包含子分类，删除后所有子分类也会被删除，确定要继续吗？'
    : '确定要删除这个分类吗？删除后不可恢复。'

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
      await deleteCategory(row.id)
      ElMessage.success('删除成功')
      await loadCategories(true) // 重置分页并重新加载
    } catch (error) {
      console.error('删除分类失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    if (dialogType.value === 'create' || dialogType.value === 'addChild') {
      const { code, message } = await createCategory(form.value)
      if (code === 200 || code === 201) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        await loadCategories(true) // 重置分页并重新加载
      } else {
        ElMessage.error(message || '创建失败')
      }
    } else {
      const { code, message } = await updateCategory(currentEditId.value!, form.value)
      if (code === 200) {
        ElMessage.success('编辑成功')
        dialogVisible.value = false
        await loadCategories(true) // 重置分页并重新加载
      } else {
        ElMessage.error(message || '编辑失败')
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
  loadCategories(false) // 不重置分页，使用新的pageSize加载
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadCategories(false) // 不重置分页，使用新的currentPage加载
}

// 生命周期钩子
onMounted(() => {
  loadCategories(true) // 初始加载时重置分页
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