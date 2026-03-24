<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { expertApi } from '../api'

const route = useRoute()
const router = useRouter()

const expertId = ref(route.query.expertId || '1')
const amount = ref(Number(route.query.amount) || 153)
const expert = ref(null)
const loading = ref(true)

const loadExpertDetail = async () => {
  try {
    loading.value = true
    const response = await expertApi.getExpertDetail(expertId.value)
    expert.value = response.data
  } catch (error) {
    console.error('加载大神详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handleContact = () => {
  router.push(`/expert/${expertId.value}`)
}

const handleBackHome = () => {
  router.push('/')
}

onMounted(() => {
  loadExpertDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <nav data-v-3b8a03f8="" class="bg-surface w-full top-0 sticky z-50">
      <div class="flex items-center gap-4">
        <span
          @click="router.back()"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">支付成功</h1>
      </div>
      <div class="w-6"></div>
    </nav>

    <main class="pt-20 px-5 max-w-2xl mx-auto">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else class="flex flex-col items-center space-y-8">
        <div class="flex flex-col items-center">
          <div class="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mb-6 shadow-xl shadow-primary-container/20">
            <span class="material-symbols-outlined text-primary text-5xl" style="font-variation-settings: 'FILL' 1;">
              check_circle
            </span>
          </div>
          <h2 class="font-headline font-extrabold text-3xl text-on-surface mb-2 tracking-tight">支付成功</h2>
          <div class="flex items-baseline gap-1">
            <span class="text-secondary font-headline font-bold text-lg">¥</span>
            <span class="text-on-surface font-headline font-black text-5xl">{{ amount }}</span>
          </div>
        </div>

        <div v-if="expert" class="w-full bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl"></div>
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary-container">
              <img :alt="expert.nickname" class="w-full h-full object-cover" :src="expert.avatar" />
            </div>
            <div>
              <h3 class="font-headline font-bold text-xl text-on-surface">{{ expert.nickname }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="bg-tertiary-container/20 text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                  大神陪练
                </span>
                <span class="text-primary font-bold text-xs">★ 5.0</span>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-on-surface-variant text-sm font-medium">预约服务</span>
              <span class="text-on-surface font-bold text-sm">{{ expert.game }}陪练</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-on-surface-variant text-sm font-medium">预约时间</span>
              <span class="text-on-surface font-bold text-sm">2026年3月15日 20:00</span>
            </div>
          </div>
        </div>

        <div class="w-full flex flex-col gap-4">
          <button
            @click="handleContact"
            class="w-full bg-primary-container text-on-primary-container font-headline font-extrabold py-4 rounded-full flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20"
          >
            <span class="material-symbols-outlined">chat_bubble</span>
            联系大神
          </button>
          <button
            @click="handleBackHome"
            class="w-full bg-surface-container-high text-on-surface-variant font-headline font-bold py-4 rounded-full active:scale-[0.98] transition-all"
          >
            返回首页
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
