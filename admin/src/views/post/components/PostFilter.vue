<template>
  <div class="post-filter">
    <el-form :model="modelValue" inline>
      <el-form-item label="分类">
        <el-tree-select
          v-model="modelValue.category"
          :data="formatCategories"
          placeholder="选择分类"
          clearable
          class="w-52"
          check-strictly
          node-key="value"
          :render-after-expand="false"
          :props="{
            label: 'label',
            children: 'children',
            value: 'value'
          }"
        />
      </el-form-item>
      
      <el-form-item label="标签">
        <el-select
          v-model="modelValue.tags"
          placeholder="选择标签"
          clearable
          class="w-52"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="状态">
        <el-select
          v-model="modelValue.status"
          placeholder="选择状态"
          clearable
          class="w-32"
        >
          <el-option label="草稿" value="draft" />
          <el-option label="已发布" value="published" />
          <el-option label="私密" value="private" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Category, Tag } from '@/types/post'

const props = defineProps<{
  modelValue: {
    category?: number
    tags?: number[]
    status?: string
    date_start?: string
    date_end?: string
  }
  categories?: Category[]
  tags?: Tag[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

// 格式化分类数据为树形结构
const formatCategories = computed(() => {
  const formatCategoryNode = (category: any) => ({
    value: category.id,
    label: category.name,
    children: category.children?.map(formatCategoryNode) || undefined
  })
  
  return props.categories?.map(formatCategoryNode) || []
})

// 日期范围
const dateRange = ref<string[]>([])

// 处理日期变化
const handleDateChange = (val: string[] | null) => {
  if (val && val.length === 2) {
    emit('update:modelValue', {
      ...props.modelValue,
      date_start: val[0],
      date_end: val[1]
    })
  } else {
    emit('update:modelValue', {
      ...props.modelValue,
      date_start: undefined,
      date_end: undefined
    })
  }
}
</script>

<style lang="scss" scoped>
.post-filter {
  padding: 16px;
  background-color: var(--el-bg-color);
  border-radius: 4px;
  
  :deep(.el-form--inline .el-form-item) {
    margin-right: 32px;
    margin-bottom: 0;
  }
}
</style> 