<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <!-- TopAppBar -->
    <nav class="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm shadow-yellow-500/5 flex justify-between items-center px-6 py-4">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-yellow-600 dark:text-yellow-400 active:scale-95 duration-200 ease-out" data-icon="menu">menu</span>
        <h1 class="font-headline font-bold text-lg tracking-tight text-yellow-600 dark:text-yellow-500 font-black tracking-tighter">SunnyPlay 日光陪玩</h1>
      </div>
      <div class="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container">
        <img class="w-full h-full object-cover" data-alt="User profile avatar of a young gamer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNN7pNKogoJYe4wsv3o-FDAyvSBuhTul48i-mZ8WsuTaiMYduHla1_zSjL2SVhNTYWcl8KXkzkFWu37CDNXR17T-IqRbkRE3YSkz9RDnoBDmP-PV4kccs__KEv3e8g6ZgTTBbhrzVg7gEB1CRLgL8Gw62MMBPFzUD9Iqe68g2fv4HYlswHzjHItNgFjyODx_dufgH7IzM8JT7PIHeVxMyHtCYvaRKAjhGPpwmk79mWP-Se0BHWL9iJ2xgSD4kBoikIe8dxtqe1tRc"/>
      </div>
    </nav>
    
    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-8">
    <!-- Hero Banner: Honor of Kings Tournament -->
    <section class="relative w-full h-48 sm:h-64 md:h-80 rounded-[2rem] overflow-hidden group shadow-xl shadow-primary/10">
      <div class="absolute inset-0 bg-gradient-to-r from-primary to-tertiary-fixed opacity-90 mix-blend-multiply"></div>
      <LazyImage 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuChoKqMjV8Zopn6t52b1X_D1IHpomYuX0uMCtUOdsEjdUbzmVSeBr-5ZKxEhOUlx1mPSxANNKH4sghnW_76nSPFe5RQDcs0D0146L6oIlgGmuRs6DcX59vrx67krFal1DduP8vpSj5o2giMgdNHYP2pIzqcKEuJfnSxyvoN_fgqJahQCNwzPm37cGoeZUvBWw_zifeh-pvUxLyRR7_8puuGkKr-5w05-1orNhrAYXS-S8PDY6s1vdzatJ05jaJSvNTo7dS88EwkP2M"
        alt="Honor of Kings Tournament"
        aspect-ratio="landscape"
        rounded="2rem"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div class="absolute inset-0 flex flex-col justify-end p-6 space-y-2">
        <span class="inline-flex items-center px-3 py-1 bg-surface-container-lowest/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest w-fit">
          Tournament Live
        </span>
        <h2 class="text-3xl font-headline font-extrabold text-white leading-tight tracking-tighter">王者荣耀<br/>巅峰挑战赛</h2>
        <div class="flex items-center gap-4 pt-2">
          <button class="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all hover:shadow-xl">
            立即报名
          </button>
          <p class="text-white/80 text-xs font-medium">1.2w 人已参与</p>
        </div>
      </div>
    </section>
    
    <!-- Game Categories -->
    <div v-if="loading.games" class="flex justify-center py-8">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="error.games" class="text-center py-8 text-red-500">
      {{ error.games }}
      <button @click="loadGames" class="mt-2 text-primary underline hover:text-primary/80 transition-colors">重试</button>
    </div>
    <div 
      v-else 
      ref="gamesRef" 
      class="transition-all duration-1000 transform"
      :class="{ 'opacity-100 translate-y-0': gamesVisible, 'opacity-0 translate-y-10': !gamesVisible }"
    >
      <GameCategories :games="games" @view-all="navigateToGameCategories" @game-click="navigateToDiscoverWithGame" />
    </div>
    
    <!-- Top Playmates (Bento Style Grid) -->
    <section 
      ref="playmatesRef" 
      class="space-y-4 transition-all duration-1000 transform"
      :class="{ 'opacity-100 translate-y-0': playmatesVisible, 'opacity-0 translate-y-10': !playmatesVisible }"
    >
      <div class="flex items-center gap-2">
        <h3 class="text-xl font-headline font-bold text-on-surface tracking-tight">优秀陪玩</h3>
        <div class="px-2 py-0.5 bg-primary/10 rounded text-[10px] font-bold text-primary tracking-widest uppercase">Editor's Choice</div>
      </div>
      <div v-if="loading.playmates" class="flex justify-center py-8">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="error.playmates" class="text-center py-8 text-red-500">
        {{ error.playmates }}
        <button @click="loadPlaymates" class="mt-2 text-primary underline hover:text-primary/80 transition-colors">重试</button>
      </div>
      <div v-else class="grid grid-cols-2 gap-4">
        <!-- Playmate Cards -->
        <template v-for="playmate in playmates" :key="playmate.id">
          <PlaymateCard 
            v-if="playmate && playmate.id"
            :playmate="{
              id: playmate.id,
              nickname: playmate.name,
              avatar: playmate.avatar,
              rating: playmate.rating,
              price: playmate.price,
              tags: playmate.tags,
              isOnline: playmate.isOnline || false
            }"
            @click="navigateToExpertDetail(playmate.id)"
          />
        </template>
        <!-- Featured Playmate Card -->
        <FeaturedPlaymateCard 
          v-if="featuredPlaymate && featuredPlaymate.id"
          :playmate="featuredPlaymate" 
        />
      </div>
    </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import GameCategories from '../components/GameCategories.vue'
import PlaymateCard from '../components/discover/PlaymateCard.vue'
import FeaturedPlaymateCard from '../components/FeaturedPlaymateCard.vue'
import LazyImage from '../components/common/LazyImage.vue'
import { api } from '../services/api.js'
import { useScrollAnimation } from '../composables/useScrollAnimation.js'

const router = useRouter()

const navigateToExpertDetail = (id) => {
  router.push(`/expert/${id}`)
}

const navigateToGameCategories = () => {
  router.push('/game-categories')
}

const navigateToDiscoverWithGame = (gameId) => {
  router.push({ path: '/discover', query: { gameId } })
}

// 状态管理
const games = ref([])
const playmates = ref([])
const featuredPlaymate = ref({})
const loading = ref({ games: false, playmates: false })
const error = ref({ games: '', playmates: '' })

// 滚动动画
const gamesRef = ref(null)
const playmatesRef = ref(null)
const { isVisible: gamesVisible, observeElement: observeGames } = useScrollAnimation()
const { isVisible: playmatesVisible, observeElement: observePlaymates } = useScrollAnimation()

// 加载游戏数据
const loadGames = async () => {
  loading.value.games = true
  error.value.games = ''
  
  const response = await api.getGames()
  if (response.success) {
    games.value = response.data
  } else {
    error.value.games = response.error || '加载游戏数据失败'
  }
  
  loading.value.games = false
}

// 加载陪玩数据
const loadPlaymates = async () => {
  loading.value.playmates = true
  error.value.playmates = ''
  
  const [playmatesResponse, featuredResponse] = await Promise.all([
    api.getPlaymates(),
    api.getFeaturedPlaymate()
  ])
  
  if (playmatesResponse.success) {
    playmates.value = playmatesResponse.data.slice(0, 2) // 只显示前两个
  } else {
    error.value.playmates = playmatesResponse.error || '加载陪玩数据失败'
  }
  
  if (featuredResponse.success) {
    featuredPlaymate.value = featuredResponse.data
  }
  
  loading.value.playmates = false
}

// 组件挂载时加载数据和观察元素
onMounted(() => {
  loadGames()
  loadPlaymates()
  
  // 观察元素进入视口
  setTimeout(() => {
    if (gamesRef.value) {
      observeGames(gamesRef.value)
    }
    if (playmatesRef.value) {
      observePlaymates(playmatesRef.value)
    }
  }, 100)
})
</script>

<style scoped>
/* 组件样式 */
</style>
