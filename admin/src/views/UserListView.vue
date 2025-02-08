<template>
  <div class="user-manage-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="left">
            <el-button
              type="danger"
              :disabled="!selectedUsers.length"
              @click="handleBatchDelete"
            >
              <el-icon><Delete /></el-icon>批量删除
            </el-button>
          </div>
          
          <div class="right">
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索用户名/昵称/邮箱"
              clearable
              class="search-input"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            
            <el-select
              v-model="searchForm.role"
              placeholder="用户角色"
              clearable
              class="role-select"
            >
              <el-option label="管理员" value="admin" />
              <el-option label="普通用户" value="user" />
            </el-select>
            
            <el-select
              v-model="searchForm.status"
              placeholder="用户状态"
              clearable
              class="status-select"
            >
              <el-option label="正常" value="active" />
              <el-option label="禁用" value="disabled" />
            </el-select>
            
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
      </template>
      
      <!-- 用户列表 -->
      <el-table
        v-loading="loading"
        :data="users"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="32" :src="row.avatar" />
              <div class="info">
                <div class="nickname">{{ row.nickname }}</div>
                <div class="username">@{{ row.username }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginAt" label="最后登录" width="180" />
        <el-table-column prop="createdAt" label="注册时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                :type="row.status === 'active' ? 'warning' : 'success'"
                link
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
              <el-button
                type="primary"
                link
                @click="handleResetPassword(row)"
              >
                重置密码
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
      
      <!-- 编辑用户对话框 -->
      <el-dialog
        v-model="dialogVisible"
        title="编辑用户"
        width="500px"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" disabled />
          </el-form-item>
          
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="请输入昵称" />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择角色">
              <el-option label="管理员" value="admin" />
              <el-option label="普通用户" value="user" />
            </el-select>
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
import { Delete, Search } from '@element-plus/icons-vue'
import type { User } from '@/types/user'
import type { FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const submitting = ref(false)
const users = ref<User[]>([])
const selectedUsers = ref<User[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = ref({
  keyword: '',
  role: undefined as string | undefined,
  status: undefined as string | undefined
})

// 对话框相关
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const form = ref({
  id: undefined as number | undefined,
  username: '',
  nickname: '',
  email: '',
  role: 'user'
})

// 表单验证规则
const rules = ref<FormRules>({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
})

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true
    // TODO: 实现获取用户列表的逻辑
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    keyword: '',
    role: undefined,
    status: undefined
  }
  handleSearch()
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchUsers()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchUsers()
}

// 处理选择变化
const handleSelectionChange = (rows: User[]) => {
  selectedUsers.value = rows
}

// 处理编辑
const handleEdit = (row: User) => {
  form.value = {
    id: row.id,
    username: row.username,
    nickname: row.nickname || '',
    email: row.email || '',
    role: row.role
  }
  dialogVisible.value = true
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    // TODO: 实现更新用户的逻辑
    dialogVisible.value = false
    ElMessage.success('更新成功')
    fetchUsers()
  } catch (error) {
    console.error('更新用户失败:', error)
  } finally {
    submitting.value = false
  }
}

// 处理删除
const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该用户吗？此操作不可恢复',
      '提示',
      {
        type: 'warning'
      }
    )
    // TODO: 实现删除用户的逻辑
    ElMessage.success('删除成功')
    fetchUsers()
  } catch {
    // 取消删除
  }
}

// 处理批量删除
const handleBatchDelete = async () => {
  if (!selectedUsers.value.length) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？此操作不可恢复`,
      '提示',
      {
        type: 'warning'
      }
    )
    // TODO: 实现批量删除用户的逻辑
    ElMessage.success('批量删除成功')
    fetchUsers()
  } catch {
    // 取消删除
  }
}

// 处理切换状态
const handleToggleStatus = async (row: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 'active' ? '禁用' : '启用'}该用户吗？`,
      '提示',
      {
        type: 'warning'
      }
    )
    // TODO: 实现切换用户状态的逻辑
    ElMessage.success(`${row.status === 'active' ? '禁用' : '启用'}成功`)
    fetchUsers()
  } catch {
    // 取消操作
  }
}

// 处理重置密码
const handleResetPassword = async (row: User) => {
  try {
    await ElMessageBox.confirm(
      '确定要重置该用户的密码吗？',
      '提示',
      {
        type: 'warning'
      }
    )
    // TODO: 实现重置密码的逻辑
    ElMessage.success('密码重置成功')
  } catch {
    // 取消操作
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style lang="scss">
@import '@/styles/views/user/user-list.scss';
</style> 