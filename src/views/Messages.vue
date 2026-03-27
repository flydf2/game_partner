<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { messageApi, handleApiError } from '../api/index.js'

const router = useRouter()

const conversations = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

const loadConversations = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await messageApi.getConversations()
    if (response.success || response.code === 0) {
      conversations.value = (response.data?.data || response.data || []).map(conv => ({
        id: conv.id,
        userId: conv.userId,
        userName: conv.userName,
        userAvatar: conv.userAvatar,
        lastMessage: conv.lastMessage,
        lastTime: conv.lastTime,
        unread: conv.unread || 0
      }))
    } else {
      throw new Error(response.message || response.msg || '获取会话列表失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取会话列表失败:', err)
  } finally {
    loading.value = false
  }
}

const handleConversationClick = (conversation) => {
  router.push(`/chat/${conversation.userId}`)
}

const handleBack = () => {
  router.back()
}

const formatTime = (time) => {
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

const getInitials = (name) => {
  return name.slice(0, 2).toUpperCase()
}

onMounted(() => {
  loadConversations()
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-24">
    <header class="fixed top-0 w-full z-50 bg-[#f6f6f6] flex items-center justify-between px-5 h-16">
      <div class="flex items-center transition-all duration-200 active:scale-95 text-[#6c5a00]">
        <button 
          class="transition-all duration-200 active:scale-95 text-[#6c5a00] hover:bg-yellow-50 p-2 rounded-full"
          @click="handleBack"
        >
          <span class="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
        </button>
      </div>
      <h1 class="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#6c5a00]">消息</h1>
      <div class="flex items-center transition-all duration-200 active:scale-95 text-[#6c5a00]">
        <button class="transition-all duration-200 active:scale-95 text-[#6c5a00] hover:bg-yellow-50 p-2 rounded-full">
          <span class="material-symbols-outlined" data-icon="settings">settings</span>
        </button>
      </div>
    </header>

    <main class="pt-20 px-5">
      <div class="relative mb-6">
        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span class="material-symbols-outlined text-outline text-lg" data-icon="search">search</span>
        </div>
        <input
          v-model="searchQuery"
          class="w-full h-12 pl-12 pr-4 bg-surface-container-high border-none rounded-2xl focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container/30 transition-all placeholder:text-outline/70"
          placeholder="搜索大神或联系人..."
          type="text"
        />
      </div>

      <section class="space-y-3">
        <div
          v-for="conversation in conversations"
          :key="conversation.id"
          @click="handleConversationClick(conversation)"
          class="p-4 bg-surface-container-lowest rounded-3xl flex items-center gap-4 transition-all duration-200 active:scale-[0.98] hover:bg-surface-container-low cursor-pointer"
        >
          <div class="relative flex-shrink-0">
            <img
              class="w-14 h-14 rounded-2xl object-cover"
              :src="conversation.userAvatar"
              :alt="conversation.userName"
            />
            <div
              v-if="conversation.unread > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-error border-2 border-surface-container-lowest rounded-full flex items-center justify-center"
            >
              <span class="text-[10px] text-white font-bold">{{ conversation.unread > 99 ? '99+' : conversation.unread }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-1">
              <h3 class="font-headline font-bold text-on-surface truncate">{{ conversation.userName }}</h3>
              <span class="text-xs text-outline shrink-0">{{ formatTime(conversation.lastTime) }}</span>
            </div>
            <p class="text-sm text-on-surface-variant truncate">{{ conversation.lastMessage }}</p>
          </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="error" class="bg-error/10 border border-error/20 rounded-3xl p-8 text-center">
          <span class="material-symbols-outlined text-error text-4xl mb-4">error_outline</span>
          <p class="text-sm text-error mb-4">{{ error }}</p>
          <button
            @click="loadConversations"
            class="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
          >
            重试
          </button>
        </div>

        <div v-else-if="conversations.length === 0" class="text-center py-16">
          <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
            <span class="material-symbols-outlined text-outline text-5xl">chat_bubble</span>
          </div>
          <h2 class="text-xl font-bold text-on-surface mb-2">暂无消息</h2>
          <p class="text-sm text-on-surface-variant">开始与大神交流，会有消息显示在这里</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
</style>
