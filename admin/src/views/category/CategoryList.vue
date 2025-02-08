<template>
  <div class="category-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-button type="primary" @click="handleCreate">
              <el-icon><Plus /></el-icon>新建分类
            </el-button>
          </div>
          <div class="right">
            <el-input
              v-model="queryParams.search"
              placeholder="搜索分类"
              class="search-input"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button @click="handleSearch">搜索</el-button>
            <el-button link @click="handleReset">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="categories"
        style="width: 100%"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="名称" min-width="200" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="order" label="排序" width="100" align="center" />
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handleCreateChild(row)">添加子分类</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分类表单对话框 -->
    <CategoryForm
      v-model:visible="formVisible"
      :edit-data="currentCategory"
      :categories="categories"
      :parent-category="parentCategory"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search, Refresh } from '@element-plus/icons-vue'
import {
  getCategories,
  deleteCategory
} from '@/api/category'
import type { Category } from '@/types/category'
import CategoryForm from './components/CategoryForm.vue'

const loading = ref(false)
const categories = ref<Category[]>([])
const formVisible = ref(false)
const currentCategory = ref<Category | undefined>(undefined)
const parentCategory = ref<Category | undefined>(undefined)
const formRef = ref<{ form: any } | null>(null)

// 查询参数
const queryParams = ref({
  search: undefined as string | undefined,
  ordering: 'order' as 'order' | 'name' | 'created_at',
  tree: true  // 获取树形结构数据
})

// 加载分类列表
const loadCategories = async () => {
  loading.value = true
  try {
    const response = await getCategories(queryParams.value)
    const { data } = response.data
    categories.value = data || []
  } catch (error: any) {
    console.error('加载分类列表失败:', error)
    ElMessage.error(error.message || '加载分类列表失败')
    categories.value = []
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  loadCategories()
}

// 处理重置
const handleReset = () => {
  queryParams.value.search = undefined
  loadCategories()
}

// 处理创建
const handleCreate = () => {
  currentCategory.value = undefined
  parentCategory.value = undefined
  formVisible.value = true
}

// 处理编辑
const handleEdit = (row: Category) => {
  currentCategory.value = row
  parentCategory.value = undefined
  formVisible.value = true
}

// 处理删除
const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${row.name}"吗？`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    
    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    loadCategories()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 处理表单提交成功
const handleSuccess = () => {
  loadCategories()
}

// 处理创建子分类
const handleCreateChild = (parent: Category) => {
  currentCategory.value = undefined
  parentCategory.value = parent
  formVisible.value = true
}

// 初始化
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

    .right {
      display: flex;
      align-items: center;
      gap: 8px;

      .search-input {
        width: 200px;
      }
    }
  }
}
</style> 