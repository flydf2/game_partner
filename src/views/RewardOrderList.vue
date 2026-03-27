<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()

const rewardOrders = ref([])
const loading = ref(true)
const activeTab = ref('available')
const error = ref(null)

const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)
const pageSize = ref(20)

const tabs = [
  { id: 'available', label: '可抢单' },
  { id: 'ongoing', label: '进行中' },
  { id: 'completed', label: '已完成' }
]

const loadRewardOrders = async (page = 1, isLoadMore = false) => {
  try {
    if (!isLoadMore) {
      loading.value = true
    }
    error.value = null
    
    const response = await api.rewardOrder.getRewardOrders({
      page,
      pageSize: pageSize.value,
      status: activeTab.value
    })
    
    if (response && response.success) {
      const responseData = response.data
      
      if (responseData && typeof responseData === 'object') {
        if (responseData.pagination) {
          currentPage.value = responseData.pagination.currentPage || page
          totalPages.value = responseData.pagination.totalPages || 1
          totalCount.value = responseData.pagination.totalCount || 0
        }
        
        const ordersData = Array.isArray(responseData.data) ? responseData.data : (Array.isArray(responseData) ? responseData : [])
        
        if (ordersData.length > 0) {
          const formattedOrders = ordersData.map(order => ({
            id: order.id,
            status: order.status,
            title: order.title || `${order.game}悬赏单`,
            content: order.content || order.description || '',
            reward: order.reward,
            game: order.game,
            publisher: {
              name: order.userName || '匿名用户',
              avatar: order.userAvatar || 'https://via.placeholder.com/100'
            },
            createdAt: order.createdAt,
            paymentMethod: order.paymentMethod,
            tags: order.tags || [],
            requirements: order.requirements || []
          }))
          
          if (isLoadMore) {
            rewardOrders.value = [...rewardOrders.value, ...formattedOrders]
          } else {
            rewardOrders.value = formattedOrders
          }
        } else {
          rewardOrders.value = []
        }
      }
    } else {
      error.value = '获取订单失败: ' + (response.message || '未知错误')
    }
  } catch (err) {
    error.value = '加载失败: ' + err.message
    console.error('加载悬赏订单失败:', err)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
  currentPage.value = 1
  totalPages.value = 1
  totalCount.value = 0
  loadRewardOrders(1)
}

const handleGrabOrder = async (orderId) => {
  try {
    const response = await api.rewardOrder.grabRewardOrder(orderId)
    if (response.success) {
      router.push(`/grab-order/${orderId}`)
    }
  } catch (err) {
    console.error('抢单失败:', err)
  }
}

const handleViewOrder = (orderId) => {
  router.push(`/reward/${orderId}`)
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    loadRewardOrders(page)
  }
}

const handleLoadMore = () => {
  if (currentPage.value < totalPages.value) {
    const nextPage = currentPage.value + 1
    loadRewardOrders(nextPage, true)
  }
}

onMounted(() => {
  loadRewardOrders()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-outline-variant/20">
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

    <main class="pt-20 px-5 max-w-md mx-auto space-y-6">
      <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabChange(tab.id)"
          :class="[
            'flex-none px-5 py-2 rounded-full font-headline text-sm transition-all',
            activeTab === tab.id
              ? 'bg-primary text-on-primary font-bold shadow-sm'
              : 'bg-surface-container text-on-surface-variant font-medium hover:bg-surface-container-high'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="error" class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-error text-5xl">error_outline</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">加载失败</h2>
        <p class="text-sm text-on-surface-variant mb-4">{{ error }}</p>
        <button 
          @click="loadRewardOrders"
          class="px-6 py-2.5 rounded-full bg-primary text-on-primary font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
        >
          重试
        </button>
      </div>

      <div v-else-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else class="space-y-4">
        <template v-for="order in rewardOrders" :key="order.id">
          <div
            :class="[
              'bg-surface-container-lowest rounded-2xl p-5 shadow-sm transition-all hover:shadow-md border border-outline-variant/10',
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
                order.status === 'available' ? 'bg-primary text-on-primary' :
                order.status === 'ongoing' ? 'bg-tertiary-container text-on-tertiary-container' :
                'bg-surface-container text-on-surface-variant'
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

            <div class="flex items-center justify-between pt-3 border-t border-outline-variant/10">
              <div class="flex items-center gap-2">
                <span class="text-xs text-on-surface-variant">支付方式:</span>
                <span :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  order.paymentMethod === 'prepay' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'
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
                class="flex-1 py-2.5 rounded-full bg-primary text-on-primary font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
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
        </template>
      </div>

      <div v-if="!loading && !error && rewardOrders.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-on-surface-variant text-5xl">receipt_long</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无订单</h2>
        <p class="text-sm text-on-surface-variant">暂无符合条件的悬赏订单</p>
      </div>

      <div v-if="!loading && !error && rewardOrders.length > 0" class="mt-8 space-y-4">
        <div class="text-center text-sm text-on-surface-variant">
          共 {{ totalCount }} 条记录，第 {{ currentPage }}/{{ totalPages }} 页
        </div>
        
        <div class="flex items-center justify-center gap-2">
          <button
            @click="handlePageChange(1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-full border border-outline-variant/20 text-on-surface-variant font-medium text-sm transition-all hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed"
          >
            首页
          </button>
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-full border border-outline-variant/20 text-on-surface-variant font-medium text-sm transition-all hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-full border border-outline-variant/20 text-on-surface-variant font-medium text-sm transition-all hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
          <button
            @click="handlePageChange(totalPages)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-full border border-outline-variant/20 text-on-surface-variant font-medium text-sm transition-all hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed"
          >
            末页
          </button>
        </div>
        
        <div class="text-center">
          <button
            v-if="currentPage < totalPages"
            @click="handleLoadMore"
            class="px-6 py-2.5 rounded-full bg-primary text-on-primary font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
          >
            加载更多
          </button>
          <div v-else class="text-sm text-on-surface-variant">
            已加载全部数据
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
