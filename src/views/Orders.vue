<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ListPageHeader from '../components/ListPageHeader.vue'
import { orderApi, handleApiError } from '../api/index.js'

const router = useRouter()

const handleBack = () => {
  router.back()
}

const handleMenu = () => {
  router.push('/profile')
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

const getStatusText = (status) => {
  const statusMap = {
    pending: '待确认',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    ongoing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return classMap[status] || ''
}

const formatTime = (time) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  return date.toLocaleDateString()
}

const getDurationText = (status) => {
  if (status === 'completed') return '服务完成'
  if (status === 'cancelled') return '已取消'
  return '进行中'
}

const loadOrders = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await orderApi.getOrders(activeTab.value === 'all' ? 'all' : activeTab.value)
    if (response.success || response.code === 0) {
      orders.value = (response.data?.data || response.data || []).map(order => ({
        ...order,
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
    error.value = err.message || '获取订单失败'
    console.error('获取订单失败:', err)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
  loadOrders()
}

const handleChat = (orderId) => {
  router.push(`/chat/${orderId}`)
}

const handleEnterRoom = (orderId) => {
  console.log('进入房间:', orderId)
  alert('进入房间功能已开发')
}

const handleOrderAgain = (orderId) => {
  const order = orders.value.find(o => o.id === orderId)
  console.log('再来一单:', orderId, order)

  if (order) {
    router.push({
      path: '/confirm-order',
      query: {
        userId: order.playmateId,
        skillId: order.skillId,
        serviceTime: '',
        amount: order.price.toString()
      }
    })
  }
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
  router.push(`/order/${orderId}`)
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-32">
    <ListPageHeader
      title="我的订单"
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />
    
    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
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

      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <span class="material-symbols-outlined text-4xl text-outline mb-4">error_outline</span>
        <p class="text-sm text-on-surface-variant mb-4">{{ error }}</p>
        <button
          @click="loadOrders"
          class="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          重试
        </button>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-outline text-5xl">assignment</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无订单</h2>
        <p class="text-sm text-on-surface-variant">开始预约陪玩，订单会显示在这里</p>
      </div>

      <div v-for="order in filteredOrders" :key="order.id" class="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
        <div class="flex items-start gap-4 mb-4">
          <img
            :src="order.playmate.avatar"
            :alt="order.playmate.name"
            class="w-14 h-14 rounded-2xl object-cover"
          />
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-bold text-on-surface mb-1">{{ order.playmate.name }}</h3>
                <div class="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span>{{ order.playmate.game }}</span>
                  <span>•</span>
                  <span>{{ order.playmate.service }}</span>
                </div>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-bold',
                  order.statusClass
                ]"
              >
                {{ order.statusText }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-xs text-on-surface-variant">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">schedule</span>
                {{ order.time }}
              </span>
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">access_time</span>
                {{ order.duration }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-outline/10">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-primary">¥{{ order.price }}</span>
            <span class="text-xs text-on-surface-variant">/ {{ order.duration }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="order.status === 'pending'"
              @click.stop="handleAcceptOrder(order.id)"
              class="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold active:scale-95 transition-all"
            >
              接单
            </button>
            <button
              v-if="order.status === 'pending'"
              @click.stop="handleRejectOrder(order.id)"
              class="px-4 py-2 bg-error text-on-error rounded-full text-xs font-bold active:scale-95 transition-all"
            >
              拒绝
            </button>
            <button
              v-if="order.status === 'ongoing'"
              @click.stop="handleConfirmOrder(order.id)"
              class="px-4 py-2 bg-success text-on-success rounded-full text-xs font-bold active:scale-95 transition-all"
            >
              确认完成
            </button>
            <button
              v-if="order.status === 'pending'"
              @click.stop="handleCancelOrder(order.id)"
              class="px-4 py-2 bg-error text-on-error rounded-full text-xs font-bold active:scale-95 transition-all"
            >
              取消
            </button>
            <button
              v-if="order.status === 'completed'"
              @click.stop="handleOrderAgain(order.id)"
              class="px-4 py-2 bg-surface-container-high text-on-surface rounded-full text-xs font-bold active:scale-95 transition-all"
            >
              再来一单
            </button>
            <button
              v-if="order.status === 'completed'"
              @click.stop="handleReview(order.id)"
              class="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold active:scale-95 transition-all"
            >
              评价
            </button>
            <button
              @click.stop="handleViewDetails(order.id)"
              class="px-4 py-2 bg-surface-container-high text-on-surface rounded-full text-xs font-bold active:scale-95 transition-all"
            >
              查看详情
            </button>
            <button
              @click.stop="handleChat(order.id)"
              class="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold active:scale-95 transition-all"
            >
              聊天
            </button>
            <button
              v-if="order.status === 'ongoing'"
              @click.stop="handleEnterRoom(order.id)"
              class="px-4 py-2 bg-success text-on-success rounded-full text-xs font-bold active:scale-95 transition-all"
            >
              进入房间
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredOrders.length > 0 && !loading && !error" class="py-8">
        <div class="text-center">
          <p class="text-sm text-on-surface-variant">没有更多订单了</p>
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
