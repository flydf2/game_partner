<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
      <SearchInput ref="searchInputRef" @search="handleSearch" />

      <div class="flex items-center gap-3">
        <router-link
          to="/filter"
          class="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full text-sm font-medium hover:bg-surface-container transition-colors"
        >
          <span class="material-symbols-outlined text-lg">tune</span>
          <span>筛选</span>
          <span
            v-if="activeFiltersCount > 0"
            class="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full"
          >
            {{ activeFiltersCount }}
          </span>
        </router-link>

        <div class="flex gap-2 overflow-x-auto no-scrollbar flex-1">
          <button
            v-for="game in popularGames"
            :key="game.id"
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            :class="selectedGame === game.id ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'"
            @click="handleGameSelect(game.id)"
          >
            {{ game.name }}
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <h2 class="text-xl font-headline font-bold text-on-surface">
          推荐陪玩
        </h2>
        <div class="flex items-center gap-2">
          <span class="text-sm text-zinc-500">排序:</span>
          <select
            v-model="sortBy"
            class="bg-surface-container-low border-0 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            @change="handleSortChange"
          >
            <option value="default">综合排序</option>
            <option value="rating">评分最高</option>
            <option value="price_asc">价格最低</option>
            <option value="price_desc">价格最高</option>
            <option value="newest">最新上线</option>
          </select>
        </div>
      </div>

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
import { useFilterStore } from '../stores/filter.js'
import { usePlaymateStore } from '../stores/playmate.js'
import { fetchPlaymates } from '../api/index.js'
import { useToast } from '../composables/useToast.js'
import SearchInput from '../components/common/SearchInput.vue'
import PlaymateList from '../components/discover/PlaymateList.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'

const router = useRouter()
const filterStore = useFilterStore()
const playmateStore = usePlaymateStore()
const { success, error: showError } = useToast()

const searchInputRef = ref(null)
const sortBy = ref('default')
const selectedGame = ref(null)

const activeFiltersCount = computed(() => filterStore.activeFiltersCount)

const popularGames = [
  { id: 'honor_of_kings', name: '王者荣耀' },
  { id: 'lol', name: 'LOL' },
  { id: 'valorant', name: 'Valorant' },
  { id: 'genshin', name: '原神' },
  { id: 'pubg', name: '绝地求生' }
]

async function loadData() {
  playmateStore.resetState()

  const params = {
    page: 1,
    pageSize: 20,
    sortBy: sortBy.value
  }

  if (selectedGame.value) {
    params.game = selectedGame.value
  }

  const filterQuery = filterStore.getFilterQuery()
  Object.assign(params, filterQuery)

  try {
    await fetchPlaymates(params)
  } catch (err) {
    showError('加载数据失败，请稍后重试')
  }
}

function handleSearch(keyword) {
  router.push({ path: '/search', query: { keyword } })
}

function handleSortChange() {
  loadData()
}

async function handleGameSelect(gameId) {
  if (selectedGame.value === gameId) {
    selectedGame.value = null
  } else {
    selectedGame.value = gameId
  }
  await loadData()
  if (selectedGame.value) {
    const game = popularGames.find(g => g.id === gameId)
    success(`已选择${game?.name || ''}`)
  } else {
    success('已清除游戏筛选')
  }
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
      pageSize: 20,
      sortBy: sortBy.value
    }

    if (selectedGame.value) {
      params.game = selectedGame.value
    }

    const filterQuery = filterStore.getFilterQuery()
    Object.assign(params, filterQuery)

    if (searchKeyword.value) {
      await searchPlaymates(searchKeyword.value, params)
    } else {
      await fetchPlaymates(params)
    }
  }
}

watch(sortBy, async () => {
  await loadData()
})

watch(() => filterStore.filters, async () => {
  await loadData()
}, { deep: true })

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