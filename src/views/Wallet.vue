<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../api/index.js'

const router = useRouter()

const walletInfo = ref({
  balance: 0,
  frozen: 0,
  totalIncome: 0,
  totalWithdraw: 0
})

const transactions = ref([])
const loading = ref(false)

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
  router.push('/withdrawal')
}

const handleBack = () => {
  router.back()
}

const handleBill = () => {
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

    <main class="page-content pt-24 pb-32 space-y-6 space-y-6">
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
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>