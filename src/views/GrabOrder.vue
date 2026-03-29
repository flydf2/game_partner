<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../api/index.js'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()
const route = useRoute()

const orderId = ref(route.params.id)
const order = ref(null)
const loading = ref(true)
const isSubmitting = ref(false)
const error = ref('')
const selfRecommendation = ref('')
const departureTime = ref('immediate')
const selectedFiles = ref({ voice: null, record: null })

const hasGrabbed = ref(false)

const loadOrderDetail = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await api.rewardOrder.getRewardOrderDetail(orderId.value)
    if (response.success || response.code === 0) {
      order.value = response.data
      // 假设订单状态为 'ongoing' 表示已抢单
      hasGrabbed.value = order.value.status === 'ongoing'
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

const handleGrabOrder = async () => {
  isSubmitting.value = true
  try {
    const grabData = {
      selfRecommendation: selfRecommendation.value,
      departureTime: departureTime.value,
      voiceFile: selectedFiles.value.voice,
      recordFile: selectedFiles.value.record
    }
    const response = await api.rewardOrder.grabRewardOrder(orderId.value, grabData)
    if (response.success || response.code === 0) {
      // 抢单成功后跳转到详情页
      router.push(`/grab-order/${orderId.value}/detail`)
    } else {
      console.info(response)
      if (response.code === 10104 || response.message === '您已经抢过此订单' || response.msg === '您已经抢过此订单') {
        // 已抢过订单，跳转到详情页
        router.push(`/grab-order/${orderId.value}/detail`)
      } else {
        throw new Error(response.message || response.msg || '抢单失败')
      }
    }
  } catch (err) {
    // 处理特殊错误码
    if (err.code === 10104) {
      // 已抢过订单，跳转到详情页
      router.push(`/grab-order/${orderId.value}/detail`)
    } else {
      error.value = err.message
      console.error('抢单失败:', err)
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleViewDetail = () => {
  router.push(`/grab-order/${orderId.value}/detail`)
}

const handleCancel = () => {
  router.back()
}

const handleFileSelect = (type) => {
  if (type === 'voice') {
    selectedFiles.value.voice = true
  } else if (type === 'record') {
    selectedFiles.value.record = true
  }
}

const fillTemplate = () => {
  selfRecommendation.value = '国服韩信，胜率85%，声音好听会聊天，带飞全场...'
}

onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 py-3 border-b border-outline-variant/20">
      <div class="flex items-center gap-4">
        <span
          @click="handleCancel"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">{{ hasGrabbed ? '抢单详情' : '立即抢单' }}</h1>
      </div>
      <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
        <span class="material-symbols-outlined text-on-primary-container text-sm">help</span>
      </div>
    </header>

    <main class="page-content pt-20 space-y-6">
      <!-- 悬赏任务简述 -->
      <section class="space-y-3">
        <h2 class="font-headline font-bold text-xl px-1">悬赏任务简述</h2>
        <div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center">
                <span class="material-symbols-outlined text-secondary text-2xl" style="font-variation-settings: 'FILL' 1;">sports_esports</span>
              </div>
              <div>
                <p class="font-bold text-lg">{{ order?.game || '游戏' }}</p>
                <p class="text-on-surface-variant text-sm">排位赛 · 连胜上分</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-primary font-bold text-xl font-headline">¥{{ order?.reward || '0.00' }}</p>
              <p class="text-on-surface-variant text-xs">预计 45 分钟</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/10">
            <span class="bg-tertiary-container/20 text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold">需要麦克风</span>
            <span class="bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold">不送人头</span>
            <span class="bg-primary-container/20 text-on-primary-container px-3 py-1 rounded-full text-[10px] font-bold">星耀段位+</span>
          </div>
        </div>
      </section>

      <!-- 已抢单状态显示 -->
      <template v-if="hasGrabbed">
        <div class="bg-success-container/10 p-4 rounded-2xl flex gap-3">
          <span class="material-symbols-outlined text-success text-lg">check_circle</span>
          <div>
            <p class="font-bold text-sm text-success">已成功抢单</p>
            <p class="text-xs text-on-success-container">请及时与雇主沟通，确认服务细节</p>
          </div>
        </div>
        <div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-on-surface-variant text-sm">抢单状态</span>
            <span class="font-bold text-success">已抢单</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-on-surface-variant text-sm">抢单时间</span>
            <span class="font-medium">{{ new Date().toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-on-surface-variant text-sm">服务状态</span>
            <span class="font-medium">待开始</span>
          </div>
        </div>
      </template>

      <!-- 未抢单状态显示 -->
      <template v-else>
        <!-- 大神自我推荐 -->
        <section class="space-y-3">
          <div class="flex items-center justify-between px-1">
            <h2 class="font-headline font-bold text-xl">大神自我推荐</h2>
            <span class="text-xs text-on-surface-variant">必填项</span>
          </div>
          <div class="relative">
            <textarea
              v-model="selfRecommendation"
              class="w-full bg-surface-container-high border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest min-h-[120px] transition-all resize-none"
              placeholder="例如：国服韩信，胜率85%，声音好听会聊天，带飞全场..."
            ></textarea>
            <div class="absolute bottom-3 right-4 flex gap-2">
              <button
                @click="fillTemplate"
                class="bg-surface-container-lowest hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-xl text-[10px] font-bold text-primary border border-primary-container/30"
              >
                快速填充模板
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mt-2">
            <button
              @click="handleFileSelect('voice')"
            >
              <span class="material-symbols-outlined" :style="{ fontSize: '24px' }">mic</span>
              <span class="text-xs font-semibold">语音试听</span>
            </button>
            <button
              @click="handleFileSelect('record')"
            >
              <span class="material-symbols-outlined" :style="{ fontSize: '24px' }">image</span>
              <span class="text-xs font-semibold">上传战绩</span>
            </button>
          </div>
        </section>

        <!-- 预计出发时间 -->
        <section class="space-y-3">
          <h2 class="font-headline font-bold text-xl px-1">预计出发时间</h2>
          <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar hide-scrollbar">
            <label
              v-for="timeOption in [{label: '立即', value: 'immediate'}, {label: '5分钟后', value: 'fiveMin'}, {label: '10分钟后', value: 'tenMin'}]"
              :key="timeOption.value"
              class="flex-shrink-0 cursor-pointer group"
            >
              <input
                v-model="departureTime"
                :value="timeOption.value"
                name="time"
                type="radio"
                class="hidden"
              />
              <div
                :class="[
                  'px-6 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[100px] border-2 transition-all',
                  departureTime === timeOption.value
                    ? 'bg-primary-container text-on-primary-container border-primary'
                    : 'bg-surface-container-lowest text-on-surface-variant border-transparent'
                ]"
              >
                <span class="text-sm font-bold">{{ timeOption.label }}</span>
                <span class="text-[10px] opacity-80">{{ timeOption.value === 'immediate' ? 'ASAP' : timeOption.value === 'fiveMin' ? 'Soon' : 'Later' }}</span>
              </div>
            </label>
          </div>
        </section>

        <!-- 确认须知 -->
        <div class="bg-secondary-container/10 p-4 rounded-2xl flex gap-3">
          <span class="material-symbols-outlined text-secondary text-lg">info</span>
          <p class="text-xs text-on-secondary-container leading-relaxed">
            温馨提示：抢单成功后请及时通过聊天工具与雇主沟通，逾期未开始可能影响您的信用评分。
          </p>
        </div>
      </template>
    </main>

    <BottomNavBar />

    <!-- 底部操作栏 -->
    <div class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl px-6 pb-10 pt-4 z-50 rounded-t-[1.5rem] shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)]">
      <div class="max-w-md mx-auto space-y-4">
        <!-- 已抢单状态 -->
        <template v-if="hasGrabbed">
          <button
            @click="handleViewDetail"
            class="w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-full text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined">visibility</span>
            查看抢单详情
          </button>
        </template>
        <!-- 未抢单状态 -->
        <template v-else>
          <div class="flex items-center justify-between text-sm px-2">
            <span class="text-on-surface-variant">诚意金抵扣</span>
            <span class="font-bold text-primary">- ¥1.50</span>
          </div>
          <button
            @click="handleGrabOrder"
            :disabled="isSubmitting"
            class="w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-full text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            :class="isSubmitting ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span v-if="isSubmitting">抢单中...</span>
            <template v-else>
              <span class="material-symbols-outlined">bolt</span>
              立即抢单
            </template>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
