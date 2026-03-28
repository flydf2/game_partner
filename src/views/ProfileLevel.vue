<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <AppHeader
      title="我的段位"
      is-primary-page
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />
    
    <main class="page-content pt-24 pb-32 space-y-6">
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
        <!-- 用户等级卡片 -->
        <section class="relative overflow-hidden rounded-[2rem] bg-primary-container p-8 shadow-sm mb-6">
          <div class="absolute -right-12 -top-12 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
          <div class="absolute -left-8 -bottom-8 w-32 h-32 bg-secondary-container/30 rounded-full blur-2xl"></div>
          <div class="relative z-10">
            <div class="flex items-end justify-between mb-6">
              <div>
                <span class="inline-block px-3 py-1 rounded-full bg-primary text-on-primary text-[10px] font-bold tracking-widest uppercase mb-2">Current Tier</span>
                <h1 class="text-4xl font-headline font-extrabold text-on-primary-container leading-none">Lv.5 黄金玩家</h1>
              </div>
              <span class="material-symbols-outlined text-6xl text-primary/20" data-icon="military_tech" style="font-variation-settings: 'FILL' 1;">military_tech</span>
            </div>
            <!-- 进度条 -->
            <div class="space-y-3">
              <div class="flex justify-between items-end">
                <span class="text-on-primary-container font-bold text-sm">距离 Lv.6 铂金</span>
                <span class="font-headline font-bold text-lg text-primary">850 <span class="text-sm font-medium opacity-60">/ 1200 EXP</span></span>
              </div>
              <div class="h-4 w-full bg-white/40 rounded-full overflow-hidden p-1">
                <div class="h-full bg-primary rounded-full transition-all duration-1000" style="width: 70%;"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 已解锁权益 -->
        <section class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-headline font-extrabold tracking-tight text-on-surface">已解锁权益</h2>
            <span class="text-primary font-bold text-sm cursor-pointer hover:opacity-80">查看全部</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-surface-container-lowest p-6 rounded-[1.5rem] flex flex-col gap-4 transition-all hover:scale-[1.02]">
              <div class="w-12 h-12 rounded-2xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                <span class="material-symbols-outlined" data-icon="pentagon" style="font-variation-settings: 'FILL' 1;">pentagon</span>
              </div>
              <div>
                <h3 class="font-bold text-on-surface mb-1">专属头像框</h3>
                <p class="text-xs text-on-surface-variant leading-relaxed">彰显黄金段位尊贵身份标识</p>
              </div>
            </div>
            <div class="bg-surface-container-lowest p-6 rounded-[1.5rem] flex flex-col gap-4 transition-all hover:scale-[1.02]">
              <div class="w-12 h-12 rounded-2xl bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span class="material-symbols-outlined" data-icon="auto_awesome" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
              </div>
              <div>
                <h3 class="font-bold text-on-surface mb-1">进场特效</h3>
                <p class="text-xs text-on-surface-variant leading-relaxed">进入聊天室自带金色闪光</p>
              </div>
            </div>
            <div class="col-span-2 bg-surface-container-lowest p-6 rounded-[1.5rem] flex items-center gap-6 transition-all hover:scale-[1.01]">
              <div class="w-16 h-16 rounded-3xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined text-3xl" data-icon="bolt" style="font-variation-settings: 'FILL' 1;">bolt</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <h3 class="font-bold text-on-surface">优先匹配权</h3>
                  <span class="px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold">ACTIVE</span>
                </div>
                <p class="text-sm text-on-surface-variant">高峰期享受陪玩师优先接单特权，无需排队等待。</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 升级指南 -->
        <section class="mb-8">
          <h2 class="text-2xl font-headline font-extrabold tracking-tight text-on-surface mb-6">升级指南</h2>
          <div class="space-y-4">
            <div class="group flex items-center p-5 rounded-[1.25rem] bg-surface-container-low hover:bg-surface-container-highest transition-colors cursor-pointer">
              <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 group-hover:bg-primary-container transition-colors">
                <span class="material-symbols-outlined text-primary" data-icon="sports_esports">sports_esports</span>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-on-surface">参与陪玩订单</h4>
                <p class="text-xs text-on-surface-variant">+50 经验/小时</p>
              </div>
              <span class="material-symbols-outlined text-outline-variant" data-icon="chevron_right">chevron_right</span>
            </div>
            <div class="group flex items-center p-5 rounded-[1.25rem] bg-surface-container-low hover:bg-surface-container-highest transition-colors cursor-pointer">
              <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 group-hover:bg-primary-container transition-colors">
                <span class="material-symbols-outlined text-primary" data-icon="volunteer_activism">volunteer_activism</span>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-on-surface">获得优质评价</h4>
                <p class="text-xs text-on-surface-variant">+20 经验/五星评价</p>
              </div>
              <span class="material-symbols-outlined text-outline-variant" data-icon="chevron_right">chevron_right</span>
            </div>
            <div class="group flex items-center p-5 rounded-[1.25rem] bg-surface-container-low hover:bg-surface-container-highest transition-colors cursor-pointer">
              <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 group-hover:bg-primary-container transition-colors">
                <span class="material-symbols-outlined text-primary" data-icon="celebration">celebration</span>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-on-surface">完成每日挑战</h4>
                <p class="text-xs text-on-surface-variant">+100 经验/任务</p>
              </div>
              <span class="material-symbols-outlined text-outline-variant" data-icon="chevron_right">chevron_right</span>
            </div>
          </div>
        </section>

        <!-- 等级积分说明 -->
        <section class="bg-surface-container-lowest rounded-3xl p-6">
          <h2 class="text-2xl font-headline font-extrabold tracking-tight text-on-surface mb-6">段位等级说明</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-on-primary" style="font-variation-settings: 'FILL' 1;">military_tech</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <h4 class="font-bold text-on-surface">Lv.1 青铜玩家</h4>
                  <span class="text-xs font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full">0-500</span>
                </div>
                <p class="text-xs text-on-surface-variant">新手入门，累计经验 0-500</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
              <div class="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-on-secondary" style="font-variation-settings: 'FILL' 1;">military_tech</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <h4 class="font-bold text-on-surface">Lv.2 白银玩家</h4>
                  <span class="text-xs font-bold bg-secondary text-on-secondary px-2 py-0.5 rounded-full">501-1200</span>
                </div>
                <p class="text-xs text-on-surface-variant">初步成长，累计经验 501-1200</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-tertiary/5 border border-tertiary/10">
              <div class="w-12 h-12 rounded-xl bg-tertiary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-on-tertiary" style="font-variation-settings: 'FILL' 1;">military_tech</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <h4 class="font-bold text-on-surface">Lv.3 黄金玩家</h4>
                  <span class="text-xs font-bold bg-tertiary text-on-tertiary px-2 py-0.5 rounded-full">1201-2500</span>
                </div>
                <p class="text-xs text-on-surface-variant">稳定提升，累计经验 1201-2500</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-primary-container/5 border border-primary-container/10">
              <div class="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">military_tech</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <h4 class="font-bold text-on-surface">Lv.4 铂金玩家</h4>
                  <span class="text-xs font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">2501-4500</span>
                </div>
                <p class="text-xs text-on-surface-variant">高手进阶，累计经验 2501-4500</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-high/5 border border-surface-container-high/10">
              <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-on-surface" style="font-variation-settings: 'FILL' 1;">military_tech</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <h4 class="font-bold text-on-surface">Lv.5 钻石玩家</h4>
                  <span class="text-xs font-bold bg-surface-container-high text-on-surface px-2 py-0.5 rounded-full">4501-7000</span>
                </div>
                <p class="text-xs text-on-surface-variant">顶尖高手，累计经验 4501-7000</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-error/5 border border-error/10">
              <div class="w-12 h-12 rounded-xl bg-error flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-on-error" style="font-variation-settings: 'FILL' 1;">military_tech</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <h4 class="font-bold text-on-surface">Lv.6 大师玩家</h4>
                  <span class="text-xs font-bold bg-error text-on-error px-2 py-0.5 rounded-full">7001+</span>
                </div>
                <p class="text-xs text-on-surface-variant">传奇王者，累计经验 7001+</p>
              </div>
            </div>
          </div>
        </section>

      </template>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { useToast } from '../composables/useToast.js'
import { userApi, orderApi, handleApiError } from '../api/index.js'
import AppHeader from '../components/AppHeader.vue'

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
    case 'notifications':
      router.push('/notifications')
      break
    case 'help':
      router.push('/profile/help')
      break
    case 'settings':
      router.push('/profile/settings')
      break
  }
}

const handleUserInfoClick = () => {
  router.push('/profile/edit')
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

onMounted(() => {
  if (!userStore.getIsLoggedIn) {
    router.push('/login')
    return
  }
  loadData()
  loadOrders()
})
</script>

<style scoped>
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
</style>
