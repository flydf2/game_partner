<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import { orderApi, grabOrderApi } from '../api/index.js'

const router = useRouter()
const route = useRoute()

const orderId = ref(route.params.id)
const order = ref(null)
const loading = ref(true)
const error = ref('')

const loadOrderDetail = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // 调用抢单详情API
    const response = await grabOrderApi.getGrabOrderDetail(orderId.value)
    order.value = response.data
  } catch (err) {
    error.value = err.message
    console.error('加载订单详情失败:', err)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/my-grab-orders')
}

const handleGoToChat = () => {
  router.push(`/chat/${orderId.value}`)
}

const handleGoToRewardDetail = () => {
  // 假设订单数据中包含悬赏单ID，如果没有则使用当前订单ID
  const rewardId = order.value?.rewardId || orderId.value
  router.push(`/reward/${rewardId}`)
}

const handleWithdraw = async () => {
  try {
    const confirmed = confirm('确定要撤回申请吗？')
    if (!confirmed) return
    
    loading.value = true
    
    // 调用撤回申请API
    await orderApi.withdrawOrder(orderId.value)
    
    // 更新订单状态
    order.value.status = 'withdrawn'
    order.value.statusText = '已撤回'
    order.value.timeline.push({
      step: 4,
      title: '已撤回申请',
      time: new Date().toLocaleString('zh-CN'),
      status: 'completed'
    })
    
    // 延迟后重定向到我的抢单页面
    setTimeout(() => {
      router.push('/my-grab-orders')
    }, 1500)
  } catch (err) {
    error.value = err.message
    console.error('撤回申请失败:', err)
  } finally {
    loading.value = false
  }
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

onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <AppHeader
      title="抢单详情"
      :show-back="false"
      :show-menu="true"
      @menu="handleCancel"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-16 space-y-6">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-error text-5xl">error_outline</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">加载失败</h2>
        <p class="text-sm text-on-surface-variant mb-4">{{ error }}</p>
        <button 
          @click="loadOrderDetail"
          class="px-6 py-2.5 rounded-full bg-primary text-on-primary font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
        >
          重试
        </button>
      </div>

      <div v-else-if="order" class="space-y-6">
        <!-- 订单信息卡片 -->
        <section class="bg-primary-container rounded-2xl p-6 relative overflow-hidden">
          <div class="relative z-10">
            <div class="flex justify-between items-start mb-4">
              <span class="bg-on-primary-container/10 text-on-primary-container text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {{ order.statusText }}
              </span>
              <div class="text-right">
                <p class="text-on-primary-container/60 text-xs font-medium">总赏金</p>
                <p class="font-headline text-3xl font-extrabold text-on-primary-container">¥{{ order.reward }}</p>
              </div>
            </div>
            <h2 class="font-headline text-2xl font-extrabold text-on-primary-container mb-2 leading-tight">{{ order.title }}</h2>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">stadia_controller</span>
              <span class="text-sm font-medium">{{ order.category }}</span>
            </div>
          </div>
          <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-on-primary-container/5 rounded-full blur-2xl"></div>
        </section>

        <!-- 任务详情网格 -->
        <section class="grid grid-cols-2 gap-4">
          <div class="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between min-h-[110px]">
            <span class="material-symbols-outlined text-secondary text-2xl">military_tech</span>
            <div>
              <p class="text-on-surface-variant text-[11px] font-medium">段位要求</p>
              <p class="font-bold text-on-surface">{{ order.requirements.level }}</p>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between min-h-[110px]">
            <span class="material-symbols-outlined text-secondary text-2xl">schedule</span>
            <div>
              <p class="text-on-surface-variant text-[11px] font-medium">预计时长</p>
              <p class="font-bold text-on-surface">{{ order.requirements.duration }}</p>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between min-h-[110px]">
            <span class="material-symbols-outlined text-secondary text-2xl">calendar_today</span>
            <div>
              <p class="text-on-surface-variant text-[11px] font-medium">开始时间</p>
              <p class="font-bold text-on-surface">{{ order.requirements.startTime }}</p>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between min-h-[110px]">
            <span class="material-symbols-outlined text-secondary text-2xl">videogame_asset</span>
            <div>
              <p class="text-on-surface-variant text-[11px] font-medium">游戏模式</p>
              <p class="font-bold text-on-surface">{{ order.requirements.mode }}</p>
            </div>
          </div>
        </section>

        <!-- 房主信息 -->
        <section class="bg-surface-container-low p-5 rounded-xl flex items-center gap-4">
          <img 
            :alt="order.publisher.name" 
            class="w-14 h-14 rounded-full object-cover border-2 border-surface-container-lowest"
            :src="order.publisher.avatar"
          />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-on-surface">{{ order.publisher.name }}</h3>
              <span v-if="order.publisher.isOwner" class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-bold">房主</span>
            </div>
            <div class="flex items-center gap-1 mt-1 text-on-surface-variant text-xs">
              <span class="material-symbols-outlined text-sm text-primary" style="font-variation-settings: 'FILL' 1;">verified_user</span>
              <span>信誉等级: {{ order.publisher.level }}</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant/40">chevron_right</span>
        </section>

        <!-- 抢单进度 -->
        <section class="bg-surface-container-lowest p-6 rounded-xl">
          <h4 class="font-bold text-on-surface mb-6 flex items-center gap-2">
            <span class="w-1.5 h-4 bg-primary rounded-full"></span>
            抢单进度
          </h4>
          <div class="space-y-8 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
            <div v-for="step in order.timeline" :key="step.step" class="flex gap-4 relative">
              <div class="z-10 w-[24px] h-[24px] rounded-full flex items-center justify-center ring-4 ring-surface-container-lowest" :class="{
                'bg-primary': step.status === 'completed' || step.status === 'current',
                'bg-surface-container': step.status === 'pending'
              }">
                <span v-if="step.status === 'completed'" class="material-symbols-outlined text-white text-sm" style="font-variation-settings: 'FILL' 1;">check</span>
                <span v-else-if="step.status === 'current'" class="material-symbols-outlined text-on-surface text-sm" style="font-variation-settings: 'FILL' 1;">visibility</span>
                <div v-else class="w-2 h-2 bg-on-surface-variant rounded-full"></div>
              </div>
              <div>
                <p class="text-sm font-bold text-on-surface" :class="step.status === 'current' ? 'font-semibold' : ''">{{ step.title }}</p>
                <p class="text-xs text-on-surface-variant mt-0.5">{{ step.time }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 我的推荐 -->
        <section class="bg-surface-container-lowest p-6 rounded-xl">
          <h4 class="font-bold text-on-surface mb-4 flex items-center gap-2">
            <span class="w-1.5 h-4 bg-primary rounded-full"></span>
            我的推荐
          </h4>
          <div class="bg-surface-container-low p-4 rounded-lg italic text-sm text-on-surface-variant leading-relaxed">
            {{ order.recommendation }}
          </div>
        </section>
      </div>

      <div v-else class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-on-surface-variant text-5xl">receipt_long</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无订单</h2>
        <p class="text-sm text-on-surface-variant">订单不存在或已删除</p>
      </div>
    </main>

    <BottomNavBar />

    <!-- 底部操作栏 -->
    <nav class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl flex justify-around items-center px-6 pb-safe z-50 rounded-t-[1.5rem] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <button 
        @click="handleWithdraw"
        class="flex flex-col items-center justify-center text-on-surface px-6 py-2 hover:bg-surface-container-high active:scale-98 transition-transform"
      >
        <span class="material-symbols-outlined text-2xl mb-1">cancel</span>
        <span class="font-headline font-semibold text-[12px]">撤回申请</span>
      </button>
      <button 
        @click="handleGoToRewardDetail"
        class="flex flex-col items-center justify-center text-on-surface px-6 py-2 hover:bg-surface-container-high active:scale-98 transition-transform"
      >
        <span class="material-symbols-outlined text-2xl mb-1">receipt_long</span>
        <span class="font-headline font-semibold text-[12px]">悬赏详情</span>
      </button>
      <button 
        @click="handleGoToChat"
        class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-8 py-2 hover:opacity-80 active:scale-98 transition-transform"
      >
        <span class="material-symbols-outlined text-2xl mb-1">chat_bubble</span>
        <span class="font-headline font-semibold text-[12px]">联系房主</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
</style>
