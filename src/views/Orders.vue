<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { orderApi, handleApiError } from '../api/index.js'

const router = useRouter()

const handleBack = () => {
  router.back()
}

const activeTab = ref('all')
const orders = ref([])
const loading = ref(false)
const error = ref(null)

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待确认' },
  { id: 'ongoing', label: '进行中' },
  { id: 'completed', label: '已完成' },
  { id: 'cancelled', label: '已取消' }
]

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return orders.value
  } else {
    return orders.value.filter(order => order.status === activeTab.value)
  }
})

const loadOrders = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await orderApi.getOrders(activeTab.value === 'all' ? 'all' : activeTab.value)
    if (response.success || response.code === 0) {
      // 转换订单数据格式
      orders.value = (response.data?.data || response.data || []).map(order => ({
        id: order.id,
        status: order.status,
        statusText: getStatusText(order.status),
        statusClass: getStatusClass(order.status),
        playmate: {
          name: order.expertName || order.playmate?.name || '未知',
          game: order.game || order.playmate?.game || '未知',
          service: order.skill || order.playmate?.service || '未知服务',
          avatar: order.expertAvatar || order.playmate?.avatar || 'https://via.placeholder.com/150'
        },
        time: formatTime(order.serviceTime || order.createdAt),
        duration: getDurationText(order.status),
        price: order.amount || order.price || 0
      }))
    } else {
      throw new Error(response.message || response.msg || '获取订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取订单失败:', err)
  } finally {
    loading.value = false
  }
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待确认',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

const getStatusClass = (status) => {
  const classMap = {
    pending: 'bg-primary-container text-on-primary-container',
    ongoing: 'bg-tertiary-container/20 text-on-tertiary-container',
    completed: 'bg-surface-container-high text-on-surface-variant',
    cancelled: 'bg-error-container/10 text-error'
  }
  return classMap[status] || 'bg-surface-container text-on-surface'
}

const getDurationText = (status) => {
  switch (status) {
    case 'ongoing':
      return '2小时 • 1局'
    case 'completed':
      return '1小时 • 娱乐上分'
    case 'pending':
      return '等待确认中...'
    case 'cancelled':
      return '用户已取消申请'
    default:
      return ''
  }
}

const formatTime = (dateString) => {
  if (!dateString) return '未知时间'
  
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return `今天, ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  } else if (days === 1) {
    return `昨天, ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const handleTabChange = async (tabId) => {
  activeTab.value = tabId
  await loadOrders()
}

const handleContact = (orderId) => {
  console.log('联系Ta:', orderId)
  // 跳转到聊天页面
  router.push(`/chat/${orderId}`)
}

const handleEnterRoom = (orderId) => {
  console.log('进入房间:', orderId)
  // 这里可以添加进入房间的逻辑
  alert('进入房间功能已开发')
}

const handleOrderAgain = (orderId) => {
  console.log('再来一单:', orderId)
  // 跳转到确认订单页面
  router.push('/confirm-order')
}

const handleReview = (orderId) => {
  console.log('去评价:', orderId)
  router.push(`/review/${orderId}`)
}

const handleCancelOrder = async (orderId) => {
  try {
    const response = await orderApi.cancelOrder(orderId)
    if (response.success || response.code === 0) {
      alert('订单已取消')
      await loadOrders()
    } else {
      alert(response.message || response.msg || '取消订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '取消订单失败，请重试')
    console.error('取消订单失败:', err)
  }
}

const handleConfirmOrder = async (orderId) => {
  try {
    const response = await orderApi.confirmOrder(orderId)
    if (response.success || response.code === 0) {
      alert('订单已确认')
      await loadOrders()
    } else {
      alert(response.message || response.msg || '确认订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '确认订单失败，请重试')
    console.error('确认订单失败:', err)
  }
}

const handleAcceptOrder = async (orderId) => {
  try {
    const response = await orderApi.acceptOrder(orderId)
    if (response.success || response.code === 0) {
      alert('订单已接单')
      await loadOrders()
    } else {
      alert(response.message || response.msg || '接单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '接单失败，请重试')
    console.error('接单失败:', err)
  }
}

const handleRejectOrder = async (orderId) => {
  try {
    const response = await orderApi.rejectOrder(orderId)
    if (response.success || response.code === 0) {
      alert('订单已拒绝')
      await loadOrders()
    } else {
      alert(response.message || response.msg || '拒绝订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '拒绝订单失败，请重试')
    console.error('拒绝订单失败:', err)
  }
}

const handleViewDetails = (orderId) => {
  console.log('查看详情:', orderId)
  // 跳转到订单详情页面
  router.push(`/order/${orderId}`)
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">我的订单</h1>
      </div>
      <div class="w-6"></div>
      <div class="absolute bottom-0 left-0 bg-zinc-100 dark:bg-zinc-800 h-[1px] w-full self-end opacity-20"></div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
      <!-- Status Tabs -->
      <div class="px-5 py-4 sticky top-16 bg-background z-40">
        <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="handleTabChange(tab.id)"
            :class="[
              'flex-none px-5 py-2 rounded-full font-headline text-sm transition-all',
              activeTab === tab.id
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant font-medium hover:bg-surface-container-high'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-20 px-5">
        <span class="material-symbols-outlined text-4xl text-error mb-4">error_outline</span>
        <p class="text-center text-error mb-4">{{ error }}</p>
        <button
          @click="loadOrders"
          class="px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold active:scale-95 transition-transform"
        >
          重试
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-20 px-5">
        <span class="material-symbols-outlined text-4xl text-outline mb-4">receipt_long</span>
        <p class="text-center text-on-surface-variant mb-4">暂无订单</p>
        <button
          @click="router.push('/discover')"
          class="px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold active:scale-95 transition-transform"
        >
          去下单
        </button>
      </div>

      <!-- Orders List -->
      <div v-else class="px-5 space-y-4">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          :class="[
            'bg-surface-container-lowest rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden',
            order.status === 'cancelled' ? 'opacity-70 grayscale-[0.5]' : ''
          ]"
        >
          <div class="absolute top-0 right-0">
            <div :class="['text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider', order.statusClass]">
              {{ order.statusText }}
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-primary-container/10 flex items-center justify-center">
              <img :alt="order.playmate.name" class="w-full h-full object-cover" :src="order.playmate.avatar" />
            </div>
            <div>
              <h3 class="font-headline font-bold text-on-surface text-base">{{ order.playmate.name }}</h3>
              <p class="text-on-surface-variant text-xs font-medium">{{ order.playmate.game }} • {{ order.playmate.service }}</p>
            </div>
          </div>

          <div v-if="order.status !== 'cancelled'" class="bg-surface-container-low rounded-xl p-3 flex justify-between items-center">
            <div class="space-y-1">
              <div class="flex items-center gap-1.5 text-on-surface-variant">
                <span class="material-symbols-outlined text-sm">
                  {{ order.status === 'ongoing' ? 'schedule' : order.status === 'completed' ? 'event_available' : 'hourglass_empty' }}
                </span>
                <span class="text-xs">{{ order.time }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-on-surface-variant">
                <span class="material-symbols-outlined text-sm">timelapse</span>
                <span class="text-xs">{{ order.duration }}</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">总价</p>
              <p class="text-xl font-headline font-extrabold" :class="order.status === 'completed' ? 'text-on-surface-variant' : 'text-primary'">
                ${{ order.price.toFixed(2) }}
              </p>
            </div>
          </div>

          <div v-if="order.status === 'cancelled'" class="flex justify-between items-center text-on-surface-variant">
            <span class="text-xs italic">{{ order.duration }}</span>
            <button @click="handleViewDetails(order.id)" class="text-xs font-bold text-primary underline active:scale-95 transition-transform">查看详情</button>
          </div>

          <div v-if="order.status === 'ongoing'" class="flex gap-3 pt-1">
            <button @click="handleContact(order.id)" class="flex-1 py-2.5 rounded-full bg-surface-container-high text-primary font-headline font-bold text-sm active:scale-95 transition-transform">
              联系Ta
            </button>
            <button @click="handleEnterRoom(order.id)" class="flex-1 py-2.5 rounded-full bg-primary text-on-primary-fixed font-headline font-bold text-sm shadow-md active:scale-95 transition-transform">
              进入房间
            </button>
          </div>

          <div v-if="order.status === 'completed'" class="flex gap-3 pt-1">
            <button @click="handleOrderAgain(order.id)" class="flex-1 py-2.5 rounded-full border border-outline-variant/20 text-on-surface-variant font-headline font-bold text-sm active:scale-95 transition-transform">
              再来一单
            </button>
            <button @click="handleReview(order.id)" class="flex-1 py-2.5 rounded-full bg-tertiary-container text-on-tertiary-container font-headline font-bold text-sm shadow-md active:scale-95 transition-transform">
              去评价
            </button>
          </div>

          <div v-if="order.status === 'pending'" class="flex gap-3 pt-1">
            <button @click="handleCancelOrder(order.id)" class="w-full py-2.5 rounded-full bg-surface-container-high text-error font-headline font-bold text-sm active:scale-95 transition-transform">
              取消订单
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>