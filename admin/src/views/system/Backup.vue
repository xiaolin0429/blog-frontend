<template>
  <div class="backup-container">
    <!-- 备份列表 -->
    <el-card class="backup-list">
      <template #header>
        <div class="card-header">
          <span>备份管理</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleCreateBackup" :loading="creating">
              <el-icon><Plus /></el-icon>创建备份
            </el-button>
          </div>
        </div>
      </template>

      <!-- 筛选条件 -->
      <div class="filter-container">
        <el-form :inline="true" :model="queryParams" class="filter-form">
          <el-form-item label="备份类型">
            <el-select v-model="queryParams.backup_type" placeholder="全部" clearable>
              <el-option label="完整备份" value="full" />
              <el-option label="数据库备份" value="db" />
              <el-option label="文件备份" value="files" />
              <el-option label="设置备份" value="settings" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="备份状态">
            <el-select v-model="queryParams.status" placeholder="全部" clearable>
              <el-option label="等待中" value="pending" />
              <el-option label="进行中" value="running" />
              <el-option label="已完成" value="completed" />
              <el-option label="失败" value="failed" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="备份时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="dateShortcuts"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 备份列表表格 -->
      <el-table
        v-loading="loading"
        :data="backupList"
        style="width: 100%"
      >
        <el-table-column prop="name" label="备份名称" min-width="200">
          <template #default="{ row }">
            <div class="backup-name">
              <el-icon><Document /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="backup_type_display" label="备份类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getBackupTypeTag(row.backup_type)">
              {{ row.backup_type_display }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status_display" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ row.status_display }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="file_size" label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.file_size) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="completed_at" label="完成时间" width="180">
          <template #default="{ row }">
            {{ row.completed_at ? formatDate(row.completed_at) : '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                type="primary"
                link
                :disabled="row.status !== 'completed'"
                @click="handleDownload(row)"
              >
                下载
              </el-button>
              <el-button
                type="warning"
                link
                :disabled="row.status !== 'completed'"
                @click="handleRestore(row)"
              >
                恢复
              </el-button>
              <el-button
                type="danger"
                link
                :disabled="row.status === 'running'"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.page_size"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 备份配置 -->
    <el-card class="backup-config">
      <template #header>
        <div class="card-header">
          <span>备份配置</span>
          <el-button type="primary" @click="handleSaveConfig" :loading="saving">
            保存配置
          </el-button>
        </div>
      </template>

      <el-form
        ref="configFormRef"
        :model="configForm"
        :rules="configRules"
        label-width="120px"
      >
        <el-form-item label="启用自动备份" prop="enabled">
          <el-switch v-model="configForm.enabled" />
        </el-form-item>

        <el-form-item label="备份类型" prop="backup_type">
          <el-select v-model="configForm.backup_type" placeholder="请选择备份类型">
            <el-option label="完整备份" value="full" />
            <el-option label="数据库备份" value="db" />
            <el-option label="文件备份" value="files" />
            <el-option label="设置备份" value="settings" />
          </el-select>
        </el-form-item>

        <el-form-item label="备份频率" prop="frequency">
          <el-select v-model="configForm.frequency" placeholder="请选择备份频率">
            <el-option label="每天" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </el-form-item>

        <el-form-item label="备份时间" prop="backup_time">
          <el-time-picker
            v-model="configForm.backup_time"
            format="HH:mm:ss"
            placeholder="选择时间"
            value-format="HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="保留天数" prop="retention_days">
          <el-input-number
            v-model="configForm.retention_days"
            :min="1"
            :max="365"
            placeholder="请输入保留天数"
          />
          <span class="form-tip">天</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleTestConfig">
            测试配置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 创建备份对话框 -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建备份"
      width="500px"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="100px"
      >
        <el-form-item label="备份名称" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入备份名称" />
        </el-form-item>

        <el-form-item label="备份类型" prop="backup_type">
          <el-select v-model="createForm.backup_type" placeholder="请选择备份类型">
            <el-option label="完整备份" value="full" />
            <el-option label="数据库备份" value="db" />
            <el-option label="文件备份" value="files" />
            <el-option label="设置备份" value="settings" />
          </el-select>
        </el-form-item>

        <el-form-item label="备份描述" prop="description">
          <el-input
            v-model="createForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入备份描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCreateBackup" :loading="creating">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Document,
  Download,
  RefreshRight
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Backup, BackupConfig, BackupQuery, CreateBackupRequest, UpdateBackupConfigRequest } from '@/types/backup'
import {
  getBackups,
  createBackup,
  deleteBackup,
  restoreBackup,
  getBackupConfigs,
  updateBackupConfig,
  testBackupConfig
} from '@/api/backup'
import dayjs from 'dayjs'

// 查询参数
const queryParams = ref<BackupQuery>({
  page: 1,
  page_size: 10,
  backup_type: undefined,
  status: undefined,
  is_auto: undefined,
  start_date: '',
  end_date: ''
})

// 日期范围
const dateRange = ref()
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 列表数据
const loading = ref(false)
const backupList = ref<Backup[]>([])
const total = ref(0)

// 创建备份相关
const creating = ref(false)
const createDialogVisible = ref(false)
const createFormRef = ref<FormInstance>()
const createForm = ref<CreateBackupRequest>({
  name: '',
  backup_type: 'full',
  description: ''
})

const createRules: FormRules = {
  name: [
    { required: true, message: '请输入备份名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  backup_type: [
    { required: true, message: '请选择备份类型', trigger: 'change' }
  ]
}

// 备份配置相关
const saving = ref(false)
const configFormRef = ref<FormInstance>()
const configForm = ref<UpdateBackupConfigRequest>({
  enabled: false,
  backup_type: 'full',
  frequency: 'daily',
  backup_time: '02:00:00',
  retention_days: 30
})

const configRules: FormRules = {
  backup_type: [
    { required: true, message: '请选择备份类型', trigger: 'change' }
  ],
  frequency: [
    { required: true, message: '请选择备份频率', trigger: 'change' }
  ],
  backup_time: [
    { required: true, message: '请选择备份时间', trigger: 'change' }
  ],
  retention_days: [
    { required: true, message: '请输入保留天数', trigger: 'blur' },
    { type: 'number', min: 1, max: 365, message: '保留天数必须在1-365之间', trigger: 'blur' }
  ]
}

// 获取备份列表
const fetchBackupList = async () => {
  try {
    loading.value = true
    const response = await getBackups(queryParams.value)
    backupList.value = response.data?.results || []
    total.value = response.data?.count || 0
  } catch (error) {
    console.error('获取备份列表失败:', error)
    ElMessage.error('获取备份列表失败')
  } finally {
    loading.value = false
  }
}

// 获取备份配置
const fetchBackupConfig = async () => {
  try {
    const response = await getBackupConfigs()
    const configs = response.data?.results || []
    if (configs.length > 0) {
      const config = configs[0]
      configForm.value = {
        enabled: config.enabled,
        backup_type: config.backup_type,
        frequency: config.frequency,
        backup_time: config.backup_time,
        retention_days: config.retention_days
      }
    }
  } catch (error) {
    console.error('获取备份配置失败:', error)
    ElMessage.error('获取备份配置失败')
  }
}

// 处理日期变化
const handleDateChange = (val: any) => {
  if (val) {
    queryParams.value.start_date = dayjs(val[0]).format('YYYY-MM-DD')
    queryParams.value.end_date = dayjs(val[1]).format('YYYY-MM-DD')
  } else {
    queryParams.value.start_date = undefined
    queryParams.value.end_date = undefined
  }
}

// 处理搜索
const handleSearch = () => {
  queryParams.value.page = 1
  fetchBackupList()
}

// 处理重置
const handleReset = () => {
  queryParams.value = {
    page: 1,
    page_size: 10,
    backup_type: undefined,
    status: undefined,
    is_auto: undefined,
    start_date: undefined,
    end_date: undefined
  }
  dateRange.value = null
  fetchBackupList()
}

// 处理分页
const handleSizeChange = (val: number) => {
  queryParams.value.page_size = val
  fetchBackupList()
}

const handleCurrentChange = (val: number) => {
  queryParams.value.page = val
  fetchBackupList()
}

// 处理创建备份
const handleCreateBackup = () => {
  createForm.value = {
    name: `手动备份_${dayjs().format('YYYYMMDD_HHmmss')}`,
    backup_type: 'full',
    description: ''
  }
  createDialogVisible.value = true
}

// 提交创建备份
const submitCreateBackup = async () => {
  if (!createFormRef.value) return
  
  try {
    await createFormRef.value.validate()
    creating.value = true
    
    const response = await createBackup(createForm.value)
    if (response.status === 200) {
      ElMessage.success('创建备份任务成功')
      createDialogVisible.value = false
      fetchBackupList()
    } else {
      ElMessage.error(response.data.message || '创建备份任务失败')
    }
  } catch (error) {
    console.error('创建备份任务失败:', error)
    ElMessage.error('创建备份任务失败')
  } finally {
    creating.value = false
  }
}

// 处理下载备份
const handleDownload = async (row: any) => {
  try {
    window.open(`/api/v1/backup/backups/${row.id}/download/`)
  } catch (error) {
    console.error('下载备份失败:', error)
    ElMessage.error('下载备份失败')
  }
}

// 处理恢复备份
const handleRestore = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '确定要恢复此备份吗？恢复过程中系统将暂时无法使用。',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await restoreBackup(row.id)
    if (response.status === 200) {
      ElMessage.success('备份恢复成功')
      fetchBackupList()
    } else {
      ElMessage.error(response.data.message || '备份恢复失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('备份恢复失败:', error)
      ElMessage.error('备份恢复失败')
    }
  }
}

// 处理删除备份
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除此备份吗？此操作不可恢复。',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await deleteBackup(row.id)
    if (response.status === 200) {
      ElMessage.success('删除备份成功')
      fetchBackupList()
    } else {
      ElMessage.error(response.data.message || '删除备份失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除备份失败:', error)
      ElMessage.error('删除备份失败')
    }
  }
}

// 处理保存配置
const handleSaveConfig = async () => {
  if (!configFormRef.value) return
  
  try {
    await configFormRef.value.validate()
    saving.value = true
    
    const response = await updateBackupConfig(1, configForm.value)
    if (response.status === 200) {
      ElMessage.success('保存配置成功')
    } else {
      ElMessage.error(response.data.message || '保存配置失败')
    }
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error('保存配置失败')
  } finally {
    saving.value = false
  }
}

// 处理测试配置
const handleTestConfig = async () => {
  try {
    const response = await testBackupConfig(1)
    if (response.status === 200) {
      ElMessage.success('测试备份已启动')
    } else {
      ElMessage.error(response.data.message || '测试备份失败')
    }
  } catch (error) {
    console.error('测试备份失败:', error)
    ElMessage.error('测试备份失败')
  }
}

// 工具函数
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const formatFileSize = (size: number) => {
  if (!size) return '-'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  return `${size.toFixed(2)} ${units[index]}`
}

const getBackupTypeTag = (type: string): 'success' | 'warning' | 'info' | undefined => {
  const types: Record<string, 'success' | 'warning' | 'info' | undefined> = {
    full: 'success',
    db: 'warning',
    files: 'info',
    settings: undefined
  }
  return types[type]
}

const getStatusTag = (status: string): 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const statuses: Record<string, 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    pending: 'info',
    running: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return statuses[status] || 'info'
}

onMounted(() => {
  fetchBackupList()
  fetchBackupConfig()
})
</script>

<style lang="scss">
.backup-container {
  .backup-list {
    margin-bottom: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .filter-container {
    margin-bottom: 20px;
    
    .filter-form {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
  
  .backup-name {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .form-tip {
    margin-left: 8px;
    color: var(--el-text-color-secondary);
  }
  
  .backup-config {
    .el-form {
      max-width: 600px;
    }
  }
}
</style> 