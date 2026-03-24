<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const notifications = ref([
  {
    id: 1,
    type: 'order',
    title: '订单已完成',
    message: '您的陪玩订单已完成，感谢您的使用',
    time: '2026-03-23 18:30',
    read: false
  },
  {
    id: 2,
    type: 'system',
    title: '系统通知',
    message: '新版本已发布，新增多种游戏类型',
    time: '2026-03-23 15:20',
    read: false
  },
  {
    id: 3,
    type: 'expert',
    title: '大神上线',
    message: '您关注的电竞少女已上线，快去预约吧',
    time: '2026-03-22 20:15',
    read: true
  },
  {
    id: 4,
    type: 'order',
    title: '订单已开始',
    message: '您的陪玩订单已开始，请注意查收',
    time: '2026-03-22 10:30',
    read: true
  },
  {
    id: 5,
    type: 'system',
    title: '账户余额变动',
    message: '您的账户收到100元订单收入',
    time: '2026-03-21 19:45',
    read: true
  }
])

const loading = ref(false)
const error = ref('')
const showClearDialog = ref(false)

const unreadCount = ref(0)

onMounted(() => {
  calculateUnreadCount()
})

const calculateUnreadCount = () => {
  unreadCount.value = notifications.value.filter(n => !n.read).length
}

const handleNotificationClick = (notification) => {
  notification.read = true
  calculateUnreadCount()
  
  // 根据通知类型跳转到不同页面
  switch (notification.type) {
    case 'order':
      router.push('/orders')
      break
    case 'expert':
      router.push('/expert/1')
      break
    default:
      break
  }
}

const handleMarkAllRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
  calculateUnreadCount()
}

const handleClearAll = () => {
  notifications.value = []
  calculateUnreadCount()
  showClearDialog.value = false
}

const handleBack = () => {
  router.back()
}

const formatNotificationTime = (time) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'order':
      return 'receipt'
    case 'system':
      return 'info'
    case 'expert':
      return 'person'
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
    case 'expert':
      return 'bg-tertiary-container/20 text-tertiary'
    default:
      return 'bg-surface-container/20 text-on-surface'
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">通知</h1>
      </div>
      <div class="flex items-center gap-3">
        <button
          v-if="unreadCount > 0"
          @click="handleMarkAllRead"
          class="text-sm text-primary font-medium active:scale-95 transition-transform"
        >
          全部已读
        </button>
        <button
          v-if="notifications.length > 0"
          @click="showClearDialog = true"
          class="text-sm text-outline font-medium active:scale-95 transition-transform"
        >
          清空
        </button>
      </div>
    </header>

    <main class="max-w-2xl mx-auto space-y-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-error/10 border border-error/20 rounded-3xl p-8 text-center">
        <span class="material-symbols-outlined text-error text-4xl mb-4">error_outline</span>
        <p class="text-sm text-error mb-4">{{ error }}</p>
        <button
          @click="loading = false; error = ''"
          class="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          重试
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="notifications.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-outline text-5xl">notifications_off</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无通知</h2>
        <p class="text-sm text-on-surface-variant">当有新消息时，会显示在这里</p>
      </div>

      <!-- 通知列表 -->
      <div v-else class="space-y-3">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 hover:shadow-md cursor-pointer"
          :class="!notification.read ? 'border-l-4 border-primary' : ''"
        >
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="getNotificationColor(notification.type)">
              <span class="material-symbols-outlined">{{ getNotificationIcon(notification.type) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-1">
                <h3 class="font-bold text-on-surface truncate">{{ notification.title }}</h3>
                <span class="text-xs text-on-surface-variant flex-shrink-0 ml-2">
                  {{ formatNotificationTime(notification.time) }}
                </span>
              </div>
              <p class="text-sm text-on-surface-variant line-clamp-2">{{ notification.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 清空确认对话框 -->
    <div v-if="showClearDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div class="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-sm animate-in fade-in-90 slide-in-from-bottom-5">
        <h3 class="text-lg font-bold text-on-surface font-headline mb-2">清空通知</h3>
        <p class="text-sm text-on-surface-variant mb-6">确定要清空所有通知吗？此操作不可恢复。</p>
        
        <div class="flex gap-3">
          <button
            @click="showClearDialog = false"
            class="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-low"
          >
            取消
          </button>
          <button
            @click="handleClearAll"
            class="flex-1 py-3 rounded-full bg-error-container text-on-error-container font-bold text-sm transition-all active:scale-95"
          >
            确认清空
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>