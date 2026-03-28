<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <ListPageHeader
      title="大神排行"
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />
    
    <main class="max-w-md mx-auto px-5 pt-24 pb-32">
      <!-- Tab Switcher -->
      <div class="bg-surface-container-low rounded-full p-1.5 flex mb-8">
        <button 
          class="flex-1 py-2.5 rounded-full text-sm font-bold bg-primary-container text-on-primary-container shadow-sm transition-all"
          :class="{ 'font-bold': tab === 'weekly', 'font-medium text-on-surface-variant hover:text-on-surface': tab !== 'weekly' }"
          @click="tab = 'weekly'"
        >
          周榜 (Weekly)
        </button>
        <button 
          class="flex-1 py-2.5 rounded-full text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all"
          :class="{ 'font-bold': tab === 'monthly', 'font-medium text-on-surface-variant hover:text-on-surface': tab !== 'monthly' }"
          @click="tab = 'monthly'"
        >
          月榜 (Monthly)
        </button>
      </div>
      
      <!-- Top 3 Podium Area -->
      <div class="relative flex items-end justify-center gap-2 mb-12 pt-10 podium-gradient rounded-3xl pb-6">
        <!-- Rank 2 -->
        <div v-if="leaderboard[1]" class="flex flex-col items-center mb-4">
          <div class="relative">
            <div class="w-20 h-20 rounded-full border-4 border-slate-300 overflow-hidden bg-white">
              <img :alt="leaderboard[1].nickname" class="w-full h-full object-cover" :src="leaderboard[1].avatar" />
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-300 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">2</div>
          </div>
          <p class="mt-4 font-bold text-sm text-on-surface">{{ leaderboard[1].nickname }}</p>
          <div class="flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-[14px] text-secondary" data-icon="local_fire_department" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
            <span class="text-[10px] font-bold text-secondary">{{ formatScore(leaderboard[1].score) }}</span>
          </div>
        </div>
        
        <!-- Rank 1 -->
        <div v-if="leaderboard[0]" class="flex flex-col items-center">
          <div class="relative -mt-8">
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[#FFD700]">
              <span class="material-symbols-outlined text-4xl" data-icon="workspace_premium" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
            </div>
            <div class="w-28 h-28 rounded-full border-4 border-primary-container overflow-hidden bg-white shadow-xl shadow-primary-container/20">
              <img :alt="leaderboard[0].nickname" class="w-full h-full object-cover" :src="leaderboard[0].avatar" />
            </div>
            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shadow-lg">1</div>
          </div>
          <p class="mt-5 font-extrabold text-lg text-on-surface tracking-tight">{{ leaderboard[0].nickname }}</p>
          <div class="flex items-center gap-1 mt-1 bg-primary-container/20 px-3 py-1 rounded-full">
            <span class="material-symbols-outlined text-[16px] text-primary" data-icon="local_fire_department" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
            <span class="text-xs font-black text-primary">{{ formatScore(leaderboard[0].score) }}</span>
          </div>
        </div>
        
        <!-- Rank 3 -->
        <div v-if="leaderboard[2]" class="flex flex-col items-center mb-2">
          <div class="relative">
            <div class="w-20 h-20 rounded-full border-4 border-slate-300 overflow-hidden bg-white">
              <img :alt="leaderboard[2].nickname" class="w-full h-full object-cover" :src="leaderboard[2].avatar" />
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#CD7F32] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg">3</div>
          </div>
          <p class="mt-4 font-bold text-sm text-on-surface">{{ leaderboard[2].nickname }}</p>
          <div class="flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-[14px] text-secondary" data-icon="local_fire_department" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
            <span class="text-[10px] font-bold text-secondary">{{ formatScore(leaderboard[2].score) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 4-20 List -->
      <div class="space-y-3">
        <div 
          v-for="(player, index) in leaderboard.slice(3, 20)" 
          :key="player.id"
          class="bg-surface-container-lowest p-4 rounded-2xl flex items-center gap-4 transition-transform active:scale-[0.98]"
        >
          <span class="text-on-surface-variant font-bold w-4 text-center">{{ index + 4 }}</span>
          <div class="w-12 h-12 rounded-xl overflow-hidden bg-surface-container">
            <img :alt="player.nickname" class="w-full h-full object-cover" :src="player.avatar" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-on-surface truncate">{{ player.nickname }}</h3>
            <div class="flex gap-2 mt-1">
              <span class="bg-tertiary-container/10 text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full">{{ getGameName(player.game) }}</span>
              <div class="flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[12px] text-secondary" data-icon="local_fire_department" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
                <span class="text-[10px] font-medium text-secondary">{{ formatScore(player.score) }}</span>
              </div>
            </div>
          </div>
          <button 
            class="bg-primary-container text-on-primary-container text-xs font-bold px-4 py-2 rounded-full active:scale-95 transition-transform"
            @click="goToDetail(player.id)"
          >
            查看战绩
          </button>
        </div>
      </div>
      
      <!-- Pagination/More Placeholder -->
      <div v-if="loading" class="py-8 text-center">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="leaderboard.length === 0" class="py-8 text-center">
        <p class="text-on-surface-variant text-sm">暂无数据</p>
      </div>
      <div v-else class="py-8 text-center">
        <p class="text-on-surface-variant text-sm">下滑查看更多大神...</p>
      </div>
    </main>
    
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavBar from '../components/BottomNavBar.vue'
import api from '../api/index.js'
import ListPageHeader from '../components/ListPageHeader.vue'

const router = useRouter()

const tab = ref('weekly')
const leaderboard = ref([])
const loading = ref(false)

const gameNames = {
  honor_of_kings: '王者荣耀',
  lol: '英雄联盟',
  pubg: '绝地求生',
  genshin: '原神',
  valorant: '无畏契约'
}

const getGameName = (gameId) => {
  return gameNames[gameId] || gameId
}

const formatScore = (score) => {
  if (!score) return '0'
  if (score >= 1000) {
    return (score / 1000).toFixed(1) + 'k'
  }
  return score
}

const goToDetail = (playerId) => {
  router.push(`/leaderboard/${playerId}`)
}

const loadLeaderboard = async () => {
  loading.value = true
  try {
    const response = await api.fetchLeaderboard({
      period: tab.value,
      page: 1,
      pageSize: 20
    })
    
    if (response.success || (response.code === 0)) {
      const data = response.data?.data || response.data || []
      leaderboard.value = data
    }
  } catch (error) {
    console.error('加载排行榜失败:', error)
  } finally {
    loading.value = false
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
  loadLeaderboard()
})
</script>

<style scoped>
.podium-gradient {
  background: linear-gradient(180deg, rgba(255, 215, 9, 0.1) 0%, rgba(246, 246, 246, 0) 100%);
}
</style>
