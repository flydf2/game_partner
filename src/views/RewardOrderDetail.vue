<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import api from '../api/index.js'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()
const route = useRoute()

const orderId = ref(route.params.id)
const order = ref(null)
const applicants = ref([])
const loading = ref(true)
const error = ref('')
const status = ref('active')
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
  } catch (err) {
    console.error('加载抢单列表失败:', err)
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

onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <AppHeader
      title="悬赏详情"
      :show-back="false"
      :show-menu="true"
      @menu="handleCancel"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="pt-16 px-5 max-w-md mx-auto space-y-6">
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
        <!-- 订单信息卡片 -->
        <section class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <div class="space-y-1">
              <span :class="[
                'text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider',
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
              <h2 class="text-2xl font-headline font-extrabold text-on-surface tracking-tight">{{ order.title }}</h2>
            </div>
            <div class="text-right">
              <span class="text-xs text-on-surface-variant font-medium">悬赏金额</span>
              <div class="text-2xl font-headline font-black text-primary">¥{{ order.reward }}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
              <div class="flex items-center gap-2 text-on-surface-variant mb-1">
                <span class="material-symbols-outlined text-sm">videogame_asset</span>
                <span class="text-[10px] font-bold">游戏段位</span>
              </div>
              <div class="font-bold text-sm">{{ order.gameLevel || '不限' }}</div>
            </div>
            <div class="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
              <div class="flex items-center gap-2 text-on-surface-variant mb-1">
                <span class="material-symbols-outlined text-sm">schedule</span>
                <span class="text-[10px] font-bold">截止时间</span>
              </div>
              <div class="font-bold text-sm">{{ order.deadline || '不限' }}</div>
            </div>
          </div>

          <div class="space-y-2">
            <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">任务需求</h3>
            <p class="text-sm text-on-surface leading-relaxed">{{ order.content }}</p>
          </div>

          <div class="flex flex-wrap gap-2 mt-4">
            <span v-for="tag in order.tags" :key="tag" class="px-3 py-1.5 bg-surface-container text-on-surface-variant text-xs font-medium rounded-full">{{ tag }}</span>
          </div>
        </section>

        <!-- 可抢单状态：立即抢单按钮 -->
        <section v-if="!loading && order && order.status === 'available'" class="px-1 mb-4">
          <button 
            @click="() => router.push(`/grab-order/${orderId}`)"
            class="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span class="material-symbols-outlined">campaign</span>
            立即抢单
          </button>
        </section>

        <!-- 抢单列表 -->
        <section v-if="order.status === 'ongoing' || order.status === 'completed'" class="space-y-4">
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
                  'bg-surface-container-lowest p-4 rounded-3xl flex items-center gap-4 transition-all',
                  applicant.selected ? 'border-2 border-primary-container' : 'hover:bg-white'
                ]"
              >
                <div class="relative">
                  <div class="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                    <img :alt="applicant.name" class="w-full h-full object-cover" :src="applicant.avatar" />
                  </div>
                  <div v-if="applicant.selected" class="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[8px] font-bold px-1.5 py-0.5 rounded-md border-2 border-white">
                    TOP 1
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
                      applicant.selected ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'
                    ]">
                      LV.{{ applicant.level }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="material-symbols-outlined text-primary text-xs" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="text-xs font-bold text-on-surface">{{ applicant.rating }}</span>
                    <span class="text-[10px] text-on-surface-variant ml-1">{{ applicant.orderCount || '0' }} 接单</span>
                  </div>
                  <p class="text-sm text-on-surface-variant mt-2 leading-relaxed">{{ applicant.specialty }}</p>
                  <div class="flex gap-1 mt-2">
                    <span v-for="badge in applicant.badges" :key="badge.type" :class="[
                      'text-[9px] px-2 py-0.5 rounded-full',
                      badge.type === 'recommended' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'
                    ]">{{ badge.text }}</span>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <button 
                    class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary active:scale-90 transition-all"
                  >
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
                  </button>
                  <button 
                    v-if="applicant.selected"
                    class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container"
                  >
                    <span class="material-symbols-outlined">check_circle</span>
                  </button>
                </div>
              </div>
            </template>
          </div>
        </section>

        <section v-else class="space-y-4">
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
                  'bg-surface-container-lowest p-4 rounded-3xl flex items-center gap-4 transition-all'
                ]"
              >
                <div class="relative">
                  <div class="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                    <img :alt="applicant.name" class="w-full h-full object-cover" :src="applicant.avatar" />
                  </div>
                  <div class="absolute -bottom-1 -right-1 bg-primary text-on-primary-container text-[8px] font-black px-1.5 py-0.5 rounded-md border-2 border-white">
                    LV.{{ applicant.level }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-on-surface truncate">{{ applicant.name }}</h4>
                    <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary-container text-on-secondary-container">
                      LV.{{ applicant.level }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="material-symbols-outlined text-primary text-xs" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="text-xs font-bold text-on-surface">{{ applicant.rating }}</span>
                    <span class="text-[10px] text-on-surface-variant ml-1">{{ applicant.orderCount || '0' }} 接单</span>
                  </div>
                  <p class="text-sm text-on-surface-variant mt-2 leading-relaxed">{{ applicant.specialty }}</p>
                  <div class="flex gap-1 mt-2">
                    <span v-for="badge in applicant.badges" :key="badge.type" :class="[
                      'text-[9px] px-2 py-0.5 rounded-full',
                      badge.type === 'recommended' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'
                    ]">{{ badge.text }}</span>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <button 
                    class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary active:scale-90 transition-all"
                  >
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
                  </button>
                </div>
              </div>
            </template>
          </div>
        </section>

        <BottomNavBar />

        <!-- 底部操作栏 -->
        <section class="fixed bottom-0 left-0 right-0 p-5 bg-surface/80 backdrop-blur-xl z-40">
          <div class="max-w-md mx-auto">
            <button 
              v-if="order.status === 'draft'"
              @click="handlePublish"
              class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-full shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              立即发布
              <span class="material-symbols-outlined font-bold">rocket_launch</span>
            </button>
            <button 
              v-else-if="order.status === 'available'"
              @click="() => router.push(`/grab-order/${orderId.value}`)"
              class="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span class="material-symbols-outlined">campaign</span>
              立即抢单
            </button>
            <button 
              v-else-if="order.status === 'completed'"
              @click="handleConfirm"
              class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-full shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
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
          </div>
        </section>
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
