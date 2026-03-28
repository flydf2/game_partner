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
const loading = ref(true)
const error = ref('')
const isSubmitting = ref(false)

const rating = ref(5)
const reviewContent = ref('')
const selectedTags = ref([])

const tags = [
  { id: 'tech', label: '技术顶尖', type: 'tech' },
  { id: 'fun', label: '温柔有趣', type: 'personality' },
  { id: 'fast', label: '带飞全场', type: 'performance' },
  { id: 'patient', label: '耐心细致', type: 'personality' },
  { id: 'professional', label: '专业高效', type: 'professional' }
]

const loadOrderDetail = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await api.rewardOrder.getRewardOrderDetail(orderId.value)
    if (response.success || response.code === 0) {
      order.value = response.data
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

const toggleTag = (tagId) => {
  if (selectedTags.value.includes(tagId)) {
    selectedTags.value = selectedTags.value.filter(id => id !== tagId)
  } else {
    selectedTags.value.push(tagId)
  }
}

const handleConfirm = async () => {
  isSubmitting.value = true
  try {
    const response = await api.rewardOrder.confirmService(orderId.value, {
      rating: rating.value,
      content: reviewContent.value,
      tags: selectedTags.value
    })
    if (response.success || response.code === 0) {
      router.push(`/reward/${orderId.value}/completed`)
    }
  } catch (err) {
    console.error('确认服务失败:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
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

onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <AppHeader
      title="服务结束"
      :show-back="false"
      :show-menu="true"
      :show-avatar="false"
      @menu="handleCancel"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-16 pb-32 space-y-8">
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

      <div v-else-if="order" class="space-y-8">
        <!-- Status Hero Section -->
        <section class="text-center space-y-4">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-container rounded-full mb-2">
            <span class="material-symbols-outlined text-4xl text-on-primary-container" style="font-variation-settings: 'FILL' 1;">task_alt</span>
          </div>
          <h2 class="font-headline text-3xl font-extrabold text-on-surface tracking-tight leading-tight">服务已圆满完成</h2>
          <p class="text-on-surface-variant font-medium">感谢您选择 SunnyPlay，享受阳光每一程。</p>
        </section>

        <!-- Service Summary Bento-ish Cards -->
        <section class="grid grid-cols-2 gap-4">
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm col-span-2 flex items-center justify-between">
            <div>
              <p class="text-label-sm text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">陪玩师</p>
              <div class="flex items-center gap-3">
                <img class="w-10 h-10 rounded-full" :alt="order.playmateName" :src="order.playmateAvatar" />
                <span class="font-headline font-bold text-lg">{{ order.playmateName }}</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-label-sm text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">服务项目</p>
              <p class="font-headline font-bold text-lg">{{ order.game }}</p>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
            <p class="text-label-sm text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">持续时间</p>
            <div class="flex items-baseline gap-1">
              <span class="font-headline font-extrabold text-2xl text-primary">{{ order.duration || 120 }}</span>
              <span class="text-sm font-bold text-on-surface-variant">MIN</span>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
            <p class="text-label-sm text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">总结收益</p>
            <div class="flex items-baseline gap-1">
              <span class="text-sm font-bold text-on-surface-variant">¥</span>
              <span class="font-headline font-extrabold text-2xl text-primary">{{ order.settlementAmount || 156.00 }}</span>
            </div>
          </div>
        </section>

        <!-- Settlement Section -->
        <section class="bg-primary-container p-6 rounded-2xl space-y-6">
          <div class="space-y-2">
            <h3 class="font-headline font-extrabold text-xl text-on-primary-container">确认完成并结算</h3>
            <p class="text-on-primary-container/80 text-sm leading-relaxed">
              请确认本次服务已按合约完成。确认后，预付资金将立即转入陪玩师账户，此操作不可撤销。
            </p>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between text-sm font-medium text-on-primary-container/70">
              <span>订单原价</span>
              <span>¥{{ order.originalPrice || 160.00 }}</span>
            </div>
            <div class="flex justify-between text-sm font-medium text-on-primary-container/70">
              <span>暖阳折扣</span>
              <span>- ¥{{ order.discount || 4.00 }}</span>
            </div>
            <div class="h-px bg-on-primary-container/10"></div>
            <div class="flex justify-between items-center pt-1">
              <span class="font-bold text-on-primary-container">结算总计</span>
              <span class="font-headline font-black text-2xl text-on-primary-container">¥{{ order.settlementAmount || 156.00 }}</span>
            </div>
          </div>
        </section>

        <!-- Rating Section -->
        <section class="space-y-4">
          <h3 class="font-headline font-bold text-xl px-2">评价服务</h3>
          <div class="bg-surface-container-lowest p-8 rounded-2xl shadow-sm text-center space-y-6">
            <div class="flex justify-center gap-2">
              <span 
                v-for="star in 5" 
                :key="star" 
                @click="rating = star"
                class="material-symbols-outlined text-4xl cursor-pointer transition-transform hover:scale-110"
                :style="{ color: star <= rating ? '#FFD700' : '#E0E0E0' }"
                style="font-variation-settings: 'FILL' 1;"
              >star</span>
            </div>
            <div class="relative">
              <textarea 
                v-model="reviewContent"
                class="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-neutral-400"
                placeholder="写下你的游玩感受吧..."
                rows="3"
              ></textarea>
            </div>
            <div class="flex flex-wrap gap-2 justify-center">
              <span 
                v-for="tag in tags" 
                :key="tag.id"
                @click="toggleTag(tag.id)"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all',
                  selectedTags.includes(tag.id) 
                    ? 'bg-secondary-container text-on-secondary-container' 
                    : 'bg-secondary-container/30 text-secondary'
                ]"
              >
                {{ tag.label }}
              </span>
            </div>
          </div>
        </section>
      </div>

      <BottomNavBar />

      <!-- Fixed Bottom Action Area -->
      <div class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-50">
        <div class="max-w-md mx-auto p-6">
          <button
            @click="handleConfirm"
            :disabled="isSubmitting"
            class="w-full bg-primary-container py-4 rounded-full font-headline font-black text-on-primary-container text-lg shadow-[0_8px_30px_rgb(255,215,0,0.3)] active:scale-95 transition-all duration-300"
            :class="isSubmitting ? 'opacity-50 cursor-not-allowed' : ''"
          >
            完成结算并结束
          </button>
          <p class="text-center text-[10px] text-on-surface-variant font-medium mt-4 uppercase tracking-widest opacity-60">SunnyPlay Secure Settlement Protocol v2.4</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>
