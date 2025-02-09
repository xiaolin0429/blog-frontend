<template>
  <div class="user-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-button
              type="danger"
              :icon="Delete"
              :disabled="!selectedUsers.length"
              @click="handleBatchDelete"
            >
              批量删除
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
              <el-option label="超级管理员" value="superadmin" />
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
            
            <el-button type="primary" :icon="Plus" @click="handleCreate">
              新建用户
          </el-button>
          </div>
        </div>
      </template>
      
      <!-- 用户列表 -->
      <el-table
        v-loading="loading"
        :data="users"
        style="width: 100%"
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
            <el-tag :type="row.role === 'superadmin' ? 'danger' : row.role === 'admin' ? 'warning' : 'info'">
              {{ 
                row.role === 'superadmin' ? '超级管理员' : 
                row.role === 'admin' ? '管理员' : 
                '普通用户' 
              }}
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
        <el-table-column prop="last_login" label="最后登录" width="180">
          <template #default="{ row }">
            {{ row.last_login ? new Date(row.last_login).toLocaleString() : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="date_joined" label="注册时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.date_joined).toLocaleString() }}
          </template>
        </el-table-column>
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
      
      <!-- 用户表单对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="form.id ? '编辑用户' : '新建用户'"
        width="500px"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username" v-if="!form.id">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="请输入昵称" />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          
          <el-form-item label="密码" prop="password" v-if="!form.id">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          
          <el-form-item label="角色" prop="role" v-if="form.id !== userStore.userInfo?.id">
            <el-select v-model="form.role" placeholder="请选择角色">
              <el-option label="超级管理员" value="superadmin" />
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
import { Delete, Search, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { User, UserQuery, UpdateUserParams, UserStatus, UserRole } from '@/types/user'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  resetUserPassword,
  deactivateUser,
  activateUser
} from '@/api/user'
import { useUserStore } from '@/store/modules/user'

const loading = ref(false)
const submitting = ref(false)
const users = ref<User[]>([])
const selectedUsers = ref<User[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = ref<UserQuery>({
  keyword: '',
  role: undefined,
  status: undefined,
  page: 1,
  size: 10
})

// 对话框相关
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

interface FormState {
  id?: number
  username?: string
  password?: string
  nickname?: string
  email?: string
  role?: UserRole
  status?: UserStatus
  is_active?: boolean
  is_staff?: boolean
  is_superuser?: boolean
}

const form = ref<FormState>({
  username: '',
  password: '',
  nickname: '',
  email: '',
  role: 'user'
})

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
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
}

const userStore = useUserStore()

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true
    const params = {
      ...searchForm.value,
      page: currentPage.value,
      size: pageSize.value
    }
    const res = await getUsers(params)
    
    // 直接使用返回的数据
    users.value = res.data.results
    total.value = res.data.count
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
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
    status: undefined,
    page: 1,
    size: pageSize.value
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

// 处理创建
const handleCreate = () => {
  form.value = {
    username: '',
    password: '',
    nickname: '',
    email: '',
    role: 'user'
  }
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: User) => {
  form.value = {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    email: row.email,
    role: row.role,
    status: row.status
  }
  dialogVisible.value = true
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    const { id } = form.value
    const { role, username } = form.value
    const formData: Partial<UpdateUserParams> = {
      nickname: form.value.nickname,
      email: form.value.email,
      is_active: form.value.status === 'active',
      is_staff: form.value.role === 'admin',
      is_superuser: form.value.role === 'superadmin'
    }
    
    if (!id) {
      // 创建用户
      if (!username || !role || !form.value.password) {
        throw new Error('缺少必要参数')
      }
      await createUser({
        username,
        password: form.value.password,
        nickname: form.value.nickname || '',
        email: form.value.email || '',
        role
      })
      ElMessage.success('创建成功')
    } else {
      // 更新用户
      const updateData = {
        ...formData
      }
      
      // 如果是用户自己，去掉权限字段
      if (id === userStore.userInfo?.id) {
        delete updateData.is_active
        delete updateData.is_staff
        delete updateData.is_superuser
      }
      
      await updateUser(id, updateData)
      ElMessage.success('更新成功')
    }
    
    dialogVisible.value = false
    fetchUsers()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
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
    await deleteUser(row.id)
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
    await batchDeleteUsers(selectedUsers.value.map(user => user.id))
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
    
    if (row.status === 'active') {
      await deactivateUser(row.id)
      ElMessage.success('禁用成功')
    } else {
      await activateUser(row.id)
      ElMessage.success('启用成功')
    }
    
    fetchUsers()
  } catch {
    // 取消操作
  }
}

// 处理重置密码
const handleResetPassword = async (row: User) => {
  try {
    const { value: newPassword } = await ElMessageBox.prompt(
      '请输入新密码',
      '重置密码',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputValidator: (value) => {
          if (!value) {
            return '密码不能为空'
          }
          if (value.length < 6 || value.length > 20) {
            return '密码长度必须在6-20个字符之间'
          }
          if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(value)) {
            return '密码必须包含字母和数字'
          }
          return true
        }
      }
    )
    
    if (newPassword) {
      await resetUserPassword(row.id, newPassword)
      ElMessage.success('密码重置成功')
    }
  } catch {
    // 取消操作
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style lang="scss">
@use '@/styles/views/system/user-list.scss';
</style> 