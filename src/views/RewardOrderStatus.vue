<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()

const rewardOrders = ref([])
const loading = ref(true)
const activeTab = ref('pending')
const error = ref(null)

const tabs = [
  { id: 'pending', label: '等待选择', count: 1 },
  { id: 'selected', label: '已入选', count: 1 },
  { id: 'completed', label: '已完成', count: 1 }
]

const loadRewardOrders = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await api.rewardOrder.getMyRewardOrders()
    
    if (response && response.success) {
      const responseData = response.data
      
      if (responseData && typeof responseData === 'object') {
        const ordersData = Array.isArray(responseData.data) ? responseData.data : (Array.isArray(responseData) ? responseData : [])
        
        if (ordersData.length > 0) {
          rewardOrders.value = ordersData.map(order => ({
            id: order.id,
            status: order.status,
            title: order.title || `${order.game}悬赏单`,
            content: order.content || '',
            reward: order.reward,
            game: order.game,
            publisher: {
              name: order.userName || '匿名用户',
              avatar: order.userAvatar || 'https://via.placeholder.com/100'
            },
            createdAt: order.createdAt,
            duration: order.duration,
            paymentMethod: order.paymentMethod,
            tags: order.tags || [],
            requirements: order.requirements || []
          }))
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
}

const handleViewOrder = (orderId) => {
  router.push(`/reward/${orderId}`)
}

const handleConfirm = (orderId) => {
  router.push(`/reward/${orderId}/review`)
}

const handleGoToService = (orderId) => {
  router.push(`/reward/${orderId}/confirm`)
}

onMounted(() => {
  loadRewardOrders()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 max-w-md mx-auto border-b border-outline-variant/20">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest">
          <img alt="User Avatar" class="w-full h-full object-cover" src="https://via.placeholder.com/40" />
        </div>
        <h1 class="font-headline font-bold text-lg text-primary tracking-tight">SunnyPlay</h1>
      </div>
      <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all active:scale-95">
        <span class="material-symbols-outlined text-primary">notifications</span>
      </button>
    </header>

    <main class="page-content pt-24 space-y-8">
      <header class="space-y-2">
        <h1 class="font-headline font-extrabold text-2xl leading-tight text-on-surface tracking-tight">抢单状态</h1>
        <p class="text-on-surface-variant font-medium text-sm">管理您的实时赏金任务与服务进度</p>
      </header>

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
          <span class="ml-1 text-[10px] opacity-70">({{ tab.count }})</span>
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

      <div v-else class="space-y-5">
        <!-- Active Bounty: Selected - Go to Service -->
        <section v-if="activeTab === 'selected'" class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4">
            <span class="bg-primary-container text-on-primary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">进行中</span>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center">
                <span class="material-symbols-outlined text-on-secondary-container" style="font-variation-settings: 'FILL' 1;">sports_esports</span>
              </div>
              <div>
                <h3 class="font-headline font-bold text-lg text-on-surface">王者荣耀：巅峰上分</h3>
                <p class="text-sm text-on-surface-variant font-medium">来自：超级大魔王</p>
              </div>
            </div>
            <div class="bg-surface-container-low rounded-2xl p-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-on-surface-variant">赏金金额</span>
                <span class="font-headline font-extrabold text-primary text-xl">¥{{ rewardOrders.find(o => o.status === 'selected')?.reward || 188.00 }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-sm">schedule</span>
                <span class="text-xs font-medium text-on-surface-variant">预计服务时长：120分钟</span>
              </div>
            </div>
            <div class="flex flex-col gap-3 mt-2">
              <div class="flex items-center gap-2 text-primary font-bold text-sm">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span>已入选 - 请前往服务</span>
              </div>
              <button 
                @click="handleGoToService(rewardOrders.find(o => o.status === 'selected')?.id)"
                class="w-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-headline font-bold py-4 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary-container/20"
              >
                确认完成并结算
                <span class="material-symbols-outlined text-lg">payments</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Pending Bounty: Waiting for Creator's Pick -->
        <section v-if="activeTab === 'pending'" class="bg-surface-container-lowest/60 rounded-2xl p-6 border-2 border-dashed border-outline-variant/20">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-tertiary-container/30 flex items-center justify-center">
                  <span class="material-symbols-outlined text-tertiary" data-icon="pending">pending</span>
                </div>
                <div>
                  <h3 class="font-headline font-bold text-lg text-on-surface/60">原神：探索协助</h3>
                  <p class="text-sm text-on-surface-variant/60 font-medium">来自：派蒙的厨师</p>
                </div>
              </div>
              <span class="text-primary font-bold text-xs bg-primary-container/20 px-3 py-1 rounded-full">等待房主选择</span>
            </div>
            <p class="text-xs text-on-surface-variant italic">您已提交申请，房主正在查看您的履历...</p>
          </div>
        </section>

        <!-- Completed Bounty: Settlement Pending -->
        <section v-if="activeTab === 'completed'" class="bg-surface-container-low rounded-2xl p-6 relative">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                <span class="material-symbols-outlined text-outline" data-icon="task_alt">task_alt</span>
              </div>
              <div>
                <h4 class="font-bold text-on-surface">和平精英：双人组队</h4>
                <p class="text-[10px] text-on-surface-variant font-medium">订单号：SP8829103</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-bold text-secondary">待结算</div>
              <div class="text-[10px] text-on-surface-variant">预计 2小时内</div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center">
            <span class="text-xs text-on-surface-variant">赏金已锁定在平台托管</span>
            <span class="font-headline font-bold text-on-surface">¥{{ rewardOrders.find(o => o.status === 'completed')?.reward || 65.00 }}</span>
          </div>
        </section>

        <!-- Decorative Info Section -->
        <div class="bg-secondary-container/10 rounded-2xl p-5 border border-secondary-container/20">
          <h5 class="font-headline font-bold text-secondary text-sm mb-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">lightbulb</span>
            抢单小贴士
          </h5>
          <p class="text-xs text-on-secondary-fixed-variant leading-relaxed">
            保持良好的信誉评分可以增加被房主选中的几率。完成服务后请务必及时发起结算申请。
          </p>
        </div>
      </div>

      <div v-if="!loading && !error && rewardOrders.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-on-surface-variant text-5xl">sports_esports</span>
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
