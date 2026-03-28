<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <!-- 顶部导航栏 -->
    <header class="fixed top-0 w-full z-50 bg-[#f6f6f6] dark:bg-neutral-900 flex justify-between items-center px-6 py-4">
      <div class="flex items-center gap-4">
        <button @click="handleBack" class="active:scale-95 duration-200 hover:opacity-80 transition-opacity">
          <span class="material-symbols-outlined text-[#6c5a00] dark:text-[#FFD700] text-2xl" data-icon="arrow_back">arrow_back</span>
        </button>
        <h1 class="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#6c5a00] dark:text-[#FFD700]">Rank Details</h1>
      </div>
      <button @click="handleShare" class="active:scale-95 duration-200 hover:opacity-80 transition-opacity">
        <span class="material-symbols-outlined text-[#6c5a00] dark:text-[#FFD700] text-2xl" data-icon="share">share</span>
      </button>
    </header>

    <!-- 主内容区域 -->
    <main class="page-content pt-20 space-y-8">
      <!-- 大神荣誉墙 -->
      <section class="relative mt-4">
        <div class="flex flex-col items-center">
          <!-- 头像与荣誉光环 -->
          <div class="relative mb-6">
            <div class="absolute inset-0 bg-primary-container blur-2xl opacity-30 rounded-full scale-110"></div>
            <div class="relative w-32 h-32 rounded-full p-1.5 bg-gradient-to-tr from-primary to-primary-container">
              <img 
                :src="expertData.avatar" 
                alt="大神头像" 
                class="w-full h-full rounded-full object-cover bg-white"
                loading="lazy"
                decoding="async"
                onerror="this.src='https://via.placeholder.com/150'"
              />
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-headline font-extrabold px-4 py-1 rounded-full text-sm shadow-lg whitespace-nowrap">
              第 {{ rank }} 名
            </div>
          </div>

          <!-- 个人信息 -->
          <div class="text-center space-y-2 mb-6">
            <h2 class="text-3xl font-headline font-extrabold tracking-tight text-on-surface">{{ expertData.nickname }}</h2>
            <p class="text-on-surface-variant font-medium">全服顶尖陪玩 · 电竞战术师</p>
          </div>

          <!-- 荣誉徽章 -->
          <div class="flex gap-3">
            <div class="flex items-center gap-1.5 bg-tertiary-container/20 text-on-tertiary-container px-4 py-2 rounded-xl border border-tertiary-container/30">
              <span class="material-symbols-outlined text-lg" data-icon="workspace_premium" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
              <span class="text-sm font-bold">常胜将军</span>
            </div>
            <div class="flex items-center gap-1.5 bg-primary-container/20 text-on-primary-container px-4 py-2 rounded-xl border border-primary-container/30">
              <span class="material-symbols-outlined text-lg" data-icon="favorite" style="font-variation-settings: 'FILL' 1;">favorite</span>
              <span class="text-sm font-bold">人气王</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 本赛季表现 -->
      <section class="space-y-4">
        <h3 class="text-xl font-headline font-bold pl-1 border-l-4 border-primary-container leading-none">本赛季表现</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2 bg-surface-container-lowest rounded-3xl p-6 editorial-shadow border border-white/50">
            <div class="flex justify-between items-end">
              <div class="space-y-1">
                <span class="text-on-surface-variant text-sm font-medium">赛季累计接单</span>
                <div class="text-5xl font-headline font-black text-on-surface tracking-tighter">
                  {{ formatNumber(expertData.stats.orders) }}<span class="text-2xl text-primary">+</span>
                </div>
              </div>
              <div class="h-20 w-32 bg-primary-container/10 rounded-2xl overflow-hidden relative">
                <div class="absolute bottom-0 left-0 right-0 flex items-end justify-between px-2 gap-1 h-full">
                  <div class="w-2 bg-primary-container h-2/5 rounded-t-sm"></div>
                  <div class="w-2 bg-primary-container h-3/5 rounded-t-sm"></div>
                  <div class="w-2 bg-primary-container h-4/5 rounded-t-sm"></div>
                  <div class="w-2 bg-primary-container h-full rounded-t-sm"></div>
                  <div class="w-2 bg-primary-container h-3/4 rounded-t-sm"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-surface-container-lowest rounded-3xl p-5 editorial-shadow border border-white/50 flex flex-col justify-between aspect-square">
            <span class="text-on-surface-variant text-sm font-medium">好评率</span>
            <div>
              <div class="text-3xl font-headline font-black text-on-surface tracking-tight">99.8%</div>
              <div class="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-primary h-full w-[99.8%]"></div>
              </div>
            </div>
          </div>

          <div class="bg-surface-container-lowest rounded-3xl p-5 editorial-shadow border border-white/50 flex flex-col justify-between aspect-square">
            <span class="text-on-surface-variant text-sm font-medium">胜率</span>
            <div>
              <div class="text-3xl font-headline font-black text-on-surface tracking-tight">{{ expertData.stats.winRate }}%</div>
              <div class="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-tertiary-container h-full" :style="{ width: expertData.stats.winRate + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 最近战绩 -->
      <section class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-headline font-bold pl-1 border-l-4 border-primary-container leading-none">最近战绩</h3>
          <button class="text-xs font-bold text-primary flex items-center gap-0.5">
            查看全部 
            <span class="material-symbols-outlined text-xs" data-icon="chevron_right">chevron_right</span>
          </button>
        </div>
        <div class="bg-surface-container-lowest rounded-3xl editorial-shadow border border-white/50 overflow-hidden divide-y divide-surface-container-low">
          <div v-for="(match, index) in recentMatches" :key="index" class="flex items-center gap-3 p-4">
            <img 
              :src="match.heroAvatar" 
              :alt="match.heroName || '英雄头像'" 
              class="w-10 h-10 rounded-xl object-cover"
              onerror="this.src='https://via.placeholder.com/40'"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span 
                  :class="match.result === '胜利' ? 'font-bold text-primary' : 'font-bold text-outline'"
                >
                  {{ match.result }}
                </span>
                <span class="text-xs font-medium text-on-surface-variant">{{ match.mode }}</span>
              </div>
              <div class="text-[10px] text-outline mt-0.5 uppercase font-bold tracking-wider">{{ match.date }}</div>
            </div>
            <div class="text-right">
              <div class="font-headline font-extrabold text-on-surface">{{ match.kda }}</div>
              <div class="text-[10px] font-bold text-on-surface-variant/60 uppercase">KDA</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 粉丝贡献榜 -->
      <section class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-headline font-bold pl-1 border-l-4 border-primary-container leading-none">粉丝贡献榜</h3>
          <span class="text-xs text-on-surface-variant font-bold">TOP CONTRIBUTIONS</span>
        </div>
        <div class="bg-surface-container-lowest rounded-3xl p-2 editorial-shadow border border-white/50 overflow-hidden">
          <div v-for="(fan, index) in fansList" :key="index" class="flex items-center gap-4 p-4">
            <div class="relative">
              <img 
                :src="fan.avatar" 
                alt="粉丝头像" 
                class="w-12 h-12 rounded-full bg-surface-container"
                loading="lazy"
                decoding="async"
                onerror="this.src='https://via.placeholder.com/50'"
              />
              <div class="absolute -top-2 -right-1" :class="getRankBadgeClass(index)">
                <span class="text-[10px] font-black" :class="getRankBadgeTextColor(index)">{{ index + 1 }}</span>
              </div>
            </div>
            <div class="flex-1">
              <div class="font-bold text-on-surface">{{ fan.name }}</div>
              <div class="text-xs text-on-surface-variant">贡献 {{ formatNumber(fan.contribution) }} 火力值</div>
            </div>
            <span class="material-symbols-outlined" :class="getStarColor(index)" data-icon="stars" style="font-variation-settings: 'FILL' 1;">stars</span>
          </div>
        </div>
      </section>

      <!-- 成长心路 -->
      <section class="space-y-4">
        <h3 class="text-xl font-headline font-bold pl-1 border-l-4 border-primary-container leading-none">成长心路</h3>
        <div class="bg-primary-container/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <span class="material-symbols-outlined absolute -top-4 -left-4 text-8xl text-primary-container/20 rotate-12" data-icon="format_quote" style="font-variation-settings: 'FILL' 1;">format_quote</span>
          <p class="relative z-10 text-on-primary-container leading-relaxed font-medium text-lg italic">
            "{{ expertData.quote || '在这片数字战场上，我不仅在寻找胜利，更在寻找与伙伴们并肩战斗的炽热。每一个赛季都是全新的征程，只要心怀阳光，操作就有灵魂。带你上分，更带你快乐。' }}"
          </p>
          <div class="mt-6 flex justify-end">
            <span class="text-sm font-headline font-bold text-primary">— 赛季感言 Season V8</span>
          </div>
        </div>
      </section>
    </main>

    <BottomNavBar />

    <!-- 底部操作栏 -->
    <div class="fixed bottom-0 left-0 w-full z-50 p-6 bg-white/80 backdrop-blur-xl flex gap-4 items-center">
      <button @click="handleChat" class="flex-1 h-14 bg-surface-container-lowest border-2 border-primary-container text-primary font-bold rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <span class="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
        私信交流
      </button>
      <button @click="handleOrder" class="flex-[2] h-14 bg-primary-container text-on-primary-container font-headline font-black text-lg rounded-full shadow-lg shadow-primary-container/30 flex items-center justify-center gap-2 active:scale-95 transition-transform">
        立即下单
        <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../api/index.js'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()
const route = useRoute()

const expertId = computed(() => route.params.id)
const rank = ref(3)
const expertData = ref({
  id: '',
  nickname: '',
  avatar: '',
  stats: {
    orders: 0,
    winRate: 0,
    rating: 0
  },
  quote: ''
})
const recentMatches = ref([
  { heroAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9E9N0W8E9z4R5T6Y7U8I9O0P1A2S3D4F5G6H7J8K9L0-Z1X2C3V4B5N6M7L8K9J0H1G2F3D4S5A6Q7W8E9R0', result: '胜利', mode: '排位赛', date: '2023-11-20', kda: '12 / 2 / 8' },
  { heroAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe6F7G8H9J0K1L2M3N4P5Q6R7S8T9U0V1W2X3Y4Z5A6S7D8F9G0H1J2K3L4M5N6P7Q8R9S0T1U2V3W4X', result: '胜利', mode: '排位赛', date: '2023-11-19', kda: '8 / 0 / 15' },
  { heroAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8Q9W0E1R2T3Y4U5I6O7P8A9S0D1F2G3H4J5K6L7Z8X9C0V1B2N3M4L5K6J7H8G9F0D1S2A3Q4W5E', result: '失败', mode: '匹配赛', date: '2023-11-19', kda: '15 / 6 / 4' }
])
const fansList = ref([
  { name: '星际守护者', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM-tN3PfVEonbLe7ZMRNuzmIEg91phz23i9I-egLCkBtVfrbBO-jFRo0Np5WDFRdN0_F4kOQpUElwSx-r5bYn5hjlerVxTAyMQxGVdakegTj_a0YaVlTm1PIOo4ODsg3_ar9_TA16x_gYXTanUKa4ZUinaWJZn6xUXminjJFv3ICWRUd2ScPOS6ObuomhXPRYD-30T5L6JMwaBvwcUvoPZZ55Y7do-yuiVMZmugLlnaAcICZBo3sFe17QSTLus2fnNumkuOQsMbUw', contribution: 52100 },
  { name: '落日余晖', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2W_yqc0gXR4HVNEQsKb2ye4HPpn_yLaIZBgjyBcsPWJ8zXntSm6cQlxWEAvN5b6JO8imwcrNJaoZ5KehNzlFCvt7hKqL6vdlCiGE5YSygGpJGFXs4AG4yssjjVXsFGDrk-yQV5_lZgQyva1C85cLeh1-hErKgrPb4gv8CN2YHWXTrgrIWM2U3iEb4pljKesTsEqxgi4t_7MuL9H87Px7Mm_THuhEsTAHUnB98ykmCC1MZ-dwtAHZuGO2fIrOUK0nzb_qiDl7gSG0', contribution: 38400 },
  { name: '电竞少女阿狸', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHPYrRZJ94ZuQHUWb49lj-Nmpqt6C2kanvgQHMVxH-oqQ1oiXy37Fc5d5BwIcPeAGMECbsP72b-jtrioHJE2Y_mU11LnhIRb7e5c9ickMWYjxxPe4KURv8-b0o8lrqHNFr2U8iOzLZsBmQ6xR_8vg597pfNnXbH1Uq1xMHn7c0b02Xg_x7lbvaMsqoVqJrtfAg5tINKUEGBIfaL_Klf-Xkrbba9j5xv0qH7MmzckXQ0mPfo4jt28fFLMxeTr1kNF7SHj-DpEs4xzA', contribution: 21900 }
])

const getRankBadgeClass = (index) => {
  if (index === 0) return 'bg-[#FFD700] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm'
  if (index === 1) return 'bg-surface-container-highest w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm'
  return 'bg-[#CD7F32]/20 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm'
}

const getRankBadgeTextColor = (index) => {
  if (index === 0) return 'text-primary'
  if (index === 1) return 'text-on-surface-variant'
  return 'text-[#8c4a00]'
}

const getStarColor = (index) => {
  if (index === 0) return 'text-tertiary-container'
  if (index === 1) return 'text-outline-variant'
  return 'text-secondary-container'
}

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

const handleShare = () => {
  console.log('分享功能')
}

const handleChat = () => {
  console.log('私信功能')
}

const handleOrder = () => {
  console.log('下单功能')
}

const loadExpertData = async () => {
  try {
    const response = await api.fetchLeaderboard({
      period: 'weekly',
      page: 1,
      pageSize: 20
    })
    
    if (response.success || (response.code === 0)) {
      const data = response.data?.data || response.data || []
      const player = data.find(p => p.id == expertId.value)
      
      if (player) {
        expertData.value = {
          id: player.id,
          nickname: player.nickname,
          avatar: player.avatar,
          stats: {
            orders: 1200,
            winRate: 85,
            rating: player.rating || 4.9
          },
          quote: player.quote || '在这片数字战场上，我不仅在寻找胜利，更在寻找与伙伴们并肩战斗的炽热。每一个赛季都是全新的征程，只要心怀阳光，操作就有灵魂。带你上分，更带你快乐。'
        }
        rank.value = player.rank || 3
      }
    }
  } catch (error) {
    console.error('加载大神数据失败:', error)
  }
}

onMounted(() => {
  loadExpertData()
})
</script>

<style scoped>
.editorial-shadow {
  box-shadow: 0 20px 40px -15px rgba(108, 90, 0, 0.08);
}
</style>
