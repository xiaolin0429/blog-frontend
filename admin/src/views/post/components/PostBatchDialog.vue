<template>
  <div>
    <!-- 批量设置分类对话框 -->
    <el-dialog
      v-model="categoryDialog.visible"
      title="设置分类"
      width="400px"
      destroy-on-close
    >
      <el-form :model="categoryDialog.form">
        <el-form-item label="选择分类">
          <el-cascader
            v-model="categoryDialog.form.category"
            :options="categoryOptions"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              emitPath: false
            }"
            :show-all-levels="false"
            placeholder="选择分类"
            class="full-width"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSetCategory" :loading="categoryDialog.loading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量设置标签对话框 -->
    <el-dialog
      v-model="tagDialog.visible"
      title="设置标签"
      width="400px"
      destroy-on-close
    >
      <el-form :model="tagDialog.form">
        <el-form-item label="选择标签">
          <el-select
            v-model="tagDialog.form.tags"
            multiple
            placeholder="选择标签"
            class="full-width"
          >
            <el-option
              v-for="item in tags"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="tagDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSetTags" :loading="tagDialog.loading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { Category, Tag } from '@/types/post'
import type { CascaderOption } from 'element-plus'

const props = defineProps<{
  categories: Category[]
  tags: Tag[]
}>()

const emit = defineEmits<{
  (e: 'set-category', categoryId: number): void
  (e: 'set-tags', tagIds: number[]): void
}>()

// 将分类数据转换为 CascaderOption 类型
const categoryOptions = computed<CascaderOption[]>(() => {
  if (!props.categories) return []
  
  const convertToOption = (category: Category): CascaderOption => ({
    value: category.id,
    label: category.name,
    children: category.children?.map(convertToOption)
  })
  
  return props.categories.map(convertToOption)
})

// 批量设置分类对话框
const categoryDialog = ref({
  visible: false,
  loading: false,
  form: {
    category: undefined as number | undefined
  }
})

// 批量设置标签对话框
const tagDialog = ref({
  visible: false,
  loading: false,
  form: {
    tags: [] as number[],
  }
})

// 打开分类对话框
const openCategoryDialog = () => {
  categoryDialog.value.visible = true
  categoryDialog.value.form.category = undefined
}

// 打开标签对话框
const openTagDialog = () => {
  tagDialog.value.visible = true
  tagDialog.value.form.tags = []
}

// 处理设置分类
const handleSetCategory = async () => {
  if (!categoryDialog.value.form.category) {
    ElMessage.warning('请选择分类')
    return
  }

  try {
    categoryDialog.value.loading = true
    await emit('set-category', categoryDialog.value.form.category)
    categoryDialog.value.visible = false
  } finally {
    categoryDialog.value.loading = false
  }
}

// 处理设置标签
const handleSetTags = async () => {
  if (!tagDialog.value.form.tags.length) {
    ElMessage.warning('请选择标签')
    return
  }

  try {
    tagDialog.value.loading = true
    await emit('set-tags', tagDialog.value.form.tags)
    tagDialog.value.visible = false
  } finally {
    tagDialog.value.loading = false
  }
}

// 暴露方法给父组件
defineExpose({
  openCategoryDialog,
  openTagDialog
})
</script>

<style lang="scss">
@forward '@/styles/views/post/post-batch-dialog';
</style> 