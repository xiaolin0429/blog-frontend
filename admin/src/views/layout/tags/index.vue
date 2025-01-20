<template>
  <div class="tag-list">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-medium">标签管理</h2>
      <el-button
        type="primary"
        @click="handleAdd"
      >
        <el-icon class="mr-1"><Plus /></el-icon>
        新建标签
      </el-button>
    </div>

    <el-card v-loading="loading">
      <el-table
        :data="tags"
        style="width: 100%"
      >
        <el-table-column prop="name" label="标签名称" min-width="200" />
        
        <el-table-column prop="slug" label="别名" min-width="200">
          <template #default="{ row }">
            {{ row.slug || '-' }}
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

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新建/编辑标签对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑标签' : '新建标签'"
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
            placeholder="请输入标签名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="别名" prop="slug">
          <el-input
            v-model="formData.slug"
            placeholder="请输入标签别名，用于URL"
            maxlength="50"
            show-word-limit
          >
            <template #prefix>/tags/</template>
          </el-input>
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
import { postApi } from '@/api'
import { formatDate } from '@/utils/format'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const tags = ref([])
const formRef = ref()

// 分页相关
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 表单数据
const formData = ref({
  name: '',
  slug: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度应在2-50个字符之间', trigger: 'blur' }
  ],
  slug: [
    { pattern: /^[a-z0-9-]+$/, message: '别名只能包含小写字母、数字和连字符', trigger: 'blur' }
  ]
}

// 获取标签列表
const fetchTags = async () => {
  try {
    loading.value = true
    const { data, total: totalCount } = await postApi.getTags({
      page: page.value,
      size: pageSize.value
    })
    tags.value = data
    total.value = totalCount
  } catch (error: any) {
    ElMessage.error(error.message || '获取标签列表失败')
  } finally {
    loading.value = false
  }
}

// 新建标签
const handleAdd = () => {
  isEdit.value = false
  formData.value = {
    name: '',
    slug: ''
  }
  dialogVisible.value = true
}

// 编辑标签
const handleEdit = (row: any) => {
  isEdit.value = true
  formData.value = { ...row }
  dialogVisible.value = true
}

// 删除标签
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '删除标签后，该标签将从所有文章中移除，确定要删除吗？',
      '提示',
      {
        type: 'warning'
      }
    )

    await postApi.deleteTag(row.id)
    ElMessage.success('删除成功')
    fetchTags()
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
      await postApi.updateTag(formData.value.id, formData.value)
      ElMessage.success('更新成功')
    } else {
      await postApi.createTag(formData.value)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchTags()
  } catch (error: any) {
    ElMessage.error(error.message || (isEdit.value ? '更新失败' : '创建失败'))
  } finally {
    submitting.value = false
  }
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
  fetchTags()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  fetchTags()
}

onMounted(() => {
  fetchTags()
})
</script>

<style scoped>
.tag-list {
  @apply p-6;
}

:deep(.el-card) {
  @apply !border-none dark:!bg-gray-800;
}

:deep(.el-table) {
  @apply !bg-transparent;
}

:deep(.el-table__row) {
  @apply dark:!bg-gray-800 dark:hover:!bg-gray-700;
}

:deep(.el-table__header) {
  @apply dark:!bg-gray-700;
}

:deep(.el-table__cell) {
  @apply dark:!text-gray-300 dark:!border-gray-700;
}

:deep(.el-dialog) {
  @apply dark:!bg-gray-800;
}

:deep(.el-dialog__header) {
  @apply dark:!text-gray-300;
}
</style> 