<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import { notificationApi } from '../api/index.js'

const router = useRouter()

const notifications = ref([])
const loading = ref(false)
const selectedType = ref('all')

const notificationTypes = ref([
  { label: '全部', value: 'all', active: true },
  { label: '订单', value: 'order', active: false },
  { label: '系统', value: 'system', active: false },
  { label: '优惠', value: 'promotion', active: false },
  { label: '消息', value: 'message', active: false }
])

const selectType = (index) => {
  notificationTypes.value.forEach((type, i) => {
    type.active = i === index
  })
  selectedType.value = notificationTypes.value[index].value
  fetchNotifications()
}

const fetchNotifications = async () => {
  loading.value = true
  try {
    const response = await notificationApi.getNotifications()
    if (response.success || response.code === 0) {
      let data = response.data || []
      if (selectedType.value !== 'all') {
        data = data.filter(item => item.type === selectedType.value)
      }
      notifications.value = data
    }
  } catch (error) {
    console.error('获取通知失败:', error)
  } finally {
    loading.value = false
  }
}

const markAsRead = async (notificationId) => {
  try {
    const response = await notificationApi.markAsRead(notificationId)
    if (response.success || response.code === 0) {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    }
  } catch (error) {
    console.error('标记已读失败:', error)
  }
}

const markAllAsRead = async () => {
  try {
    const response = await notificationApi.markAllAsRead()
    if (response.success || response.code === 0) {
      notifications.value.forEach(n => {
        n.read = true
      })
    }
  } catch (error) {
    console.error('标记全部已读失败:', error)
  }
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'order':
      return 'receipt_long'
    case 'system':
      return 'settings'
    case 'promotion':
      return 'local_offer'
    case 'message':
      return 'chat'
    default:
      return 'notifications'
  }
}

const getNotificationColor = (type) => {
  switch (type) {
    case 'order':
      return 'bg-primary-container/20 text-primary'
    case 'system':
      return 'bg-secondary-container/20 text-secondary'
    case 'promotion':
      return 'bg-tertiary-container/20 text-tertiary'
    case 'message':
      return 'bg-error-container/20 text-error'
    default:
      return 'bg-surface-container text-on-surface-variant'
  }
}

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

onMounted(() => {
  fetchNotifications()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <AppHeader
      title="通知"
      is-primary-page
      :show-back="true"
      @back="handleBack"
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-4 pb-24">
      <section class="mb-6 px-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-on-surface">筛选通知</h2>
          <button 
            class="text-primary text-sm font-bold"
            @click="markAllAsRead"
          >
            全部已读
          </button>
        </div>
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            v-for="(type, index) in notificationTypes" 
            :key="type.value"
            @click="selectType(index)"
            class="whitespace-nowrap px-5 py-2 rounded-full font-bold text-sm transition-colors"
            :class="type.active ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'"
          >
            {{ type.label }}
          </button>
        </div>
      </section>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <span class="material-symbols-outlined text-on-surface-variant animate-spin">progress_activity</span>
      </div>

      <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center py-12 text-on-surface-variant">
        <span class="material-symbols-outlined text-6xl mb-4">notifications_off</span>
        <p class="text-sm">暂无通知</p>
      </div>

      <div v-else class="space-y-3 px-4">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="bg-surface-container-lowest p-5 rounded-3xl flex items-start gap-4 group transition-colors"
          :class="notification.read ? 'opacity-60' : ''"
          @click="markAsRead(notification.id)"
        >
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" :class="getNotificationColor(notification.type)">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">
              {{ getNotificationIcon(notification.type) }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-bold text-on-surface" :class="notification.read ? 'font-normal' : ''">{{ notification.title }}</h4>
              <span v-if="!notification.read" class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></span>
            </div>
            <p class="text-sm text-on-surface-variant mt-1 line-clamp-2">{{ notification.content }}</p>
            <p class="text-xs text-on-surface-variant/70 mt-2">{{ notification.time }}</p>
          </div>
        </div>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>