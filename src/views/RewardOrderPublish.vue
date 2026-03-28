<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import api from '../api/index.js'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()

const games = [
  { id: 1, name: '英雄联盟', image: 'https://via.placeholder.com/96x128', active: true },
  { id: 2, name: '无畏契约', image: 'https://via.placeholder.com/96x128', active: false },
  { id: 3, name: '反恐精英2', image: 'https://via.placeholder.com/96x128', active: false },
  { id: 4, name: '王者荣耀', image: 'https://via.placeholder.com/96x128', active: false },
  { id: 5, name: '原神', image: 'https://via.placeholder.com/96x128', active: false },
  { id: 6, name: '绝地求生', image: 'https://via.placeholder.com/96x128', active: false }
]

const selectedGame = ref(null)
const rewardAmount = ref('')
const duration = ref(1)
const startTime = ref('今天 20:00')
const requirements = ref('')
const loading = ref(false)

const durations = [
  { value: 1, label: '1h' },
  { value: 2, label: '2h' },
  { value: 3, label: '3h' },
  { value: 4, label: '4h+' },
  { value: 8, label: '包天' }
]

const handleGameSelect = (game) => {
  selectedGame.value = game
}

const handleDurationSelect = (durationValue) => {
  duration.value = durationValue
}

const handlePublish = async () => {
  if (!selectedGame.value) {
    alert('请选择游戏')
    return
  }
  
  if (!rewardAmount.value) {
    alert('请输入赏金金额')
    return
  }
  
  loading.value = true
  try {
    const response = await api.rewardOrder.publishReward({
      gameId: selectedGame.value.id,
      reward: parseFloat(rewardAmount.value),
      duration: duration.value,
      startTime: startTime.value,
      requirements: requirements.value
    })
    
    if (response.success) {
      router.push('/reward')
    }
  } catch (err) {
    console.error('发布悬赏失败:', err)
  } finally {
    loading.value = false
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
  selectedGame.value = games[0]
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-outline-variant/20">
      <div class="flex items-center gap-4">
        <button
          @click="handleCancel"
          class="active:scale-95 duration-200 transition-opacity hover:opacity-80"
        >
          <span class="material-symbols-outlined text-primary">close</span>
        </button>
        <h1 class="font-headline font-bold text-lg tracking-tight text-primary">发布悬赏</h1>
      </div>
      <div class="w-8 h-8 rounded-full overflow-hidden">
        <img alt="User Avatar" class="w-full h-full object-cover" src="https://via.placeholder.com/32" />
      </div>
    </header>

    <main class="page-content pt-20 space-y-8">
      <!-- Section: Game Selection -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-on-surface font-headline font-bold text-lg">选择游戏</h2>
          <span class="text-primary text-xs font-semibold">更多游戏</span>
        </div>
        <div class="flex gap-4 overflow-x-auto hide-scrollbar py-2">
          <div
            v-for="game in games"
            :key="game.id"
            @click="handleGameSelect(game)"
            :class="[
              'flex-shrink-0 w-24 aspect-[3/4] rounded-xl p-0.5 relative overflow-hidden transition-all',
              selectedGame && selectedGame.id === game.id ? 'bg-primary-container ring-2 ring-primary' : 'bg-surface-container-highest'
            ]"
          >
            <img :alt="game.name" class="w-full h-full object-cover rounded-[0.6rem]" :src="game.image" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
              <span class="text-white text-[10px] font-bold">{{ game.name }}</span>
            </div>
            <div v-if="selectedGame && selectedGame.id === game.id" class="absolute top-1 right-1 bg-primary text-on-primary-container rounded-full p-0.5">
              <span class="material-symbols-outlined text-[14px] font-bold">check</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Bounty Details -->
      <section class="grid grid-cols-1 gap-6">
        <!-- Amount Input -->
        <div class="space-y-3">
          <label class="block text-on-surface font-headline font-bold text-lg">赏金金额</label>
          <div class="bg-surface-container-high rounded-2xl p-4 flex items-center gap-3 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
            <span class="text-primary font-bold text-2xl">¥</span>
            <input
              v-model="rewardAmount"
              class="bg-transparent border-none focus:ring-0 text-xl font-bold w-full placeholder:text-outline/50"
              placeholder="0.00"
              type="number"
            />
            <span class="text-on-surface-variant font-medium text-sm">/ 小时</span>
          </div>
        </div>

        <!-- Duration Selection -->
        <div class="space-y-3">
          <label class="block text-on-surface font-headline font-bold text-lg">预计时长</label>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="d in durations"
              :key="d.value"
              @click="handleDurationSelect(d.value)"
              :class="[
                'px-5 py-2.5 rounded-full font-bold text-sm transition-all',
                duration === d.value
                  ? 'bg-primary-container text-on-primary-container ring-1 ring-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              ]"
            >
              {{ d.label }}
            </button>
          </div>
        </div>

        <!-- Start Time -->
        <div class="space-y-3">
          <label class="block text-on-surface font-headline font-bold text-lg">开始时间</label>
          <div class="bg-surface-container-high rounded-2xl p-4 flex items-center justify-between hover:bg-surface-container-highest transition-all cursor-pointer">
            <div class="flex items-center gap-3 text-on-surface">
              <span class="material-symbols-outlined text-primary">schedule</span>
              <span class="font-medium">{{ startTime }}</span>
            </div>
            <span class="material-symbols-outlined text-outline">chevron_right</span>
          </div>
        </div>

        <!-- Requirements -->
        <div class="space-y-3">
          <label class="block text-on-surface font-headline font-bold text-lg">详细要求</label>
          <textarea
            v-model="requirements"
            class="w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm placeholder:text-outline/50 resize-none"
            placeholder="写下你的段位要求、位置偏好或其他个性化需求..."
            rows="4"
          ></textarea>
        </div>
      </section>

      <!-- Identity/Status Info -->
      <div class="p-4 rounded-2xl bg-tertiary-container/10 border border-tertiary-container/20 flex items-start gap-3">
        <span class="material-symbols-outlined text-tertiary text-lg">info</span>
        <p class="text-xs text-on-tertiary-container leading-relaxed">
          您的当前等级为 <span class="font-bold">黄金猎人</span>，本次发布将享受优先展示权。悬赏金将在陪玩结束后自动结算至对方钱包。
        </p>
      </div>
    </main>

    <BottomNavBar />

    <!-- Bottom Action Area -->
    <div class="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50">
      <div class="max-w-md mx-auto">
        <button
          @click="handlePublish"
          :disabled="loading"
          class="w-full bg-primary-container text-on-primary-container py-4 rounded-full font-headline font-extrabold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(255,215,0,0.25)]"
          :class="loading ? 'opacity-50 cursor-not-allowed' : ''"
        >
          立即发布
          <span class="material-symbols-outlined font-bold">rocket_launch</span>
        </button>
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
