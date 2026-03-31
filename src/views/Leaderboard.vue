<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <AppHeader
      title="大神排行"
      is-primary-page
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-24 pb-32">
      <!-- Tab Switcher -->
      <div class="bg-surface-container-low rounded-full p-1.5 flex mb-6">
        <button
          class="flex-1 py-2.5 rounded-full text-sm transition-all"
          :class="tab === 'weekly' ? 'bg-primary-container text-on-primary-container font-bold shadow-sm' : 'text-on-surface-variant font-medium hover:text-on-surface'"
          @click="handleTabChange('weekly')"
        >
          周榜
        </button>
        <button
          class="flex-1 py-2.5 rounded-full text-sm transition-all"
          :class="tab === 'monthly' ? 'bg-primary-container text-on-primary-container font-bold shadow-sm' : 'text-on-surface-variant font-medium hover:text-on-surface'"
          @click="handleTabChange('monthly')"
        >
          月榜
        </button>
      </div>

      <!-- Game Type Filter -->
      <div class="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide no-scrollbar">
        <button
          v-for="game in gameTypes"
          :key="game.id"
          class="flex-none px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95"
          :class="selectedGame === game.id ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'"
          @click="handleGameChange(game.id)"
        >
          {{ game.name }}
        </button>
      </div>

      <!-- Top 3 Podium Area -->
      <div v-if="leaderboard.length > 0" class="relative flex items-end justify-center gap-2 mb-12 pt-10 podium-gradient rounded-3xl pb-6">
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

      <!-- 4+ List -->
      <div class="space-y-3">
        <div
          v-for="(player, index) in leaderboard.slice(3)"
          :key="`${player.id}-${page}`"
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

      <!-- Loading Indicator -->
      <div v-if="loading" class="py-8 text-center">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="leaderboard.length === 0" class="py-16 text-center">
        <span class="material-symbols-outlined text-5xl text-outline mb-4">leaderboard</span>
        <p class="text-on-surface-variant text-sm">暂无排行数据</p>
      </div>

      <!-- Load More / End of List -->
      <div v-else-if="hasMore" class="py-8 text-center">
        <button
          v-if="loadingMore"
          class="px-6 py-2.5 bg-surface-container-lowest text-on-surface-variant text-sm font-medium rounded-full"
          disabled
        >
          <span class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
          加载中...
        </button>
        <button
          v-else
          @click="loadMore"
          class="px-6 py-2.5 bg-primary-container text-on-primary-container text-sm font-bold rounded-full active:scale-95 transition-transform"
        >
          加载更多
        </button>
      </div>

      <!-- End of List -->
      <div v-else-if="!hasMore && leaderboard.length > 0" class="py-8 text-center">
        <p class="text-on-surface-variant text-sm">— 没有更多了 —</p>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavBar from '../components/BottomNavBar.vue'
import api from '../api/index.js'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()

const tab = ref('weekly')
const selectedGame = ref('all')
const leaderboard = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)
const totalPages = ref(1)

const gameTypes = ref([
  { id: 'all', name: '全部' },
  { id: 'honor_of_kings', name: '王者荣耀' },
  { id: 'lol', name: '英雄联盟' },
  { id: 'pubg', name: '绝地求生' },
  { id: 'genshin', name: '原神' },
  { id: 'valorant', name: '无畏契约' },
  { id: 'csgo', name: 'CS:GO' }
])

const gameNames = {
  honor_of_kings: '王者荣耀',
  lol: '英雄联盟',
  pubg: '绝地求生',
  genshin: '原神',
  valorant: '无畏契约',
  csgo: 'CS:GO'
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

const handleTabChange = (newTab) => {
  if (tab.value === newTab) return
  tab.value = newTab
  resetAndLoad()
}

const handleGameChange = (gameId) => {
  if (selectedGame.value === gameId) return
  selectedGame.value = gameId
  resetAndLoad()
}

const resetAndLoad = () => {
  page.value = 1
  hasMore.value = true
  leaderboard.value = []
  loadLeaderboard(false)
}

const loadLeaderboard = async (append = false) => {
  if (!append) {
    loading.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const params = {
      period: tab.value,
      page: page.value,
      pageSize: pageSize.value
    }

    if (selectedGame.value !== 'all') {
      params.game = selectedGame.value
    }

    const response = await api.fetchLeaderboard(params)

    let newData = []
    if (response.success || response.code === 0) {
      const data = response.data?.data || response.data || []
      const pagination = response.data?.pagination || {}

      newData = data.map(item => ({
        ...item,
        score: item.score || item.rating * 100 || 0
      }))

      hasMore.value = page.value < (pagination.totalPages || 1)
      totalPages.value = pagination.totalPages || 1
    }

    if (append) {
      leaderboard.value = [...leaderboard.value, ...newData]
    } else {
      leaderboard.value = newData
    }
  } catch (error) {
    console.error('加载排行榜失败:', error)
    hasMore.value = false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (loadingMore.value || !hasMore.value) return
  page.value++
  loadLeaderboard(true)
}

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  if (scrollTop + clientHeight >= scrollHeight - 200 && !loading.value && !loadingMore.value && hasMore.value) {
    loadMore()
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
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.podium-gradient {
  background: linear-gradient(180deg, rgba(255, 215, 9, 0.1) 0%, rgba(246, 246, 246, 0) 100%);
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
