<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <!-- 广告通栏 -->
    <div class="relative w-full h-12 bg-gradient-to-r from-primary to-primary-dark overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform" @click="goToRewardOrders">
      <div class="absolute inset-0 flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-white text-[10px] font-bold">flash_on</span>
        <span class="text-white text-[10px] font-bold tracking-wider">抢悬赏单</span>
        <span class="material-symbols-outlined text-white text-[10px] font-bold">arrow_forward_ios</span>
      </div>
    </div>
    
    <!-- TopAppBar -->
    <header class="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm shadow-yellow-500/5 flex justify-between items-center px-6 py-4 w-full">
      <div class="flex items-center gap-4">
        <span class="material-symbols-outlined text-yellow-600 dark:text-yellow-400 active:scale-95 duration-200 ease-out cursor-pointer" data-icon="menu">menu</span>
        <h1 class="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-yellow-600 dark:text-yellow-400">发现大神</h1>
      </div>
      <div class="flex items-center gap-4">
        <span
          class="material-symbols-outlined text-zinc-500 relative cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
          data-icon="notifications"
          @click="goToNotifications"
        >
          notifications
          <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-primary text-on-primary rounded-full flex items-center justify-center text-[8px] font-bold">
            {{ unreadCount }}
          </span>
        </span>
        <span class="material-symbols-outlined text-zinc-500" data-icon="search">search</span>
        <div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden">
          <img alt="User Avatar" class="w-full h-full object-cover" data-alt="User profile avatar circle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoBTc_5bZuXQ8l_u2UKFazkITvVt5UY-tB83GE9qFMKnbb7Gz7DBuHH11MCcfExFpNociu2AurEP9Lt2NRc9nvSntdZ9hgcWNL_d-0yyyC7bLbO0F8qFUi1FZ_0xgHBG5ZWEfyBs3f5BMl_rBN4SHJoDd3xp76P8kx7eQBwXzcI46GuMySscFwGrnXs_YK9_ArHQEUVcsZUe0o_yRl84Nf4j3WwXor_Xd2gFFDgNuPdbSQuyQiPQkAovGTm7Cek_vM2ZGapACwBM4"/>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 bg-zinc-100 dark:bg-zinc-800 h-[1px] w-full self-end opacity-20"></div>
    </header>
    
    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-8">
    <!-- Hero Banner: Honor of Kings Tournament -->
    <section class="relative w-full h-48 rounded-[2rem] overflow-hidden group shadow-xl shadow-primary/10 bg-black">
      <img alt="Honor of Kings Tournament" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60" data-alt="Epic cinematic background of a competitive gaming arena" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChoKqMjV8Zopn6t52b1X_D1IHpomYuX0uMCtUOdsEjdUbzmVSeBr-5ZKxEhOUlx1mPSxANNKH4sghnW_76nSPFe5RQDcs0D0146L6oIlgGmuRs6DcX59vrx67krFal1DduP8vpSj5o2giMgdNHYP2pIzqcKEuJfnSxyvoN_fgqJahQCNwzPm37cGoeZUvBWw_zifeh-pvUxLyRR7_8puuGkKr-5w05-1orNhrAYXS-S8PDY6s1vdzatJ05jaJSvNTo7dS88EwkP2M"/>
      <div class="absolute inset-0 flex flex-col justify-center p-6 space-y-2">
        <span class="inline-flex items-center px-3 py-1 bg-surface-container-lowest/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest w-fit mb-2">
          TOURNAMENT LIVE
        </span>
        <h2 class="text-3xl font-headline font-extrabold text-white leading-tight tracking-tighter mb-4">王者荣耀<br/>巅峰挑战赛</h2>
        <div class="flex items-center gap-4">
          <button class="bg-white text-primary px-8 py-2.5 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all">
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
      class="transition-all duration-1000 transform opacity-100 translate-y-0"
    >
      <section class="space-y-4">
        <div class="flex justify-between items-end">
          <h3 class="text-xl font-headline font-bold text-on-surface tracking-tight">热门游戏</h3>
          <span class="text-xs font-semibold text-primary underline decoration-2 underline-offset-4">查看全部</span>
        </div>
        <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <div 
            v-for="game in games" 
            :key="game.id"
            class="flex-shrink-0 w-28 h-36 bg-surface-container-lowest rounded-3xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            @click="navigateToDiscoverWithGame(game.id)"
          >
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center">
              <img 
                v-if="game.image" 
                :src="game.image" 
                :alt="game.name" 
                class="w-full h-full object-contain"
              />
              <span 
                v-else
                class="material-symbols-outlined text-3xl"
                :class="{
                  'bg-yellow-400 text-yellow-800': game.id === 'lol',
                  'bg-orange-200 text-orange-600': game.id === 'valorant',
                  'bg-orange-400 text-white': game.id === 'honor_of_kings',
                  'bg-gray-200 text-gray-600': true
                }"
              >
                {{ game.icon || 'videogame_asset' }}
              </span>
            </div>
            <span class="font-bold text-sm">{{ game.name }}</span>
          </div>
        </div>
      </section>
    </div>
    
    <!-- Top Playmates (Bento Style Grid) -->
    <section 
      ref="playmatesRef" 
      class="space-y-4 transition-all duration-1000 transform"
      :class="{ 'opacity-100 translate-y-0': playmatesVisible, 'opacity-0 translate-y-10': !playmatesVisible }"
    >
      <div class="flex items-center gap-2">
        <h3 class="text-xl font-headline font-bold text-on-surface tracking-tight">优秀陪玩</h3>
        <div class="px-3 py-1 bg-gray-200 rounded text-[10px] font-bold text-gray-700 tracking-widest uppercase">Editor's Choice</div>
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
        <template v-for="(playmate, index) in playmates.slice(0, 2)" :key="playmate.id">
          <div class="bg-surface-container-lowest rounded-[2rem] p-4 space-y-4 shadow-sm relative overflow-hidden flex flex-col">
            <div class="absolute top-3 left-3">
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-yellow-500 text-[10px]" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
                <span class="text-[10px] font-bold">{{ playmate.rating || 5.0 }}</span>
              </div>
            </div>
            <div class="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container">
              <img 
                :src="playmate.avatar || 'https://randomuser.me/api/portraits/women/44.jpg'" 
                :alt="playmate.nickname" 
                class="w-full h-full object-cover"
              />
            </div>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="(tag, tagIndex) in (playmate.tags || ['王者', '萌妹'])" 
                  :key="tagIndex"
                  class="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[9px] font-bold rounded-lg"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-sm">{{ playmate.nickname || playmate.name || `陪玩${index + 1}` }}</span>
                <span class="text-primary text-xs font-black">¥{{ playmate.price || 45 }}/hr</span>
              </div>
            </div>
          </div>
        </template>
        <!-- Featured Playmate Cards -->
        <div 
          v-for="playmate in playmates.slice(2)" 
          :key="playmate.id"
          class="col-span-2 bg-surface-container-lowest rounded-[2rem] p-5 shadow-sm flex items-center gap-5 relative overflow-hidden group"
        >
          <div class="w-24 h-24 rounded-2xl overflow-hidden bg-surface-container flex-shrink-0">
            <img 
              :src="playmate.avatar || 'https://randomuser.me/api/portraits/women/68.jpg'" 
              :alt="playmate.nickname" 
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-grow space-y-2">
            <div class="flex justify-between items-start">
              <div class="flex flex-col">
                <span class="font-bold text-lg">{{ playmate.nickname || playmate.name || '安妮喵呜' }}</span>
                <span class="text-[10px] text-zinc-500 font-medium">累计陪玩 1,200+ 小时</span>
              </div>
              <span class="text-primary text-lg font-black">¥{{ playmate.price || 55 }}/hr</span>
            </div>
            <div class="flex gap-2">
              <span 
                v-for="(tag, tagIndex) in (playmate.tags || ['温柔语聊', '绝地求生'])" 
                :key="tagIndex"
                class="px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Community Hot Posts -->
    <section 
      ref="communityRef" 
      class="space-y-4 transition-all duration-1000 transform"
      :class="{ 'opacity-100 translate-y-0': communityVisible, 'opacity-0 translate-y-10': !communityVisible }"
    >
      <div class="flex justify-between items-end">
        <h3 class="text-xl font-headline font-bold text-on-surface tracking-tight">社区热帖</h3>
        <span class="text-xs font-semibold text-primary underline decoration-2 underline-offset-4">查看全部</span>
      </div>
      <div v-if="loading.community" class="flex justify-center py-8">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="error.community" class="text-center py-8 text-red-500">
        {{ error.community }}
        <button @click="loadCommunityPosts" class="mt-2 text-primary underline hover:text-primary/80 transition-colors">重试</button>
      </div>
      <div v-else class="space-y-4">
        <div 
          v-for="post in communityPosts" 
          :key="post.id"
          class="bg-surface-container-lowest rounded-[2rem] p-5 shadow-sm"
        >
          <div class="flex items-center gap-3 mb-3">
            <img 
              :src="post.user.avatar" 
              :alt="post.user.name" 
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-grow">
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm">{{ post.user.name }}</span>
                <span class="text-[10px] text-zinc-500">{{ post.user.game }}</span>
              </div>
              <span class="text-[10px] text-zinc-400">{{ post.time }}</span>
            </div>
          </div>
          <p class="text-sm mb-3 line-clamp-2">{{ post.content }}</p>
          <div v-if="post.images && post.images.length > 0" class="grid grid-cols-3 gap-2 mb-3">
            <img 
              v-for="(image, index) in post.images" 
              :key="index"
              :src="image" 
              :alt="`Post image ${index + 1}`" 
              class="w-full aspect-square rounded-xl object-cover"
            />
          </div>
          <div class="flex items-center gap-4 text-[10px] text-zinc-500">
            <div class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">favorite</span>
              <span>{{ post.likes }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">comment</span>
              <span>{{ post.comments }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Reward Orders -->
    <section 
      ref="rewardOrdersRef" 
      class="space-y-4 transition-all duration-1000 transform"
      :class="{ 'opacity-100 translate-y-0': rewardOrdersVisible, 'opacity-0 translate-y-10': !rewardOrdersVisible }"
    >
      <div class="flex justify-between items-end">
        <h3 class="text-xl font-headline font-bold text-on-surface tracking-tight">悬赏订单</h3>
        <span class="text-xs font-semibold text-primary underline decoration-2 underline-offset-4">查看全部</span>
      </div>
      <div v-if="loading.rewardOrders" class="flex justify-center py-8">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="error.rewardOrders" class="text-center py-8 text-red-500">
        {{ error.rewardOrders }}
        <button @click="loadRewardOrders" class="mt-2 text-primary underline hover:text-primary/80 transition-colors">重试</button>
      </div>
      <div v-else class="space-y-4">
        <div 
          v-for="order in rewardOrders" 
          :key="order.id"
          class="bg-surface-container-lowest rounded-[2rem] p-5 shadow-sm"
        >
          <div class="flex items-center gap-3 mb-3">
            <img 
              :src="order.userAvatar" 
              :alt="order.userName" 
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-grow">
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm">{{ order.userName }}</span>
                <span class="text-[10px] text-zinc-500">{{ order.game }}</span>
              </div>
              <span class="text-[10px] text-zinc-400">{{ order.createdAt }}</span>
            </div>
            <span class="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold">¥{{ order.reward }}</span>
          </div>
          <p class="text-sm mb-3 line-clamp-2">{{ order.content }}</p>
          <div v-if="order.tags && order.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
            <span 
              v-for="(tag, index) in order.tags" 
              :key="index"
              class="px-2 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-bold rounded-lg"
            >
              {{ tag }}
            </span>
          </div>
          <button class="w-full bg-primary text-white py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors">
            立即接单
          </button>
        </div>
      </div>
    </section>
    </main>
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavBar from '../components/BottomNavBar.vue'
import { api } from '../services/api.js'
import { useScrollAnimation } from '../composables/useScrollAnimation.js'
import { notificationApi } from '../api/index.js'

const router = useRouter()

const goToNotifications = () => {
  router.push('/notifications')
}

const unreadCount = ref(0)

const loadUnreadCount = async () => {
  try {
    const response = await notificationApi.getUnreadCount()
    if (response.success || response.code === 0) {
      unreadCount.value = response.data?.unreadCount || response.data || 0
    }
  } catch (err) {
    console.error('获取未读通知失败:', err)
  }
}

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
const communityPosts = ref([])
const rewardOrders = ref([])
const loading = ref({ games: false, playmates: false, community: false, rewardOrders: false })
const error = ref({ games: '', playmates: '', community: '', rewardOrders: '' })

// 滚动动画
const gamesRef = ref(null)
const playmatesRef = ref(null)
const communityRef = ref(null)
const rewardOrdersRef = ref(null)
const { isVisible: gamesVisible, observeElement: observeGames } = useScrollAnimation()
const { isVisible: playmatesVisible, observeElement: observePlaymates } = useScrollAnimation()
const { isVisible: communityVisible, observeElement: observeCommunity } = useScrollAnimation()
const { isVisible: rewardOrdersVisible, observeElement: observeRewardOrders } = useScrollAnimation()

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
  
  const response = await api.getPlaymates({page:1,pageSize:5})
  console.info('response', response)
  if (response.success === true) {
    // 处理数据格式，确保正确解析data.data和data.pagination
    const playmateData = response.data || []
    playmates.value = playmateData.map(playmate => ({
      ...playmate,
      tags: playmate.tags ? playmate.tags.split(',') : [],
    }))
  } else {
    error.value.playmates = response.error || '加载陪玩数据失败'
  }
    
  loading.value.playmates = false
}
// 时间格式化函数
const formatTime = (dateString) => {
  if (!dateString) return '未知时间'
  const now = new Date()
  const date = new Date(dateString)
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}
// 加载社区热帖
const loadCommunityPosts = async () => {
  loading.value.community = true
  error.value.community = ''
  
  const communityResponse = await api.getCommunityPosts({page:1,pagaSize:5})
  if (communityResponse.success) {
      const rawPosts = communityResponse.data?.data || communityResponse.data || []
      communityPosts.value = rawPosts.map(post => {
        let imagesArray = []
        if (post.images) {
          if (Array.isArray(post.images)) {
            imagesArray = post.images
          } else {
            imagesArray = post.images.split(',')
          }
        }
        return {
          ...post,
          user: post.user || {
            id: post.userId || post.user_id || '1',
            name: post.user?.name || `用户${post.userId || post.user_id || '1'}`,
            avatar: post.user?.avatar || `https://randomuser.me/api/portraits/${(post.userId || post.user_id || 1) % 2 === 0 ? 'women' : 'men'}/${(post.userId || post.user_id || 1) % 70 + 1}.jpg`,
            game: post.user?.game || post.game || '未知游戏'
          },
          time: post.time || formatTime(post.createdAt),
          isLiked: post.isLiked || false,
          isFollowing: post.isFollowing || false,
          images: imagesArray
        }
      })

  } else {
    error.value.community = communityResponse.error || '加载社区热帖失败'
  }
  
  loading.value.community = false
}

// 加载悬赏订单
const loadRewardOrders = async () => {
  loading.value.rewardOrders = true
  error.value.rewardOrders = ''
  
  const rewardOrdersResponse = await api.getRewardOrders()
  
  if (rewardOrdersResponse.success) {
    rewardOrders.value = rewardOrdersResponse.data
  } else {
    error.value.rewardOrders = rewardOrdersResponse.error || '加载悬赏订单失败'
  }
  
  loading.value.rewardOrders = false
}

// 组件挂载时加载数据和观察元素
onMounted(() => {
  loadGames()
  loadPlaymates()
  loadCommunityPosts()
  loadRewardOrders()
  loadUnreadCount()
  
  // 观察元素进入视口
  setTimeout(() => {
    if (gamesRef.value) {
      observeGames(gamesRef.value)
    }
    if (playmatesRef.value) {
      observePlaymates(playmatesRef.value)
    }
    if (communityRef.value) {
      observeCommunity(communityRef.value)
    }
    if (rewardOrdersRef.value) {
      observeRewardOrders(rewardOrdersRef.value)
    }
  }, 100)
})
</script>

<style scoped>
/* 组件样式 */
</style>
