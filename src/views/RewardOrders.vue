<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()

const rewardOrders = ref([])
const loading = ref(true)
const activeTab = ref('available')

const tabs = [
  { id: 'available', label: '可抢单' },
  { id: 'ongoing', label: '进行中' },
  { id: 'completed', label: '已完成' }
]

const loadRewardOrders = async () => {
  try {
    loading.value = true
    const response = await api.rewardOrder.getRewardOrders()
    if (response.success && Array.isArray(response.data)) {
      // 转换数据结构以匹配组件期望的格式
      rewardOrders.value = response.data.map(order => ({
        id: order.id,
        status: order.status,
        title: `${order.content.substring(0, 20)}${order.content.length > 20 ? '...' : ''}`,
        content: order.content,
        reward: order.reward,
        game: order.game,
        publisher: {
          name: order.userName,
          avatar: order.userAvatar
        },
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
        tags: order.tags || []
      }))
    } else {
      console.error('获取的订单数据格式不正确')
      rewardOrders.value = []
    }
  } catch (error) {
    console.error('加载悬赏订单失败:', error)
    rewardOrders.value = []
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
}

const handleGrabOrder = async (orderId) => {
  try {
    const response = await api.rewardOrder.grabRewardOrder(orderId)
    if (response.success) {
      console.log('抢单成功:', response.data)
      // 跳转到抢单确认页面
      router.push(`/grab-order/${orderId}`)
    }
  } catch (error) {
    console.error('抢单失败:', error)
  }
}

const handleViewOrder = (orderId) => {
  console.log('查看订单:', orderId)
  // 跳转到订单详情页面
  router.push(`/order/${orderId}`)
}

onMounted(() => {
  loadRewardOrders()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-surface-container-low/50">
      <div class="flex items-center gap-4">
        <span
          @click="router.back()"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">悬赏订单</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="pt-20 px-5 max-w-2xl mx-auto space-y-6">
      <!-- 标签切换 -->
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

      <!-- 订单列表 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="order in rewardOrders"
          :key="order.id"
          v-if="order.status === activeTab"
          :class="[
            'bg-surface-container-lowest rounded-3xl p-5 shadow-sm transition-all hover:shadow-md',
            order.status === 'completed' ? 'opacity-70' : ''
          ]"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden">
                <img :alt="order.publisher.name" class="w-full h-full object-cover" :src="order.publisher.avatar" />
              </div>
              <div>
                <h3 class="font-bold text-on-surface">{{ order.publisher.name }}</h3>
                <p class="text-xs text-on-surface-variant">{{ order.createdAt }}</p>
              </div>
            </div>
            <div :class="[
              'px-3 py-1 rounded-full text-xs font-bold',
              order.status === 'available' ? 'bg-primary-container text-on-primary-container' :
              order.status === 'ongoing' ? 'bg-tertiary-container/20 text-on-tertiary-container' :
              'bg-surface-container-high text-on-surface-variant'
            ]">
              {{ order.status === 'available' ? '可抢单' : order.status === 'ongoing' ? '进行中' : '已完成' }}
            </div>
          </div>

          <h4 class="font-bold text-on-surface mb-2">{{ order.title }}</h4>
          <p class="text-sm text-on-surface-variant mb-3 line-clamp-2">{{ order.content }}</p>

          <div class="flex flex-wrap gap-2 mb-3">
            <span class="px-2 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">{{ order.game }}</span>
            <span v-for="tag in order.tags" :key="tag" class="px-2 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">{{ tag }}</span>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-surface-container-low/50">
            <div class="flex items-center gap-2">
              <span class="text-xs text-on-surface-variant">支付方式:</span>
              <span :class="[
                'px-2 py-0.5 rounded-full text-xs font-medium',
                order.paymentMethod === 'prepay' ? 'bg-primary-container/10 text-primary' : 'bg-secondary-container/10 text-secondary'
              ]">
                {{ order.paymentMethod === 'prepay' ? '预支付' : '确认后支付' }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-xl font-headline font-bold text-primary">¥{{ order.reward }}</p>
            </div>
          </div>

          <div class="flex gap-3 pt-3">
            <button
              v-if="order.status === 'available'"
              @click="handleGrabOrder(order.id)"
              class="flex-1 py-2.5 rounded-full bg-primary text-on-primary-fixed font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
            >
              抢单
            </button>
            <button
              @click="handleViewOrder(order.id)"
              class="flex-1 py-2.5 rounded-full border border-outline-variant/20 text-on-surface-variant font-headline font-bold text-sm active:scale-95 transition-transform"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>

      <div v-if="!loading && rewardOrders.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-outline text-5xl">receipt_long</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无订单</h2>
        <p class="text-sm text-on-surface-variant">暂无符合条件的悬赏订单</p>
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