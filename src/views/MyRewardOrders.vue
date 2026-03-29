<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32" >
    
    <AppHeader
      title="我发布的悬赏"
      @back="handleBack"
    />
    
    <main class="page-content pb-32">
      <!-- 状态筛选 -->
      <div class="flex border-b border-surface-container bg-surface sticky top-[var(--header-height)] z-10 overflow-x-auto">
        <button 
          v-for="status in orderStatuses" 
          :key="status.key"
          class="flex-shrink-0 px-4 py-4 text-center font-medium transition-all whitespace-nowrap"
          :class="{ 'text-primary border-b-2 border-primary': activeStatus === status.key, 'text-on-surface-variant': activeStatus !== status.key }"
          @click="activeStatus = status.key"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="p-5 space-y-4">
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
              @click="loadOrders"
            >
              重试
            </button>
          </div>
        </div>

        <!-- 订单列表 -->
        <div v-else-if="filteredOrders.length > 0" class="space-y-4">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id"
            class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 active:scale-[0.98] hover:bg-surface-container-low cursor-pointer"
            @click="handleOrderDetail(order.id)"
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
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-2">
                <span class="text-xs text-on-surface-variant">发布时间</span>
                <span class="text-xs text-on-surface-variant">{{ order.createdAt }}</span>
              </div>
              <div v-if="order.applicantCount > 0" class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-on-surface-variant">groups</span>
                <span class="text-xs text-on-surface-variant">{{ order.applicantCount }}人已抢单</span>
              </div>
            </div>
            
            <!-- 新添加的字段 -->
            <div class="flex flex-wrap gap-4 mb-3">
              <div v-if="order.gameRank" class="flex items-center gap-1">
                <span class="text-xs text-on-surface-variant">段位</span>
                <span class="text-xs font-medium">{{ order.gameRank }}</span>
              </div>
              <div v-if="order.startTime" class="flex items-center gap-1">
                <span class="text-xs text-on-surface-variant">开始时间</span>
                <span class="text-xs font-medium">{{ formatTime(order.startTime) }}</span>
              </div>
              <div v-if="order.duration" class="flex items-center gap-1">
                <span class="text-xs text-on-surface-variant">时长</span>
                <span class="text-xs font-medium">{{ order.duration }}小时</span>
              </div>
              <div v-if="order.location" class="flex items-center gap-1">
                <span class="text-xs text-on-surface-variant">位置</span>
                <span class="text-xs font-medium">{{ order.location }}</span>
              </div>
              <div v-if="order.timeLeft" class="flex items-center gap-1">
                <span class="text-xs text-on-surface-variant">剩余时间</span>
                <span class="text-xs font-medium text-error">{{ order.timeLeft }}</span>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button 
                v-if="order.status === 'pending'"
                class="px-3 py-1 text-xs font-medium border border-primary text-primary rounded-full hover:bg-primary/5 transition-colors"
                @click.stop="handleCancelOrder(order.id)"
              >
                取消订单
              </button>
              <button 
                class="px-3 py-1 text-xs font-medium bg-primary text-on-primary rounded-full hover:bg-primary-dim transition-colors"
                @click.stop="handleOrderDetail(order.id)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="bg-surface-container-lowest rounded-3xl p-8 text-center">
          <div class="w-20 h-20 mx-auto bg-surface-container flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-outline text-4xl">rewards</span>
          </div>
          <p class="text-sm text-on-surface-variant">暂无发布的悬赏订单</p>
          <button 
            class="mt-4 px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
            @click="handlePublishReward"
          >
            发布悬赏
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { rewardOrderApi as rewardApi, handleApiError } from '../api/index.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const { showToast } = useToast()

const activeStatus = ref('all')
const loading = ref(false)
const error = ref('')
const orders = ref([])

const orderStatuses = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待抢单' },
  { key: 'ongoing', label: '进行中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
]

const filteredOrders = computed(() => {
  if (activeStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === activeStatus.value)
})

const loadOrders = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await rewardApi.getMyRewardOrders()
    if (response.success || response.code === 0) {
      orders.value = (response.data?.data || response.data || []).map(order => ({
        id: order.id,
        title: order.title || '未知标题',
        game: order.game || '未知游戏',
        amount: order.amount || 0,
        status: order.status,
        statusText: getStatusText(order.status),
        applicantCount: order.applicantCount || 0,
        createdAt: formatDate(order.createdAt),
        timeLeft: order.timeLeft || order.deadline || '',
        gameRank: order.gameRank || '',
        startTime: order.startTime || '',
        duration: order.duration || 0,
        location: order.location || ''
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

// 格式化时间
const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleOrderDetail = (orderId) => {
  router.push(`/reward/${orderId}`)
}

const handleCancelOrder = async (orderId) => {
  try {
    const response = await rewardApi.cancelRewardOrder(orderId)
    if (response.success || response.code === 0) {
      showToast('订单已取消', 'success')
      loadOrders()
    } else {
      throw new Error(response.message || response.msg || '取消订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    showToast(result.error, 'error')
    console.error('取消订单失败:', err)
  }
}

const handlePublishReward = () => {
  router.push('/reward/publish')
}

const handleBack = () => {
  router.back()
}

watch(activeStatus, () => {
  // 状态切换时不需要重新加载，因为我们已经有了所有数据
})

onMounted(() => {
  loadOrders()
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
  
  button {
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