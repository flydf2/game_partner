<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { appealApi, handleApiError } from '../api/index.js'
import { useModal } from '../composables/useModal.js'

const router = useRouter()
const { success: showSuccess, error: showError, info: showInfo } = useModal()

const handleBack = () => {
  router.back()
}

const handleMenu = () => {
  router.push('/profile')
}

const handleNotifications = () => {
  router.push('/notifications')
}

const handleSearch = () => {
  router.push('/search')
}

const handleProfile = () => {
  router.push('/profile')
}

const activeTab = ref('all')
const appeals = ref([])
const loading = ref(false)
const error = ref(null)
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalCount: 0
})

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待处理' },
  { id: 'processing', label: '处理中' },
  { id: 'resolved', label: '已完成' },
  { id: 'rejected', label: '已拒绝' }
]

const statusTextMap = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已处理',
  rejected: '已拒绝'
}

const statusClassMap = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}

const priorityTextMap = {
  high: '紧急',
  normal: '普通',
  low: '低'
}

const priorityClassMap = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

const typeTextMap = {
  order: '订单问题',
  payment: '支付问题',
  service: '服务问题',
  other: '其他问题'
}

const typeIconMap = {
  order: 'receipt_long',
  payment: 'payments',
  service: 'support_agent',
  other: 'help'
}

const filteredAppeals = computed(() => {
  if (activeTab.value === 'all') {
    return appeals.value
  }
  return appeals.value.filter(appeal => appeal.status === activeTab.value)
})

const getStatusText = (status) => statusTextMap[status] || status
const getStatusClass = (status) => statusClassMap[status] || ''
const getPriorityText = (priority) => priorityTextMap[priority] || priority
const getPriorityClass = (priority) => priorityClassMap[priority] || ''
const getTypeText = (type) => typeTextMap[type] || type
const getTypeIcon = (type) => typeIconMap[type] || 'help'

const formatTime = (time) => {
  if (!time || time === '0001-01-01T00:00:00Z') return '未知'
  const date = new Date(time)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  return date.toLocaleDateString('zh-CN')
}

const formatDateTime = (time) => {
  if (!time || time === '0001-01-01T00:00:00Z') return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const parseImages = (imagesStr) => {
  if (!imagesStr) return []
  return imagesStr.split(',').filter(img => img.trim())
}

const loadAppeals = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await appealApi.getAppeals({ page: pagination.value.currentPage })
    if (response.code === 0 || response.success) {
      const responseData = response.data?.data || response.data || []
      appeals.value = responseData.map(appeal => ({
        ...appeal,
        statusText: getStatusText(appeal.status),
        statusClass: getStatusClass(appeal.status),
        priorityText: getPriorityText(appeal.priority),
        priorityClass: getPriorityClass(appeal.priority),
        typeText: getTypeText(appeal.type),
        typeIcon: getTypeIcon(appeal.type),
        images: parseImages(appeal.images),
        formattedCreatedAt: formatTime(appeal.createdAt),
        formattedUpdatedAt: formatDateTime(appeal.updatedAt),
        formattedHandledAt: formatDateTime(appeal.handledAt)
      }))
      pagination.value = response.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0
      }
    } else {
      throw new Error(response.message || response.msg || '获取申诉列表失败')
    }
  } catch (err) {
    error.value = err.message || '获取申诉列表失败'
    console.error('获取申诉列表失败:', err)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
  pagination.value.currentPage = 1
  loadAppeals()
}

const handleViewDetail = (appeal) => {
  router.push(`/appeal/${appeal.id}`)
}

const handleCreateAppeal = () => {
  showInfo('创建申诉功能开发中')
}

onMounted(() => {
  loadAppeals()
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-32">
    <AppHeader
      title="我的申诉"
      is-primary-page
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-24 pb-32 space-y-6">
      <div class="px-5 py-4 sticky top-16 bg-background z-40">
        <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="handleTabChange(tab.id)"
            :class="[
              'flex-none px-5 py-2 rounded-full font-headline text-sm transition-all',
              activeTab === tab.id
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant font-medium hover:bg-surface-container-high'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <span class="material-symbols-outlined text-4xl text-outline mb-4">error_outline</span>
        <p class="text-sm text-on-surface-variant mb-4">{{ error }}</p>
        <button
          @click="loadAppeals"
          class="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          重试
        </button>
      </div>

      <div v-else-if="filteredAppeals.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-outline text-5xl">assignment</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无申诉记录</h2>
        <p class="text-sm text-on-surface-variant">你还没有提交过任何申诉</p>
        <button
          @click="handleCreateAppeal"
          class="mt-6 px-8 py-3 bg-primary text-on-primary font-bold rounded-full shadow-lg active:scale-95 transition-transform"
        >
          提交申诉
        </button>
      </div>

      <div v-for="appeal in filteredAppeals" :key="appeal.id" class="bg-surface-container-lowest rounded-3xl p-5 shadow-sm mx-5">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-primary-container/50 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">
              {{ appeal.typeIcon }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-bold text-on-surface mb-1">{{ appeal.title }}</h3>
                <div class="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span>{{ appeal.typeText }}</span>
                  <span>•</span>
                  <span>订单 #{{ appeal.orderId }}</span>
                </div>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold', appeal.statusClass]">
                  {{ appeal.statusText }}
                </span>
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold', appeal.priorityClass]">
                  {{ appeal.priorityText }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-sm text-on-surface-variant mb-4 line-clamp-2">{{ appeal.content }}</p>

        <div v-if="appeal.images.length > 0" class="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
          <img
            v-for="(img, imgIndex) in appeal.images.slice(0, 4)"
            :key="imgIndex"
            :src="img.trim()"
            :alt="`附件 ${imgIndex + 1}`"
            class="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
          <div
            v-if="appeal.images.length > 4"
            class="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0"
          >
            <span class="text-sm text-on-surface-variant font-bold">+{{ appeal.images.length - 4 }}</span>
          </div>
        </div>

        <div v-if="appeal.response" class="bg-surface-container-high/50 rounded-xl p-3 mb-4">
          <div class="text-xs text-on-surface-variant mb-1">处理回复</div>
          <p class="text-sm text-on-surface">{{ appeal.response }}</p>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-outline/10">
          <div class="flex items-center gap-4 text-xs text-on-surface-variant">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">schedule</span>
              {{ appeal.formattedCreatedAt }}
            </span>
            <span v-if="appeal.contactInfo" class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">phone</span>
              {{ appeal.contactInfo }}
            </span>
          </div>

          <button
            @click="handleViewDetail(appeal)"
            class="text-sm font-bold text-primary flex items-center gap-1 active:opacity-60 transition-opacity"
          >
            查看详情
            <span class="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>

      <div v-if="filteredAppeals.length > 0 && !loading && !error" class="py-8 text-center">
        <p class="text-sm text-on-surface-variant">
          共 {{ pagination.totalCount }} 条记录
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
