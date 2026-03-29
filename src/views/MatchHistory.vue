<template>
  <div class="min-h-screen bg-background text-on-background pb-24">
    <AppHeader
      title="历史战绩"
      is-primary-page
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <!-- 主内容区域 -->
    <main class="page-content pt-20 space-y-6">
      <!-- 加载状态 -->
      <section v-if="loading" class="bg-surface-container-lowest rounded-3xl p-8 flex items-center justify-center">
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

      <template v-else>
        <!-- 赛季总结 Bento Grid -->
        <section class="grid grid-cols-12 gap-3">
          <div class="col-span-12 hero-gradient rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-sm">
            <div class="relative z-10">
              <p class="text-on-primary-container font-medium opacity-80 mb-1">当前赛季</p>
              <h2 class="text-on-primary-container font-headline font-extrabold text-3xl tracking-tight">{{ matchHistory.seasonName || 'S24 巅峰对决' }}</h2>
            </div>
            <div class="flex justify-between items-end relative z-10">
              <div class="flex gap-6">
                <div>
                  <p class="text-[10px] text-on-primary-container font-bold uppercase tracking-wider opacity-60">总场次</p>
                  <p class="font-headline font-black text-2xl text-on-primary-container">{{ formatNumber(matchHistory.totalMatches) }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-on-primary-container font-bold uppercase tracking-wider opacity-60">胜率</p>
                  <p class="font-headline font-black text-2xl text-on-primary-container">{{ matchHistory.winRate }}%</p>
                </div>
              </div>
              <div class="bg-white/30 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/20">
                <span class="material-symbols-outlined text-on-primary-container text-lg" style="font-variation-settings: 'FILL' 1;">stars</span>
                <span class="text-on-primary-container font-bold text-sm">MVP {{ matchHistory.mvpCount }}次</span>
              </div>
            </div>
            <!-- Abstract Decorative Elements -->
            <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
          </div>
        </section>

        <!-- 近期对局列表 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h3 class="font-headline font-bold text-on-surface">近期对局</h3>
            <span class="text-xs text-outline font-medium cursor-pointer">查看全部报告</span>
          </div>

          <!-- Match Card -->
          <div
            v-for="match in recentMatches"
            :key="match.id"
            class="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all duration-200 cursor-pointer group shadow-sm"
            @click="handleMatchClick(match.id)"
          >
            <div class="relative">
              <div
                class="w-16 h-16 rounded-full overflow-hidden bg-surface-container border-2"
                :class="match.isVictory ? 'border-primary-container' : 'grayscale border-surface-container'"
              >
                <img
                  :src="match.heroAvatar"
                  alt="Hero avatar"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onerror="this.src='https://via.placeholder.com/64'"
                />
              </div>
              <div v-if="match.isMVP" class="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-surface-container-lowest">
                MVP
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span :class="match.isVictory ? 'text-primary font-black text-lg' : 'text-outline font-black text-lg uppercase'">
                  {{ match.isVictory ? 'VICTORY' : 'DEFEAT' }}
                </span>
                <span class="text-[10px] text-outline font-medium">{{ match.time }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex items-baseline gap-0.5">
                  <span class="font-headline font-bold text-on-surface">{{ match.kills }}</span>
                  <span class="text-outline-variant">/</span>
                  <span class="font-headline font-bold text-error">{{ match.deaths }}</span>
                  <span class="text-outline-variant">/</span>
                  <span class="font-headline font-bold text-tertiary">{{ match.assists }}</span>
                </div>
                <div class="h-3 w-[1px] bg-surface-container"></div>
                <span class="text-xs text-on-surface-variant font-medium">{{ match.duration }}</span>
              </div>
            </div>
            <span class="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">
              chevron_right
            </span>
          </div>

          <!-- 空状态 -->
          <div v-if="recentMatches.length === 0" class="bg-surface-container-lowest rounded-3xl p-8 text-center">
            <div class="w-20 h-20 mx-auto bg-surface-container flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-outline text-4xl">sports_esports</span>
            </div>
            <p class="text-sm text-on-surface-variant">暂无对局记录</p>
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore" class="flex justify-center py-4">
            <button
              class="px-6 py-2 bg-surface-container text-on-surface-variant rounded-full text-sm font-medium hover:bg-surface-container-high transition-colors"
              :disabled="loadingMore"
              @click="loadMore"
            >
              <span v-if="loadingMore" class="flex items-center gap-2">
                <span class="material-symbols-outlined animate-spin">refresh</span>
                加载中...
              </span>
              <span v-else>加载更多</span>
            </button>
          </div>
        </div>
      </template>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import { matchHistoryApi } from '../api/match-history.js'
import { handleApiError } from '../api/index.js'

const router = useRouter()

const loading = ref(true)
const loadingMore = ref(false)
const error = ref('')
const currentPage = ref(1)
const hasMore = ref(true)

const matchHistory = ref({
  seasonName: 'S24 巅峰对决',
  totalMatches: 0,
  winRate: 0,
  mvpCount: 0
})

const recentMatches = ref([])

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}

const loadData = async () => {
  loading.value = true
  error.value = ''
  currentPage.value = 1
  hasMore.value = true

  try {
    const [historyResponse, matchesResponse] = await Promise.all([
      matchHistoryApi.getMatchHistory().catch(() => null),
      matchHistoryApi.getRecentMatches(1, 20).catch(() => null)
    ])

    if (historyResponse?.success) {
      const data = historyResponse.data
      matchHistory.value = {
        seasonName: data.seasonName || 'S24 巅峰对决',
        totalMatches: data.totalMatches || 0,
        winRate: data.winRate || 0,
        mvpCount: data.mvpCount || 0
      }
    }

    if (matchesResponse?.success) {
      const matches = matchesResponse.data?.data || matchesResponse.data || []
      recentMatches.value = matches.map(match => ({
        id: match.id,
        isVictory: match.isVictory || match.result === 'win',
        isMVP: match.isMVP || match.isMvp,
        heroAvatar: match.heroAvatar || match.heroImage || 'https://via.placeholder.com/64',
        time: match.time || match.matchTime || formatMatchTime(match.createdAt),
        kills: match.kills || 0,
        deaths: match.deaths || 0,
        assists: match.assists || 0,
        duration: match.duration || match.gameDuration || '00:00'
      }))

      const pagination = matchesResponse.data?.pagination
      if (pagination) {
        hasMore.value = pagination.currentPage < pagination.totalPages
      }
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('加载历史战绩失败:', err)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return

  loadingMore.value = true
  try {
    const nextPage = currentPage.value + 1
    const response = await matchHistoryApi.getRecentMatches(nextPage, 20)

    if (response?.success) {
      const matches = response.data?.data || response.data || []
      const newMatches = matches.map(match => ({
        id: match.id,
        isVictory: match.isVictory || match.result === 'win',
        isMVP: match.isMVP || match.isMvp,
        heroAvatar: match.heroAvatar || match.heroImage || 'https://via.placeholder.com/64',
        time: match.time || match.matchTime || formatMatchTime(match.createdAt),
        kills: match.kills || 0,
        deaths: match.deaths || 0,
        assists: match.assists || 0,
        duration: match.duration || match.gameDuration || '00:00'
      }))

      recentMatches.value.push(...newMatches)
      currentPage.value = nextPage

      const pagination = response.data?.pagination
      if (pagination) {
        hasMore.value = pagination.currentPage < pagination.totalPages
      } else {
        hasMore.value = matches.length === 20
      }
    }
  } catch (err) {
    console.error('加载更多对局失败:', err)
  } finally {
    loadingMore.value = false
  }
}

const formatMatchTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

const handleMatchClick = (matchId) => {
  router.push(`/match/${matchId}`)
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
  loadData()
})
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(135deg, #ffd709 0%, #feb246 100%);
}
</style>
