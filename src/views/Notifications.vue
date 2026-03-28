<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()

const selectedMonth = ref('2023年10月')

const months = [
  '2023年10月', '2023年09月', '2023年08月', '2023年07月',
  '2023年06月', '2023年05月', '2023年04月', '2023年03月',
  '2023年02月', '2023年01月', '2022年12月', '2022年11月'
]

const transactionTypes = ref([
  { label: '全部类型', active: true },
  { label: '充值记录', active: false },
  { label: '订单消费', active: false },
  { label: '提现记录', active: false },
  { label: '系统奖励', active: false }
])

const selectType = (index) => {
  transactionTypes.value.forEach((type, i) => {
    type.active = i === index
  })
}

const transactions = [
  {
    id: 1,
    title: '系统奖励 - 活跃之星',
    time: '今天 14:20',
    amount: '+88.00',
    status: 'success',
    type: 'tertiary',
    icon: 'military_tech'
  },
  {
    id: 2,
    title: '订单消费 - 英雄联盟陪玩',
    time: '昨天 22:15',
    amount: '-120.00',
    status: 'success',
    type: 'secondary',
    icon: 'receipt_long'
  },
  {
    id: 3,
    title: '微信充值',
    time: '10-24 10:05',
    amount: '+500.00',
    status: 'failed',
    type: 'primary',
    icon: 'account_balance_wallet'
  },
  {
    id: 4,
    title: '余额提现',
    time: '10-23 18:30',
    amount: '-1,000.00',
    status: 'processing',
    type: 'on-surface-variant',
    icon: 'payments'
  },
  {
    id: 5,
    title: '订单消费 - 王者荣耀组队',
    time: '10-22 20:00',
    amount: '-60.00',
    status: 'success',
    type: 'secondary',
    icon: 'receipt_long'
  }
]

const formatAmount = (amount) => {
  if (amount.startsWith('+')) {
    return amount
  }
  return amount
}

const getStatusColor = (status) => {
  switch (status) {
    case 'success':
      return 'bg-surface-container/50 text-on-surface-variant'
    case 'failed':
      return 'bg-error-container/20 text-error'
    case 'processing':
      return 'bg-surface-container/50 text-on-surface-variant'
    default:
      return 'bg-surface-container/50 text-on-surface-variant'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'success':
      return '成功'
    case 'failed':
      return '失败'
    case 'processing':
      return '处理中'
    default:
      return status
  }
}

const getIconColor = (type) => {
  switch (type) {
    case 'primary':
      return 'text-primary'
    case 'secondary':
      return 'text-secondary'
    case 'tertiary':
      return 'text-tertiary'
    case 'on-surface-variant':
      return 'text-on-surface-variant'
    default:
      return 'text-on-surface'
  }
}

const handleMenu = () => {
  router.push('/profile')
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

const toggleMonthDropdown = (event) => {
  event.stopPropagation()
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <AppHeader
      title="交易明细"
      is-primary-page
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="pb-24 px-5 pt-4 max-w-2xl mx-auto">
      <section class="mb-8 relative overflow-hidden bg-primary-container rounded-3xl p-6 shadow-sm">
        <div class="relative z-10">
          <p class="text-on-primary-container/70 text-sm font-medium mb-1">当前余额 (元)</p>
          <h2 class="font-headline text-4xl font-extrabold text-on-primary-container tracking-tight">2,840.50</h2>
          <div class="flex gap-4 mt-6">
            <button class="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-transform flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">add_circle</span>
              快速充值
            </button>
            <button class="bg-surface-container-lowest/30 backdrop-blur-md text-on-primary-container px-6 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-transform">
              提现申请
            </button>
          </div>
        </div>
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-on-primary-container/10 rounded-full blur-2xl"></div>
        <div class="absolute -left-8 -bottom-8 w-40 h-40 bg-secondary-container/20 rounded-full blur-3xl"></div>
      </section>

      <section class="mb-6 space-y-4">
        <div class="flex items-center justify-between">
          <button class="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-sm hover:bg-surface-container-low transition-colors group" @click="toggleMonthDropdown">
            <span class="material-symbols-outlined text-primary text-xl">calendar_today</span>
            <span class="text-sm font-bold text-on-surface">{{ selectedMonth }}</span>
            <span class="material-symbols-outlined text-outline text-sm group-hover:rotate-180 transition-transform">expand_more</span>
          </button>
          <div class="h-10 w-10 flex items-center justify-center bg-surface-container-lowest rounded-2xl shadow-sm">
            <span class="material-symbols-outlined text-primary">filter_list</span>
          </div>
        </div>
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            v-for="(type, index) in transactionTypes" 
            :key="type.label"
            @click="selectType(index)"
            class="whitespace-nowrap px-5 py-2 rounded-full font-bold text-sm transition-colors"
            :class="type.active ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'"
          >
            {{ type.label }}
          </button>
        </div>
      </section>

      <div class="space-y-3">
        <div 
          v-for="transaction in transactions" 
          :key="transaction.id"
          class="bg-surface-container-lowest p-5 rounded-3xl flex items-center justify-between group hover:bg-primary-container/5 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl" :class="`${transaction.type === 'on-surface-variant' ? 'bg-on-surface-variant/10' : `bg-${transaction.type}-container/20`} flex items-center justify-center`">
              <span class="material-symbols-outlined" :class="getIconColor(transaction.type)" style="font-variation-settings: 'FILL' 1;">
                {{ transaction.icon }}
              </span>
            </div>
            <div>
              <h4 class="font-bold text-on-surface">{{ transaction.title }}</h4>
              <p class="text-xs text-on-surface-variant mt-0.5">{{ transaction.time }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-headline font-bold text-lg" :class="transaction.amount.startsWith('+') ? 'text-primary' : 'text-on-surface'">
              {{ transaction.amount }}
            </p>
            <span class="inline-block px-2 py-0.5 rounded-lg" :class="getStatusColor(transaction.status)">
              {{ getStatusText(transaction.status) }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <button class="text-on-surface-variant text-sm font-bold flex items-center gap-1 mx-auto hover:text-primary transition-colors">
          加载更多历史明细
          <span class="material-symbols-outlined text-sm">keyboard_double_arrow_down</span>
        </button>
      </div>
    </main>

    <BottomNavBar />

    <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl rounded-t-[1.5rem] shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)]">
      <a class="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 px-4 py-1.5 hover:opacity-80 transition-all duration-300" href="#">
        <span class="material-symbols-outlined mb-1">home</span>
        <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-medium">首页</span>
      </a>
      <a class="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 px-4 py-1.5 hover:opacity-80 transition-all duration-300" href="#">
        <span class="material-symbols-outlined mb-1">group</span>
        <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-medium">社区</span>
      </a>
      <a class="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 px-4 py-1.5 hover:opacity-80 transition-all duration-300" href="#">
        <span class="material-symbols-outlined mb-1">receipt_long</span>
        <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-medium">订单</span>
      </a>
      <a class="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 px-4 py-1.5 hover:opacity-80 transition-all duration-300" href="#">
        <span class="material-symbols-outlined mb-1">military_tech</span>
        <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-medium">成就</span>
      </a>
      <a class="flex flex-col items-center justify-center bg-[#FFD700] text-[#6c5a00] rounded-2xl px-4 py-1.5 animate-spring" href="#">
        <span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">person</span>
        <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-medium">我的</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
