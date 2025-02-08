<template>
  <div class="category-manage-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>新建分类
          </el-button>
          
          <el-input
            v-model="searchQuery"
            placeholder="搜索分类名称"
            clearable
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </template>
      
      <!-- 分类列表 -->
      <el-table
        v-loading="loading"
        :data="categories"
        style="width: 100%"
      >
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="slug" label="别名" width="200" />
        <el-table-column prop="description" label="描述" min-width="300" show-overflow-tooltip />
        <el-table-column prop="count" label="文章数" width="100" align="center" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="handleEdit(row)">
                编辑
              </el-button>
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
      
      <!-- 新建/编辑分类对话框 -->
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
          
          <el-form-item label="别名" prop="slug">
            <el-input v-model="form.slug" placeholder="请输入分类别名" />
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
            <el-button type="primary" :loading="submitting" @click="handleSubmit">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type { Category } from '@/types/category'
import type { FormInstance } from 'element-plus'

const loading = ref(false)
const submitting = ref(false)
const categories = ref<Category[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchQuery = ref('')

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()
const form = ref({
  id: undefined as number | undefined,
  name: '',
  slug: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  slug: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和连字符', trigger: 'blur' }
  ]
}

// 待实现获取分类列表的功能
const fetchCategories = async () => {
  // 实现获取分类列表的逻辑
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchCategories()
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchCategories()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchCategories()
}

// 处理创建
const handleCreate = () => {
  dialogType.value = 'create'
  form.value = {
    id: undefined,
    name: '',
    slug: '',
    description: ''
  }
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: Category) => {
  dialogType.value = 'edit'
  form.value = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || ''
  }
  dialogVisible.value = true
}

// 处理提交
const handleSubmit = async () => {
  // 实现提交逻辑
}

// 处理删除
const handleDelete = async (row: Category) => {
  // 实现删除逻辑
}

// 初始化
onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss">
@use '@/styles/views/category/category-list.scss';
</style> 