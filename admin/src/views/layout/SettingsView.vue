<template>
  <div class="settings-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <!-- 基本设置 -->
        <div class="section-title">基本设置</div>
        <el-form-item label="网站标题" prop="siteTitle">
          <el-input v-model="form.siteTitle" placeholder="请输入网站标题" />
        </el-form-item>
        
        <el-form-item label="网站描述" prop="siteDescription">
          <el-input
            v-model="form.siteDescription"
            type="textarea"
            :rows="3"
            placeholder="请输入网站描述"
          />
        </el-form-item>
        
        <el-form-item label="网站关键词" prop="siteKeywords">
          <el-input
            v-model="form.siteKeywords"
            placeholder="请输入网站关键词，多个关键词用逗号分隔"
          />
        </el-form-item>
        
        <el-form-item label="网站Logo" prop="siteLogo">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeLogoUpload"
            :http-request="uploadLogo"
          >
            <img v-if="form.siteLogo" :src="form.siteLogo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：200x50px，支持 jpg、png、gif 格式</div>
        </el-form-item>
        
        <el-form-item label="网站图标" prop="siteFavicon">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeFaviconUpload"
            :http-request="uploadFavicon"
          >
            <img v-if="form.siteFavicon" :src="form.siteFavicon" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：32x32px，支持 ico、png 格式</div>
        </el-form-item>
        
        <!-- 评论设置 -->
        <div class="section-title">评论设置</div>
        <el-form-item label="评论审核" prop="commentAudit">
          <el-switch v-model="form.commentAudit" />
          <span class="form-tip">开启后，新评论需要审核后才能显示</span>
        </el-form-item>
        
        <el-form-item label="评论间隔" prop="commentInterval">
          <el-input-number
            v-model="form.commentInterval"
            :min="0"
            :max="3600"
          />
          <span class="form-tip">两次评论之间的最小间隔时间（秒），0 表示不限制</span>
        </el-form-item>
        
        <!-- 邮件设置 -->
        <div class="section-title">邮件设置</div>
        <el-form-item label="SMTP服务器" prop="smtpHost">
          <el-input v-model="form.smtpHost" placeholder="请输入SMTP服务器地址" />
        </el-form-item>
        
        <el-form-item label="SMTP端口" prop="smtpPort">
          <el-input-number v-model="form.smtpPort" :min="1" :max="65535" />
        </el-form-item>
        
        <el-form-item label="发件人邮箱" prop="smtpUsername">
          <el-input v-model="form.smtpUsername" placeholder="请输入发件人邮箱" />
        </el-form-item>
        
        <el-form-item label="邮箱密码" prop="smtpPassword">
          <el-input
            v-model="form.smtpPassword"
            type="password"
            placeholder="请输入邮箱密码或授权码"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            保存设置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, UploadRequestOptions, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const form = ref({
  siteTitle: '',
  siteDescription: '',
  siteKeywords: '',
  siteLogo: '',
  siteFavicon: '',
  commentAudit: false,
  commentInterval: 60,
  smtpHost: '',
  smtpPort: 465,
  smtpUsername: '',
  smtpPassword: ''
})

// 表单验证规则
const rules = ref<FormRules>({
  siteTitle: [
    { required: true, message: '请输入网站标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  siteDescription: [
    { required: true, message: '请输入网站描述', trigger: 'blur' },
    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
  ],
  smtpHost: [
    { required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }
  ],
  smtpPort: [
    { required: true, message: '请输入SMTP端口', trigger: 'blur' }
  ],
  smtpUsername: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  smtpPassword: [
    { required: true, message: '请输入邮箱密码或授权码', trigger: 'blur' }
  ]
})

// Logo上传前的验证
const beforeLogoUpload = (file: File) => {
  const isImage = /^image\/(jpeg|png|gif)$/.test(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('Logo只能是jpg、png、gif格式!')
  }
  if (!isLt2M) {
    ElMessage.error('Logo大小不能超过2MB!')
  }

  return isImage && isLt2M
}

// Favicon上传前的验证
const beforeFaviconUpload = (file: File) => {
  const isValid = /\.(ico|png)$/.test(file.name.toLowerCase())
  const isLt1M = file.size / 1024 / 1024 < 1

  if (!isValid) {
    ElMessage.error('图标只能是ico、png格式!')
  }
  if (!isLt1M) {
    ElMessage.error('图标大小不能超过1MB!')
  }

  return isValid && isLt1M
}

// 上传Logo
const uploadLogo = async (options: UploadRequestOptions) => {
  // 实现Logo上传逻辑
}

// 上传Favicon
const uploadFavicon = async (options: UploadRequestOptions) => {
  // 实现Favicon上传逻辑
}

// 获取设置
const fetchSettings = async () => {
  // 实现获取设置的逻辑
}

// 提交设置
const handleSubmit = async () => {
  // 实现提交设置的逻辑
}

// 初始化
onMounted(() => {
  fetchSettings()
})
</script>

<style lang="scss">
@use '@/styles/views/settings/index.scss';
</style> 