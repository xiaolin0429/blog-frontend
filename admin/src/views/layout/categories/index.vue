<template>
  <div class="category-list">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-medium">分类管理</h2>
      <el-button
        type="primary"
        @click="handleAdd"
      >
        <el-icon class="mr-1"><Plus /></el-icon>
        新建分类
      </el-button>
    </div>

    <el-card v-loading="loading">
      <el-table
        :data="categories"
        style="width: 100%"
      >
        <el-table-column prop="name" label="分类名称" min-width="200" />
        
        <el-table-column prop="slug" label="别名" min-width="200">
          <template #default="{ row }">
            {{ row.slug || '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="description" label="描述" min-width="300">
          <template #default="{ row }">
            {{ row.description || '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="postCount" label="文章数" width="100" align="center" />

        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新建分类'"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入分类名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="别名" prop="slug">
          <el-input
            v-model="formData.slug"
            placeholder="请输入分类别名，用于URL"
            maxlength="50"
            show-word-limit
          >
            <template #prefix>/categories/</template>
          </el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/category'
import type { Category } from '@/types/category'
import { formatDate } from '@/utils/format'

interface CategoryForm {
  id?: number
  name: string
  slug: string
  description: string
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const categories = ref<Category[]>([])
const formRef = ref()

// 表单数据
const formData = ref<CategoryForm>({
  name: '',
  slug: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度应在2-50个字符之间', trigger: 'blur' }
  ],
  slug: [
    { pattern: /^[a-z0-9-]+$/, message: '别名只能包含小写字母、数字和连字符', trigger: 'blur' }
  ]
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    loading.value = true
    const response = await getCategories()
    categories.value = response.data.data
  } catch (error: any) {
    ElMessage.error(error.message || '获取分类列表失败')
  } finally {
    loading.value = false
  }
}

// 新建分类
const handleAdd = () => {
  isEdit.value = false
  formData.value = {
    name: '',
    slug: '',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row: any) => {
  isEdit.value = true
  formData.value = { ...row }
  dialogVisible.value = true
}

// 删除分类
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '删除分类后，该分类下的文章将变为未分类状态，确定要删除吗？',
      '提示',
      {
        type: 'warning'
      }
    )

    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    fetchCategories()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    if (isEdit.value) {
      if (!formData.value.id) {
        throw new Error('分类ID不存在')
      }
      await updateCategory(formData.value.id, formData.value)
      ElMessage.success('更新成功')
    } else {
      await createCategory(formData.value)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchCategories()
  } catch (error: any) {
    ElMessage.error(error.message || (isEdit.value ? '更新失败' : '创建失败'))
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss">
@use '@/styles/views/layout/categories/index.scss';
</style> 