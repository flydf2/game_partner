<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import api from '../api/index.js'

const router = useRouter()

const bounties = ref([])
const categories = ref(['全部悬赏', '王者荣耀', '英雄联盟', '和平精英', '金铲铲之战', '无畏契约', '反恐精英2'])
const selectedCategory = ref('全部悬赏')
const loading = ref(true)
const error = ref(null)


// 解析 tags 字段（支持 JSON 字符串数组或逗号分隔字符串）
const parseTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') {
    // 尝试解析 JSON 数组字符串
    try {
      const parsed = JSON.parse(tags)
      if (Array.isArray(parsed)) return parsed
    } catch (e) {
      // 不是 JSON，按逗号分隔处理
    }
    // 按逗号分隔
    return tags.split(',').map(tag => tag.trim()).filter(Boolean)
  }
  return []
}

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
            id: bounty.id || bounty.orderId || bounty.ID,
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
            timeLeft: bounty.timeLeft || bounty.deadline || '24:59',
            gameRank: bounty.gameRank || '',
            startTime: bounty.startTime || '',
            duration: bounty.duration || 0,
            location: bounty.location || '',
            tags: parseTags(bounty.tags),
            requirements: parseTags(bounty.requirements),
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
  if (!bountyId) {
    console.error('悬赏单ID无效')
    return
  }
  router.push(`/reward/${bountyId}`)
}

const handleMyGrabOrders = () => {
  router.push('/my-grab-orders')
}

const handleMyPublished = () => {
  router.push('/profile/my-published')
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

// 段位标签映射
const rankMap = {
  bronze: '青铜',
  silver: '白银',
  gold: '黄金',
  platinum: '铂金',
  diamond: '钻石',
  master: '大师',
  grandmaster: '宗师',
  challenger: '王者'
}

// 获取段位标签
const getRankLabel = (rank) => {
  return rankMap[rank] || rank
}

// 格式化时间
const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadBounties()
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-background pb-24">
    <AppHeader
      title="悬赏广场"
      is-primary-page
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />
    
    <main class="page-content pt-20 sm:pt-24 space-y-6 sm:space-y-8">
      <!-- Hero Section -->
      <section class="space-y-3 sm:space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 class="font-headline font-extrabold text-2xl sm:text-4xl leading-tight text-on-surface">
            悬赏<span class="text-primary">广场</span>
          </h1>
          <div class="flex items-center gap-2 sm:gap-4">
            <button
              @click="handleMyPublished"
              class="text-xs sm:text-sm font-semibold text-primary active:scale-95 transition-transform flex items-center gap-1"
            >
              我的发布 <span class="material-symbols-outlined text-base sm:text-lg">arrow_forward_ios</span>
            </button>
            <button
              @click="handleMyGrabOrders"
              class="text-xs sm:text-sm font-semibold text-primary active:scale-95 transition-transform flex items-center gap-1"
            >
              我的抢单 <span class="material-symbols-outlined text-base sm:text-lg">arrow_forward_ios</span>
            </button>
          </div>
        </div>
        <p class="text-on-surface-variant text-sm sm:text-base leading-relaxed pr-4 sm:pr-8">
          寻找志同道合的游戏搭子，或是通过你的技术赚取丰厚赏金。
        </p>
        
        <!-- Category Chips -->
        <div class="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <span
            v-for="category in categories"
            :key="category"
            @click="handleCategorySelect(category)"
            :class="[
              'flex-none px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap transition-all',
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
      <section class="editorial-grid space-y-3 sm:space-y-4">
        <!-- Large Featured Bounty Card -->
        <div
          v-for="bounty in bounties"
          :key="bounty.id"
          class="bounty-card bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-sm space-y-3 sm:space-y-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-start gap-2">
            <div class="flex items-center gap-2 sm:gap-3 min-w-0">
              <img
                :alt="bounty.publisher.name"
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex-shrink-0"
                :src="bounty.publisher.avatar"
              />
              <div class="min-w-0">
                <h3 class="font-bold text-on-surface text-sm sm:text-base truncate">{{ bounty.publisher.name }}</h3>
                <span class="text-[9px] sm:text-[10px] text-on-surface-variant bg-surface-container-high px-1.5 sm:px-2 py-0.5 rounded-md">Lv.{{ bounty.publisher.level }} {{ bounty.publisher.specialty }}</span>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-primary font-headline font-black text-lg sm:text-xl">¥{{ bounty.reward }}<span class="text-[10px] sm:text-xs font-normal">/h</span></div>
              <div class="flex items-center text-error font-medium text-[9px] sm:text-[10px] justify-end gap-1">
                <span class="material-symbols-outlined text-[10px] sm:text-xs">timer</span>
                <span>{{ bounty.timeLeft }}</span>
              </div>
            </div>
          </div>
          
          <div class="space-y-1.5 sm:space-y-2">
            <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span class="bg-secondary-container text-on-secondary-container px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold">{{ bounty.game }}</span>
              <span v-if="bounty.gameRank" class="bg-primary-container/10 text-primary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold">{{ getRankLabel(bounty.gameRank) }}</span>
              <span class="text-on-surface font-semibold text-xs sm:text-sm">{{ bounty.title }}</span>
            </div>
            <p class="text-on-surface-variant text-xs sm:text-sm leading-relaxed line-clamp-2">
              {{ bounty.content }}
            </p>
            <div class="flex flex-wrap gap-1.5 sm:gap-2 pt-1 text-[10px] sm:text-xs text-on-surface-variant">
              <div v-if="bounty.startTime" class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[10px] sm:text-xs">schedule</span>
                <span>{{ formatTime(bounty.startTime) }}</span>
              </div>
              <div v-if="bounty.duration" class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[10px] sm:text-xs">access_time</span>
                <span>{{ bounty.duration }}小时</span>
              </div>
              <div v-if="bounty.location" class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[10px] sm:text-xs">location_on</span>
                <span>{{ bounty.location }}</span>
              </div>
            </div>
            <div v-if="bounty.tags && bounty.tags.length > 0" class="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              <span
                v-for="tag in bounty.tags"
                :key="tag"
                class="text-[9px] sm:text-[10px] text-tertiary bg-tertiary-container/20 px-1.5 sm:px-2 py-0.5 rounded-full"
              >
                # {{ tag }}
              </span>
            </div>
          </div>
          
          <button
            @click="handleJoinBounty(bounty.id)"
            class="w-full bg-primary-container text-on-primary-container py-2.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm active:scale-95 transition-transform"
          >
            我来接单
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && !error && bounties.length === 0" class="text-center py-8 sm:py-12">
          <div class="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <span class="material-symbols-outlined text-on-surface-variant text-3xl sm:text-5xl">sports_esports</span>
          </div>
          <h2 class="text-base sm:text-xl font-bold text-on-surface mb-1 sm:mb-2">暂无悬赏订单</h2>
          <p class="text-xs sm:text-sm text-on-surface-variant">暂无符合条件的悬赏订单</p>
        </div>
      </section>
    </main>

    <!-- Floating Action Button -->
    <button
      @click="handlePublishBounty"
      class="fixed right-4 sm:right-6 bottom-28 sm:bottom-32 w-12 h-12 sm:w-14 sm:h-14 bg-primary-container text-on-primary-container rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(255,215,0,0.3)] flex items-center justify-center active:scale-90 transition-transform z-50"
    >
      <span class="material-symbols-outlined text-2xl sm:text-3xl font-bold">add</span>
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
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .editorial-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  .bounty-card:nth-child(3n+1) {
    grid-column: span 2;
  }
}
</style>
