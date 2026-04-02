<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userApi, handleApiError } from '../api/index.js'
import { useToast } from '../composables/useToast.js'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()
const { showToast } = useToast()

const selectedAmount = ref(100)
const selectedPayment = ref('wechat')
const customAmount = ref('')
const loading = ref(false)

const amountOptions = [
  { label: '10元', value: 10 },
  { label: '50元', value: 50 },
  { label: '100元', value: 100 },
  { label: '200元', value: 200 },
  { label: '500元', value: 500 },
  { label: '1000元', value: 1000 }
]

const paymentOptions = [
  {
    id: 'wechat',
    name: '微信支付',
    icon: 'chat'
  },
  {
    id: 'alipay',
    name: '支付宝',
    icon: 'account_balance_wallet'
  },
  {
    id: 'balance',
    name: '余额支付',
    icon: 'savings'
  }
]

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

const selectAmount = (amount) => {
  selectedAmount.value = amount
}

const selectPayment = (paymentId) => {
  selectedPayment.value = paymentId
}

const handleCustomAmountInput = () => {
  if (customAmount.value) {
    selectedAmount.value = 0
  }
}

const confirmRecharge = async () => {
  if (loading.value) return

  const amount = customAmount.value || selectedAmount.value
  if (!amount || amount <= 0) {
    showToast('请选择或输入充值金额', 'error')
    return
  }

  loading.value = true
  try {
    const rechargeData = {
      amount: amount,
      method: selectedPayment.value,
      returnUrl: `${window.location.origin}/profile/wallet`,
      notifyUrl: `${window.location.origin}/api/pay/callback`
    }

    const response = await userApi.recharge(rechargeData)

    if (response.success || response.code === 0) {
      if (selectedPayment.value === 'balance') {
        showToast('充值成功', 'success')
        router.push('/profile/wallet')
      } else {
        showToast('充值成功，跳转支付页面', 'success')
        if (response.data && response.data.payUrl) {
          window.location.href = response.data.payUrl
        } else {
          router.push('/profile/wallet')
        }
      }
    } else {
      throw new Error(response.message || response.msg || '充值失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    showToast(result.error || '充值失败，请稍后重试', 'error')
    console.error('充值失败:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <AppHeader
      title="立即充值"
      :show-back="true"
      :show-notifications="true"
      :show-search="true"
      :show-avatar="true"
      @back="handleBack"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content space-y-6">
      <!-- 充值金额 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-sm font-bold text-on-surface mb-4">充值金额</h2>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="amount in amountOptions"
            :key="amount.value"
            class="py-4 px-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95"
            :class="selectedAmount === amount.value && !customAmount
              ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'"
            @click="selectAmount(amount.value); customAmount = ''"
          >
            {{ amount.label }}
          </button>
        </div>
        <div class="mt-4 pt-4 border-t border-surface-container">
          <div class="flex items-center gap-3">
            <span class="text-lg font-bold text-on-surface">¥</span>
            <input
              v-model="customAmount"
              class="w-full bg-transparent border-none p-0 text-lg font-semibold text-on-surface placeholder:text-surface-container-high focus:ring-0"
              placeholder="自定义金额"
              type="number"
              @input="handleCustomAmountInput"
            />
          </div>
        </div>
      </section>

      <!-- 支付方式 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-sm font-bold text-on-surface mb-4">支付方式</h2>
        <div class="space-y-3">
          <button
            v-for="payment in paymentOptions"
            :key="payment.id"
            class="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 active:scale-95"
            :class="selectedPayment === payment.id
              ? 'bg-primary-container/30 border-2 border-primary'
              : 'bg-surface-container border-2 border-transparent hover:bg-surface-container-high'"
            @click="selectPayment(payment.id)"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="selectedPayment === payment.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'"
            >
              <span class="material-symbols-outlined">{{ payment.icon }}</span>
            </div>
            <span class="flex-1 font-semibold text-on-surface text-left">{{ payment.name }}</span>
            <span
              class="material-symbols-outlined text-2xl"
              :class="selectedPayment === payment.id ? 'text-primary' : 'text-outline'"
            >
              {{ selectedPayment === payment.id ? 'check_circle' : 'radio_button_unchecked' }}
            </span>
          </button>
        </div>
      </section>

      <!-- 充值信息 -->
      <section class="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 shadow-xl shadow-primary/20 text-white">
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined">add_card</span>
            <span class="text-sm font-medium">充值信息</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold">¥</span>
            <span class="text-5xl font-extrabold font-headline tracking-tight">{{ customAmount || selectedAmount }}</span>
          </div>
          <div class="flex items-center gap-2 text-white/70 text-sm">
            <span class="material-symbols-outlined text-base">payments</span>
            <span>{{ paymentOptions.find(p => p.id === selectedPayment)?.name }}</span>
          </div>
        </div>
      </section>

      <!-- 充值按钮 -->
      <section class="px-1">
        <button
          @click="confirmRecharge"
          :disabled="loading"
          class="w-full py-4 rounded-2xl bg-primary text-on-primary font-bold text-base shadow-lg shadow-primary/25 active:scale-95 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
          <span>{{ loading ? '充值中...' : `确认充值 ¥${customAmount || selectedAmount}` }}</span>
        </button>
      </section>

      <!-- 提示信息 -->
      <section class="px-5">
        <div class="flex items-start gap-2 text-xs text-on-surface-variant">
          <span class="material-symbols-outlined text-base">info</span>
          <p>充值后金额将实时到账，可在钱包中查看余额变动。如有问题请联系客服。</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>
