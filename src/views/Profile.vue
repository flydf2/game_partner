<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <!-- TopAppBar -->
    <TopAppBar title="个人中心" />
    
    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
      <!-- 加载状态 -->
      <section v-if="loading" class="bg-surface-container-lowest rounded-3xl p-6 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm text-on-surface-variant">加载中...</p>
        </div>
      </section>

      <!-- 错误状态 -->
      <section v-else-if="error" class="bg-surface-container-lowest rounded-3xl p-6">
        <div class="flex flex-col items-center gap-3">
          <span class="material-symbols-outlined text-error text-4xl">error_outline</span>
          <p class="text-sm text-error">{{ error }}</p>
          <button 
            class="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
            @click="loadData"
          >
            重试
          </button>
        </div>
      </section>

      <!-- 主内容 -->
      <template v-else>
        <section 
          class="relative overflow-hidden rounded-3xl bg-surface-container-lowest p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-md cursor-pointer"
          @click="handleLevelClick"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-bl-full -mr-8 -mt-8"></div>
          <div class="relative w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-primary-container/30">
            <img alt="Avatar" class="w-full h-full object-cover" :src="userInfo.avatar" />
          </div>
          <div class="flex-1 space-y-1">
            <h2 class="text-xl font-bold text-on-surface font-headline">{{ userInfo.nickname }}</h2>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">VIP {{ userInfo.vipLevel }}</span>
              <span class="text-xs text-on-surface-variant">ID: {{ userInfo.id }}</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-outline transition-transform duration-200 hover:translate-x-1">chevron_right</span>
        </section>

        <section class="grid grid-cols-2 gap-4">
          <div 
            class="bg-primary-container rounded-3xl p-5 space-y-2 transition-all duration-300 hover:shadow-md cursor-pointer active:scale-95"
            @click="handleWalletClick"
          >
            <div class="flex items-center justify-between text-on-primary-container">
              <span class="text-sm font-semibold">账户余额</span>
              <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-xs font-bold text-on-primary-container">¥</span>
              <span class="text-2xl font-black font-headline text-on-primary-container tracking-tight">{{ formatAmount(userInfo.balance) }}</span>
            </div>
          </div>
          <div class="bg-white rounded-3xl p-5 space-y-2 border border-surface-container transition-all duration-300 hover:shadow-md">
            <div class="flex items-center justify-between text-on-surface-variant">
              <span class="text-sm font-semibold">优惠券</span>
              <span class="material-symbols-outlined text-lg">confirmation_number</span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black font-headline text-primary tracking-tight">{{ userInfo.couponCount }}</span>
              <span class="text-xs font-bold text-on-surface-variant">张</span>
            </div>
          </div>
        </section>

        <section class="bg-surface-container-lowest rounded-3xl p-5">
          <h3 class="text-sm font-bold text-on-surface mb-5 px-1">服务订单</h3>
          <div class="flex justify-between items-center">
            <button 
              v-for="status in orderStatuses" 
              :key="status.key"
              class="flex flex-col items-center gap-2 group transition-all active:scale-95"
              :class="{ 'text-primary': activeOrderStatus === status.key }"
              @click="handleOrderStatusClick(status.key)"
            >
              <div class="relative w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-container transition-colors">
                <span class="material-symbols-outlined">{{ status.icon }}</span>
                <span 
                  v-if="status.badge" 
                  class="absolute -top-1 -right-1 w-4 h-4 bg-error text-[9px] text-white flex items-center justify-center rounded-full border-2 border-white"
                >
                  {{ status.badge }}
                </span>
              </div>
              <span class="text-[11px] font-medium text-on-surface-variant">{{ status.label }}</span>
            </button>
          </div>
        </section>

        <!-- 订单加载状态 -->
        <section v-if="orderLoading" class="bg-surface-container-lowest rounded-3xl p-8 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3">
            <div class="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-on-surface-variant">加载订单中...</p>
          </div>
        </section>

        <!-- 订单错误状态 -->
        <section v-else-if="orderError" class="bg-surface-container-lowest rounded-3xl p-6">
          <div class="flex flex-col items-center gap-3">
            <span class="material-symbols-outlined text-error text-3xl">error_outline</span>
            <p class="text-sm text-error">{{ orderError }}</p>
            <button 
              class="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
              @click="loadOrders"
            >
              重试
            </button>
          </div>
        </section>

        <!-- 订单列表 -->
        <section v-else-if="filteredOrders.length > 0" class="space-y-4">
          <h3 class="text-sm font-bold text-on-surface px-1">订单列表</h3>
          <div 
            v-for="order in filteredOrders" 
            :key="order.id"
            class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 active:scale-[0.98] hover:bg-surface-container-low cursor-pointer"
            @click="handleOrderDetail(order.id)"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl overflow-hidden">
                  <img :src="order.expertAvatar" alt="Expert Avatar" class="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 class="font-bold text-sm">{{ order.expertName }}</h4>
                  <p class="text-xs text-on-surface-variant">{{ order.game }} · {{ order.skill }}</p>
                </div>
              </div>
              <span :class="getOrderStatusClass(order.status)" class="text-xs font-bold px-2 py-1 rounded-full">
                {{ order.statusText }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <div>
                <span class="text-xs text-on-surface-variant">服务时间</span>
                <p class="text-sm font-medium">{{ order.serviceTime }}</p>
              </div>
              <div class="text-right">
                <span class="text-xs text-on-surface-variant">金额</span>
                <p class="text-sm font-bold text-primary">¥{{ order.amount }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 空订单状态 -->
        <section v-else class="bg-surface-container-lowest rounded-3xl p-8 text-center">
          <div class="w-20 h-20 mx-auto bg-surface-container flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-outline text-4xl">receipt_long</span>
          </div>
          <p class="text-sm text-on-surface-variant">暂无订单</p>
        </section>

        <!-- 设置菜单 -->
        <section class="bg-surface-container-lowest rounded-3xl overflow-hidden">
          <div class="divide-y divide-surface-container">
            <a 
              v-for="item in menuItems" 
              :key="item.key"
              class="flex items-center gap-4 p-5 hover:bg-surface-container-low transition-colors cursor-pointer duration-200"
              @click="handleMenuClick(item.key)"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="item.iconBg">
                <span class="material-symbols-outlined" :class="item.iconColor" style="font-variation-settings: 'FILL' 1;">{{ item.icon }}</span>
              </div>
              <span class="flex-1 font-semibold text-on-surface">{{ item.label }}</span>
              <span v-if="item.badge" class="text-xs text-outline mr-1">{{ item.badge }}</span>
              <span class="material-symbols-outlined text-outline text-lg transition-transform duration-200 hover:translate-x-1">chevron_right</span>
            </a>
          </div>
        </section>

        <!-- 退出登录按钮 -->
        <button 
          class="w-full py-4 rounded-full bg-white text-error font-bold text-sm shadow-sm active:scale-95 transition-all duration-200 hover:bg-red-50"
          @click="showLogoutDialog = true"
        >
          退出登录
        </button>
      </template>

      <!-- 退出登录确认对话框 -->
      <div v-if="showLogoutDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
        <div class="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-sm animate-in fade-in-90 slide-in-from-bottom-5">
          <h3 class="text-lg font-bold text-on-surface font-headline mb-4 text-center">确认退出登录</h3>
          <p class="text-sm text-on-surface-variant mb-6 text-center">您确定要退出当前账号吗？</p>
          <div class="flex gap-4">
            <button 
              class="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-low"
              @click="showLogoutDialog = false"
            >
              取消
            </button>
            <button 
              class="flex-1 py-3 rounded-full bg-error text-white font-bold text-sm transition-all active:scale-95 hover:bg-error-dim"
              @click="handleLogout"
            >
              确定退出
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TopAppBar from '../components/TopAppBar.vue'
import { useUserStore } from '../stores/user.js'
import { useToast } from '../composables/useToast.js'
import { userApi, orderApi, handleApiError } from '../api/index.js'

const router = useRouter()
const userStore = useUserStore()
const { showToast } = useToast()

const userInfo = ref({
  avatar: '',
  nickname: '',
  vipLevel: 0,
  id: '',
  balance: 0,
  couponCount: 0
})

const orders = ref([])
const orderStatuses = ref([
  { key: 'all', label: '全部', icon: 'receipt_long', badge: null },
  { key: 'pending', label: '待进行', icon: 'pending_actions', badge: null },
  { key: 'completed', label: '已完成', icon: 'check_circle', badge: null },
  { key: 'cancelled', label: '已取消', icon: 'cancel', badge: null }
])

const activeOrderStatus = ref('all')
const loading = ref(true)
const error = ref('')
const orderLoading = ref(false)
const orderError = ref('')
const showLogoutDialog = ref(false)

const filteredOrders = computed(() => {
  if (activeOrderStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === activeOrderStatus.value)
})

const menuItems = ref([
  { 
    key: 'edit', 
    label: '编辑资料', 
    icon: 'edit', 
    iconBg: 'bg-blue-50', 
    iconColor: 'text-blue-600',
    badge: null 
  },
  { 
    key: 'wallet', 
    label: '我的钱包', 
    icon: 'account_balance_wallet', 
    iconBg: 'bg-green-50', 
    iconColor: 'text-green-600',
    badge: null 
  },
  { 
    key: 'favorites', 
    label: '我的收藏', 
    icon: 'star', 
    iconBg: 'bg-yellow-50', 
    iconColor: 'text-yellow-600',
    badge: null 
  },
  { 
    key: 'following', 
    label: '关注列表', 
    icon: 'favorite', 
    iconBg: 'bg-pink-50', 
    iconColor: 'text-pink-600',
    badge: null 
  },
  { 
    key: 'history', 
    label: '浏览历史', 
    icon: 'history', 
    iconBg: 'bg-purple-50', 
    iconColor: 'text-purple-600',
    badge: null 
  },
  { 
    key: 'skills', 
    label: '我的技能', 
    icon: 'sports_esports', 
    iconBg: 'bg-orange-50', 
    iconColor: 'text-orange-600',
    badge: null 
  },
  { 
    key: 'order-settings', 
    label: '接单设置', 
    icon: 'settings_applications', 
    iconBg: 'bg-indigo-50', 
    iconColor: 'text-indigo-600',
    badge: null 
  },
  { 
    key: 'match-history', 
    label: '历史战绩', 
    icon: 'sports_esports', 
    iconBg: 'bg-orange-50', 
    iconColor: 'text-orange-600',
    badge: null 
  },
  { 
    key: 'security', 
    label: '账号安全', 
    icon: 'security', 
    iconBg: 'bg-red-50', 
    iconColor: 'text-red-600',
    badge: null 
  },
  { 
    key: 'privacy', 
    label: '隐私设置', 
    icon: 'privacy_tip', 
    iconBg: 'bg-indigo-50', 
    iconColor: 'text-indigo-600',
    badge: null 
  },
  { 
    key: 'expert-certification', 
    label: '大神认证', 
    icon: 'verified_user', 
    iconBg: 'bg-teal-50', 
    iconColor: 'text-teal-600',
    badge: null 
  },
  { 
    key: 'withdrawal', 
    label: '收益提现', 
    icon: 'attach_money', 
    iconBg: 'bg-cyan-50', 
    iconColor: 'text-cyan-600',
    badge: null 
  },
  { 
    key: 'appeals', 
    label: '申诉记录', 
    icon: 'description', 
    iconBg: 'bg-gray-50', 
    iconColor: 'text-gray-600',
    badge: null 
  },
  { 
    key: 'user-agreement', 
    label: '用户协议', 
    icon: 'description', 
    iconBg: 'bg-slate-50', 
    iconColor: 'text-slate-600',
    badge: null 
  },
  { 
    key: 'notifications', 
    label: '通知', 
    icon: 'notifications', 
    iconBg: 'bg-purple-50', 
    iconColor: 'text-purple-600',
    badge: null 
  },
  { 
    key: 'help', 
    label: '帮助与客服', 
    icon: 'support_agent', 
    iconBg: 'bg-blue-50', 
    iconColor: 'text-blue-600',
    badge: null 
  },
  { 
    key: 'settings', 
    label: '通用设置', 
    icon: 'settings', 
    iconBg: 'bg-zinc-100', 
    iconColor: 'text-zinc-600',
    badge: null 
  }
])

const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getOrderStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-primary/10 text-primary'
    case 'completed':
      return 'bg-green-100 text-green-600'
    case 'cancelled':
      return 'bg-zinc-100 text-zinc-600'
    default:
      return 'bg-surface-container text-on-surface-variant'
  }
}

const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await userApi.getUserInfo()
    if (response.success || response.code === 0) {
      userInfo.value = {
        avatar: response.data.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
        nickname: response.data.nickname || response.data.username || '用户',
        vipLevel: response.data.vipLevel || 0,
        id: response.data.id || '',
        balance: response.data.balance || 0,
        couponCount: response.data.couponCount || 0
      }
    } else {
      throw new Error(response.message || response.msg || '获取用户信息失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取用户信息失败:', err)
  } finally {
    loading.value = false
  }
}

const loadOrders = async () => {
  orderLoading.value = true
  orderError.value = ''
  try {
    const response = await orderApi.getOrders(activeOrderStatus.value === 'all' ? 'all' : activeOrderStatus.value)
    if (response.success || response.code === 0) {
      orders.value = (response.data?.data || response.data || []).map(order => ({
        id: order.id,
        expertAvatar: order.expertAvatar || order.playmate?.avatar || 'https://via.placeholder.com/150',
        expertName: order.expertName || order.playmate?.name || '未知',
        game: order.game || order.playmate?.game || '未知',
        skill: order.skill || order.playmate?.service || '未知服务',
        status: order.status,
        statusText: getStatusText(order.status),
        serviceTime: formatServiceTime(order.serviceTime || order.createdAt),
        amount: order.amount || order.price || 0
      }))
    } else {
      throw new Error(response.message || response.msg || '获取订单列表失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    orderError.value = result.error
    console.error('获取订单列表失败:', err)
  } finally {
    orderLoading.value = false
  }
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待进行',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

const formatServiceTime = (dateString) => {
  if (!dateString) return '未知时间'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const handleOrderStatusClick = (status) => {
  activeOrderStatus.value = status
  loadOrders()
}

const handleOrderDetail = async (orderId) => {
  try {
    // 跳转到订单详情页面
    router.push(`/order/${orderId}`)
  } catch (err) {
    console.error('获取订单详情失败:', err)
  }
}

const handleMenuClick = (key) => {
  console.log('菜单项点击:', key)
  switch (key) {
    case 'edit':
      router.push('/profile/edit')
      break
    case 'wallet':
      router.push('/profile/wallet')
      break
    case 'favorites':
      router.push('/profile/favorites')
      break
    case 'following':
      router.push('/profile/following')
      break
    case 'history':
      router.push('/profile/history')
      break
    case 'skills':
      router.push('/profile/skills')
      break
    case 'order-settings':
      router.push('/order-settings')
      break
    case 'match-history':
      router.push('/match-history')
      break
    case 'security':
      router.push('/profile/security')
      break
    case 'privacy':
      router.push('/profile/privacy')
      break
    case 'expert-certification':
      router.push('/expert-certification')
      break
    case 'withdrawal':
      router.push('/withdrawal')
      break
    case 'appeals':
      router.push('/appeals')
      break
    case 'user-agreement':
      router.push('/user-agreement')
      break
    case 'help':
      router.push('/profile/help')
      break
    case 'notifications':
      router.push('/notifications')
      break
    case 'settings':
      router.push('/profile/settings')
      break
  }
}

const handleWalletClick = () => {
  router.push('/profile/wallet')
}

const handleLevelClick = () => {
  router.push('/profile/level')
}

const handleLogout = async () => {
  try {
    showLogoutDialog.value = false
    await userStore.logout()
    showToast('退出登录成功', 'success')
    router.push('/login')
  } catch (err) {
    console.error('退出登录失败:', err)
    showToast('退出登录失败，请重试', 'error')
  }
}

onMounted(() => {
  // 检查登录状态
  if (!userStore.getIsLoggedIn) {
    router.push('/login')
    return
  }
  loadData()
  loadOrders()
})
</script>

<style scoped>
/* 组件样式 */

/* 页面滚动动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

section {
  animation: fadeIn 0.5s ease-out forwards;
}

section:nth-child(1) { animation-delay: 0.1s; }
section:nth-child(2) { animation-delay: 0.2s; }
section:nth-child(3) { animation-delay: 0.3s; }
section:nth-child(4) { animation-delay: 0.4s; }
section:nth-child(5) { animation-delay: 0.5s; }
section:nth-child(6) { animation-delay: 0.6s; }
section:nth-child(7) { animation-delay: 0.7s; }
section:nth-child(8) { animation-delay: 0.8s; }

/* 移动端适配 */
@media (max-width: 375px) {
  section {
    padding: 4px;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .w-20 {
    width: 16rem;
  }
  
  .h-20 {
    height: 16rem;
  }
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 触摸反馈优化 */
button, a {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
</style>
