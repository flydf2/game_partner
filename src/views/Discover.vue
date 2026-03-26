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
    
    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6 max-w-md mx-auto">
      <!-- Search and Title Section -->
      <header class="mb-8">
        <h2 class="text-3xl font-extrabold header-font text-on-surface tracking-tight mb-6">寻找队友</h2>
        <div class="relative group">
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span class="material-symbols-outlined text-outline" data-icon="search">search</span>
          </div>
          <input class="w-full h-14 pl-12 pr-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all text-body-md placeholder:text-outline" placeholder="搜索大神或游戏" type="text" @input="handleSearchInput" />
        </div>
      </header>
      
      <!-- Filter Chips -->
      <section class="flex gap-3 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
        <button class="flex-none px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-bold text-sm shadow-sm active:scale-95 transition-transform">在线</button>
        <button class="flex-none px-6 py-2.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-semibold text-sm border border-transparent hover:bg-surface-container-low active:scale-95 transition-transform">价格</button>
        <button class="flex-none px-6 py-2.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-semibold text-sm border border-transparent hover:bg-surface-container-low active:scale-95 transition-transform">段位</button>
        <button class="flex-none px-6 py-2.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-semibold text-sm border border-transparent hover:bg-surface-container-low active:scale-95 transition-transform">性别</button>
      </section>

      <div class="min-h-[500px]">
        <PullToRefresh :on-refresh="handleRefresh" :min-height="500">
          <PlaymateList @retry="handleRetry" />
        </PullToRefresh>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaymateStore } from '../stores/playmate.js'
import { fetchPlaymates } from '../api/index.js'
import { useToast } from '../composables/useToast.js'
import PlaymateList from '../components/discover/PlaymateList.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'

const router = useRouter()
const playmateStore = usePlaymateStore()
const { success, error: showError } = useToast()

const searchInput = ref('')

async function loadData() {
  playmateStore.resetState()

  const params = {
    page: 1,
    pageSize: 20
  }

  try {
    await fetchPlaymates(params)
  } catch (err) {
    showError('加载数据失败，请稍后重试')
  }
}

function handleSearchInput(event) {
  searchInput.value = event.target.value
  // 这里可以添加防抖处理，当用户输入完成后跳转到搜索结果页
}

async function handleRetry() {
  await loadData()
  success('重新加载成功')
}

async function handleRefresh() {
  await loadData()
  success('刷新成功')
}

async function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  
  if (scrollTop + clientHeight >= scrollHeight - 200 && !playmateStore.loading && playmateStore.hasMore) {
    playmateStore.incrementPage()

    const params = {
      page: playmateStore.currentPage,
      pageSize: 20
    }

    await fetchPlaymates(params)
  }
}

onMounted(() => {
  loadData()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 640px) {
  .space-y-6 {
    gap: 1.25rem;
  }
}
</style>