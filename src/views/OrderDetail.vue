<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderApi, expertApi, handleApiError } from '../api/index.js'

const route = useRoute()
const router = useRouter()

const orderId = ref(route.params.id || '1')
const order = ref(null)
const expert = ref(null)
const loading = ref(true)
const error = ref('')

const loadOrderDetail = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await orderApi.getOrderDetail(orderId.value)
    if (response.success || response.code === 0) {
      order.value = response.data
      
      if (order.value.expertId) {
        await loadExpertDetail(order.value.expertId)
      }
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

const loadExpertDetail = async (expertId) => {
  try {
    const response = await expertApi.getExpertDetail(expertId)
    if (response.success || response.code === 0) {
      expert.value = response.data
    }
  } catch (error) {
    console.error('加载大神详情失败:', error)
  }
}

const handleContact = () => {
  router.push(`/expert/${order.value.expertId}`)
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <nav data-v-3b8a03f8="" class="bg-surface w-full top-0 sticky z-50">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">订单详情</h1>
      </div>
      <div class="w-6"></div>
    </nav>

    <main v-if="loading" class="pt-20 px-5 max-w-2xl mx-auto">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </main>

    <main v-else-if="order" class="pt-20 pb-32 px-5 max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
      <!-- 订单状态 -->
      <section class="bg-surface-container-lowest rounded-xl p-5 shadow-sm overflow-hidden relative">
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold font-headline text-on-surface">订单状态</h2>
            <span class="bg-success-container text-on-success-container text-sm px-3 py-1 rounded-full font-medium">
              {{ order.status === 'completed' ? '已完成' : order.status === 'pending' ? '待支付' : order.status === 'ongoing' ? '进行中' : '已取消' }}
            </span>
          </div>
          <div class="text-sm text-on-surface-variant">
            <p>订单编号: {{ order.id }}</p>
            <p class="mt-1">下单时间: {{ order.createdAt }}</p>
          </div>
        </div>
      </section>

      <!-- 服务信息 -->
      <section v-if="expert" class="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-bold font-headline text-on-surface mb-4">服务信息</h2>
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-container">
            <img :alt="expert.nickname" class="w-full h-full object-cover" :src="expert.avatar" />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold font-headline text-on-surface">{{ expert.nickname }}</h3>
            <div class="flex gap-2 mt-1">
              <span class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                {{ expert.game }}
              </span>
              <span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                {{ order.serviceType }}
              </span>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-on-surface-variant">服务时长</span>
            <span class="font-headline font-semibold text-on-surface">{{ order.duration }}小时</span>
          </div>
          <div class="flex justify-between">
            <span class="text-on-surface-variant">预约时间</span>
            <span class="font-headline font-semibold text-on-surface">{{ order.scheduledAt }}</span>
          </div>
          <div v-if="order.completedAt" class="flex justify-between">
            <span class="text-on-surface-variant">完成时间</span>
            <span class="font-headline font-semibold text-on-surface">{{ order.completedAt }}</span>
          </div>
        </div>
      </section>

      <!-- 费用详情 -->
      <section class="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-bold font-headline text-on-surface mb-4">费用详情</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-on-surface-variant">服务费</span>
            <span class="font-headline font-semibold text-on-surface">¥{{ order.price }}/小时 × {{ order.duration }}小时</span>
          </div>
          <div class="flex justify-between">
            <span class="text-on-surface-variant">平台保障费</span>
            <span class="font-headline font-semibold text-on-surface">¥5</span>
          </div>
          <div class="h-[1px] bg-surface-container-high w-full mt-2"></div>
          <div class="flex justify-between">
            <span class="font-headline font-bold text-on-surface">总计</span>
            <span class="font-headline font-bold text-primary">¥{{ order.totalAmount }}</span>
          </div>
        </div>
      </section>

      <!-- 联系按钮 -->
      <div class="pt-4">
        <button
          @click="handleContact"
          class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-full shadow-lg shadow-primary-container/30 active:scale-95 transition-all duration-200"
        >
          联系大神
        </button>
      </div>
    </main>
  </div>
</template>