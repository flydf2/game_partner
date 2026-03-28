<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { withdrawalApi } from '../api'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()

const balance = ref('12,850.00')
const withdrawalAmount = ref('')
const selectedPaymentMethod = ref('wechat')
const submitting = ref(false)
const errorMessage = ref('')

const paymentMethods = [
  {
    id: 'wechat',
    name: '微信支付',
    description: '提现至微信零钱',
    icon: 'account_balance_wallet',
    color: '#07C160'
  },
  {
    id: 'alipay',
    name: '支付宝',
    description: '提现至支付宝账号',
    icon: 'payments',
    color: '#1677FF'
  },
  {
    id: 'bank',
    name: '银行卡',
    description: '预计1-3个工作日到账',
    icon: 'credit_card',
    color: '#8c4a00'
  }
]

const isSubmitDisabled = computed(() => {
  return !withdrawalAmount.value || submitting.value
})

const handleBack = () => {
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

const handleWithdrawalRecord = () => {
  router.push('/orders')
}

const handleWithdrawAll = () => {
  withdrawalAmount.value = balance.value.replace(',', '')
}

const validateWithdrawalAmount = () => {
  const amount = parseFloat(withdrawalAmount.value)
  
  if (!amount || amount <= 0) {
    errorMessage.value = '请输入有效的提现金额'
    return false
  }
  
  if (amount < 10) {
    errorMessage.value = '单笔最低提现 ¥10.00'
    return false
  }
  
  const maxBalance = parseFloat(balance.value.replace(',', ''))
  if (amount > maxBalance) {
    errorMessage.value = '提现金额不能超过可用余额'
    return false
  }
  
  if (amount > 50000) {
    errorMessage.value = '单笔提现金额不能超过 ¥50,000'
    return false
  }
  
  errorMessage.value = ''
  return true
}

const handleConfirmWithdrawal = async () => {
  if (!validateWithdrawalAmount()) {
    return
  }
  
  try {
    submitting.value = true
    errorMessage.value = ''
    
    const withdrawalData = {
      amount: withdrawalAmount.value,
      method: selectedPaymentMethod.value
    }
    
    const response = await withdrawalApi.submitWithdrawal(withdrawalData)
    
    if (response.success) {
      alert('提现申请已提交，请等待审核')
      router.push('/orders')
    } else {
      errorMessage.value = response.message || '提现申请失败，请重试'
    }
  } catch (error) {
    console.error('提现申请失败:', error)
    errorMessage.value = error.message || '提现申请失败，请重试'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-background font-body pb-24">
    <AppHeader
      title="收益提现"
      :show-back="false"
      :show-menu="true"
      @menu="handleBack"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-16 space-y-8">
      <!-- Balance Section -->
      <section class="relative overflow-hidden bg-primary-container rounded-[2rem] p-8 flex flex-col items-center justify-center text-on-primary-container">
        <!-- Decorative Element -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
        <p class="text-sm font-medium opacity-80 mb-2">当前可提现余额 (元)</p>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-headline font-bold">¥</span>
          <span class="text-5xl font-headline font-black tracking-tight">{{ balance }}</span>
        </div>
        <div class="mt-6 px-4 py-1.5 bg-on-primary-container/10 rounded-full flex items-center gap-2">
          <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">verified_user</span>
          <span class="text-[10px] font-bold tracking-wider uppercase">安全提现保障中</span>
        </div>
      </section>

      <!-- Withdrawal Amount Input -->
      <section class="space-y-4">
        <h2 class="text-sm font-bold text-on-surface-variant px-1">提现金额</h2>
        <div :class="['bg-surface-container-lowest rounded-2xl p-6 transition-all', errorMessage ? 'ring-2 ring-error' : 'focus-within:ring-2 focus-within:ring-primary-container']">
          <div class="flex items-center gap-3 pb-4">
            <span class="text-3xl font-headline font-bold text-on-surface">¥</span>
            <input
              v-model="withdrawalAmount"
              class="w-full bg-transparent border-none p-0 text-3xl font-headline font-bold placeholder:text-surface-container-high focus:ring-0"
              placeholder="0.00"
              type="number"
            />
            <button @click="handleWithdrawAll" class="shrink-0 text-primary font-bold text-sm px-3 py-1 bg-primary-container/30 rounded-lg active:scale-95 transition-transform">
              全部提现
            </button>
          </div>
          <div class="pt-4 border-t border-surface-container-low flex justify-between items-center text-[12px] text-on-surface-variant">
            <span>单笔最低提现 ¥10.00</span>
            <span>今日剩余额度 ¥50,000</span>
          </div>
        </div>
        
        <div v-if="errorMessage" class="flex items-center gap-2 text-error text-sm px-1">
          <span class="material-symbols-outlined text-base">error</span>
          {{ errorMessage }}
        </div>
      </section>

      <!-- Withdrawal Method Selection -->
      <section class="space-y-4">
        <h2 class="text-sm font-bold text-on-surface-variant px-1">提现方式</h2>
        <div class="space-y-3">
          <label
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl cursor-pointer group active:scale-[0.98] transition-all"
          >
            <div class="flex items-center gap-4">
              <div :style="{ backgroundColor: `${method.color}10` }" class="w-12 h-12 rounded-xl flex items-center justify-center">
                <span :style="{ color: method.color }" class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">{{ method.icon }}</span>
              </div>
              <div>
                <p class="font-bold text-on-surface">{{ method.name }}</p>
                <p class="text-xs text-on-surface-variant">{{ method.description }}</p>
              </div>
            </div>
            <input
              v-model="selectedPaymentMethod"
              :value="method.id"
              class="w-6 h-6 text-primary border-surface-container-high focus:ring-primary-container"
              name="pay_method"
              type="radio"
            />
          </label>
        </div>
      </section>

      <!-- Withdrawal Tips -->
      <section class="px-1 space-y-2">
        <h3 class="text-[12px] font-bold text-on-surface-variant flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">info</span>
          提现说明
        </h3>
        <ul class="text-[11px] text-on-surface-variant/80 leading-relaxed list-disc list-inside">
          <li>每笔提现将扣除 1% 的平台服务手续费。</li>
          <li>单日提现上限为 5 次，总额不超过 50,000 元。</li>
          <li>提现申请提交后，系统将在 24 小时内完成审核。</li>
        </ul>
      </section>
    </main>

    <BottomNavBar />

    <!-- Confirm Button (Fixed Bottom) -->
    <div class="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-5 bg-background/80 backdrop-blur-lg z-40">
      <button 
        @click="handleConfirmWithdrawal" 
        :disabled="isSubmitDisabled"
        :class="[
          'w-full h-14 bg-primary-container text-on-primary-container font-headline font-bold text-lg rounded-full shadow-[0_8px_30px_rgb(255,215,9,0.3)] transition-all flex items-center justify-center gap-2',
          isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.97]'
        ]"
      >
        {{ submitting ? '提交中...' : '确认提现' }}
        <span v-if="!submitting" class="material-symbols-outlined">arrow_forward</span>
        <span v-else class="material-symbols-outlined animate-spin">hourglass_empty</span>
      </button>
      <div class="h-safe-area-inset-bottom"></div>
    </div>

    <!-- Background Decoration -->
    <div class="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
      <div class="absolute top-[10%] -left-[20%] w-[80%] h-[40%] bg-primary-container/20 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[20%] -right-[10%] w-[60%] h-[30%] bg-secondary-container/20 rounded-full blur-[80px]"></div>
    </div>
  </div>
</template>