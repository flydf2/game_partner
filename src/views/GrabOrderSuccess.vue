<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()

const orderId = ref(null)
const order = ref(null)
const loading = ref(true)
const error = ref('')

const loadOrderDetail = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await api.rewardOrder.getRewardOrderDetail(orderId.value)
    if (response.success || response.code === 0) {
      order.value = response.data
    } else {
      throw new Error(response.message || response.msg || '获取订单详情失败')
    }
  } catch (err) {
    error.value = err.message
    console.error('加载订单详情失败:', err)
  } finally {
    loading.value = false
  }
}

const handleGoToChat = () => {
  router.push(`/chat/${orderId.value}`)
}

const handleViewOrder = () => {
  router.push(`/reward/${orderId.value}`)
}

const handleBackToBounty = () => {
  router.push('/reward')
}

onMounted(() => {
  const routeParams = router.currentRoute.value.params
  if (routeParams.id) {
    orderId.value = routeParams.id
    loadOrderDetail()
  }
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-background pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 py-3 border-b border-outline-variant/20">
      <div class="flex items-center gap-4">
        <span
          @click="handleBackToBounty"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">SunnyPlay 任务中心</h1>
      </div>
      <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-primary">
        <img alt="User Profile" class="w-full h-full object-cover" src="https://via.placeholder.com/32" />
      </div>
    </header>

    <main class="pt-20 px-5 max-w-md mx-auto space-y-6">
      <!-- 成功反馈 -->
      <div class="flex flex-col items-center mb-10">
        <div class="relative mb-6">
          <div class="absolute inset-0 bg-primary-container/40 blur-3xl rounded-full scale-150"></div>
          <div class="relative w-24 h-24 bg-primary-container rounded-full flex items-center justify-center shadow-lg shadow-primary/10">
            <span class="material-symbols-outlined text-primary text-6xl" style="font-variation-settings: 'FILL' 1, 'wght' 700;">check_circle</span>
          </div>
        </div>
        <div class="text-center space-y-2">
          <h2 class="font-headline font-extrabold text-3xl text-on-surface tracking-tight">恭喜！</h2>
          <p class="text-on-surface-variant font-medium text-lg">房主已选中你</p>
        </div>
      </div>

      <!-- 任务信息卡片 -->
      <div v-if="order" class="w-full space-y-4">
        <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl"></div>
          <div class="flex justify-between items-start mb-4 relative z-10">
            <span class="bg-tertiary-container/20 text-on-tertiary-container text-[10px] font-bold px-3 py-1 rounded-full font-headline uppercase tracking-wider">High Bounty</span>
            <div class="flex items-center gap-1 text-primary">
              <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
              <span class="text-xs font-bold">4.9</span>
            </div>
          </div>
          <h3 class="font-headline text-xl font-bold text-on-surface mb-2 relative z-10 leading-tight">{{ order.title }}</h3>
          <div class="flex items-center gap-2 mb-6 relative z-10">
            <span class="material-symbols-outlined text-secondary text-sm">schedule</span>
            <p class="text-sm text-on-surface-variant font-medium">预计耗时：3 小时</p>
          </div>
          <div class="grid grid-cols-2 gap-3 relative z-10">
            <div class="bg-surface-container-low rounded-2xl p-4">
              <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">预计总额</p>
              <p class="font-headline text-2xl font-extrabold text-primary tracking-tighter">¥{{ order.reward || '298.00' }}</p>
            </div>
            <div class="bg-surface-container-low rounded-2xl p-4">
              <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">任务等级</p>
              <p class="font-headline text-xl font-extrabold text-secondary tracking-tight">SSS级</p>
            </div>
          </div>
        </div>

        <div class="bg-primary-container rounded-2xl p-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary">account_balance_wallet</span>
            </div>
            <div>
              <p class="text-xs font-bold text-on-primary-container/80 uppercase">Payment Method</p>
              <p class="font-bold text-on-primary-container">担保交易 · 极速到账</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-on-primary-container/40">chevron_right</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-auto w-full space-y-4 pt-10">
        <button
          @click="handleGoToChat"
          class="w-full bg-primary-container text-on-primary-container font-extrabold py-5 rounded-full font-headline text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">chat</span>
          立即沟通
        </button>
        <button
          @click="handleViewOrder"
          class="w-full bg-white text-primary font-bold py-5 rounded-full font-headline text-md active:scale-95 transition-all duration-200 border border-primary/10"
        >
          查看任务详情
        </button>
      </div>
    </main>

    <nav class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl rounded-t-[1.5rem] shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)] z-50 flex justify-around items-center px-4 pb-6 pt-3">
      <a class="flex flex-col items-center justify-center text-neutral-400 px-5 py-2 hover:bg-neutral-100 rounded-2xl transition-all active:scale-90" href="#">
        <span class="material-symbols-outlined mb-1">bolt</span>
        <span class="font-headline text-[10px] font-semibold">抢单</span>
      </a>
      <a class="flex flex-col items-center justify-center bg-[#FFD700] text-[#6c5a00] rounded-2xl px-5 py-2 transition-all active:scale-90" href="#">
        <span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">query_stats</span>
        <span class="font-headline text-[10px] font-semibold">进度</span>
      </a>
      <a class="flex flex-col items-center justify-center text-neutral-400 px-5 py-2 hover:bg-neutral-100 rounded-2xl transition-all active:scale-90 relative" href="#">
        <span class="material-symbols-outlined mb-1">chat_bubble</span>
        <span class="font-headline text-[10px] font-semibold">消息</span>
        <span class="absolute top-2 right-4 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
      </a>
      <a class="flex flex-col items-center justify-center text-neutral-400 px-5 py-2 hover:bg-neutral-100 rounded-2xl transition-all active:scale-90" href="#">
        <span class="material-symbols-outlined mb-1">person</span>
        <span class="font-headline text-[10px] font-semibold">我的</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
</style>
