<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../api/index.js'

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
      router.push('/reward-orders')
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

onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-outline-variant/20">
      <div class="flex items-center gap-4">
        <span
          @click="handleCancel"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">悬赏详情</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="pt-20 px-5 max-w-md mx-auto space-y-6">
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
                order.status === 'active' ? 'bg-tertiary-container text-on-tertiary-container' : 
                order.status === 'completed' ? 'bg-secondary-container text-on-secondary-container' :
                order.status === 'draft' ? 'bg-surface-container-high text-on-surface-variant' :
                'bg-primary-container text-on-primary-container'
              ]">
                {{ order.status === 'active' ? '进行中' : order.status === 'completed' ? '已完成' : order.status === 'draft' ? '草稿' : '已结束' }}
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

        <!-- 抢单列表 -->
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-headline font-bold text-on-surface">
              抢单列表 
              <span class="text-on-surface-variant text-sm font-normal ml-2">
                ({{ order.applicantCount || applicants.length }}人已抢)
              </span>
            </h3>
            <button class="text-xs font-bold text-primary flex items-center gap-1">
              综合排序 <span class="material-symbols-outlined text-xs">unfold_more</span>
            </button>
          </div>

          <div class="space-y-3">
            <template v-for="applicant in applicants" :key="applicant.id">
              <div 
                :class="[
                  'bg-surface-container-lowest p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]',
                  applicant.selected ? 'border-2 border-primary-container ring-4 ring-primary-container/20' : ''
                ]"
              >
                <div class="relative">
                  <div class="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                    <img :alt="applicant.name" class="w-full h-full object-cover" :src="applicant.avatar" />
                  </div>
                  <div class="absolute -bottom-1 -right-1 bg-primary text-on-primary-container text-[8px] font-black px-1.5 py-0.5 rounded-md border-2 border-white">
                    LV.{{ applicant.level }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-on-surface truncate">{{ applicant.name }}</h4>
                    <span class="flex items-center text-[10px] text-tertiary font-bold">
                      <span class="material-symbols-outlined text-[12px]" style="font-variation-settings: 'FILL' 1;">star</span> 
                      {{ applicant.rating }}
                    </span>
                  </div>
                  <p class="text-[10px] text-on-surface-variant truncate">{{ applicant.specialty || '暂无详情' }}</p>
                  <div class="flex gap-1 mt-1">
                    <span v-for="badge in applicant.badges" :key="badge" :class="[
                      'bg-surface-container text-[8px] text-on-surface-variant px-1.5 py-0.5 rounded',
                      badge.type === 'recommended' ? 'bg-secondary-container text-on-secondary-container' : ''
                    ]">{{ badge.text }}</span>
                  </div>
                </div>

                <button 
                  v-if="!applicant.selected && order.status === 'active'"
                  @click="handleSelectApplicant(applicant.id)"
                  class="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-4 py-2 rounded-full whitespace-nowrap active:bg-primary-container active:text-on-primary-container transition-colors"
                >
                  选择他
                </button>
                <button 
                  v-else
                  :class="[
                    'text-[10px] font-bold px-4 py-2 rounded-full whitespace-nowrap',
                    applicant.selected ? 'bg-primary-container text-on-primary-container shadow-sm' : 'bg-surface-container text-on-surface-variant'
                  ]"
                >
                  {{ applicant.selected ? '已选择' : '已入选' }}
                </button>
              </div>
            </template>
          </div>
        </section>

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
              v-else-if="order.status === 'active' && applicants.length > 0"
              @click="handlePay"
              class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-full shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span class="material-symbols-outlined">security</span>
              安全支付 ¥{{ order.reward }}
            </button>
            <button 
              v-else-if="order.status === 'active' && applicants.length === 0"
              class="w-full bg-surface-container-high text-on-surface-variant font-headline font-bold py-4 rounded-full"
              disabled
            >
              等待抢单...
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
