<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const history = ref([
  {
    id: 1,
    type: 'expert',
    expertId: '1',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    name: '电竞少女',
    game: '英雄联盟',
    skill: '钻石段位',
    price: 48,
    rating: 4.9,
    viewTime: '2026-03-23 18:30'
  },
  {
    id: 2,
    type: 'expert',
    expertId: '2',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    name: '游戏大师',
    game: 'CS:GO',
    skill: '大师段位',
    price: 52,
    rating: 4.8,
    viewTime: '2026-03-23 15:20'
  },
  {
    id: 3,
    type: 'expert',
    expertId: '3',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: '安妮喵呜',
    game: '绝地求生',
    skill: '温柔语聊',
    price: 55,
    rating: 5.0,
    viewTime: '2026-03-22 20:15'
  },
  {
    id: 4,
    type: 'expert',
    expertId: '4',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    name: '电竞王子',
    game: '王者荣耀',
    skill: '王者段位',
    price: 60,
    rating: 4.7,
    viewTime: '2026-03-22 10:30'
  },
  {
    id: 5,
    type: 'expert',
    expertId: '5',
    avatar: 'https://randomuser.me/api/portraits/women/66.jpg',
    name: '游戏小仙女',
    game: '原神',
    skill: '深渊满星',
    price: 45,
    rating: 4.9,
    viewTime: '2026-03-21 19:45'
  }
])

const loading = ref(false)
const error = ref('')
const showClearDialog = ref(false)

const handleExpertDetail = (expertId) => {
  router.push(`/expert/${expertId}`)
}

const handleClearHistory = async () => {
  try {
    // 模拟清空历史
    history.value = []
    showClearDialog.value = false
  } catch (err) {
    console.error('清空历史失败:', err)
  }
}

const handleBack = () => {
  router.back()
}

const formatViewTime = (time) => {
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
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">浏览历史</h1>
      </div>
      <button
        v-if="history.length > 0"
        @click="showClearDialog = true"
        class="text-sm text-primary font-medium active:scale-95 transition-transform"
      >
        清空
      </button>
      <div v-else class="w-6"></div>
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
      <div v-else-if="history.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-outline text-5xl">history</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无浏览历史</h2>
        <p class="text-sm text-on-surface-variant mb-6">快去发现心仪的大神吧</p>
        <button
          @click="router.push('/discover')"
          class="px-8 py-3 bg-primary-container text-on-primary-container rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          去发现
        </button>
      </div>

      <!-- 历史记录列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="item in history"
          :key="item.id"
          class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 hover:shadow-md"
        >
          <div class="flex items-start gap-4">
            <div
              @click="handleExpertDetail(item.expertId)"
              class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
            >
              <img :alt="item.name" class="w-full h-full object-cover" :src="item.avatar" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div
                  @click="handleExpertDetail(item.expertId)"
                  class="flex-1 min-w-0 cursor-pointer"
                >
                  <h3 class="font-bold text-on-surface truncate">{{ item.name }}</h3>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="material-symbols-outlined text-primary text-sm">star</span>
                    <span class="text-sm font-medium text-primary">{{ item.rating }}</span>
                  </div>
                </div>
                <span class="text-xs text-on-surface-variant flex-shrink-0 ml-2">
                  {{ formatViewTime(item.viewTime) }}
                </span>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {{ item.game }}
                </span>
                <span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {{ item.skill }}
                </span>
              </div>
              <span class="text-lg font-bold text-primary">¥{{ item.price }}/小时</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 清空确认对话框 -->
    <div v-if="showClearDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div class="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-sm animate-in fade-in-90 slide-in-from-bottom-5">
        <h3 class="text-lg font-bold text-on-surface font-headline mb-2">清空浏览历史</h3>
        <p class="text-sm text-on-surface-variant mb-6">确定要清空所有浏览历史吗？此操作不可恢复。</p>
        
        <div class="flex gap-3">
          <button
            @click="showClearDialog = false"
            class="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-low"
          >
            取消
          </button>
          <button
            @click="handleClearHistory"
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