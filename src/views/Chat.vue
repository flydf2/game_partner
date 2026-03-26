<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { messageApi, handleApiError } from '../api/index.js'

const router = useRouter()
const route = useRoute()

const userId = route.params.id
const isListView = !userId

const messages = ref([])
const conversations = ref([])
const inputMessage = ref('')
const loading = ref(false)
const error = ref('')
const isTyping = ref(false)
const online = ref(true)

const chatPartner = ref({
  id: userId,
  name: '',
  avatar: '',
  game: '',
  skill: ''
})

const messageContainer = ref(null)
const pollingInterval = ref(null)
const lastMessageId = ref(null)

const loadMessages = async () => {
  if (isListView) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await messageApi.getChatMessages(userId)
    if (response.success || response.code === 0) {
      messages.value = (response.data?.messages || response.data || []).map(msg => ({
        id: msg.id || Date.now(),
        content: msg.content,
        sender: msg.from === 'self' ? 'me' : 'other',
        time: msg.time,
        read: msg.status === 'read',
        type: msg.type || 'text',
        status: msg.from === 'self' ? (msg.status === 'read' ? 'read' : 'sent') : 'received'
      }))
      
      chatPartner.value = response.data?.chatPartner || {
        id: userId,
        name: '用户',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        game: '未知游戏',
        skill: '未知'
      }
      
      if (messages.value.length > 0) {
        lastMessageId.value = messages.value[messages.value.length - 1].id
      }
      
      scrollToBottom()
      
      try {
        await messageApi.markConversationAsRead(userId)
        messages.value.forEach(msg => {
          if (msg.sender === 'other') {
            msg.read = true
          }
        })
      } catch (err) {
        console.error('标记会话已读失败:', err)
      }
    } else {
      throw new Error(response.message || response.msg || '获取聊天记录失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取聊天记录失败:', err)
  } finally {
    loading.value = false
  }
}

const loadConversations = async () => {
  if (!isListView) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await messageApi.getConversations()
    if (response.success || response.code === 0) {
      conversations.value = response.data || []
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

onMounted(() => {
  if (isListView) {
    loadConversations()
  } else {
    loadMessages()
    startPolling()
  }
})

onUnmounted(() => {
  stopPolling()
})

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

const handleSendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
  const tempMessage = {
    id: Date.now(),
    content: inputMessage.value.trim(),
    sender: 'me',
    time: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    read: false,
    type: 'text',
    status: 'sending'
  }
  
  messages.value.push(tempMessage)
  inputMessage.value = ''
  scrollToBottom()
  
  try {
    const response = await messageApi.sendMessage(userId, tempMessage.content, tempMessage.type)
    if (response.success || response.code === 0) {
      if (response.data && response.data.id) {
        tempMessage.id = response.data.id
      }
      if (response.data && response.data.time) {
        tempMessage.time = response.data.time
      }
      tempMessage.status = 'sent'
      if (response.data && response.data.status) {
        tempMessage.read = response.data.status === 'read'
        if (response.data.status === 'read') {
          tempMessage.status = 'read'
        }
      }
    } else {
      throw new Error(response.message || response.msg || '发送消息失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('发送消息失败:', err)
    tempMessage.status = 'failed'
  }
}

const handleBack = () => {
  router.back()
}

const handleRetryMessage = async (message) => {
  message.status = 'sending'
  
  try {
    const response = await messageApi.sendMessage(userId, message.content, message.type)
    if (response.success || response.code === 0) {
      if (response.data && response.data.id) {
        message.id = response.data.id
      }
      if (response.data && response.data.time) {
        message.time = response.data.time
      }
      message.status = 'sent'
      if (response.data && response.data.status) {
        message.read = response.data.status === 'read'
        if (response.data.status === 'read') {
          message.status = 'read'
        }
      }
    } else {
      throw new Error(response.message || response.msg || '发送消息失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('重试发送消息失败:', err)
    message.status = 'failed'
  }
}

const startPolling = () => {
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await messageApi.getChatMessages(userId)
      if (response.success || response.code === 0) {
        const newMessages = (response.data?.messages || response.data || []).map(msg => ({
          id: msg.id || Date.now(),
          content: msg.content,
          sender: msg.from === 'self' ? 'me' : 'other',
          time: msg.time,
          read: msg.status === 'read',
          type: msg.type || 'text',
          status: msg.from === 'self' ? (msg.status === 'read' ? 'read' : 'sent') : 'received'
        }))
        
        if (newMessages.length > 0 && lastMessageId.value) {
          const newMessagesOnly = newMessages.filter(msg => msg.id > lastMessageId.value)
          if (newMessagesOnly.length > 0) {
            messages.value = [...messages.value, ...newMessagesOnly]
            lastMessageId.value = newMessagesOnly[newMessagesOnly.length - 1].id
            scrollToBottom()
            
            try {
              await messageApi.markConversationAsRead(userId)
              newMessagesOnly.forEach(msg => {
                if (msg.sender === 'other') {
                  msg.read = true
                }
              })
            } catch (err) {
              console.error('标记会话已读失败:', err)
            }
          }
        }
      }
    } catch (err) {
      console.error('轮询获取消息失败:', err)
    }
  }, 3000)
}

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
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
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const isSameDay = (currentTime, previousTime) => {
  const current = new Date(currentTime)
  const previous = new Date(previousTime)
  return current.toDateString() === previous.toDateString()
}

const shouldShowTime = (index) => {
  if (index === 0) return true
  return !isSameDay(messages.value[index].time, messages.value[index - 1].time)
}

const formatTimeDisplay = (time) => {
  const date = new Date(time)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const handleConversationClick = (userId) => {
  router.push(`/chat/${userId}`)
}

watch(() => route.params.id, (newUserId) => {
  if (newUserId) {
    loadMessages()
  } else {
    loadConversations()
  }
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-24">
    <!-- List View Header -->
    <header v-if="isListView" class="fixed top-0 w-full z-50 bg-[#f6f6f6] flex items-center justify-between px-5 h-16">
      <h1 class="font-headline font-bold text-lg text-[#6c5a00]">消息</h1>
      <button class="transition-all duration-200 active:scale-95 text-[#6c5a00] hover:bg-yellow-50 p-2 rounded-full">
        <span class="material-symbols-outlined" data-icon="settings">settings</span>
      </button>
    </header>

    <!-- Chat View Header -->
    <header v-else class="fixed top-0 w-full z-50 bg-[#f6f6f6] flex items-center justify-between px-5 h-16">
      <div class="flex items-center gap-4">
        <button 
          class="transition-all duration-200 active:scale-95 text-[#6c5a00] hover:bg-yellow-50 p-2 rounded-full"
          @click="handleBack"
        >
          <span class="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
        </button>
        <div class="flex flex-col">
          <h1 class="font-headline font-bold text-lg text-[#6c5a00]">{{ chatPartner.name }}</h1>
          <span class="text-[10px] text-primary flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
            在线
          </span>
        </div>
      </div>
      <button class="transition-all duration-200 active:scale-95 text-[#6c5a00] hover:bg-yellow-50 p-2 rounded-full">
        <span class="material-symbols-outlined" data-icon="settings">settings</span>
      </button>
    </header>

    <!-- List View Content -->
    <main v-if="isListView" class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
      <div v-if="loading" class="w-full flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="error" class="w-full flex justify-center py-10">
        <div class="bg-error/10 border border-error/20 rounded-full px-4 py-2 flex items-center gap-2">
          <span class="material-symbols-outlined text-error text-sm">error_outline</span>
          <span class="text-sm text-error">{{ error }}</span>
          <button @click="error = ''; loadConversations()" class="material-symbols-outlined text-error text-sm cursor-pointer hover:opacity-80">refresh</button>
        </div>
      </div>
      
      <div v-else-if="conversations.length === 0" class="w-full flex flex-col items-center justify-center py-20">
        <div class="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant">chat_bubble_outline</span>
        </div>
        <p class="text-on-surface-variant text-center">暂无消息</p>
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="conversation in conversations" 
          :key="conversation.id"
          @click="handleConversationClick(conversation.userId)"
          class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors duration-200 cursor-pointer"
        >
          <div class="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
            <img 
              :alt="conversation.userName" 
              class="w-full h-full object-cover" 
              :src="conversation.userAvatar" 
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-medium text-on-surface truncate">{{ conversation.userName }}</h3>
              <span class="text-[11px] text-outline ml-2">{{ formatMessageTime(conversation.lastTime) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-on-surface-variant truncate">{{ conversation.lastMessage }}</p>
              <span v-if="conversation.unread > 0" class="bg-primary text-white text-[10px] font-medium px-2 py-0.5 rounded-full min-w-6 text-center">
                {{ conversation.unread }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Chat View Content -->
    <main v-else class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
      <div ref="messageContainer" class="h-[calc(100vh-12rem)] overflow-y-auto pb-4">
        <div v-for="(message, index) in messages" :key="message.id">
          <div v-if="shouldShowTime(index)" class="flex justify-center mb-4">
            <span class="text-[11px] font-medium text-outline bg-surface-container-low px-3 py-1 rounded-full">
              {{ formatMessageTime(message.time) }}
            </span>
          </div>

          <div v-if="message.sender === 'other'" class="flex items-end gap-3 max-w-[85%] mb-4">
            <div class="w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
              <img 
                :alt="chatPartner.name" 
                class="w-full h-full object-cover" 
                :src="chatPartner.avatar" 
              />
            </div>
            <div class="bg-surface-container-lowest p-4 rounded-3xl bubble-left shadow-sm">
              <p class="text-on-surface leading-relaxed text-sm">{{ message.content }}</p>
            </div>
          </div>

          <div v-else class="flex items-end justify-end gap-3 ml-auto max-w-[85%] mb-4">
            <div class="bg-primary-container p-4 rounded-3xl bubble-right shadow-sm">
              <p class="text-on-primary-container leading-relaxed text-sm">{{ message.content }}</p>
            </div>
            <div class="w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
              <img 
                alt="我的头像" 
                class="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuyVY8He6CZYlr392HOlzoxwVpZM2EuGoAMT1iFq8ioj_Wx-T6ky9SWEnKCc_HoriWlL95Sv2Wp3v-NxA1C6FUoFy_W3QG1uLIHGXFhTJhCl2hLljVR8JPYvnQq_tPE9BgJfkbIRn5DEVrNgfElxjQAS7BfalyFk8vmvUs3zefwsQx6hhEbPjowAFOtT5CrPrfUwngkgmY2ojlbzdNcooq138ZFYfh0D-pHapFs0O2u7zuE1nKEwIbkBhkT3imXvbG4MztaaQVY1M" 
              />
            </div>
          </div>
        </div>

        <div v-if="isTyping" class="flex items-end gap-3 max-w-[85%] mb-4">
          <div class="w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
            <img 
              :alt="chatPartner.name" 
              class="w-full h-full object-cover" 
              :src="chatPartner.avatar" 
            />
          </div>
          <div class="bg-surface-container-lowest p-4 rounded-3xl bubble-left shadow-sm">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>

        <div v-if="error" class="w-full flex justify-center mb-4">
          <div class="bg-error/10 border border-error/20 rounded-full px-4 py-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-error text-sm">error_outline</span>
            <span class="text-sm text-error">{{ error }}</span>
            <button @click="error = ''; loadMessages()" class="material-symbols-outlined text-error text-sm cursor-pointer hover:opacity-80">refresh</button>
          </div>
        </div>
      </div>
    </main>

    <!-- Chat View Footer -->
    <footer v-if="!isListView" class="fixed bottom-0 w-full z-50 bg-white/80 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-safe">
      <div class="flex items-center gap-3 px-6 py-4">
        <button class="transition-transform active:scale-90 text-on-surface-variant">
          <span class="material-symbols-outlined text-[28px]" data-icon="mic">mic</span>
        </button>
        <div class="flex-1 bg-surface-container-low rounded-full px-5 py-2.5 flex items-center">
          <input
            v-model="inputMessage"
            class="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline text-on-surface"
            placeholder="输入消息..."
            type="text"
            @keyup.enter="handleSendMessage"
          />
          <button class="text-on-surface-variant ml-2">
            <span class="material-symbols-outlined text-[24px]" data-icon="mood">mood</span>
          </button>
        </div>
        <button 
          class="w-11 h-11 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container transition-transform active:scale-90 shadow-sm"
          @click="handleSendMessage"
        >
          <span class="material-symbols-outlined" data-icon="add">add</span>
        </button>
      </div>
      <div class="h-1.5 w-32 bg-surface-container-highest mx-auto mb-2 rounded-full opacity-30"></div>
    </footer>
  </div>
</template>

<style scoped>
.chat-container {
  height: calc(100vh - 128px);
  overflow-y: auto;
  padding-bottom: 24px;
}

.bubble-left {
  border-bottom-left-radius: 4px;
}

.bubble-right {
  border-bottom-right-radius: 4px;
}
</style>
