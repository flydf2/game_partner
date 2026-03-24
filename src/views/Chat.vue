<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const userId = route.params.id

const messages = ref([
  {
    id: 1,
    content: '你好，我是电竞少女，很高兴为你服务',
    sender: 'other',
    time: '2026-03-23 18:00',
    read: true
  },
  {
    id: 2,
    content: '你好，我想预约明天晚上的陪玩',
    sender: 'me',
    time: '2026-03-23 18:01',
    read: true
  },
  {
    id: 3,
    content: '好的，明天晚上几点呢？',
    sender: 'other',
    time: '2026-03-23 18:02',
    read: true
  },
  {
    id: 4,
    content: '8点可以吗？',
    sender: 'me',
    time: '2026-03-23 18:03',
    read: true
  },
  {
    id: 5,
    content: '好的，明天晚上8点见',
    sender: 'other',
    time: '2026-03-23 18:30',
    read: false
  }
])

const inputMessage = ref('')
const loading = ref(false)
const error = ref('')
const isTyping = ref(false)
const online = ref(true)

const chatPartner = ref({
  id: userId,
  name: '电竞少女',
  avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
  game: '英雄联盟',
  skill: '钻石段位'
})

const messageContainer = ref(null)

onMounted(() => {
  scrollToBottom()
  // 模拟对方正在输入
  setTimeout(() => {
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
    }, 2000)
  }, 3000)
})

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

const handleSendMessage = () => {
  if (!inputMessage.value.trim()) return
  
  const newMessage = {
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
    read: false
  }
  
  messages.value.push(newMessage)
  inputMessage.value = ''
  scrollToBottom()
  
  // 模拟对方回复
  setTimeout(() => {
    const replyMessage = {
      id: Date.now() + 1,
      content: '收到，我会准时在线',
      sender: 'other',
      time: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      read: false
    }
    messages.value.push(replyMessage)
    scrollToBottom()
  }, 1500)
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
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-10 h-10 rounded-full overflow-hidden">
              <img :alt="chatPartner.name" class="w-full h-full object-cover" :src="chatPartner.avatar" />
            </div>
            <div v-if="online" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-surface"></div>
          </div>
          <div>
            <h1 class="font-headline font-bold text-base text-primary">{{ chatPartner.name }}</h1>
            <div class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full" :class="online ? 'bg-success' : 'bg-outline'"></span>
              <span class="text-xs text-on-surface-variant">{{ online ? '在线' : '离线' }}</span>
            </div>
          </div>
        </div>
      </div>
      <span class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform">
        more_vert
      </span>
    </nav>

    <main class="pt-20 pb-24 px-5 max-w-2xl mx-auto">
      <div
        ref="messageContainer"
        class="space-y-6 overflow-y-auto h-[calc(100vh-12rem)] pr-1"
      >
        <!-- 聊天消息 -->
        <div
          v-for="(message, index) in messages"
          :key="message.id"
          class="flex"
          :class="message.sender === 'me' ? 'justify-end' : 'justify-start'"
        >
          <!-- 时间分隔 -->
          <div v-if="shouldShowTime(index)" class="w-full flex justify-center mb-4">
            <span class="bg-surface-container text-on-surface-variant text-xs px-3 py-1 rounded-full">
              {{ formatMessageTime(message.time) }}
            </span>
          </div>
          
          <!-- 对方消息 -->
          <div v-if="message.sender === 'other'" class="flex items-end gap-3 max-w-[70%]">
            <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img :alt="chatPartner.name" class="w-full h-full object-cover" :src="chatPartner.avatar" />
            </div>
            <div>
              <div class="bg-surface-container-lowest rounded-2xl rounded-tl-none p-3 shadow-sm">
                <p class="text-sm text-on-surface">{{ message.content }}</p>
              </div>
              <div class="flex items-center gap-1 mt-1">
                <span class="text-xs text-on-surface-variant">{{ formatMessageTime(message.time) }}</span>
                <span v-if="message.read" class="material-symbols-outlined text-xs text-primary">done_all</span>
              </div>
            </div>
          </div>
          
          <!-- 我的消息 -->
          <div v-else class="flex items-end gap-3 max-w-[70%]">
            <div class="order-2">
              <div class="bg-primary-container rounded-2xl rounded-tr-none p-3 shadow-sm">
                <p class="text-sm text-on-primary-container">{{ message.content }}</p>
              </div>
              <div class="flex items-center justify-end gap-1 mt-1">
                <span class="text-xs text-on-surface-variant">{{ formatMessageTime(message.time) }}</span>
                <span v-if="message.read" class="material-symbols-outlined text-xs text-primary">done_all</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 对方正在输入 -->
        <div v-if="isTyping" class="flex items-end gap-3 max-w-[70%]">
          <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img :alt="chatPartner.name" class="w-full h-full object-cover" :src="chatPartner.avatar" />
          </div>
          <div class="bg-surface-container-lowest rounded-2xl rounded-tl-none p-3 shadow-sm">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 输入框 -->
    <div class="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline px-5 py-4 z-40">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:opacity-80 transition-opacity">
          emoji_emotions
        </span>
        <span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:opacity-80 transition-opacity">
          attach_file
        </span>
        <div class="flex-1 relative">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="输入消息..."
            class="w-full bg-surface-container-low rounded-full py-3 px-5 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
            @keyup.enter="handleSendMessage"
          />
        </div>
        <button
          @click="handleSendMessage"
          class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary hover:opacity-80 transition-opacity active:scale-95"
        >
          <span class="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>