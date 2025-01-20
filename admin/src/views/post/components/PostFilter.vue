<template>
  <div class="post-filter">
    <el-form :model="filterModel" inline>
      <el-form-item label="分类">
        <el-select
          v-model="filterModel.category"
          placeholder="选择分类"
          clearable
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          v-model="filterModel.tag"
          placeholder="选择标签"
          clearable
        >
          <el-option
            v-for="item in tags"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="filterModel.status"
          placeholder="选择状态"
          clearable
        >
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
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
      <el-form-item label="排序">
        <el-select
          v-model="filterModel.ordering"
          placeholder="选择排序"
          clearable
        >
          <el-option label="创建时间降序" value="-created_at" />
          <el-option label="创建时间升序" value="created_at" />
          <el-option label="更新时间降序" value="-updated_at" />
          <el-option label="更新时间升序" value="updated_at" />
          <el-option label="浏览量降序" value="-view_count" />
          <el-option label="浏览量升序" value="view_count" />
          <el-option label="点赞数降序" value="-like_count" />
          <el-option label="点赞数升序" value="like_count" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Category, Tag } from '@/types/store'
import type { PostQuery } from '@/types/api'

const props = defineProps<{
  modelValue: PostQuery
  categories: Category[]
  tags: Tag[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PostQuery): void
}>()

const filterModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const dateRange = ref<[string, string] | null>(null)

// 监听日期范围变化
const handleDateChange = (val: [string, string] | null) => {
  if (val) {
    filterModel.value.startDate = val[0]
    filterModel.value.endDate = val[1]
  } else {
    filterModel.value.startDate = ''
    filterModel.value.endDate = ''
  }
}

// 监听 modelValue 变化，同步日期范围
watch(
  () => [props.modelValue.startDate, props.modelValue.endDate],
  ([start, end]) => {
    if (start && end) {
      dateRange.value = [start, end]
    } else {
      dateRange.value = null
    }
  },
  { immediate: true }
)
</script>

<style lang="scss">
@forward '@/styles/views/post/post-filter';
</style> 