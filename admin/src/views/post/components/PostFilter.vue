<template>
  <div class="post-filter">
    <el-form :model="modelValue" inline>
      <el-form-item label="分类">
        <el-select
          v-model="modelValue.category"
          placeholder="选择分类"
          clearable
          class="w-52"
          value-key="id"
        >
          <template v-for="category in categories" :key="category.id">
            <!-- 顶级分类 -->
            <el-option
              :value="category.id"
              :label="category.name"
              class="parent-category"
            >
              <div class="category-item">
                <el-icon 
                  v-if="category.children?.length"
                  class="expand-icon"
                  @click.stop="categoryStates.get(category.id).showChildren = !categoryStates.get(category.id).showChildren"
                >
                  <ArrowRight :class="{ 'is-expand': categoryStates.get(category.id)?.showChildren }" />
                </el-icon>
                <span>{{ category.name }}</span>
              </div>
            </el-option>
            <!-- 子分类和孙分类 -->
            <template v-if="categoryStates.get(category.id)?.showChildren && category.children?.length">
              <template v-for="child in category.children" :key="child.id">
                <el-option
                  :value="child.id"
                  :label="child.name"
                  class="child-category"
                >
                  <div class="category-item">
                    <el-icon 
                      v-if="child.children?.length"
                      class="expand-icon"
                      @click.stop="categoryStates.get(child.id).showChildren = !categoryStates.get(child.id).showChildren"
                    >
                      <ArrowRight :class="{ 'is-expand': categoryStates.get(child.id)?.showChildren }" />
                    </el-icon>
                    <span>{{ child.name }}</span>
                  </div>
                </el-option>
                <!-- 孙分类 -->
                <template v-if="categoryStates.get(child.id)?.showChildren && child.children?.length">
                  <el-option
                    v-for="grandChild in child.children"
                    :key="grandChild.id"
                    :value="grandChild.id"
                    :label="grandChild.name"
                    class="grandchild-category"
                  >
                    <div class="category-item">
                      <span>{{ grandChild.name }}</span>
                    </div>
                  </el-option>
                </template>
              </template>
            </template>
          </template>
        </el-select>
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
import { ref, computed, watch, onMounted } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import type { PostQuery } from '@/types/api'
import type { Category, Tag } from '@/types/post'
import type { CascaderOption } from 'element-plus'

const props = defineProps<{
  modelValue: PostQuery
  categories: Category[]
  tags: Tag[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PostQuery): void
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const categoryStates = ref(new Map())

// 初始化分类状态的函数
const initCategoryStates = () => {
  props.categories.forEach(category => {
    if (!categoryStates.value.has(category.id)) {
      categoryStates.value.set(category.id, { showChildren: false })
    }
    if (category.children) {
      category.children.forEach(child => {
        if (!categoryStates.value.has(child.id)) {
          categoryStates.value.set(child.id, { showChildren: false })
        }
        if (child.children) {
          child.children.forEach(grandChild => {
            if (!categoryStates.value.has(grandChild.id)) {
              categoryStates.value.set(grandChild.id, { showChildren: false })
            }
          })
        }
      })
    }
  })
}

// 监听 categories 的变化，重新初始化状态
watch(() => props.categories, () => {
  initCategoryStates()
}, { immediate: true })

// 组件挂载时初始化状态
onMounted(() => {
  initCategoryStates()
})

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

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  position: relative;

  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.parent-category {
  .category-item {
    padding-left: 24px;

    .expand-icon {
      left: 4px;
    }
  }
}

.child-category {
  .category-item {
    padding-left: 44px;

    .expand-icon {
      left: 24px;
    }
  }
}

.grandchild-category {
  .category-item {
    padding-left: 64px;
  }
}

.expand-icon {
  cursor: pointer;
  transition: transform 0.3s;
  position: absolute;

  &.is-expand {
    transform: rotate(90deg);
  }
}
</style> 