<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaymateStore } from '../stores/playmate'
import { searchPlaymates, getSearchSuggestions } from '../api'
import PlaymateListCard from '../components/PlaymateListCard.vue'

const router = useRouter()
const playmateStore = usePlaymateStore()

const searchKeyword = ref('')
const selectedFilter = ref('all')
const sortBy = ref('recommend')
const filters = ref([
  { id: 'all', label: '全部' },
  { id: 'online', label: '在线' },
  { id: 'price', label: '价格' },
  { id: 'rank', label: '段位' },
  { id: 'gender', label: '性别' }
])

const sortOptions = ref([
  { id: 'recommend', label: '综合推荐' },
  { id: 'price_asc', label: '价格从低到高' },
  { id: 'price_desc', label: '价格从高到低' },
  { id: 'rating', label: '评分最高' },
  { id: 'orders', label: '接单最多' }
])

const suggestions = ref([])
const showSuggestions = ref(false)

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    await fetchPlaymates()
    return
  }
  
  const params = {
    keyword: searchKeyword.value,
    online: selectedFilter.value === 'online' ? true : undefined,
    sortBy: sortBy.value
  }
  
  await searchPlaymates(searchKeyword.value, params)
  showSuggestions.value = false
}

const handleFilterChange = async (filterId) => {
  selectedFilter.value = filterId
  
  const params = {
    keyword: searchKeyword.value || undefined,
    online: filterId === 'online' ? true : undefined,
    sortBy: sortBy.value
  }
  
  await searchPlaymates(searchKeyword.value, params)
}

const handleSortChange = async (sortId) => {
  sortBy.value = sortId
  
  const params = {
    keyword: searchKeyword.value || undefined,
    online: selectedFilter.value === 'online' ? true : undefined,
    sortBy: sortId
  }
  
  await searchPlaymates(searchKeyword.value, params)
}

const handleInput = async (value) => {
  searchKeyword.value = value
  
  if (value.trim().length > 0) {
    suggestions.value = await getSearchSuggestions(value)
    showSuggestions.value = suggestions.value.length > 0
  } else {
    showSuggestions.value = false
  }
}

const handleSelectSuggestion = (suggestion) => {
  searchKeyword.value = suggestion
  showSuggestions.value = false
  handleSearch()
}

const handlePlaymateClick = (playmate) => {
  router.push(`/expert/${playmate.id}`)
}

const fetchPlaymates = async () => {
  const params = {
    online: selectedFilter.value === 'online' ? true : undefined,
    sortBy: sortBy.value
  }
  await searchPlaymates('', params)
}

const filteredPlaymates = computed(() => {
  return playmateStore.playmates
})

onMounted(() => {
  fetchPlaymates()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 py-4">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary cursor-pointer active:scale-95 duration-200">menu</span>
        <h1 class="font-headline font-bold text-lg tracking-tight text-primary">SunnyPlay 日光陪玩</h1>
      </div>
      <div class="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container cursor-pointer" @click="router.push('/profile')">
        <img class="w-full h-full object-cover" alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNN7pNKogoJYe4wsv3o-FDAyvSBuhTul48i-mZ8WsuTaiMYduHla1_zSjL2SVhNTYWcl8KXkzkFWu37CDNXR17T-IqRbkRE3YSkz9RDnoBDmP-PV4kccs__KEv3e8g6ZgTTBbhrzVg7gEB1CRLgL8Gw62MMBPFzUD9Iqe68g2fv4HYlswHzjHItNgFjyODx_dufgH7IzM8JT7PIHeVxMyHtCYvaRKAjhGPpwmk79mWP-Se0BHWL9iJ2xgSD4kBoikIe8dxtqe1tRc"/>
      </div>
    </nav>

    <main class="pt-24 pb-32 px-5 max-w-md mx-auto">
      <header class="mb-8">
        <h2 class="text-3xl font-extrabold font-headline text-on-surface tracking-tight mb-6">寻找队友</h2>
        
        <div class="relative group">
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span class="material-symbols-outlined text-outline">search</span>
          </div>
          <input
            v-model="searchKeyword"
            @input="handleInput($event.target.value)"
            @keyup.enter="handleSearch"
            class="w-full h-14 pl-12 pr-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all placeholder:text-outline"
            placeholder="搜索大神或游戏"
            type="text"
          />
          
          <div v-if="showSuggestions" class="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-2xl shadow-lg overflow-hidden z-50">
            <div
              v-for="suggestion in suggestions"
              :key="suggestion"
              @click="handleSelectSuggestion(suggestion)"
              class="px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors"
            >
              {{ suggestion }}
            </div>
          </div>
        </div>
      </header>

      <section class="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
        <router-link
          to="/filter"
          class="flex-none px-6 py-2.5 rounded-full font-bold text-sm shadow-sm active:scale-95 transition-transform bg-surface-container-lowest text-on-surface-variant border border-transparent hover:bg-surface-container-low"
        >
          <span class="material-symbols-outlined text-sm mr-1">tune</span>筛选
        </router-link>
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="handleFilterChange(filter.id)"
          :class="[
            'flex-none px-6 py-2.5 rounded-full font-bold text-sm shadow-sm active:scale-95 transition-transform',
            selectedFilter === filter.id
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-container-lowest text-on-surface-variant border border-transparent hover:bg-surface-container-low'
          ]"
        >
          {{ filter.label }}
        </button>
      </section>

      <section class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-sm text-on-surface-variant">排序方式</span>
          <select
            v-model="sortBy"
            @change="handleSortChange(sortBy)"
            class="bg-surface-container-lowest border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary-container"
          >
            <option
              v-for="option in sortOptions"
              :key="option.id"
              :value="option.id"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="text-sm text-on-surface-variant">
          共 <span class="font-bold text-primary">{{ filteredPlaymates.length }}</span> 位陪玩师
        </div>
      </section>

      <div v-if="playmateStore.loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="playmateStore.error" class="text-center py-12">
        <p class="text-on-surface-variant">{{ playmateStore.error }}</p>
        <button
          @click="fetchPlaymates"
          class="mt-4 px-6 py-2 bg-primary-container text-on-primary-container rounded-full font-bold"
        >
          重试
        </button>
      </div>

      <div v-else-if="playmateStore.playmates.length === 0" class="text-center py-12">
        <p class="text-on-surface-variant">暂无符合条件的陪玩师</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-5">
        <PlaymateListCard
          v-for="playmate in filteredPlaymates"
          :key="playmate.id"
          :playmate="{
            id: playmate.id,
            nickname: playmate.name,
            avatar: playmate.avatar,
            rating: playmate.rating,
            price: playmate.price,
            tags: playmate.tags,
            isOnline: playmate.isOnline || false,
            level: playmate.level
          }"
        />
      </div>
    </main>

    <nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(255,215,0,0.08)] rounded-t-[24px] z-50">
      <div
        @click="router.push('/')"
        class="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary transition-all active:scale-90 duration-300 cursor-pointer"
      >
        <span class="material-symbols-outlined mb-1">home_filled</span>
        <span class="font-headline text-[11px] font-semibold tracking-wide">首页</span>
      </div>
      <div
        @click="router.push('/discover')"
        class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-2xl px-5 py-2 scale-105 transform transition-all active:scale-90 duration-300 cursor-pointer"
      >
        <span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">explore</span>
        <span class="font-headline text-[11px] font-semibold tracking-wide">发现</span>
      </div>
      <div
        class="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary transition-all active:scale-90 duration-300 cursor-pointer"
      >
        <span class="material-symbols-outlined mb-1">chat_bubble</span>
        <span class="font-headline text-[11px] font-semibold tracking-wide">聊天</span>
      </div>
      <div
        @click="router.push('/orders')"
        class="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary transition-all active:scale-90 duration-300 cursor-pointer"
      >
        <span class="material-symbols-outlined mb-1">receipt_long</span>
        <span class="font-headline text-[11px] font-semibold tracking-wide">订单</span>
      </div>
      <div
        @click="router.push('/profile')"
        class="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary transition-all active:scale-90 duration-300 cursor-pointer"
      >
        <span class="material-symbols-outlined mb-1">person</span>
        <span class="font-headline text-[11px] font-semibold tracking-wide">我的</span>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
