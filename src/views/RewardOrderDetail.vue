<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import api from '../api/index.js'
import BottomNavBar from '../components/BottomNavBar.vue'
import { useUserStore } from '../stores/user.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const orderId = ref(route.params.id)
const order = ref(null)
const applicants = ref([])
const publishedOrders = ref([])
const loading = ref(true)
const error = ref('')
const status = ref('active')
const currentUserGrabOrderId = ref('')


const isPublisher = computed(() => {
  if (!order.value || !userStore.userInfo) return false
  return order.value.userId === userStore.userInfo.id
})

const currentUserApplication = computed(() => {
  if (!userStore.userInfo || !applicants.value.length) return null
  return applicants.value.find(app => String(app.userId) === String(userStore.userInfo.id))
})

const currentUserApplicationStatus = computed(() => {
  const app = currentUserApplication.value
  if (!app) return null
  return app.status
})

const currentUserApplicationStatusText = computed(() => {
  const status = currentUserApplicationStatus.value
  if (!status) return ''
  const statusMap = {
    'pending': '待处理',
    'approved': '已通过',
    'rejected': '已拒绝'
  }
  return statusMap[status] || status
})

const parsedTags = computed(() => {
  if (!order.value || !order.value.tags) return []
  try {
    return Array.isArray(order.value.tags) ? order.value.tags : JSON.parse(order.value.tags)
  } catch (e) {
    return [order.value.tags]
  }
})

const parsedRequirements = computed(() => {
  if (!order.value || !order.value.requirements) return []
  try {
    return Array.isArray(order.value.requirements) ? order.value.requirements : JSON.parse(order.value.requirements)
  } catch (e) {
    return [order.value.requirements]
  }
})

const paymentMethodText = computed(() => {
  if (!order.value) return ''
  const methods = {
    'prepay': '预付',
    'postpay': '后付'
  }
  return methods[order.value.paymentMethod] || order.value.paymentMethod
})

const loadOrderDetail = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await api.rewardOrder.getRewardOrderDetail(orderId.value)
    if (response.success || response.code === 0) {
      order.value = response.data
      status.value = response.data.status || 'active'
      loadApplicants()
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

const loadApplicants = async () => {
  try {
    const response = await api.rewardOrder.getApplicants(orderId.value)
    if (response.success || response.code === 0) {
      applicants.value = response.data || []
    }
    // 找到我的抢单ID  赋值给 currentUserGrabOrderId
    if (userStore.userInfo) {
      const userGrabOrder = applicants.value.find(app => String(app.userId) === String(userStore.userInfo.id))
      if (userGrabOrder) {
        currentUserGrabOrderId.value = userGrabOrder.id
      }
    }
  } catch (err) {
    console.error('加载抢单列表失败:', err)
  }
}

const loadPublishedOrders = async () => {
  try {
    const response = await api.rewardOrder.getRewardOrders({ status: 'available' })
    if (response.success || response.code === 0) {
      publishedOrders.value = response.data || []
    }
  } catch (err) {
    console.error('加载发布列表失败:', err)
  }
}

const handleSelectApplicant = async (applicantId) => {
  try {
    const response = await api.rewardOrder.selectApplicant(orderId.value, applicantId)
    if (response.success || response.code === 0) {
      loadOrderDetail()
    }
  } catch (err) {
    console.error('选择抢单者失败:', err)
  }
}

const handleCancel = () => {
  router.back()
}

const handlePublish = async () => {
  try {
    const response = await api.rewardOrder.publishRewardOrder(orderId.value)
    if (response.success || response.code === 0) {
      router.push('/reward')
    }
  } catch (err) {
    console.error('发布悬赏失败:', err)
  }
}

const handleEdit = () => {
  router.push(`/reward/publish?id=${orderId.value}`)
}

const handleDelete = async () => {
  if (confirm('确定要删除这个悬赏单吗？')) {
    try {
      const response = await api.rewardOrder.deleteRewardOrder(orderId.value)
      if (response.success || response.code === 0) {
        router.push('/reward')
      }
    } catch (err) {
      console.error('删除悬赏失败:', err)
    }
  }
}

const handleCancelOrder = async () => {
  if (confirm('确定要取消这个悬赏单吗？取消后无法恢复。')) {
    try {
      const response = await api.rewardOrder.cancelRewardOrder(orderId.value)
      if (response.success || response.code === 0) {
        order.value = { ...order.value, status: 'cancelled' }
        status.value = 'cancelled'
        success('订单已取消')
        loadOrderDetail()
      }
    } catch (err) {
      console.error('取消悬赏失败:', err)
      error(err.response?.data?.msg || err.message || '取消失败，请稍后重试')
    }
  }
}

const handlePay = () => {
  router.push(`/reward/${orderId.value}/payment`)
}

const handleConfirm = () => {
  router.push(`/reward/${orderId.value}/review`)
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

const handleUserProfile = () => {
  if (order.value) {
    router.push(`/profile/${order.value.userId}`)
  }
}

onMounted(() => {
  userStore.checkAuth()
  loadOrderDetail()
  loadPublishedOrders()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <AppHeader
      title="悬赏详情"
      :show-back="true"
      :show-menu="false"
      @back="handleCancel"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-16 space-y-6">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <div class="w-28 h-28 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-8">
          <span class="material-symbols-outlined text-error text-6xl">error_outline</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-3">加载失败</h2>
        <p class="text-sm text-on-surface-variant mb-6">{{ error }}</p>
        <button 
          @click="loadOrderDetail"
          class="px-8 py-3 rounded-full bg-primary text-on-primary font-headline font-bold text-sm shadow-md active:scale-95 transition-transform hover:shadow-lg hover:shadow-primary/20 transition-shadow"
        >
          重试
        </button>
      </div>

      <div v-else-if="order" class="space-y-6">
        <!-- 创建者信息卡片 -->
        <section class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl overflow-hidden shadow-md border-2 border-surface-container">
              <img :alt="order.userName" class="w-full h-full object-cover" :src="order.userAvatar" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-on-surface">{{ order.userName }}</h3>
                <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary-container text-on-secondary-container">
                  LV.{{ order.userLevel }}
                </span>
              </div>
              <p class="text-sm text-on-surface-variant mt-1">{{ order.userSpecialty }}</p>
            </div>
            <button 
              @click="handleUserProfile"
              class="px-4 py-2 bg-surface-container text-on-surface-variant text-sm font-medium rounded-full hover:bg-surface-container-high transition-colors active:scale-95 transition-transform"
            >
              查看主页
            </button>
          </div>
        </section>

        <!-- 订单信息卡片 -->
        <section class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
          <div class="flex justify-between items-start mb-6">
            <div class="space-y-2">
              <span :class="[
                'text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider',
                order.status === 'available' ? 'bg-primary-container text-on-primary-container' :
                order.status === 'ongoing' ? 'bg-tertiary-container text-on-tertiary-container' :
                order.status === 'completed' ? 'bg-secondary-container text-on-secondary-container' :
                order.status === 'draft' ? 'bg-surface-container-high text-on-surface-variant' :
                order.status === 'cancelled' ? 'bg-error-container text-on-error-container' :
                order.status === 'expired' ? 'bg-surface-container-high text-on-surface-variant' :
                'bg-primary-container text-on-primary-container'
              ]">
                {{ order.status === 'available' ? '可抢单' : order.status === 'ongoing' ? '进行中' : order.status === 'completed' ? '已完成' : order.status === 'draft' ? '草稿' : order.status === 'cancelled' ? '已取消' : order.status === 'expired' ? '已过期' : '已结束' }}
              </span>
              <h2 class="text-2xl font-headline font-extrabold text-on-surface tracking-tight line-clamp-2">{{ order.title || '任务标题' }}</h2>
            </div>
            <div class="flex items-end flex-col">
              <div v-if="isPublisher" class="flex gap-2 mb-3">
                <button 
                  @click="handleEdit"
                  class="px-3 py-1.5 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full hover:bg-surface-container-high transition-colors active:scale-95 transition-transform"
                >
                  编辑
                </button>
                <button 
                  @click="handleDelete"
                  class="px-3 py-1.5 bg-error-container text-on-error-container text-xs font-medium rounded-full hover:bg-error-container/80 transition-colors active:scale-95 transition-transform"
                >
                  删除
                </button>
              </div>
              <div class="text-right">
                <span class="text-xs text-on-surface-variant font-medium">悬赏金额</span>
                <div class="text-2xl font-headline font-black text-primary">¥{{ order.reward }}</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 transition-all duration-300 hover:bg-surface-container">
              <div class="flex items-center gap-2 text-on-surface-variant mb-2">
                <span class="material-symbols-outlined text-sm">videogame_asset</span>
                <span class="text-[10px] font-bold">游戏名称</span>
              </div>
              <div class="font-bold text-sm">{{ order.game || '未知游戏' }}</div>
            </div>
            <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 transition-all duration-300 hover:bg-surface-container">
              <div class="flex items-center gap-2 text-on-surface-variant mb-2">
                <span class="material-symbols-outlined text-sm">schedule</span>
                <span class="text-[10px] font-bold">截止时间</span>
              </div>
              <div class="font-bold text-sm">{{ order.timeLeft || order.deadline || '不限' }}</div>
            </div>
            <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 transition-all duration-300 hover:bg-surface-container">
              <div class="flex items-center gap-2 text-on-surface-variant mb-2">
                <span class="material-symbols-outlined text-sm">payment</span>
                <span class="text-[10px] font-bold">支付方式</span>
              </div>
              <div class="font-bold text-sm">{{ paymentMethodText }}</div>
            </div>
            <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 transition-all duration-300 hover:bg-surface-container">
              <div class="flex items-center gap-2 text-on-surface-variant mb-2">
                <span class="material-symbols-outlined text-sm">event</span>
                <span class="text-[10px] font-bold">发布时间</span>
              </div>
              <div class="font-bold text-sm">{{ new Date(order.createdAt).toLocaleString('zh-CN') }}</div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="space-y-3">
              <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">任务需求</h3>
              <p class="text-sm text-on-surface leading-relaxed whitespace-pre-line">{{ order.content }}</p>
            </div>

            <div class="space-y-3">
              <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">具体要求</h3>
              <ul class="space-y-3">
                <li v-for="(req, index) in parsedRequirements" :key="index" class="flex items-start gap-2 text-sm text-on-surface leading-relaxed p-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <span class="material-symbols-outlined text-primary text-xs mt-0.5 flex-shrink-0" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                  <span class="flex-1">{{ req }}</span>
                </li>
              </ul>
            </div>

            <div class="space-y-3">
              <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">联系方式</h3>
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3 text-sm text-on-surface p-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <span class="material-symbols-outlined text-primary flex-shrink-0">phone</span>
                  <span class="flex-1">{{ order.contactInfo?.phone || '未设置' }}</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-on-surface p-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <span class="material-symbols-outlined text-primary flex-shrink-0">chat</span>
                  <span class="flex-1">{{ order.contactInfo?.wechat || '未设置' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mt-6">
            <span v-for="tag in parsedTags" :key="tag" class="px-3 py-1.5 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full transition-all duration-300 hover:bg-primary-container hover:text-on-primary-container">
              {{ tag }}
            </span>
          </div>

          <!-- 当前用户抢单状态 -->
          <div v-if="currentUserApplication && !isPublisher" class="mt-6 p-4 bg-primary-container/30 rounded-2xl border border-primary-container">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-on-primary-container">person</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-on-surface">我的抢单</p>
                  <p class="text-xs text-on-surface-variant">申请时间: {{ new Date(currentUserApplication.appliedAt).toLocaleString('zh-CN') }}</p>
                </div>
              </div>
              <span :class="[
                'px-4 py-2 rounded-full text-sm font-bold',
                currentUserApplicationStatus === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                currentUserApplicationStatus === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                currentUserApplicationStatus === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                'bg-surface-container text-on-surface-variant'
              ]">
                {{ currentUserApplicationStatusText }}
              </span>
            </div>
            <div v-if="currentUserApplication.recommendation" class="mt-3 pt-3 border-t border-primary-container/30">
              <p class="text-xs text-on-surface-variant mb-1">我的推荐</p>
              <p class="text-sm text-on-surface">{{ currentUserApplication.recommendation }}</p>
            </div>
            <div class="mt-3 flex gap-2">
              <button
                @click="router.push(`/grab-order/${currentUserGrabOrderId}/detail`)"
                class="flex-1 bg-primary text-on-primary py-2.5 rounded-xl text-sm font-bold active:scale-[0.98] transition-all"
              >
                查看抢单详情
              </button>
            </div>
          </div>
        </section>

        <!-- 可抢单状态：立即抢单按钮 -->
        <section v-if="!loading && order && order.status === 'available' && !currentUserApplication && !isPublisher" class="px-1 mb-4">
          <button 
            @click="() => router.push(`/grab-order/${orderId}`)"
            class="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <span class="material-symbols-outlined">campaign</span>
            立即抢单
          </button>
        </section>

        <!-- 抢单列表 -->
        <section v-if="(order.status === 'available' || order.status === 'ongoing' || order.status === 'completed') && applicants.length > 0" class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h3 class="font-headline font-extrabold text-lg flex items-center gap-2">
              大神抢单列表
              <span class="bg-primary-container text-on-primary-container text-xs px-2 py-0.5 rounded-full">{{ order.applicantCount || applicants.length }}</span>
            </h3>
            <span class="text-xs text-on-surface-variant">按评分排序</span>
          </div>

          <div class="space-y-4">
            <template v-for="applicant in applicants" :key="applicant.id">
              <div 
                :class="[
                  'bg-surface-container-lowest p-5 rounded-3xl flex items-center gap-4 transition-all duration-300',
                  applicant.status === 'approved' ? 'border-2 border-primary-container shadow-md' : 'hover:bg-white hover:shadow-sm'
                ]"
              >
                <div class="relative">
                  <div class="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-surface-container">
                    <img :alt="applicant.name" class="w-full h-full object-cover" :src="applicant.avatar" />
                  </div>
                  <div v-if="applicant.status === 'approved'" class="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[8px] font-bold px-1.5 py-0.5 rounded-md border-2 border-white">
                    已通过
                  </div>
                  <div v-else-if="applicant.status === 'rejected'" class="absolute -bottom-1 -right-1 bg-error-container text-on-error-container text-[8px] font-bold px-1.5 py-0.5 rounded-md border-2 border-white">
                    已拒绝
                  </div>
                  <div v-else class="absolute -bottom-1 -right-1 bg-primary text-on-primary-container text-[8px] font-black px-1.5 py-0.5 rounded-md border-2 border-white">
                    LV.{{ applicant.level }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-on-surface truncate">{{ applicant.name }}</h4>
                    <span :class="[
                      'text-[10px] px-1.5 py-0.5 rounded-md font-bold',
                      applicant.status === 'approved' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'
                    ]">
                      LV.{{ applicant.level }}
                    </span>
                    <span :class="[
                      'text-[10px] px-1.5 py-0.5 rounded-md font-bold',
                      applicant.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      applicant.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      applicant.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-surface-container text-on-surface-variant'
                    ]">
                      {{ applicant.status === 'pending' ? '待处理' : applicant.status === 'approved' ? '已通过' : applicant.status === 'rejected' ? '已拒绝' : applicant.status }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="material-symbols-outlined text-primary text-xs" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="text-xs font-bold text-on-surface">{{ applicant.rating }}</span>
                    <span class="text-[10px] text-on-surface-variant ml-1">{{ applicant.orderCount || '0' }} 接单</span>
                  </div>
                  <p class="text-sm text-on-surface-variant mt-2 leading-relaxed line-clamp-2">{{ applicant.specialty }}</p>
                  <p v-if="applicant.recommendation" class="text-xs text-on-surface-variant mt-1 leading-relaxed line-clamp-1">推荐理由：{{ applicant.recommendation }}</p>
                  <div class="flex gap-1 mt-2">
                    <span v-for="badge in applicant.badges" :key="badge.type" :class="[
                      'text-[9px] px-2 py-0.5 rounded-full',
                      badge.type === 'recommended' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'
                    ]">{{ badge.text }}</span>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <button 
                    class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary active:scale-90 transition-all hover:bg-primary/10"
                  >
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
                  </button>
                  <button 
                    v-if="applicant.status === 'approved'"
                    class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container"
                  >
                    <span class="material-symbols-outlined">check_circle</span>
                  </button>
                  <button 
                    v-else-if="isPublisher && order.status === 'available' && applicant.status === 'pending'"
                    @click="handleSelectApplicant(applicant.id)"
                    class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary active:scale-90 transition-all hover:shadow-md hover:shadow-primary/20"
                  >
                    <span class="material-symbols-outlined">check</span>
                  </button>
                </div>
              </div>
            </template>
          </div>
        </section>

        <!-- 发布列表 -->
        <section v-if="publishedOrders.length > 0" class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h3 class="font-headline font-extrabold text-lg flex items-center gap-2">
              最新发布
              <span class="bg-primary-container text-on-primary-container text-xs px-2 py-0.5 rounded-full">{{ publishedOrders.length }}</span>
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <template v-for="publishedOrder in publishedOrders.slice(0, 4)" :key="publishedOrder.id">
              <div 
                @click="router.push(`/reward/${publishedOrder.id}`)"
                class="bg-surface-container-lowest p-4 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-md cursor-pointer"
              >
                <div class="flex justify-between items-start mb-3">
                  <span :class="[
                    'text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider',
                    publishedOrder.status === 'available' ? 'bg-primary-container text-on-primary-container' :
                    publishedOrder.status === 'ongoing' ? 'bg-tertiary-container text-on-tertiary-container' :
                    publishedOrder.status === 'completed' ? 'bg-secondary-container text-on-secondary-container' :
                    publishedOrder.status === 'draft' ? 'bg-surface-container-high text-on-surface-variant' :
                    publishedOrder.status === 'cancelled' ? 'bg-error-container text-on-error-container' :
                    publishedOrder.status === 'expired' ? 'bg-surface-container-high text-on-surface-variant' :
                    'bg-primary-container text-on-primary-container'
                  ]">
                    {{ publishedOrder.status === 'available' ? '可抢单' : publishedOrder.status === 'ongoing' ? '进行中' : publishedOrder.status === 'completed' ? '已完成' : publishedOrder.status === 'draft' ? '草稿' : publishedOrder.status === 'cancelled' ? '已取消' : publishedOrder.status === 'expired' ? '已过期' : '已结束' }}
                  </span>
                  <div class="text-right">
                    <span class="text-xs text-on-surface-variant font-medium">赏金</span>
                    <div class="text-lg font-headline font-black text-primary">¥{{ publishedOrder.reward }}</div>
                  </div>
                </div>
                
                <h4 class="font-bold text-on-surface text-sm mb-2 line-clamp-2">{{ publishedOrder.title || publishedOrder.content || '任务标题' }}</h4>
                
                <div class="flex items-center gap-2 mb-3">
                  <span class="material-symbols-outlined text-sm text-on-surface-variant">videogame_asset</span>
                  <span class="text-xs text-on-surface-variant">{{ publishedOrder.game || '未知游戏' }}</span>
                </div>
                
                <div class="flex items-center gap-2 mb-3">
                  <span class="material-symbols-outlined text-sm text-on-surface-variant">schedule</span>
                  <span class="text-xs text-on-surface-variant">{{ publishedOrder.timeLeft || publishedOrder.deadline || '不限' }}</span>
                </div>
                
                <div class="flex flex-wrap gap-1">
                  <span v-for="(tag, index) in (Array.isArray(publishedOrder.tags) ? publishedOrder.tags : [publishedOrder.tags])" :key="index" class="px-2 py-1 bg-surface-container text-on-surface-variant text-[9px] font-medium rounded-full">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </section>

        <BottomNavBar />

        <!-- 底部操作栏 -->
        <section class="fixed bottom-0 left-0 right-0 p-5 bg-surface/80 backdrop-blur-xl z-40 border-t border-outline-variant/20">
          <div class="max-w-md mx-auto">
            <button 
              v-if="order.status === 'draft'"
              @click="handlePublish"
              class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-full shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-primary-container/30"
            >
              立即发布
              <span class="material-symbols-outlined font-bold">rocket_launch</span>
            </button>
            <div v-else-if="order.status === 'available'" class="flex gap-4">
              <template v-if="isPublisher">
                <button
                  class="flex-1 bg-surface-container text-on-surface-variant font-headline font-bold py-4 rounded-full shadow-md"
                  disabled
                >
                  等待抢单
                </button>
                <button
                  @click="handleCancelOrder"
                  class="flex-1 bg-error-container text-on-error-container font-headline font-bold py-4 rounded-full shadow-md active:scale-[0.98] transition-all hover:bg-error-container/80"
                >
                  取消订单
                </button>
              </template>
              <template v-else-if="currentUserApplication">
                <button
                  @click="router.push(`/grab-order/${currentUserGrabOrderId}/detail`)"
                  class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-full shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-primary-container/30"
                >
                  <span class="material-symbols-outlined">visibility</span>
                  查看我的抢单
                </button>
              </template>
              <template v-else>
                <button
                  @click="() => router.push(`/grab-order/${orderId}`)"
                  class="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-primary/30"
                >
                  <span class="material-symbols-outlined">campaign</span>
                  立即抢单
                </button>
              </template>
            </div>
            <button 
              v-else-if="order.status === 'completed'"
              @click="handleConfirm"
              class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-full shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-primary-container/30"
            >
              <span class="material-symbols-outlined">check_circle</span>
              确认完成
            </button>
            <button 
              v-else-if="order.status === 'cancelled'"
              class="w-full bg-error-container text-on-error-container font-headline font-bold py-4 rounded-full"
              disabled
            >
              订单已取消
            </button>
            <button 
              v-else-if="order.status === 'expired'"
              class="w-full bg-surface-container-high text-on-surface-variant font-headline font-bold py-4 rounded-full"
              disabled
            >
              订单已过期
            </button>
            <button 
              v-else-if="order.status === 'ongoing' && isPublisher"
              class="w-full bg-surface-container text-on-surface-variant font-headline font-bold py-4 rounded-full"
              disabled
            >
              进行中
            </button>
          </div>
        </section>
      </div>

      <div v-else class="text-center py-16">
        <div class="w-28 h-28 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-8">
          <span class="material-symbols-outlined text-on-surface-variant text-6xl">receipt_long</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-3">暂无订单</h2>
        <p class="text-sm text-on-surface-variant">订单不存在或已删除</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>