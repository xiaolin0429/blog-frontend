<template>
  <div class="post-filter">
    <el-form :model="modelValue" inline>
      <el-form-item label="分类">
        <el-cascader
          v-model="modelValue.category"
          :options="formatCategories"
          :props="{
            expandTrigger: 'hover',
            checkStrictly: true,
            emitPath: false,
            multiple: false
          }"
          placeholder="选择分类"
          clearable
          class="w-52"
        />
      </el-form-item>
      
      <el-form-item label="标签">
        <el-select
          v-model="modelValue.tag"
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
import type { PostQuery } from '@/types/api'

const props = defineProps<{
  modelValue: PostQuery
  categories: Category[]
  tags: Tag[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PostQuery): void
}>()

// 格式化分类数据，只使用根分类及其子分类
const formatCategories = computed(() => {
  if (!props.categories) return []
  
  // 只返回顶级分类（parent 为 null 的分类）及其子分类
  return props.categories
    .filter(category => category.parent === null)
    .map(category => {
      const node = {
        value: category.id,
        label: category.name,
        children: undefined as any[] | undefined
      }
      
      if (category.children && category.children.length > 0) {
        node.children = category.children.map(child => {
          const childNode = {
            value: child.id,
            label: child.name,
            children: undefined as any[] | undefined
          }
          
          if (child.children && child.children.length > 0) {
            childNode.children = child.children.map(grandChild => ({
              value: grandChild.id,
              label: grandChild.name
            }))
          }
          
          return childNode
        })
      }
      
      return node
    })
})

// 日期范围
const dateRange = ref<string[]>([])

// 处理日期变化
const handleDateChange = (val: string[] | null) => {
  if (val && val.length === 2) {
    emit('update:modelValue', {
      ...props.modelValue,
      startDate: val[0],
      endDate: val[1]
    })
  } else {
    emit('update:modelValue', {
      ...props.modelValue,
      startDate: undefined,
      endDate: undefined
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