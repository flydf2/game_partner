<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { rewardOrderApi, handleApiError } from '../api/index.js'

const router = useRouter()
const route = useRoute()

const goToRewardOrders = () => {
  router.push('/reward-orders')
}

const orderId = ref(route.params.id)
const order = ref(null)
const loading = ref(true)
const isSubmitting = ref(false)
const error = ref('')

const loadOrderDetail = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await rewardOrderApi.getRewardOrderDetail(orderId.value)
    if (response.success || response.code === 0) {
      order.value = response.data
    } else {
      throw new Error(response.message || response.msg || '获取订单详情失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('加载订单详情失败:', err)
  } finally {
    loading.value = false
  }
}

const handleGrabOrder = async () => {
  isSubmitting.value = true
  try {
    const response = await rewardOrderApi.grabRewardOrder(orderId.value)
    if (response.success || response.code === 0) {
      router.push(`/order/${orderId.value}`)
    } else {
      throw new Error(response.message || response.msg || '抢单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '抢单失败，请重试')
    console.error('抢单失败:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <!-- 广告通栏 -->
    <div class="fixed top-16 left-0 right-0 h-10 z-40 bg-gradient-to-r from-yellow-500 to-yellow-600 overflow-hidden shadow-md cursor-pointer active:scale-[0.98] transition-transform duration-200" @click="goToRewardOrders">
      <div class="absolute inset-0 flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-white text-[9px] font-bold">flash_on</span>
        <span class="text-white text-[9px] font-bold tracking-wider">抢悬赏单</span>
        <span class="material-symbols-outlined text-white text-[9px] font-bold">arrow_forward_ios</span>
      </div>
    </div>
    
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-surface-container-low/50">
      <div class="flex items-center gap-4">
        <span
          @click="handleCancel"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">抢单确认</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="pt-20 px-5 max-w-2xl mx-auto space-y-6">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="order" class="space-y-6">
        <!-- 订单信息 -->
        <section class="bg-surface-container-lowest rounded-3xl p-5">
          <h2 class="text-xl font-bold text-on-surface mb-4">{{ order.title }}</h2>
          <p class="text-sm text-on-surface-variant mb-4">{{ order.content }}</p>

          <div class="flex flex-wrap gap-2 mb-4">
            <span class="px-2 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">{{ order.game }}</span>
            <span v-for="tag in order.tags" :key="tag" class="px-2 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">{{ tag }}</span>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden">
                <img :alt="order.userName" class="w-full h-full object-cover" :src="order.userAvatar" />
              </div>
              <div>
                <h3 class="font-bold text-on-surface">{{ order.userName }}</h3>
                <p class="text-xs text-on-surface-variant">等级 1 · {{ order.game }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xl font-headline font-bold text-primary">¥{{ order.reward }}</p>
              <p class="text-xs text-on-surface-variant">{{ order.paymentMethod === 'prepay' ? '预支付' : '确认后支付' }}</p>
            </div>
          </div>
        </section>

        <!-- 要求 -->
        <section class="bg-surface-container-lowest rounded-3xl p-5">
          <h3 class="font-bold text-on-surface mb-3">发布要求</h3>
          <ul class="space-y-2">
            <li v-for="(requirement, index) in order.requirements" :key="index" class="flex items-start gap-2">
              <span class="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
              <span class="text-sm text-on-surface-variant">{{ requirement }}</span>
            </li>
          </ul>
        </section>

        <!-- 底部操作栏 -->
        <section class="bg-surface-container-low rounded-3xl p-5 shadow-sm">
          <div class="flex gap-3">
            <button
              @click="handleCancel"
              class="flex-1 py-3 rounded-full border border-outline-variant/20 text-on-surface-variant font-headline font-bold text-sm active:scale-95 transition-transform"
            >
              取消
            </button>
            <button
              @click="handleGrabOrder"
              :disabled="isSubmitting"
              class="flex-1 py-3 rounded-full bg-primary text-on-primary-fixed font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
              :class="isSubmitting ? 'opacity-50 cursor-not-allowed' : ''"
            >
              {{ isSubmitting ? '抢单中...' : '确认抢单' }}
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>