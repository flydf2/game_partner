<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import { notificationApi } from '../api/index.js'

const router = useRouter()

const selectedMonth = ref('2023年10月')

const months = [
  '2023年10月', '2023年09月', '2023年08月', '2023年07月',
  '2023年06月', '2023年05月', '2023年04月', '2023年03月',
  '2023年02月', '2023年01月', '2022年12月', '2022年11月'
]

const transactionTypes = ref([
  { label: '全部类型', active: true },
  { label: '充值记录', active: false },
  { label: '订单消费', active: false },
  { label: '提现记录', active: false },
  { label: '系统奖励', active: false }
])

const notifications = ref([])
const loading = ref(false)

const selectType = (index) => {
  transactionTypes.value.forEach((type, i) => {
    type.active = i === index
  })
}

const formatAmount = (amount) => {
  if (amount.startsWith('+')) {
    return amount
  }
  return amount
}

const getStatusColor = (status) => {
  switch (status) {
    case 'success':
      return 'bg-surface-container/50 text-on-surface-variant'
    case 'failed':
      return 'bg-error-container/20 text-error'
    case 'processing':
      return 'bg-surface-container/50 text-on-surface-variant'
    default:
      return 'bg-surface-container/50 text-on-surface-variant'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'success':
      return '成功'
    case 'failed':
      return '失败'
    case 'processing':
      return '处理中'
    default:
      return status
  }
}

const getIconColor = (type) => {
  switch (type) {
    case 'primary':
      return 'text-primary'
    case 'secondary':
      return 'text-secondary'
    case 'tertiary':
      return 'text-tertiary'
    case 'on-surface-variant':
      return 'text-on-surface-variant'
    default:
      return 'text-on-surface'
  }
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

const toggleMonthDropdown = (event) => {
  event.stopPropagation()
}

const fetchNotifications = async () => {
  loading.value = true
  try {
    const response = await notificationApi.getNotifications()
    if (response.success) {
      notifications.value = response.data
    }
  } catch (error) {
    console.error('获取通知失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <AppHeader
      title="通知中心"
      is-primary-page
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-4 pb-24">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="notifications.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant mb-4">notifications_off</span>
        <p class="text-on-surface-variant">暂无通知</p>
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="bg-surface-container-lowest p-5 rounded-3xl flex items-start justify-between group hover:bg-primary-container/5 transition-colors"
        >
          <div class="flex items-start gap-4 flex-1">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :class="{
              'bg-primary-container/20': notification.type === 'order',
              'bg-secondary-container/20': notification.type === 'system',
              'bg-tertiary-container/20': notification.type === 'promotion',
              'bg-surface-container/20': notification.type === 'message'
            }">
              <span class="material-symbols-outlined text-lg" :class="{
                'text-primary': notification.type === 'order',
                'text-secondary': notification.type === 'system',
                'text-tertiary': notification.type === 'promotion',
                'text-on-surface-variant': notification.type === 'message'
              }" style="font-variation-settings: 'FILL' 1;">
                {{ {
                  'order': 'receipt_long',
                  'system': 'info',
                  'promotion': 'local_offer',
                  'message': 'chat_bubble'
                }[notification.type] }}
              </span>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-bold text-on-surface">{{ notification.title }}</h4>
                <span v-if="!notification.read" class="w-2 h-2 bg-primary rounded-full"></span>
              </div>
              <p class="text-sm text-on-surface-variant mb-2">{{ notification.content }}</p>
              <p class="text-xs text-on-surface-variant">{{ notification.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <button class="text-on-surface-variant text-sm font-bold flex items-center gap-1 mx-auto hover:text-primary transition-colors">
          加载更多通知
          <span class="material-symbols-outlined text-sm">keyboard_double_arrow_down</span>
        </button>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
