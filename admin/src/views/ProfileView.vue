<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <!-- 个人信息卡片 -->
      <el-col :span="8">
        <el-card class="profile-card">
          <div class="avatar-container">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="uploadAvatar"
            >
              <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">点击上传头像</div>
          </div>
          
          <div class="info-container">
            <h2 class="nickname">{{ userInfo.nickname }}</h2>
            <p class="username">@{{ userInfo.username }}</p>
            <p class="email">{{ userInfo.email }}</p>
          </div>
          
          <div class="stats-container">
            <div class="stat-item">
              <div class="value">{{ userInfo.posts || 0 }}</div>
              <div class="label">文章</div>
            </div>
            <div class="stat-item">
              <div class="value">{{ userInfo.comments || 0 }}</div>
              <div class="label">评论</div>
            </div>
            <div class="stat-item">
              <div class="value">{{ userInfo.likes || 0 }}</div>
              <div class="label">获赞</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 编辑资料表单 -->
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>编辑资料</span>
            </div>
          </template>
          
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" disabled />
              <span class="form-tip">用户名不可修改</span>
            </el-form-item>
            
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname" placeholder="请输入昵称" />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
            
            <el-form-item label="个人简介" prop="bio">
              <el-input
                v-model="form.bio"
                type="textarea"
                :rows="4"
                placeholder="请输入个人简介"
              />
            </el-form-item>
            
            <el-form-item label="GitHub" prop="github">
              <el-input v-model="form.github" placeholder="请输入GitHub主页地址" />
            </el-form-item>
            
            <el-form-item label="网站" prop="website">
              <el-input v-model="form.website" placeholder="请输入个人网站地址" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" :loading="submitting" @click="handleSubmit">
                保存修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        
        <!-- 修改密码卡片 -->
        <el-card class="password-card">
          <template #header>
            <div class="card-header">
              <span>修改密码</span>
            </div>
          </template>
          
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
          >
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入当前密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button
                type="primary"
                :loading="passwordSubmitting"
                @click="handlePasswordSubmit"
              >
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import type { FormInstance, UploadRequestOptions, FormRules } from 'element-plus'
import { uploadUserAvatar } from '@/api/user'

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const submitting = ref(false)
const passwordSubmitting = ref(false)

// 用户信息
const userInfo = ref({
  username: '',
  nickname: '',
  email: '',
  avatar: '',
  bio: '',
  github: '',
  website: '',
  posts: 0,
  comments: 0,
  likes: 0
})

// 编辑资料表单
const form = ref({
  username: '',
  nickname: '',
  email: '',
  bio: '',
  github: '',
  website: ''
})

// 修改密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
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
  bio: [
    { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
  ],
  github: [
    { pattern: /^https?:\/\/github\.com\/[\w-]+\/?$/, message: '请输入正确的GitHub主页地址', trigger: 'blur' }
  ],
  website: [
    { pattern: /^https?:\/\/\S+$/, message: '请输入正确的网站地址', trigger: 'blur' }
  ]
})

// 密码验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 头像上传前的验证
const beforeAvatarUpload = (file: File) => {
  const isImage = /^image\/(jpeg|png|gif)$/.test(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('头像只能是jpg、png、gif格式!')
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过2MB!')
  }

  return isImage && isLt2M
}

// 上传头像
const uploadAvatar = async (options: UploadRequestOptions) => {
  try {
    const formData = new FormData()
    formData.append('avatar', options.file)
    
    const res = await uploadUserAvatar(formData)
    if (res.data.code === 200) {
      userInfo.value.avatar = res.data.data
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error(res.data.message || '头像上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败')
  }
}

// 获取用户信息
const fetchUserInfo = async () => {
  // 实现获取用户信息的逻辑
}

// 提交资料修改
const handleSubmit = async () => {
  // 实现提交资料修改的逻辑
}

// 提交密码修改
const handlePasswordSubmit = async () => {
  // 实现提交密码修改的逻辑
}

// 初始化
onMounted(() => {
  fetchUserInfo()
})
</script>

<style lang="scss">
@use '@/styles/views/profile/index.scss';
</style> 