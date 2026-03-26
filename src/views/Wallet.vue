<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi, withdrawalApi, handleApiError } from '../api/index.js'

const router = useRouter()

const walletInfo = ref({
  balance: 0,
  frozen: 0,
  totalIncome: 0,
  totalWithdraw: 0
})

const transactions = ref([])
const loading = ref(false)
const showWithdrawDialog = ref(false)
const withdrawAmount = ref('')
const withdrawError = ref('')

const loadWallet = async () => {
  loading.value = true
  try {
    const response = await userApi.getWallet()
    if (response.success || response.code === 0) {
      const data = response.data || {}
      walletInfo.value = {
        balance: data.balance || 0,
        frozen: data.frozen || 0,
        totalIncome: data.totalIncome || 0,
        totalWithdraw: data.totalExpense || 0
      }
      
      // 转换交易记录格式
      transactions.value = (data.transactions || []).map(transaction => ({
        id: transaction.id,
        type: transaction.type === 'expense' ? 'withdraw' : transaction.type,
        title: transaction.description,
        amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
        time: new Date(transaction.time).toLocaleString('zh-CN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'completed'
      }))
    } else {
      throw new Error(response.message || response.msg || '获取钱包信息失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    console.error('获取钱包信息失败:', err)
  } finally {
    loading.value = false
  }
}

const availableBalance = computed(() => {
  return walletInfo.value.balance - walletInfo.value.frozen
})

const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleWithdraw = () => {
  if (!withdrawAmount.value) {
    withdrawError.value = '请输入提现金额'
    return
  }

  const amount = parseFloat(withdrawAmount.value)
  if (amount <= 0) {
    withdrawError.value = '提现金额必须大于0'
    return
  }

  if (amount > availableBalance.value) {
    withdrawError.value = '提现金额不能超过可用余额'
    return
  }

  showWithdrawDialog.value = true
}

const confirmWithdraw = async () => {
  loading.value = true
  try {
    const response = await withdrawalApi.submitWithdrawal({
      amount: parseFloat(withdrawAmount.value)
    })
    if (response.success || response.code === 0) {
      walletInfo.value.balance -= parseFloat(withdrawAmount.value)
      walletInfo.value.totalWithdraw += parseFloat(withdrawAmount.value)
      
      transactions.value.unshift({
        id: Date.now(),
        type: 'withdraw',
        title: '提现到微信',
        amount: -parseFloat(withdrawAmount.value),
        time: new Date().toLocaleString('zh-CN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'processing'
      })
      
      showWithdrawDialog.value = false
      withdrawAmount.value = ''
      withdrawError.value = ''
    } else {
      throw new Error(response.message || response.msg || '提现失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    withdrawError.value = result.error
    console.error('提现失败:', err)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
}

const handleBill = () => {
  // 账单功能，暂时显示提示
  alert('账单功能开发中')
}

const getTransactionIcon = (type) => {
  return type === 'income' ? 'arrow_downward' : 'arrow_upward'
}

const getTransactionColor = (type) => {
  return type === 'income' ? 'text-success' : 'text-error'
}

onMounted(() => {
  loadWallet()
})
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
      <div class="w-6"></div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6 space-y-6">
      <!-- 钱包卡片 -->
      <section class="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 shadow-xl shadow-primary/20 text-white">
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined">account_balance_wallet</span>
            <span class="text-sm font-medium">账户余额</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold">¥</span>
            <span class="text-5xl font-extrabold font-headline tracking-tight">{{ formatAmount(walletInfo.balance) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <div>
              <p class="text-white/70">可用余额</p>
              <p class="font-bold">¥{{ formatAmount(availableBalance) }}</p>
            </div>
            <div>
              <p class="text-white/70">冻结金额</p>
              <p class="font-bold">¥{{ formatAmount(walletInfo.frozen) }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 操作按钮 -->
      <section class="grid grid-cols-2 gap-4">
        <button
          @click="handleWithdraw"
          class="bg-surface-container-lowest rounded-3xl p-5 flex flex-col items-center gap-3 hover:bg-surface-container-low transition-all active:scale-95"
        >
          <div class="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-xl">payments</span>
          </div>
          <span class="font-bold text-on-surface">提现</span>
        </button>
        <button
          @click="handleBill"
          class="bg-surface-container-lowest rounded-3xl p-5 flex flex-col items-center gap-3 hover:bg-surface-container-low transition-all active:scale-95"
        >
          <div class="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-secondary text-xl">receipt_long</span>
          </div>
          <span class="font-bold text-on-surface">账单</span>
        </button>
      </section>

      <!-- 统计信息 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-sm font-bold text-on-surface mb-4">收支统计</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <p class="text-xs text-on-surface-variant">累计收入</p>
            <p class="text-lg font-bold text-success">¥{{ formatAmount(walletInfo.totalIncome) }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs text-on-surface-variant">累计提现</p>
            <p class="text-lg font-bold text-error">¥{{ formatAmount(walletInfo.totalWithdraw) }}</p>
          </div>
        </div>
      </section>

      <!-- 交易记录 -->
      <section class="space-y-4">
        <h2 class="text-sm font-bold text-on-surface px-1">交易记录</h2>
        <div class="space-y-3">
          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="bg-surface-container-lowest rounded-2xl p-4 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="transaction.type === 'income' ? 'bg-success-container/20' : 'bg-error-container/20'">
                <span class="material-symbols-outlined" :class="getTransactionColor(transaction.type)">{{ getTransactionIcon(transaction.type) }}</span>
              </div>
              <div>
                <p class="font-semibold text-on-surface">{{ transaction.title }}</p>
                <p class="text-xs text-on-surface-variant">{{ transaction.time }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold" :class="getTransactionColor(transaction.type)">
                {{ transaction.amount > 0 ? '+' : '' }}¥{{ formatAmount(Math.abs(transaction.amount)) }}
              </p>
              <p class="text-xs" :class="transaction.status === 'completed' ? 'text-success' : 'text-warning'">
                {{ transaction.status === 'completed' ? '已完成' : '处理中' }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 提现对话框 -->
    <div v-if="showWithdrawDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div class="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-sm animate-in fade-in-90 slide-in-from-bottom-5">
        <h3 class="text-lg font-bold text-on-surface font-headline mb-4">提现申请</h3>
        
        <div class="space-y-4">
          <div class="bg-surface-container rounded-2xl p-4">
            <p class="text-sm text-on-surface-variant">可用余额</p>
            <p class="text-2xl font-bold text-primary">¥{{ formatAmount(availableBalance) }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">提现金额</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">¥</span>
              <input
                v-model="withdrawAmount"
                type="number"
                placeholder="请输入提现金额"
                class="w-full bg-surface-container-low rounded-2xl py-4 pl-10 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              />
            </div>
            <p v-if="withdrawError" class="text-xs text-error">{{ withdrawError }}</p>
          </div>

          <div class="flex gap-3">
            <button
              @click="showWithdrawDialog = false"
              class="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-low"
            >
              取消
            </button>
            <button
              @click="confirmWithdraw"
              :disabled="loading"
              class="flex-1 py-3 rounded-full bg-primary-container text-on-primary-container font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? '处理中...' : '确认提现' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>