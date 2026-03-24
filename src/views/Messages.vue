<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const conversations = ref([
  {
    id: '1',
    userId: '1',
    name: '电竞少女',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    lastMessage: '好的，明天晚上8点见',
    lastMessageTime: '2026-03-23 18:30',
    unreadCount: 2,
    online: true
  },
  {
    id: '2',
    userId: '2',
    name: '游戏大师',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    lastMessage: '那我们约后天下午吧',
    lastMessageTime: '2026-03-23 15:20',
    unreadCount: 0,
    online: false
  },
  {
    id: '3',
    userId: '3',
    name: '安妮喵呜',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: '好的，我会准时到',
    lastMessageTime: '2026-03-22 20:15',
    unreadCount: 0,
    online: true
  },
  {
    id: '4',
    userId: '4',
    name: '电竞王子',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    lastMessage: '谢谢你的建议',
    lastMessageTime: '2026-03-22 10:30',
    unreadCount: 1,
    online: false
  }
])

const loading = ref(false)
const error = ref('')

const totalUnreadCount = ref(0)

onMounted(() => {
  calculateTotalUnread()
})

const calculateTotalUnread = () => {
  totalUnreadCount.value = conversations.value.reduce((sum, conv) => sum + conv.unreadCount, 0)
}

const handleConversationClick = (conversation) => {
  // 标记为已读
  conversation.unreadCount = 0
  calculateTotalUnread()
  
  // 跳转到聊天页面
  router.push(`/chat/${conversation.userId}`)
}

const handleBack = () => {
  router.back()
}

const formatMessageTime = (time) => {
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
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <nav data-v-3b8a03f8="" class="bg-surface w-full top-0 sticky z-50">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">消息</h1>
      </div>
      <div v-if="totalUnreadCount > 0" class="bg-primary text-on-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
        {{ totalUnreadCount }}
      </div>
      <div v-else class="w-6"></div>
    </nav>

    <main class="pt-20 px-5 max-w-2xl mx-auto">
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
      <div v-else-if="conversations.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-outline text-5xl">chat</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无消息</h2>
        <p class="text-sm text-on-surface-variant">开始与大神聊天吧</p>
      </div>

      <!-- 消息列表 -->
      <div v-else class="space-y-3">
        <div
          v-for="conversation in conversations"
          :key="conversation.id"
          @click="handleConversationClick(conversation)"
          class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 hover:shadow-md cursor-pointer"
        >
          <div class="flex items-start gap-4">
            <div class="relative flex-shrink-0">
              <div class="w-14 h-14 rounded-2xl overflow-hidden">
                <img :alt="conversation.name" class="w-full h-full object-cover" :src="conversation.avatar" />
              </div>
              <div v-if="conversation.online" class="absolute bottom-1 right-1 w-3 h-3 bg-success rounded-full border-2 border-surface-container-lowest"></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-1">
                <h3 class="font-bold text-on-surface truncate">{{ conversation.name }}</h3>
                <span class="text-xs text-on-surface-variant flex-shrink-0 ml-2">
                  {{ formatMessageTime(conversation.lastMessageTime) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-sm text-on-surface-variant truncate">{{ conversation.lastMessage }}</p>
                <div v-if="conversation.unreadCount > 0" class="bg-primary text-on-primary text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 ml-2">
                  {{ conversation.unreadCount }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>