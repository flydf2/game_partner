<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../api/index.js'

const router = useRouter()

const selectedPlan = ref(null)
const loading = ref(false)
const agreements = ref({
  terms: false,
  service: false
})

const plans = ref([
  { id: 1, coins: 6, price: 6.00, bonus: 0, badge: null },
  { id: 2, coins: 30, price: 30.00, bonus: 1.2, badge: '送1.2元' },
  { id: 3, coins: 60, price: 60.00, bonus: 6, badge: '送6元' },
  { id: 4, coins: 128, price: 128.00, bonus: 12, badge: '送12元' },
  { id: 5, coins: 328, price: 328.00, bonus: 35, badge: '送35元' },
  { id: 6, coins: 648, price: 648.00, bonus: 100, badge: '送100元' }
])

const selectedPlanData = computed(() => {
  return plans.value.find(p => p.id === selectedPlan.value)
})

const totalAmount = computed(() => {
  if (!selectedPlanData.value) return 0
  return selectedPlanData.value.price
})

const totalCoins = computed(() => {
  if (!selectedPlanData.value) return 0
  return selectedPlanData.value.coins + selectedPlanData.value.bonus
})

const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleBack = () => {
  router.back()
}

const selectPlan = (id) => {
  selectedPlan.value = id
}

const toggleAgreement = (type) => {
  agreements.value[type] = !agreements.value[type]
}

const handleRecharge = async () => {
  if (!selectedPlan.value) {
    alert('请选择充值档位')
    return
  }
  
  if (!agreements.value.terms || !agreements.value.service) {
    alert('请阅读并同意相关协议')
    return
  }
  
  loading.value = true
  try {
    const response = await userApi.recharge({
      planId: selectedPlan.value,
      amount: totalAmount.value,
      coins: totalCoins.value
    })
    
    if (response.success || response.code === 0) {
      alert('充值成功！')
      router.push('/profile/wallet')
    } else {
      throw new Error(response.message || response.msg || '充值失败')
    }
  } catch (err) {
    console.error('充值失败:', err)
    alert(err.message || '充值失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">我的钱包</h1>
      </div>
      <div class="text-neutral-500 font-medium text-sm hover:opacity-80 transition-opacity cursor-pointer">
        明细
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-8">
      <!-- 余额卡片 -->
      <section class="relative overflow-hidden bg-primary-container rounded-[2rem] p-8 shadow-sm">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
        <div class="relative z-10">
          <p class="text-on-primary-container/80 text-sm font-medium mb-1">阳光币余额</p>
          <div class="flex items-baseline gap-2">
            <span class="font-headline font-extrabold text-5xl text-on-primary-container">1,280</span>
            <span class="material-symbols-outlined text-on-primary-container text-2xl" style="font-variation-settings: 'FILL' 1;">wb_sunny</span>
          </div>
          <div class="mt-6 inline-flex items-center gap-2 bg-white/30 px-3 py-1.5 rounded-full backdrop-blur-md">
            <span class="material-symbols-outlined text-xs text-on-primary-container" style="font-variation-settings: 'FILL' 1;">stars</span>
            <span class="text-xs font-semibold text-on-primary-container">首充赠送 20%</span>
          </div>
        </div>
      </section>

      <!-- 充值档位 -->
      <section>
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold text-on-surface">充值档位</h2>
          <span class="text-xs text-on-surface-variant">1元 = 1阳光币</span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="bg-surface-container-lowest p-6 rounded-[1.5rem] flex flex-col items-center justify-center border-2 border-transparent hover:border-primary-container transition-all cursor-pointer active:scale-95 group relative"
            :class="{ 'border-primary-container bg-primary-container/10': selectedPlan === plan.id }"
            @click="selectPlan(plan.id)"
          >
            <div
              v-if="plan.badge"
              class="absolute top-0 right-0 bg-secondary text-on-secondary px-3 py-1 rounded-tr-[1.3rem] rounded-bl-[1rem] text-[10px] font-bold"
            >
              {{ plan.badge }}
            </div>
            <span class="font-headline font-bold text-2xl mb-1" :class="{ 'text-primary': selectedPlan === plan.id }">
              {{ plan.coins + plan.bonus }}
            </span>
            <p class="text-xs text-on-surface-variant">阳光币</p>
            <div class="mt-4 text-sm font-bold text-on-surface">¥{{ formatAmount(plan.price) }}</div>
          </div>
        </div>
      </section>

      <!-- 充值说明 -->
      <section class="bg-surface-container-low p-5 rounded-2xl">
        <h3 class="text-sm font-bold mb-2 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">info</span>
          充值说明
        </h3>
        <ul class="text-xs text-on-surface-variant space-y-2 leading-relaxed">
          <li>• 阳光币仅限在本平台内用于消费，不可提现。</li>
          <li>• 充值成功后通常实时到账，如遇延迟请咨询客服。</li>
          <li>• 支付成功即视为同意相关充值服务条款。</li>
        </ul>
      </section>
    </main>

    <!-- 底部操作栏 -->
    <div class="fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-md p-6 pb-10 z-50">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-center gap-2 mb-4">
          <div
            class="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center bg-primary cursor-pointer"
            @click="toggleAgreement('terms')"
          >
            <span
              v-if="agreements.terms"
              class="material-symbols-outlined text-[10px] text-on-primary font-bold"
            >
              check
            </span>
          </div>
          <p class="text-[11px] text-on-surface-variant">
            充值即代表同意
            <span class="text-primary font-semibold cursor-pointer">《用户协议》</span>
            与
            <span class="text-primary font-semibold cursor-pointer">《充值服务条款》</span>
          </p>
        </div>
        <button
          class="w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-full shadow-lg shadow-primary-container/20 active:scale-95 transition-all text-lg tracking-wide"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
          :disabled="loading"
          @click="handleRecharge"
        >
          {{ loading ? '处理中...' : '立即充值' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
