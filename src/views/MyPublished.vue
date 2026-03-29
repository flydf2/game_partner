<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32" >
    
    <AppHeader
      title="我的发布"
      @back="handleBack"
    />
    
    <main class="page-content pb-32">
      <!-- 标签页 -->
      <div class="flex border-b border-surface-container bg-surface sticky top-[var(--header-height)] z-10">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          class="flex-1 py-4 text-center font-medium transition-all"
          :class="{ 'text-primary border-b-2 border-primary': activeTab === tab.key, 'text-on-surface-variant': activeTab !== tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="p-5">
        <!-- 悬赏订单 -->
        <div v-if="activeTab === 'reward'" class="space-y-4">
          <!-- 加载状态 -->
          <div v-if="loading" class="bg-surface-container-lowest rounded-3xl p-8 flex items-center justify-center">
            <div class="flex flex-col items-center gap-3">
              <div class="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
              <p class="text-sm text-on-surface-variant">加载中...</p>
            </div>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="error" class="bg-surface-container-lowest rounded-3xl p-6">
            <div class="flex flex-col items-center gap-3">
              <span class="material-symbols-outlined text-error text-3xl">error_outline</span>
              <p class="text-sm text-error">{{ error }}</p>
              <button 
                class="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
                @click="loadRewardOrders"
              >
                重试
              </button>
            </div>
          </div>

          <!-- 订单列表 -->
          <div v-else-if="rewardOrders.length > 0" class="space-y-4">
            <div 
              v-for="order in rewardOrders" 
              :key="order.id"
              class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 active:scale-[0.98] hover:bg-surface-container-low cursor-pointer"
              @click="handleRewardOrderDetail(order.id)"
            >
              <div class="flex justify-between items-start mb-4">
                <h4 class="font-bold text-sm">{{ order.title }}</h4>
                <span :class="getOrderStatusClass(order.status)" class="text-xs font-bold px-2 py-1 rounded-full">
                  {{ order.statusText }}
                </span>
              </div>
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-on-surface-variant">游戏</span>
                  <span class="text-sm font-medium">{{ order.game }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-on-surface-variant">金额</span>
                  <span class="text-sm font-bold text-primary">¥{{ order.amount }}</span>
                </div>
              </div>
              <div class="text-xs text-on-surface-variant">
                {{ order.createdAt }}
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="bg-surface-container-lowest rounded-3xl p-8 text-center">
            <div class="w-20 h-20 mx-auto bg-surface-container flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-outline text-4xl">rewards</span>
            </div>
            <p class="text-sm text-on-surface-variant">暂无发布的悬赏</p>
            <button 
              class="mt-4 px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
              @click="handlePublishReward"
            >
              发布悬赏
            </button>
          </div>
        </div>

        <!-- 动态 -->
        <div v-if="activeTab === 'posts'" class="space-y-4">
          <!-- 加载状态 -->
          <div v-if="loading" class="bg-surface-container-lowest rounded-3xl p-8 flex items-center justify-center">
            <div class="flex flex-col items-center gap-3">
              <div class="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
              <p class="text-sm text-on-surface-variant">加载中...</p>
            </div>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="error" class="bg-surface-container-lowest rounded-3xl p-6">
            <div class="flex flex-col items-center gap-3">
              <span class="material-symbols-outlined text-error text-3xl">error_outline</span>
              <p class="text-sm text-error">{{ error }}</p>
              <button 
                class="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
                @click="loadPosts"
              >
                重试
              </button>
            </div>
          </div>

          <!-- 动态列表 -->
          <div v-else-if="posts.length > 0" class="space-y-4">
            <div 
              v-for="post in posts" 
              :key="post.id"
              class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 active:scale-[0.98] hover:bg-surface-container-low cursor-pointer"
              @click="handlePostDetail(post.id)"
            >
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 rounded-full overflow-hidden">
                  <img :src="post.avatar" alt="Avatar" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-sm">{{ post.nickname }}</h4>
                  <p class="text-xs text-on-surface-variant mt-1">{{ post.content }}</p>
                </div>
              </div>
              <div v-if="post.image" class="w-full rounded-2xl overflow-hidden mb-3">
                <img :src="post.image" alt="Post Image" class="w-full h-auto object-cover" />
              </div>
              <div class="flex items-center justify-between text-xs text-on-surface-variant">
                <span>{{ post.createdAt }}</span>
                <div class="flex items-center gap-4">
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">favorite</span>
                    {{ post.likes }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">comment</span>
                    {{ post.comments }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="bg-surface-container-lowest rounded-3xl p-8 text-center">
            <div class="w-20 h-20 mx-auto bg-surface-container flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-outline text-4xl">post_add</span>
            </div>
            <p class="text-sm text-on-surface-variant">暂无发布的动态</p>
            <button 
              class="mt-4 px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
              @click="handleCreatePost"
            >
              发布动态
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { rewardOrderApi as rewardApi, communityApi, handleApiError } from '../api/index.js'

const router = useRouter()

const activeTab = ref('reward')
const loading = ref(false)
const error = ref('')
const rewardOrders = ref([])
const posts = ref([])

const tabs = [
  { key: 'reward', label: '悬赏订单' },
  { key: 'posts', label: '动态' }
]

const loadRewardOrders = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await rewardApi.getMyRewardOrders()
    if (response.success || response.code === 0) {
      rewardOrders.value = (response.data?.data || response.data || []).map(order => ({
        id: order.id,
        title: order.title || '未知标题',
        game: order.game || '未知游戏',
        amount: order.amount || 0,
        status: order.status,
        statusText: getStatusText(order.status),
        createdAt: formatDate(order.createdAt)
      }))
    } else {
      throw new Error(response.message || response.msg || '获取悬赏订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取悬赏订单失败:', err)
  } finally {
    loading.value = false
  }
}

const loadPosts = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await communityApi.getMyPosts()
    if (response.success || response.code === 0) {
      posts.value = (response.data?.data || response.data || []).map(post => ({
        id: post.id,
        avatar: post.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
        nickname: post.nickname || '用户',
        content: post.content || '',
        image: post.image || '',
        likes: post.likes || 0,
        comments: post.comments || 0,
        createdAt: formatDate(post.createdAt)
      }))
    } else {
      throw new Error(response.message || response.msg || '获取动态失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取动态失败:', err)
  } finally {
    loading.value = false
  }
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待抢单',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

const getOrderStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-primary/10 text-primary'
    case 'ongoing':
      return 'bg-blue-100 text-blue-600'
    case 'completed':
      return 'bg-green-100 text-green-600'
    case 'cancelled':
      return 'bg-zinc-100 text-zinc-600'
    default:
      return 'bg-surface-container text-on-surface-variant'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '未知时间'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const handleRewardOrderDetail = (orderId) => {
  router.push(`/reward/${orderId}`)
}

const handlePostDetail = (postId) => {
  router.push(`/post/${postId}`)
}

const handlePublishReward = () => {
  router.push('/reward/publish')
}

const handleCreatePost = () => {
  router.push('/create-post')
}

const handleBack = () => {
  router.back()
}

watch(activeTab, (newTab) => {
  if (newTab === 'reward') {
    loadRewardOrders()
  } else if (newTab === 'posts') {
    loadPosts()
  }
})

onMounted(() => {
  loadRewardOrders()
})
</script>

<style scoped>
/* 组件样式 */

/* 页面滚动动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

main {
  animation: fadeIn 0.5s ease-out forwards;
}

/* 移动端适配 */
@media (max-width: 375px) {
  .p-5 {
    padding: 1rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 触摸反馈优化 */
button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
</style>