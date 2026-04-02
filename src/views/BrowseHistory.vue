<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi, handleApiError } from '../api/index.js'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()

const history = ref([])
const loading = ref(false)
const error = ref('')
const showClearDialog = ref(false)

const loadHistory = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await userApi.getBrowseHistory()
    if (response.success || response.code === 0) {
      history.value = response.data || []
    } else {
      throw new Error(response.message || response.msg || '获取浏览历史失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取浏览历史失败:', err)
  } finally {
    loading.value = false
  }
}

const handleExpertDetail = (expertId) => {
  router.push(`/expert/${expertId}`)
}

const handleClearHistory = async () => {
  try {
    const response = await userApi.clearHistory()
    if (response.success || response.code === 0) {
      history.value = []
      showClearDialog.value = false
    } else {
      throw new Error(response.message || response.msg || '清空历史失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('清空历史失败:', err)
  }
}

const handleBack = () => {
  router.back()
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

onMounted(() => {
  loadHistory()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <AppHeader
      title="浏览历史"
      :show-back="true"
      :show-notifications="true"
      :show-search="true"
      :show-avatar="true"
      @back="handleBack"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    >
      <template #right-actions>
        <button
          v-if="history.length > 0"
          @click="showClearDialog = true"
          class="text-sm text-primary font-medium active:scale-95 transition-transform"
        >
          清空
        </button>
      </template>
    </AppHeader>

    <main class="page-content space-y-6">
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