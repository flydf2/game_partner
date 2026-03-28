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
      <!-- 赛季总结 Bento Grid -->
      <section class="grid grid-cols-12 gap-3">
        <div class="col-span-12 hero-gradient rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-sm">
          <div class="relative z-10">
            <p class="text-on-primary-container font-medium opacity-80 mb-1">当前赛季</p>
            <h2 class="text-on-primary-container font-headline font-extrabold text-3xl tracking-tight">S24 巅峰对决</h2>
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
      </div>
    </main>

    <BottomNavBar />

    <!-- BottomNavBar -->
    <nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pb-6 pt-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl rounded-t-[1.5rem] z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div class="flex flex-col items-center justify-center text-neutral-400 p-2 hover:text-[#6c5a00] active:scale-90 transition-all duration-300 ease-out cursor-pointer">
        <span class="material-symbols-outlined" data-icon="grid_view">grid_view</span>
        <span class="font-plus-jakarta-sans text-[10px] font-semibold mt-1">首页</span>
      </div>
      <div class="flex flex-col items-center justify-center bg-[#FFD700] text-[#6c5a00] rounded-full px-4 py-1.5 active:scale-90 transition-all duration-300 ease-out cursor-pointer">
        <span class="material-symbols-outlined" data-icon="sports_esports" style="font-variation-settings: 'FILL' 1;">sports_esports</span>
        <span class="font-plus-jakarta-sans text-[10px] font-semibold mt-1">对局</span>
      </div>
      <div class="flex flex-col items-center justify-center text-neutral-400 p-2 hover:text-[#6c5a00] active:scale-90 transition-all duration-300 ease-out cursor-pointer">
        <span class="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
        <span class="font-plus-jakarta-sans text-[10px] font-semibold mt-1">消息</span>
      </div>
      <div class="flex flex-col items-center justify-center text-neutral-400 p-2 hover:text-[#6c5a00] active:scale-90 transition-all duration-300 ease-out cursor-pointer">
        <span class="material-symbols-outlined" data-icon="person">person</span>
        <span class="font-plus-jakarta-sans text-[10px] font-semibold mt-1">我的</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()

const matchHistory = ref({
  totalMatches: 1248,
  winRate: 64.2,
  mvpCount: 86
})

const recentMatches = ref([
  {
    id: 1,
    isVictory: true,
    isMVP: true,
    heroAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPD_5CyNJmopxDSER0ZPl9vdGjLuYb8Cly-R-vYRPhXXlys1A1Csa19Q8VVHrnISAEQUrKgmU-z0XgVY0dK_KosES5CkMhjUBuTSuIkdIe0EBs8n_svF7PrmZy-mvXSpf0XJ3kq0plHniYIt4bYkkZzJ_UDXxUTQelMGhm48oawAx-YNtzOGyNBQ4Ulw4p_akue4sKmXgai32l_lGib0bYWtUXavWblDzJKLPKpLJLZDxFhZV8X9TiQz62wse9QIfbmSjrL-FXuRA',
    time: '10-24 14:30',
    kills: 12,
    deaths: 2,
    assists: 8,
    duration: '18:42'
  },
  {
    id: 2,
    isVictory: false,
    isMVP: false,
    heroAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEHaIRAqBM2kwZtns2GUAEBz_FQTmXXVZ_JbpACk1KW5dNxu5_U3yNQbQWW_qJcfaATr_ep3f5XgNgbK35BuQL6Mrnf0V6IyyzUsM4jguPSy7HMxGons2Ak4zZc4FeOIaARvPE2CDINhxnoWhoHSJWueJUNiy4rymvhPqLurV7JTbrXcXXA2HvJhi4XXs8NmFi0qDH5OWtwr9K2ncqBDXspYB6VgwO3LvUDY6ouHPLchZdrUDKKb3f8YYWVitg8ZaNsiiTiyXs3PM',
    time: '10-24 12:15',
    kills: 4,
    deaths: 8,
    assists: 11,
    duration: '32:10'
  },
  {
    id: 3,
    isVictory: true,
    isMVP: false,
    heroAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLCX9UFOVfgOJJRfU5glnA8DCtLreMcJKaMpyHD7oBZVsqNDsTCpTGcatLgHsQZ_8NEMDa9j-rqUTCFPwERZcxhCe3tai4xW-U2DVTk0nLZ9ZKJXa6G2LeWTaJoL0OGhacZUC__J0XHiZjGmP6kcc0B423IjB4yKz7V0K7fZSDHWpdSwMia4RQg8cNc_y2MbLMei0BT4dvXPfu36mv8xJD-pLLRyfQcCa88kp4oACcD3p5XuhIYXRZcu1RhTUMYAFtUWYtsG3PXDg',
    time: '10-23 21:50',
    kills: 15,
    deaths: 5,
    assists: 3,
    duration: '24:15'
  },
  {
    id: 4,
    isVictory: true,
    isMVP: false,
    heroAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA7QkKdEtr2dxDrazaxzvAf9EpGlRr696hlFA5yyHTR1mbMwzRG1pyJImGIHYLjQUm08HDRsI484UMDvWtMLzfCtdJIZ19M2D1XeOPxZEZiHLs37HO3eAPrZBRl-XzKuTDqmZXqm-K6jSO7L0qm958jzEzTQN8Q8JnuHjG7KIRc-5KrRy93ma_tbD-TQ1LmPYNKfG1ynqJ_CTaOaViZPtdSIuaft7kgTlQkuLQ1g7W9Ot2PDzykK1-tvGeGTSiLvuIll7rQLyVQJU',
    time: '10-23 19:05',
    kills: 8,
    deaths: 1,
    assists: 14,
    duration: '15:58'
  }
])

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}

const handleBack = () => {
  router.back()
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
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(135deg, #ffd709 0%, #feb246 100%);
}
</style>
