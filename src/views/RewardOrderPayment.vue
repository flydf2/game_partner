<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import api from '../api/index.js'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()
const route = useRoute()

const orderId = ref(route.params.id)
const order = ref(null)
const loading = ref(true)
const error = ref('')
const isSubmitting = ref(false)

const selectedDuration = ref(4)
const selectedPaymentMethod = ref('alipay')

const durations = [
  { value: 1, label: '1小时', price: 80 },
  { value: 2, label: '2小时', price: 80 },
  { value: 3, label: '3小时', price: 80 },
  { value: 4, label: '4小时', price: 80 },
  { value: 8, label: '包天', price: 600 }
]

const totalAmount = computed(() => {
  const duration = durations.find(d => d.value === selectedDuration.value)
  return duration ? duration.price : 0
})

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

const handlePayment = async () => {
  isSubmitting.value = true
  try {
    const response = await api.rewardOrder.payRewardOrder(orderId.value, {
      amount: totalAmount.value,
      duration: selectedDuration.value,
      paymentMethod: selectedPaymentMethod.value
    })
    if (response.success || response.code === 0) {
      router.push(`/reward/${orderId.value}/confirmation`)
    }
  } catch (err) {
    console.error('支付失败:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
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
      title="支付托管金"
      :show-back="false"
      :show-menu="true"
      :show-avatar="false"
      @menu="handleCancel"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-16 space-y-8">
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
        <!-- Playmate Selection Card -->
        <section class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-2xl overflow-hidden">
              <img :alt="order.playmateName" class="w-full h-full object-cover" :src="order.playmateAvatar" />
            </div>
            <div>
              <h3 class="font-headline font-bold text-lg text-on-surface">{{ order.playmateName }}</h3>
              <div class="flex items-center space-x-1 mt-0.5">
                <span class="material-symbols-outlined text-[14px] text-tertiary" style="font-variation-settings: 'FILL' 1;">stars</span>
                <span class="text-label-sm text-on-surface-variant font-medium">LV.{{ order.playmateLevel }} {{ order.playmateTitle }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Pricing Details Bento -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-surface-container-low rounded-2xl p-5 flex flex-col justify-between space-y-2">
            <span class="text-on-surface-variant text-xs font-medium">预定时长</span>
            <span class="text-on-surface font-headline font-bold text-2xl">{{ selectedDuration }} <span class="text-sm font-medium">小时</span></span>
          </div>
          <div class="bg-surface-container-low rounded-2xl p-5 flex flex-col justify-between space-y-2">
            <span class="text-on-surface-variant text-xs font-medium">时薪单位</span>
            <span class="text-on-surface font-headline font-bold text-2xl">¥{{ order.hourlyRate || 80 }} <span class="text-sm font-medium">/h</span></span>
          </div>
        </div>

        <!-- Duration Selection -->
        <section class="space-y-3">
          <label class="block text-on-surface font-headline font-bold text-lg">选择时长</label>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="duration in durations"
              :key="duration.value"
              @click="selectedDuration = duration.value"
              :class="[
                'px-5 py-2.5 rounded-full font-bold text-sm transition-all',
                selectedDuration === duration.value
                  ? 'bg-primary-container text-on-primary-container ring-2 ring-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              ]"
            >
              {{ duration.label }}
            </button>
          </div>
        </section>

        <!-- Total Amount Hero Card -->
        <div class="bg-primary-container rounded-2xl p-6 relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
          <div class="relative z-10 flex justify-between items-end">
            <div class="space-y-1">
              <span class="text-on-primary-container font-headline font-bold text-sm">应付总额</span>
              <div class="text-on-primary-container font-headline font-extrabold text-4xl">¥{{ totalAmount }}</div>
            </div>
            <div class="bg-white/40 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center space-x-1.5">
              <span class="material-symbols-outlined text-on-primary-container text-lg" style="font-variation-settings: 'FILL' 1;">verified_user</span>
              <span class="text-[10px] font-bold text-on-primary-container uppercase tracking-tighter">Verified</span>
            </div>
          </div>
        </div>

        <!-- Platform Guarantee Notice -->
        <div class="bg-tertiary-container/10 border border-tertiary-container/20 rounded-2xl p-5 flex space-x-4">
          <div class="bg-tertiary-container p-2 rounded-lg h-fit">
            <span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">gpp_good</span>
          </div>
          <div class="space-y-1">
            <h4 class="text-on-tertiary-container font-bold text-sm">Platform Guarantee</h4>
            <p class="text-on-surface-variant text-xs leading-relaxed">
              资金将托管于平台安全账户，仅在您确认陪玩服务圆满完成后才会结算给猎人。期间如遇违规，可随时申请退款。
            </p>
          </div>
        </div>

        <!-- Payment Methods -->
        <section class="space-y-4 pt-4">
          <h4 class="text-on-surface font-bold text-sm px-1">支付方式</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl">
              <div class="flex items-center space-x-3">
                <span class="material-symbols-outlined text-[#00A0E9]" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
                <span class="text-sm font-medium">支付宝支付 (Alipay)</span>
              </div>
              <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">radio_button_checked</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-surface-container-lowest/50 rounded-2xl opacity-60">
              <div class="flex items-center space-x-3">
                <span class="material-symbols-outlined text-[#07C160]" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
                <span class="text-sm font-medium">微信支付 (WeChat Pay)</span>
              </div>
              <span class="material-symbols-outlined text-neutral-300">radio_button_unchecked</span>
            </div>
          </div>
        </section>
      </div>

      <BottomNavBar />

      <!-- Fixed Bottom Action Area -->
      <div class="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl z-40">
        <div class="max-w-md mx-auto">
          <button
            @click="handlePayment"
            :disabled="isSubmitting"
            class="w-full bg-[#FFD700] text-[#6c5a00] font-headline font-black text-lg py-4 rounded-full shadow-[0_12px_24px_-10px_rgba(255,215,0,0.5)] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            :class="isSubmitting ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">security</span>
            <span>安全支付 ¥{{ totalAmount }}</span>
          </button>
          <p class="text-center text-[10px] text-on-surface-variant mt-4 opacity-60">点击即代表您同意《SunnyPlay 支付服务协议》</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>
