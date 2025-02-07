<template>
  <el-dialog
    :title="form.id ? '编辑分类' : (props.parentCategory ? '添加子分类' : '新建分类')"
    v-model="dialogVisible"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="category-form"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="请输入分类描述"
        />
      </el-form-item>
      <el-form-item v-if="!props.parentCategory" label="父分类" prop="parent">
        <el-select
          v-model="form.parent"
          placeholder="请选择父分类"
          clearable
          filterable
        >
          <el-option
            v-for="item in availableCategories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="form.id === item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { Category, CreateCategoryRequest } from '@/types/category'
import { createCategory, updateCategory } from '@/api/category'

const props = defineProps<{
  visible: boolean
  categories: Category[]
  editData?: Category
  parentCategory?: Category
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const formRef = ref<FormInstance>()
const loading = ref(false)

const dialogVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val)
})

const form = reactive<CreateCategoryRequest & { id?: number }>({
  name: '',
  description: '',
  parent: undefined,
  order: 0
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 定义重置表单函数
const resetForm = () => {
  form.id = undefined
  form.name = ''
  form.description = ''
  form.parent = undefined
  form.order = 0
}

// 处理关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 如果是通过"添加子分类"按钮打开，设置父分类ID
        if (props.parentCategory && !form.id) {
          form.parent = props.parentCategory.id
        }

        if (form.id) {
          await updateCategory(form.id, form)
          ElMessage.success('更新成功')
        } else {
          await createCategory(form)
          ElMessage.success('创建成功')
        }
        emit('success')
        handleClose()
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 计算可用的父分类列表（排除当前分类及其子分类）
const availableCategories = computed(() => {
  if (props.parentCategory) {
    // 如果是通过"添加子分类"按钮打开，则不显示任何选项
    return []
  }
  
  if (!form.id) {
    // 创建新分类时，显示所有分类
    return props.categories
  }

  // 编辑分类时，需要排除当前分类及其所有子分类
  const findChildrenIds = (categoryId: number): number[] => {
    const children: number[] = []
    const findChildren = (id: number) => {
      props.categories.forEach(category => {
        if (category.parent === id) {
          children.push(category.id)
          findChildren(category.id)
        }
      })
    }
    findChildren(categoryId)
    return children
  }

  const excludeIds = [form.id, ...findChildrenIds(form.id)]
  return props.categories.filter(category => !excludeIds.includes(category.id))
})

// 监听编辑数据变化
watch(
  () => props.editData,
  (newVal: Category | undefined) => {
    if (newVal) {
      Object.assign(form, newVal)
    } else {
      resetForm()
      // 如果有父分类，则设置父分类ID
      if (props.parentCategory) {
        form.parent = props.parentCategory.id
      }
    }
  },
  { immediate: true }
)

// 暴露给父组件
defineExpose({
  form
})
</script>

<style scoped>
.category-form {
  padding: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 