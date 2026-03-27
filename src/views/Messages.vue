<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { messageApi } from '../api/index.js'

const router = useRouter()

const conversations = ref([])
const loading = ref(false)
const error = ref('')

const loadConversations = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await messageApi.getConversations()
    if (response.success || response.code === 0) {
      conversations.value = response.data || []
    } else {
      throw new Error(response.message || response.msg || '获取消息列表失败')
    }
  } catch (err) {
    console.error('获取消息列表失败:', err)
    error.value = err.message || '获取消息列表失败'
  } finally {
    loading.value = false
  }
}

const handleConversationClick = (conversation) => {
  router.push(`/chat/${conversation.userId}`)
}

const handleRetry = () => {
  loadConversations()
}

onMounted(() => {
  loadConversations()
})

onUnmounted(() => {
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-24">
    <header class="fixed top-0 w-full z-50 bg-[#f6f6f6] flex items-center justify-between px-5 h-16">
      <h1 class="font-headline font-bold text-xl text-[#6c5a00]">消息</h1>
      <button class="transition-all duration-200 active:scale-95 text-[#6c5a00] hover:bg-yellow-50 p-2 rounded-full">
        <span class="material-symbols-outlined" data-icon="edit">edit</span>
      </button>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-24 space-y-4">
      <div v-if="error" class="w-full flex justify-center mb-8">
        <div class="bg-error/10 border border-error/20 rounded-2xl px-6 py-4 flex items-center gap-3 max-w-md">
          <span class="material-symbols-outlined text-error">error_outline</span>
          <span class="text-sm text-error">{{ error }}</span>
          <button @click="handleRetry" class="ml-2 text-sm font-medium text-error hover:underline">
            重试
          </button>
        </div>
      </div>

      <div v-if="conversations.length === 0 && !loading" class="text-center py-16">
        <div class="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-4xl text-outline">forum</span>
        </div>
        <p class="text-on-surface-variant">暂无消息</p>
      </div>

      <div v-for="conversation in conversations" :key="conversation.id" 
           class="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-98">
        <div class="relative">
          <div class="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
            <img 
              :alt="conversation.userName" 
              class="w-full h-full object-cover" 
              :src="conversation.userAvatar" 
            />
          </div>
          <div v-if="conversation.unread > 0" 
               class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center text-[10px] font-bold">
            {{ conversation.unread }}
          </div>
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="font-medium text-base text-on-surface truncate">{{ conversation.userName }}</h3>
            <span class="text-[11px] text-on-surface-variant whitespace-nowrap">{{ conversation.lastTime }}</span>
          </div>
          <div class="flex items-center gap-2">
            <p class="text-sm text-on-surface-variant truncate flex-1">
              {{ conversation.lastMessage }}
            </p>
            <span v-if="conversation.unread > 0" 
                  class="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
          </div>
        </div>
        
        <span class="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>
