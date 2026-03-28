<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ListPageHeader from '../components/ListPageHeader.vue'
import api from '../api/index.js'

const router = useRouter()

const bounties = ref([])
const categories = ref(['全部悬赏', '王者荣耀', '英雄联盟', '和平精英', '金铲铲之战', '无畏契约', '反恐精英2'])
const selectedCategory = ref('全部悬赏')
const loading = ref(true)
const error = ref(null)

const loadBounties = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await api.rewardOrder.getRewardOrders({
      page: 1,
      pageSize: 20
    })
    
    if (response && response.success) {
      const responseData = response.data
      
      if (responseData && typeof responseData === 'object') {
        const bountiesData = Array.isArray(responseData.data) ? responseData.data : (Array.isArray(responseData) ? responseData : [])
        
        if (bountiesData.length > 0) {
          bounties.value = bountiesData.map(bounty => ({
            id: bounty.id,
            title: bounty.title || `${bounty.game}悬赏单`,
            content: bounty.content || '',
            reward: bounty.reward,
            game: bounty.game,
            publisher: {
              name: bounty.userName || '匿名用户',
              avatar: bounty.userAvatar || 'https://via.placeholder.com/56',
              level: bounty.userLevel || 24,
              specialty: bounty.userSpecialty || ''
            },
            timeLeft: bounty.timeLeft || '24:59',
            tags: bounty.tags || [],
            requirements: bounty.requirements || []
          }))
        } else {
          bounties.value = []
        }
      }
    } else {
      error.value = '获取悬赏列表失败: ' + (response.message || '未知错误')
    }
  } catch (err) {
    error.value = '加载失败: ' + err.message
    console.error('加载悬赏列表失败:', err)
  } finally {
    loading.value = false
  }
}

const handleCategorySelect = (category) => {
  selectedCategory.value = category
}

const handleViewBounty = (bountyId) => {
  router.push(`/reward/${bountyId}`)
}

const handlePublishBounty = () => {
  router.push('/reward/publish')
}

const handleJoinBounty = (bountyId) => {
  router.push(`/reward/${bountyId}`)
}

const handleMyGrabOrders = () => {
  router.push('/my-grab-orders')
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
  loadBounties()
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-background pb-24">
    <ListPageHeader
      title="悬赏广场"
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />
    
    <main class="max-w-md mx-auto px-5 pt-24 space-y-8">
      <!-- Hero Section -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h1 class="font-headline font-extrabold text-4xl leading-tight text-on-surface">
            悬赏<span class="text-primary">广场</span>
          </h1>
          <button
            @click="handleMyGrabOrders"
            class="text-sm font-semibold text-primary active:scale-95 transition-transform flex items-center gap-1"
          >
            我的抢单 <span class="material-symbols-outlined text-lg">arrow_forward_ios</span>
          </button>
        </div>
        <p class="text-on-surface-variant leading-relaxed pr-8">
          寻找志同道合的游戏搭子，或是通过你的技术赚取丰厚赏金。
        </p>
        
        <!-- Category Chips -->
        <div class="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <span
            v-for="category in categories"
            :key="category"
            @click="handleCategorySelect(category)"
            :class="[
              'flex-none px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all',
              selectedCategory === category
                ? 'bg-primary-container text-on-primary-container font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            ]"
          >
            {{ category }}
          </span>
        </div>
      </section>

      <!-- Bounty List (Editorial Bento Grid) -->
      <section class="editorial-grid space-y-4">
        <!-- Large Featured Bounty Card -->
        <div
          v-for="bounty in bounties"
          :key="bounty.id"
          class="bounty-card bg-surface-container-lowest rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-3">
              <img
                :alt="bounty.publisher.name"
                class="w-12 h-12 rounded-2xl"
                :src="bounty.publisher.avatar"
              />
              <div>
                <h3 class="font-bold text-on-surface">{{ bounty.publisher.name }}</h3>
                <span class="text-[10px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md">Lv.{{ bounty.publisher.level }} {{ bounty.publisher.specialty }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-primary font-headline font-black text-xl">¥{{ bounty.reward }}<span class="text-xs font-normal">/h</span></div>
              <div class="flex items-center text-error font-medium text-[10px] justify-end gap-1">
                <span class="material-symbols-outlined text-xs">timer</span>
                <span>{{ bounty.timeLeft }}</span>
              </div>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="bg-secondary-container text-on-secondary-container px-2 py-1 rounded-lg text-xs font-bold">{{ bounty.game }}</span>
              <span class="text-on-surface font-semibold text-sm">{{ bounty.title }}</span>
            </div>
            <p class="text-on-surface-variant text-sm leading-relaxed">
              {{ bounty.content }}
            </p>
            <div v-if="bounty.tags && bounty.tags.length > 0" class="flex flex-wrap gap-2 pt-1">
              <span
                v-for="tag in bounty.tags"
                :key="tag"
                class="text-[10px] text-tertiary bg-tertiary-container/20 px-2 py-1 rounded-full"
              >
                # {{ tag }}
              </span>
            </div>
          </div>
          
          <button
            @click="handleJoinBounty(bounty.id)"
            class="w-full bg-primary-container text-on-primary-container py-4 rounded-full font-bold text-sm active:scale-95 transition-transform"
          >
            我来接单
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && !error && bounties.length === 0" class="text-center py-12">
          <div class="w-24 h-24 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-6">
            <span class="material-symbols-outlined text-on-surface-variant text-5xl">sports_esports</span>
          </div>
          <h2 class="text-xl font-bold text-on-surface mb-2">暂无悬赏订单</h2>
          <p class="text-sm text-on-surface-variant">暂无符合条件的悬赏订单</p>
        </div>
      </section>
    </main>

    <!-- Floating Action Button -->
    <button
      @click="handlePublishBounty"
      class="fixed right-6 bottom-32 w-14 h-14 bg-primary-container text-on-primary-container rounded-2xl shadow-[0_8px_30px_rgba(255,215,0,0.3)] flex items-center justify-center active:scale-90 transition-transform z-50"
    >
      <span class="material-symbols-outlined text-3xl font-bold">add</span>
    </button>
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

.editorial-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.bounty-card:nth-child(3n+1) {
  grid-column: span 2;
}
</style>
