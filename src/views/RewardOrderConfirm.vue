<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../api/index.js'

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

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-outline-variant/20">
      <div class="flex items-center gap-4">
        <span
          @click="handleCancel"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">悬赏订单</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="page-content pt-20 space-y-6">
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
        <!-- Summary Context Section -->
        <section class="mb-8">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-primary font-bold text-sm tracking-wide">赏金任务确认</span>
            <div class="h-px flex-1 bg-surface-container-high"></div>
          </div>
          <h2 class="font-headline font-extrabold text-3xl text-on-surface leading-tight">确认并托管</h2>
          <p class="text-on-surface-variant text-sm mt-2">您已选择陪玩师，请完成资金托管以启动任务。</p>
        </section>

        <!-- Playmate Selection Card -->
        <div class="relative mb-6 group">
          <div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm overflow-hidden flex items-center gap-5">
            <div class="relative">
              <div class="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-primary-container/20">
                <img :alt="order.playmateName" class="w-full h-full object-cover" :src="order.playmateAvatar" />
              </div>
              <div class="absolute -bottom-2 -right-2 bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full text-[10px] font-bold">
                Lv.{{ order.playmateLevel }}
              </div>
            </div>
            <div class="flex-1">
              <h3 class="font-headline font-bold text-lg text-on-surface">{{ order.playmateName }}</h3>
              <div class="flex items-center gap-1 mt-1">
                <span class="material-symbols-outlined text-[14px] text-primary" style="font-variation-settings: 'FILL' 1;">star</span>
                <span class="text-xs font-semibold text-on-surface">{{ order.playmateRating || 4.9 }}</span>
                <span class="text-xs text-on-surface-variant ml-2">{{ order.playmateOrderCount || 500 }}+ 接单量</span>
              </div>
              <div class="mt-2 flex flex-wrap gap-1">
                <span class="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">{{ order.game }}</span>
                <span class="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">{{ order.region || '国服一区' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Breakdown -->
        <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] mb-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-on-surface-variant text-sm">陪玩时薪 (Reward)</span>
              <span class="font-headline font-bold text-on-surface">¥ {{ order.hourlyRate || 88.00 }} / 小时</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-on-surface-variant text-sm">预定时长 (Hours)</span>
              <span class="font-headline font-bold text-on-surface">{{ order.duration || 3 }} 小时</span>
            </div>
            <div class="flex justify-between items-center pb-4 border-b border-dashed border-surface-container-highest">
              <span class="text-on-surface-variant text-sm">平台服务费</span>
              <span class="font-headline font-bold text-on-surface">¥ {{ order.platformFee || 12.00 }}</span>
            </div>
            <div class="pt-2 flex justify-between items-end">
              <div>
                <span class="block text-on-surface-variant text-xs mb-1">应付总额 (Total)</span>
                <span class="text-tertiary font-bold text-sm bg-tertiary-container/20 px-2 py-0.5 rounded">托管保障中</span>
              </div>
              <div class="text-right">
                <span class="font-headline font-black text-3xl text-primary leading-none">¥ {{ order.totalAmount || 276.00 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Explanation -->
        <div class="grid grid-cols-2 gap-3 mb-8">
          <div class="bg-surface-container-low p-4 rounded-2xl border border-transparent">
            <span class="material-symbols-outlined text-primary mb-2" style="font-variation-settings: 'FILL' 1;">verified_user</span>
            <h4 class="font-bold text-xs text-on-surface block mb-1">资金安全托管</h4>
            <p class="text-[10px] leading-relaxed text-on-surface-variant">资金将锁定在平台账户，确认服务完成后再结算给陪玩师。</p>
          </div>
          <div class="bg-surface-container-low p-4 rounded-2xl border border-transparent">
            <span class="material-symbols-outlined text-primary mb-2" style="font-variation-settings: 'FILL' 1;">assignment_turned_in</span>
            <h4 class="font-bold text-xs text-on-surface block mb-1">服务质量保障</h4>
            <p class="text-[10px] leading-relaxed text-on-surface-variant">如服务期间出现任何违规或未按约定执行，可申请全额退款。</p>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="space-y-4">
          <button
            @click="router.push(`/reward/${orderId}/payment`)"
            class="w-full bg-primary-container text-on-primary-container font-headline font-extrabold py-4 rounded-full shadow-lg shadow-primary-container/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-xl">encrypted</span>
            安全支付 ¥ {{ order.totalAmount || 276.00 }}
          </button>
          <button
            @click="handleCancel"
            class="w-full bg-surface-container-lowest text-primary font-bold py-4 rounded-full active:scale-[0.98] transition-all border border-surface-container-highest"
          >
            取消支付
          </button>
        </div>

        <!-- Safe Transaction Footer -->
        <div class="mt-8 flex items-center justify-center gap-4 text-outline opacity-60">
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">lock</span>
            <span class="text-[10px] font-medium">SSL 加密传输</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            <span class="text-[10px] font-medium">支付保障体系</span>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-on-surface-variant text-5xl">receipt_long</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无订单</h2>
        <p class="text-sm text-on-surface-variant">订单不存在或已删除</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>
