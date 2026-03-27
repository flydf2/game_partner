<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()

const rewardOrders = ref([])
const loading = ref(true)
const activeTab = ref('available')
const error = ref(null)

// 分页相关状态
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
    console.log('开始加载悬赏订单...', { page, isLoadMore })
    
    const response = await api.rewardOrder.getRewardOrders({
      page,
      pageSize: pageSize.value
    })
    
    console.log('API 响应:', response)
    
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
          
          if (isLoadMore) {
            rewardOrders.value = [...rewardOrders.value, ...formattedOrders]
          } else {
            rewardOrders.value = formattedOrders
          }
          
          console.log('转换后的订单数据:', rewardOrders.value)
        } else {
          rewardOrders.value = []
        }
      } else {
        error.value = '获取订单失败: 响应数据格式错误'
        console.error('响应数据格式错误:', responseData)
      }
    } else {
      error.value = '获取订单失败: ' + (response.message || '未知错误')
      console.error('API 响应失败:', response)
    }
  } catch (err) {
    error.value = '加载失败: ' + err.message
    console.error('加载悬赏订单失败:', err)
  } finally {
    loading.value = false
    console.log('加载完成，loading:', loading.value)
  }
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
  console.log('切换到标签:', tabId)
  // 切换标签时重置分页状态并重新加载数据
  currentPage.value = 1
  totalPages.value = 1
  totalCount.value = 0
  loadRewardOrders(1)
}

const handleGrabOrder = async (orderId) => {
  try {
    const response = await api.rewardOrder.grabRewardOrder(orderId)
    if (response.success) {
      console.log('抢单成功:', response.data)
      // 跳转到抢单确认页面
      router.push(`/grab-order/${orderId}`)
    }
  } catch (err) {
    console.error('抢单失败:', err)
  }
}

const handleViewOrder = (orderId) => {
  console.log('查看订单:', orderId)
  // 跳转到订单详情页面
  router.push(`/order/${orderId}`)
}

// 分页控制函数
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    loadRewardOrders(page)
  }
}

// 加载更多函数
const handleLoadMore = () => {
  if (currentPage.value < totalPages.value) {
    const nextPage = currentPage.value + 1
    loadRewardOrders(nextPage, true)
  }
}

onMounted(() => {
  console.log('组件挂载，开始加载数据...')
  loadRewardOrders()
})
</script>

<template>
  <div class="min-h-screen bg-white text-black pb-32">
    <header class="fixed top-0 w-full z-50 bg-white flex items-center justify-between px-5 h-16 border-b border-gray-200">
      <div class="flex items-center gap-4">
        <span
          @click="router.back()"
          class="material-symbols-outlined text-blue-500 cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-blue-500">悬赏订单</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="pt-20 px-5 max-w-2xl mx-auto space-y-6">
      <!-- 调试信息 -->
      <div class="bg-gray-100 p-4 rounded-lg">
        <p>加载状态: {{ loading }}</p>
        <p>错误信息: {{ error }}</p>
        <p>订单数量: {{ rewardOrders.length }}</p>
        <p>当前标签: {{ activeTab }}</p>
      </div>
      <!-- 标签切换 -->
      <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabChange(tab.id)"
          :class="[
            'flex-none px-5 py-2 rounded-full font-headline text-sm transition-all',
            activeTab === tab.id
              ? 'bg-blue-500 text-white font-bold shadow-sm'
              : 'bg-gray-100 text-gray-600 font-medium hover:bg-gray-200'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 错误信息 -->
      <div v-if="error" class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-red-500 text-5xl">error_outline</span>
        </div>
        <h2 class="text-xl font-bold text-red-500 mb-2">加载失败</h2>
        <p class="text-sm text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="loadRewardOrders"
          class="px-6 py-2.5 rounded-full bg-blue-500 text-white font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
        >
          重试
        </button>
      </div>

      <!-- 订单列表 -->
      <div v-else-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <div v-else class="space-y-4">
        <template v-for="order in rewardOrders" :key="order.id">
          <div
            v-if="order && order.status === activeTab"
            :class="[
              'bg-white rounded-3xl p-5 shadow-sm transition-all hover:shadow-md border border-gray-100',
              order.status === 'completed' ? 'opacity-70' : ''
            ]"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full overflow-hidden">
                  <img :alt="order.publisher.name" class="w-full h-full object-cover" :src="order.publisher.avatar" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900">{{ order.publisher.name }}</h3>
                  <p class="text-xs text-gray-500">{{ order.createdAt }}</p>
                </div>
              </div>
              <div :class="[
                'px-3 py-1 rounded-full text-xs font-bold',
                order.status === 'available' ? 'bg-blue-500 text-white' :
                order.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-600'
              ]">
                {{ order.status === 'available' ? '可抢单' : order.status === 'ongoing' ? '进行中' : '已完成' }}
              </div>
            </div>

            <h4 class="font-bold text-gray-900 mb-2">{{ order.title }}</h4>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ order.content }}</p>

            <div class="flex flex-wrap gap-2 mb-3">
              <span class="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{{ order.game }}</span>
              <span v-for="tag in order.tags" :key="tag" class="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{{ tag }}</span>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">支付方式:</span>
                <span :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  order.paymentMethod === 'prepay' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                ]">
                  {{ order.paymentMethod === 'prepay' ? '预支付' : '确认后支付' }}
                </span>
              </div>
              <div class="text-right">
                <p class="text-xl font-headline font-bold text-blue-500">¥{{ order.reward }}</p>
              </div>
            </div>

            <div class="flex gap-3 pt-3">
              <button
                v-if="order.status === 'available'"
                @click="handleGrabOrder(order.id)"
                class="flex-1 py-2.5 rounded-full bg-blue-500 text-white font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
              >
                抢单
              </button>
              <button
                @click="handleViewOrder(order.id)"
                class="flex-1 py-2.5 rounded-full border border-gray-200 text-gray-600 font-headline font-bold text-sm active:scale-95 transition-transform"
              >
                查看详情
              </button>
            </div>
          </div>
        </template>
      </div>

      <div v-if="!loading && !error && rewardOrders.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-gray-400 text-5xl">receipt_long</span>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">暂无订单</h2>
        <p class="text-sm text-gray-500">暂无符合条件的悬赏订单</p>
      </div>

      <!-- 分页控件 -->
      <div v-if="!loading && !error && rewardOrders.length > 0" class="mt-8 space-y-4">
        <!-- 分页信息 -->
        <div class="text-center text-sm text-gray-500">
          共 {{ totalCount }} 条记录，第 {{ currentPage }}/{{ totalPages }} 页
        </div>
        
        <!-- 分页按钮 -->
        <div class="flex items-center justify-center gap-2">
          <button
            @click="handlePageChange(1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-full border border-gray-200 text-gray-600 font-medium text-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            首页
          </button>
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-full border border-gray-200 text-gray-600 font-medium text-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-full border border-gray-200 text-gray-600 font-medium text-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
          <button
            @click="handlePageChange(totalPages)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-full border border-gray-200 text-gray-600 font-medium text-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            末页
          </button>
        </div>
        
        <!-- 加载更多按钮 -->
        <div class="text-center">
          <button
            v-if="currentPage < totalPages"
            @click="handleLoadMore"
            class="px-6 py-2.5 rounded-full bg-blue-500 text-white font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
          >
            加载更多
          </button>
          <div v-else class="text-sm text-gray-500">
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