<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api.js'

const router = useRouter()

const activeCategory = ref('')
const searchQuery = ref('')
const games = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref('')

const filteredGames = computed(() => {
  let result = activeCategory.value 
    ? games.value.filter(game => game.category === activeCategory.value)
    : games.value
  if (searchQuery.value) {
    result = result.filter(game => 
      game.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  return result
})

const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId
}

const handleSearch = () => {
  // 搜索逻辑已在computed属性中处理
}

const loadGames = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await api.getGames()
    if (response.success) {
      games.value = Array.isArray(response.data) ? response.data : []
      
      // 提取唯一的分类
      const uniqueCategories = [...new Set(games.value.map(game => game.category))]
      categories.value = uniqueCategories.map(category => ({
        id: category,
        label: category
      }))
      
      // 设置默认活跃分类
      if (categories.value.length > 0 && !activeCategory.value) {
        activeCategory.value = categories.value[0].id
      }
    } else {
      error.value = '加载游戏数据失败'
    }
  } catch (err) {
    error.value = '加载游戏数据失败'
    console.error('加载游戏数据错误:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadGames()
})

const handleGameSelect = (gameId) => {
  console.log('选择游戏:', gameId)
  // 这里可以跳转到游戏详情页面或技能认证页面
  router.push('/expert-verification')
}

const handleNotifications = () => {
  console.log('通知')
}

const handleProfile = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <!-- Top Navigation Anchor -->
    <header class="bg-surface fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary">grid_view</span>
        <h1 class="text-primary font-headline font-bold text-lg">游戏分类</h1>
      </div>
      <div class="flex items-center gap-4">
        <button @click="handleNotifications" class="text-neutral-500 hover:opacity-80 transition-opacity active:scale-95 transition-transform">
          <span class="material-symbols-outlined">notifications</span>
        </button>
        <button @click="handleProfile" class="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
          <img alt="User profile avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwUt6pQRLLdeu_Bmf1d44qJCNduKIPqoONJ7qtflO4D81igagDtYxqWPFsBktIND10YcC0518JxX5wd4M2EnZL1n4pyU7CDrnAR-xTFAO588L7YCKHF0Wzs8pOXQbK3Fe8s7QI6uHzCCSeIWpV4l3Hb3EoJdtr_Y1oaL4vhBnSSwxIsQRz-7FyhYEh9Rzf6nUPVqP8LutLAckx2N6AR4lt9dWUnQXRaXmQchSR0KuRCJBPqEar-nOLIuTHBfIcqBlaBajY3D87lVQ" />
        </button>
      </div>
    </header>

    <main class="pt-20 px-6 pb-24">
      <!-- Search Bar Section -->
      <div class="mb-6 mt-4">
        <div class="relative flex items-center bg-surface-container-high rounded-full px-5 py-3.5 transition-all focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container">
          <span class="material-symbols-outlined text-on-surface-variant mr-3">search</span>
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            class="bg-transparent border-none outline-none w-full text-on-surface placeholder:text-outline p-0 focus:ring-0"
            placeholder="搜索游戏"
            type="text"
          />
        </div>
      </div>

      <div class="flex gap-6 h-[calc(100vh-220px)] overflow-hidden">
        <!-- Sidebar Navigation -->
        <aside class="w-24 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pb-4">
          <div v-if="loading" class="flex justify-center items-center p-4">
            <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div v-else-if="categories.length === 0" class="flex justify-center items-center p-4 text-on-surface-variant">
            <span class="text-sm">暂无分类</span>
          </div>
          <div
            v-else
            v-for="category in categories"
            :key="category.id"
            @click="handleCategoryChange(category.id)"
            :class="[
              'flex flex-col items-center justify-center p-3 rounded-xl font-bold shadow-sm transition-all active:scale-95',
              activeCategory === category.id
                ? 'bg-primary-container text-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            ]"
          >
            <span class="text-sm">{{ category.label }}</span>
          </div>
        </aside>

        <!-- Content Area - Game Grid -->
        <section class="flex-grow overflow-y-auto pb-8">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="flex flex-col items-center justify-center h-full gap-4">
            <span class="material-symbols-outlined text-4xl text-error">error_outline</span>
            <p class="text-error text-center">{{ error }}</p>
            <button @click="loadGames" class="px-4 py-2 bg-primary text-white rounded-full text-sm font-bold">
              重试
            </button>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="filteredGames.length === 0" class="flex flex-col items-center justify-center h-full gap-4">
            <span class="material-symbols-outlined text-4xl text-outline">sports_esports</span>
            <p class="text-on-surface-variant text-center">暂无游戏</p>
          </div>
          
          <!-- Game Grid -->
          <div v-else class="grid grid-cols-3 gap-y-6 gap-x-4">
            <!-- Game Card -->
            <div
              v-for="game in filteredGames"
              :key="game.id"
              @click="handleGameSelect(game.id)"
              class="flex flex-col items-center gap-2 group active:scale-95 transition-transform cursor-pointer"
            >
              <div class="w-full aspect-square rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden flex items-center justify-center">
                <img :alt="game.name" class="w-full h-full object-cover" :src="game.image || 'https://via.placeholder.com/150'" />
              </div>
              <span class="text-xs font-medium text-on-surface text-center">{{ game.name }}</span>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Bottom Navigation Bar Shell -->
    <nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl z-50 rounded-t-[1.5rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div @click="router.push('/')" class="flex flex-col items-center justify-center text-neutral-400 px-4 py-1.5 transition-transform active:scale-90 duration-200 cursor-pointer">
        <span class="material-symbols-outlined mb-1">home</span>
        <span class="font-headline text-[10px] font-medium">首页</span>
      </div>
      <div class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-2xl px-4 py-1.5 transition-all active:scale-90 duration-200 shadow-sm cursor-pointer">
        <span class="material-symbols-outlined mb-1">emoji_events</span>
        <span class="font-headline text-[10px] font-medium">排行榜</span>
      </div>
      <div @click="router.push('/game-categories')" class="flex flex-col items-center justify-center text-neutral-400 px-4 py-1.5 transition-transform active:scale-90 duration-200 cursor-pointer">
        <span class="material-symbols-outlined mb-1">extension</span>
        <span class="font-headline text-[10px] font-medium">技能</span>
      </div>
      <div @click="router.push('/profile/wallet')" class="flex flex-col items-center justify-center text-neutral-400 px-4 py-1.5 transition-transform active:scale-90 duration-200 cursor-pointer">
        <span class="material-symbols-outlined mb-1">account_balance_wallet</span>
        <span class="font-headline text-[10px] font-medium">钱包</span>
      </div>
      <div @click="router.push('/profile')" class="flex flex-col items-center justify-center text-neutral-400 px-4 py-1.5 transition-transform active:scale-90 duration-200 cursor-pointer">
        <span class="material-symbols-outlined mb-1">person</span>
        <span class="font-headline text-[10px] font-medium">我的</span>
      </div>
    </nav>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>