<template>
  <div class="about-container">
    <el-card>
      <template #header>
        <h2>关于我</h2>
      </template>
      
      <div class="about-content">
        <!-- 关于页面内容 -->
        <el-skeleton :rows="10" animated v-if="loading" />
        <div v-else>
          <div class="profile-section">
            <el-avatar :size="100" src="https://placeholder.co/100" />
            <h3>{{ profileData.nickname }}</h3>
            <p class="bio">{{ profileData.bio }}</p>
          </div>
          
          <div class="contact-section">
            <h4>联系方式</h4>
            <ul class="contact-list">
              <li v-for="(contact, index) in profileData.contacts" :key="index">
                <el-icon><component :is="contact.icon" /></el-icon>
                <span>{{ contact.label }}：{{ contact.value }}</span>
              </li>
            </ul>
          </div>
          
          <div class="site-section">
            <h4>关于本站</h4>
            <p>{{ profileData.aboutSite }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Message, Link } from '@element-plus/icons-vue'

const loading = ref(true)

// 使用静态数据，后续可以改为API获取
const profileData = ref({
  nickname: '博主昵称',
  bio: '这里是博主的个人简介，可以介绍自己的职业、兴趣爱好等信息。',
  contacts: [
    { icon: 'Message', label: '邮箱', value: 'example@example.com' },
    { icon: 'Link', label: 'GitHub', value: 'https://github.com/example' }
  ],
  aboutSite: '本站是一个基于 Vue 3 + TypeScript + Element Plus 开发的个人博客系统。主要用于分享技术文章、生活随笔等内容。'
})

onMounted(() => {
  // 模拟API请求延迟
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.about-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.about-content {
  line-height: 1.8;
}

.profile-section {
  text-align: center;
  margin-bottom: 40px;
  
  .el-avatar {
    margin-bottom: 20px;
  }
  
  h3 {
    margin: 0 0 10px;
    color: #303133;
  }
  
  .bio {
    color: #606266;
    margin: 0;
  }
}

.contact-section,
.site-section {
  margin-top: 40px;
  
  h4 {
    margin: 0 0 20px;
    color: #303133;
    font-size: 18px;
  }
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    color: #606266;
    
    .el-icon {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style> 