<template>
  <div class="min-h-screen bg-surface">
    <!-- 顶部导航栏 -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm shadow-yellow-500/5 flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-4">
        <button @click="handleBack" class="flex items-center active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-2xl text-zinc-900">arrow_back</span>
        </button>
        <h1 class="font-headline font-bold text-lg tracking-tight text-zinc-900">大神主页</h1>
      </div>
      <div class="flex items-center gap-4">
        <button @click="handleShare" class="flex items-center justify-center active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-2xl text-zinc-900">share</span>
        </button>
        <button @click="handleMore" class="flex items-center justify-center active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-2xl text-zinc-900">more_horiz</span>
        </button>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="pt-16 pb-24">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen">
        <!-- 骨架屏 -->
        <div class="container mx-auto px-4 -mt-20">
          <div class="bg-surface_container_lowest rounded-xl p-6 shadow-sm mb-6">
            <div class="flex items-start">
              <!-- 头像骨架 -->
              <div class="relative mr-4">
                <div class="w-24 h-24 rounded-full bg-surface_container_low animate-pulse"></div>
              </div>
              <!-- 个人信息骨架 -->
              <div class="flex-1">
                <div class="flex items-center justify-between mb-3">
                  <div class="h-6 w-32 bg-surface_container_low rounded animate-pulse"></div>
                  <div class="flex space-x-2">
                    <div class="h-8 w-16 bg-surface_container_low rounded-full animate-pulse"></div>
                    <div class="h-8 w-16 bg-surface_container_low rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div class="h-4 w-48 bg-surface_container_low rounded animate-pulse mb-2"></div>
                <div class="h-4 w-64 bg-surface_container_low rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <!-- 统计数据骨架 -->
          <div class="bg-surface_container_lowest rounded-xl p-6 shadow-sm mb-6">
            <div class="grid grid-cols-3 gap-4">
              <div v-for="i in 3" :key="i" class="text-center">
                <div class="h-8 w-16 mx-auto bg-surface_container_low rounded animate-pulse mb-2"></div>
                <div class="h-4 w-12 mx-auto bg-surface_container_low rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <!-- 技能骨架 -->
          <div class="bg-surface_container_lowest rounded-xl p-6 shadow-sm mb-6">
            <div class="h-6 w-24 bg-surface_container_low rounded animate-pulse mb-4"></div>
            <div class="grid grid-cols-1 gap-4">
              <div v-for="i in 2" :key="i" class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-surface_container_low rounded-lg mr-4 animate-pulse"></div>
                  <div>
                    <div class="h-4 w-32 bg-surface_container_low rounded animate-pulse mb-2"></div>
                    <div class="h-4 w-48 bg-surface_container_low rounded animate-pulse"></div>
                  </div>
                </div>
                <div class="h-6 w-16 bg-surface_container_low rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-on_surface_variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-body-md text-on_surface_variant mb-4">{{ error }}</p>
          <button @click="loadExpertData" class="bg-primary_container text-on_primary_container px-6 py-2 rounded-full font-medium active:scale-95 transition-all">
            重新加载
          </button>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="!expertData.id" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-on_surface_variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-body-md text-on_surface_variant mb-4">暂无大神信息</p>
          <button @click="router.back()" class="bg-primary_container text-on_primary_container px-6 py-2 rounded-full font-medium active:scale-95 transition-all">
            返回上一页
          </button>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div v-else>
      <!-- Hero区域 -->
      <section class="relative">
        <div class="w-full h-[420px] overflow-hidden">
          <img 
            :src="expertData.banner || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPO2DBKN-H1FWbrWcSWYg-WhIjfHuLM-OJyMiqMrMFOsWn8BSSp5nBOOC--KLp9rQeVdNW6eMEJjtq53AovIveTZfTKFJEG3zYoO6Y6ozLSWhKRHEkF0P2L4XivO0NEHnHXc9H6HFUpN3mTEk_vWgVIUiM9WlY0B1k2jn7DAoQnwPPclXc7hu_ihkd5P542CxbXOt0_CRaInMHufM4tUl6tec8WLrmxejkSJ0mipN0vxZHL8vlBHzsNRTfTmhUUrK5R07MSyUyDko'" 
            alt="Hero Banner" 
            class="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/20"></div>
        </div>
        <!-- 个人信息区域 -->
        <div class="relative px-5 -mt-24 z-10">
          <!-- 个人信息卡片 -->
          <div class="bg-surface-container-lowest rounded-[2rem] p-6 shadow-xl shadow-black/5">
            <div class="flex justify-between items-start">
              <div class="relative">
                <img 
                  :src="expertData.avatar" 
                  :alt="expertData.name" 
                  class="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg"
                  loading="lazy"
                  decoding="async"
                  onerror="this.src='https://via.placeholder.com/150'"
                />
                <div class="absolute -bottom-2 -right-2 bg-primary-container text-on-primary-container p-1 rounded-xl shadow-sm">
                  <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">verified</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="handleFollow" class="bg-surface-container-low text-zinc-600 px-5 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-all">
                  {{ isFollowing ? '已关注' : '关注' }}
                </button>
                <button @click="handleChat" class="bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-all">
                  私聊
                </button>
                <button @click="handleShare" class="w-10 h-10 bg-surface-container-low text-zinc-600 rounded-full flex items-center justify-center active:scale-95 transition-all">
                  <span class="material-symbols-outlined text-[20px]">share</span>
                </button>
                <button @click="handleMore" class="w-10 h-10 bg-surface-container-low text-zinc-600 rounded-full flex items-center justify-center active:scale-95 transition-all">
                  <span class="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
              </div>
            </div>
            <div class="mt-6">
              <div class="flex items-center gap-2">
                <h2 class="text-2xl font-headline font-black tracking-tight text-on-surface">{{ expertData.name }}</h2>
                <span class="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-md text-[10px] font-bold">V{{ expertData.level }}</span>
              </div>
              <p class="text-on-surface-variant text-sm mt-1">"{{ expertData.description || '性格超好，不压力。' }}"</p>
            </div>
          </div>
          
          <!-- 统计数据 Bento -->
          <div class="grid grid-cols-3 gap-3 mt-8">
            <div class="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center justify-center">
              <span class="text-xl font-headline font-black text-on-surface">{{ expertData.stats.winRate }}%</span>
              <span class="text-[11px] text-zinc-500 font-medium">胜率</span>
            </div>
            <div class="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center justify-center">
              <span class="text-xl font-headline font-black text-on-surface">{{ expertData.stats.followers.toLocaleString() }}</span>
              <span class="text-[11px] text-zinc-500 font-medium">粉丝</span>
            </div>
            <div class="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center justify-center">
              <span class="text-xl font-headline font-black text-on-surface">{{ expertData.stats.rating }}</span>
              <span class="text-[11px] text-zinc-500 font-medium">评分</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 技能专区 -->
      <section class="px-5 mt-8">
        <h3 class="font-headline font-extrabold text-xl mb-4 flex items-center gap-2">
          技能专区 <span class="text-primary-dim text-sm font-normal">Expertise</span>
        </h3>
        <div class="space-y-4">
          <div 
            v-for="skill in expertData.skills" 
            :key="skill.id" 
            @click="selectSkill(skill)"
            :class="['bg-surface-container-lowest p-5 rounded-[1.5rem] shadow-sm flex items-center justify-between border-l-4 transition-all cursor-pointer', selectedSkill?.id === skill.id ? 'border-primary ring-2 ring-primary_container' : 'border-zinc-100']"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center">
                <img 
                  :src="skill.icon || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFRn9sKdbZUjI2cK_RArJlKQsKs4hHmE9vmu-5KXEK5Pn1hKzN7p2Yx_AIE1LmQRt6LjBMAsYB6fJydPFzVwk7h0Gv_LQHVIp7p0qED1Yl0jMMoO_l6gwRl8BduskFcZpKPJJP1zM7V31rJ7YWmT9bmeoanaOnFkgar_4hScagabz7escAfpMwD3hh5FuN0Z0moKWW6xmHRCyu6YYtFOyOn1in3xoW2j2Uo-tyHZ9mSRn0fb0br_nZ8mIXlvlDml16jk6L9UtLNuU'" 
                  class="w-10 h-10 rounded-lg object-cover"
                  alt="技能图标"
                />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-zinc-900">{{ skill.name }}</span>
                  <span class="bg-tertiary-container text-on-tertiary-container text-[10px] px-1.5 py-0.5 rounded-md font-bold">{{ skill.level }}</span>
                </div>
                <p class="text-xs text-zinc-500 mt-1">{{ skill.description }}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-primary font-black text-lg">¥{{ skill.price }}</span>
              <span class="text-zinc-400 text-[10px] block">/小时</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 语音介绍 -->
      <section class="px-5 mt-6">
        <div class="bg-primary-container rounded-[1.5rem] p-4 flex items-center gap-4 relative overflow-hidden">
          <div class="absolute right-0 top-0 opacity-10">
            <span class="material-symbols-outlined text-[120px]" data-icon="graphic_eq" style="font-variation-settings: 'FILL' 0;">graphic_eq</span>
          </div>
          <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-primary" data-icon="play_arrow" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-on-primary-container text-sm">语音介绍</span>
              <span class="text-xs text-on-primary-container/60 font-medium">15"</span>
            </div>
            <!-- Visualizer mock -->
            <div class="flex items-end gap-1 h-4 mt-1">
              <div v-for="i in 9" :key="i" class="w-1 h-3 bg-on-primary-container/40 rounded-full transition-all" :style="{ height: isPlaying ? `${Math.random() * 12 + 8}px` : '8px' }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 用户评价 -->
      <section class="px-5 mt-10">
        <div class="flex justify-between items-end mb-6">
          <h3 class="font-headline font-extrabold text-xl">用户评价 <span class="text-zinc-400 text-sm font-normal ml-1">{{ reviewsTotalCount }}</span></h3>
          <span class="text-primary font-bold text-sm" v-if="reviews.length > 0" @click="handleShowAllReviews">查看全部</span>
        </div>
        <div class="space-y-6">
          <div v-for="review in (showAllReviews ? reviews : reviews.slice(0, 2))" :key="review.id" class="bg-surface-container-lowest p-5 rounded-[2rem] shadow-sm">
            <div class="flex justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
                  <span class="material-symbols-outlined text-zinc-500" data-icon="person">person</span>
                </div>
                <div>
                  <span class="font-bold text-sm block text-zinc-900">用户{{ review.userId }}</span>
                  <div class="flex gap-0.5">
                    <span class="material-symbols-outlined text-[12px] text-yellow-500" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="material-symbols-outlined text-[12px] text-yellow-500" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="material-symbols-outlined text-[12px] text-yellow-500" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="material-symbols-outlined text-[12px] text-yellow-500" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="material-symbols-outlined text-[12px] text-yellow-500" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
                  </div>
                </div>
              </div>
              <span class="text-zinc-400 text-[10px]">{{ review.createdAt }}</span>
            </div>
            <p class="mt-4 text-zinc-600 text-sm leading-relaxed">{{ review.content }}</p>
            <div class="mt-4 flex gap-2" v-if="review.images && review.images.length > 0">
              <img 
                v-for="(image, index) in review.images" 
                :key="index" 
                :src="image" 
                class="w-20 h-20 rounded-xl object-cover cursor-pointer active:scale-95 transition-all"
                alt="评价图片"
                loading="lazy"
                decoding="async"
                onerror="this.src='https://via.placeholder.com/80'"
              />
            </div>
          </div>
        </div>
        <div v-if="showAllReviews && reviewsPage < reviewsTotalPages" class="mt-4 text-center">
          <button 
            @click="loadMoreReviews" 
            :disabled="reviewsLoading"
            class="bg-surface-container-low text-primary px-6 py-2 rounded-full font-medium active:scale-95 transition-all"
          >
            {{ reviewsLoading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </section>
      </div>
    </main>

    <!-- 固定底部下单栏 -->
    <footer class="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-2xl z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-6 pt-5 pb-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="flex flex-col items-center gap-1 active:scale-90 transition-transform cursor-pointer" @click="handleFavorite">
            <span class="material-symbols-outlined" :class="isFavorite ? 'text-primary' : 'text-zinc-600'" data-icon="favorite">favorite</span>
            <span class="text-[10px] font-bold text-zinc-500">收藏</span>
          </div>
          <div class="flex flex-col items-center gap-1 active:scale-90 transition-transform cursor-pointer" @click="handleMessage">
            <span class="material-symbols-outlined text-zinc-600" data-icon="mail">mail</span>
            <span class="text-[10px] font-bold text-zinc-500">留言</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <div class="flex items-baseline gap-0.5 justify-end">
              <span class="text-xs font-bold text-primary">¥</span>
              <span class="text-2xl font-black text-primary font-headline tracking-tighter">{{ selectedSkill ? selectedSkill.price : expertData.skills[0]?.price || 0 }}</span>
            </div>
            <span class="text-[10px] font-bold text-zinc-400">起/小时</span>
          </div>
          <button @click="handleOrder" :disabled="isLoading || !selectedSkill" class="bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-black text-base shadow-lg shadow-yellow-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '下单中...' : '立即下单' }}
          </button>
        </div>
      </div>
    </footer>

    <!-- Toast通知组件 -->
    <Toast 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type"
      @close="closeToast"
    />
    
    <!-- 图片预览组件 -->
    <Transition name="modal">
      <div v-if="imagePreview.show" class="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center" @click="closeImagePreview">
        <div class="relative w-full h-full flex items-center justify-center" @click.stop>
          <!-- 关闭按钮 -->
          <button @click="closeImagePreview" class="absolute top-4 right-4 text-white hover:opacity-80 active:scale-95 transition-all">
            <span class="material-symbols-outlined text-4xl">close</span>
          </button>
          
          <!-- 上一张按钮 -->
          <button 
            v-if="imagePreview.currentIndex > 0" 
            @click="prevImage" 
            class="absolute left-4 text-white hover:opacity-80 active:scale-95 transition-all"
          >
            <span class="material-symbols-outlined text-4xl">chevron_left</span>
          </button>
          
          <!-- 图片 -->
          <img 
            :src="imagePreview.images[imagePreview.currentIndex]" 
            alt="预览图片" 
            class="max-w-full max-h-full object-contain"
          />
          
          <!-- 下一张按钮 -->
          <button 
            v-if="imagePreview.currentIndex < imagePreview.images.length - 1" 
            @click="nextImage" 
            class="absolute right-4 text-white hover:opacity-80 active:scale-95 transition-all"
          >
            <span class="material-symbols-outlined text-4xl">chevron_right</span>
          </button>
          
          <!-- 页码指示器 -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {{ imagePreview.currentIndex + 1 }} / {{ imagePreview.images.length }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { expertService } from '../services/expert.js'
import { orderApi, handleApiError } from '../api/index.js'
import Toast from '../components/common/Toast.vue'

const router = useRouter()
const route = router.currentRoute.value

const expertData = ref({
  id: null,
  name: '',
  avatar: '',
  level: 0,
  title: '',
  description: '',
  stats: {
    winRate: 0,
    followers: 0,
    rating: 0
  },
  skills: [],
  voiceIntroduction: {
    url: '',
    duration: ''
  },
  reviews: []
})

const loading = ref(true)
const error = ref('')
const isLoading = ref(false)
const isFollowing = ref(false)
const isFavorite = ref(false)

// Toast状态
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// 交互状态
const selectedSkill = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const progress = ref(0)
const audioElement = ref(null)
const audioInterval = ref(null)

// 评价相关状态
const reviews = ref([])
const reviewsPage = ref(1)
const reviewsTotalPages = ref(1)
const reviewsLoading = ref(false)
const showAllReviews = ref(false)

// 评价总数
const reviewsTotalCount = computed(() => {
  return reviews.value.length
})

// 图片预览状态
const imagePreview = ref({
  show: false,
  images: [],
  currentIndex: 0
})

// 显示Toast
const showToast = (message, type = 'success') => {
  toast.value = {
    show: true,
    message,
    type
  }
}

// 关闭Toast
const closeToast = () => {
  toast.value.show = false
}

// 本地存储工具函数
const storage = {
  set(key, value, expireMinutes = 5) {
    const data = {
      value,
      expire: Date.now() + expireMinutes * 60 * 1000
    }
    localStorage.setItem(key, JSON.stringify(data))
  },
  
  get(key) {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      
      const data = JSON.parse(item)
      if (Date.now() > data.expire) {
        localStorage.removeItem(key)
        return null
      }
      return data.value
    } catch (err) {
      console.error('读取本地存储失败:', err)
      return null
    }
  },
  
  remove(key) {
    localStorage.removeItem(key)
  },
  
  clear() {
    localStorage.clear()
  }
}

// 防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 节流函数
const throttle = (fn, delay) => {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last > delay) {
      fn.apply(this, args)
      last = now
    }
  }
}

// 加载评价列表
const loadReviews = async (page = 1) => {
  reviewsLoading.value = true
  try {
    const expertId = expertData.value.id
    
    // 检查缓存（仅第一页）
    if (page === 1) {
      const cacheKey = `expert_reviews_${expertId}`
      const cachedReviews = storage.get(cacheKey)
      
      if (cachedReviews) {
        reviews.value = cachedReviews.reviews.map(review => ({
          ...review,
          images: typeof review.images === 'string' 
            ? review.images.split(',').filter(img => img.trim() !== '')
            : Array.isArray(review.images) ? review.images : []
        }))
        
        reviewsPage.value = cachedReviews.pagination.currentPage
        reviewsTotalPages.value = cachedReviews.pagination.totalPages
        reviewsLoading.value = false
        return
      }
    }
    
    const response = await expertService.getExpertReviews(expertId, page, 10)
    if (response.success) {
      let processedReviews = response.data.reviews
      processedReviews = processedReviews.map(review => ({
        ...review,
        images: typeof review.images === 'string' 
          ? review.images.split(',').filter(img => img.trim() !== '')
          : Array.isArray(review.images) ? review.images : []
      }))
      
      if (page === 1) {
        reviews.value = processedReviews
        // 缓存第一页数据（3分钟）
        const cacheKey = `expert_reviews_${expertId}`
        storage.set(cacheKey, response.data, 3)
      } else {
        reviews.value = [...reviews.value, ...processedReviews]
      }
      reviewsPage.value = response.data.pagination.currentPage
      reviewsTotalPages.value = response.data.pagination.totalPages
    }
  } catch (err) {
    const result = handleApiError(err)
    showToast(result.error, 'error')
  } finally {
    reviewsLoading.value = false
  }
}

// 显示全部评价
const handleShowAllReviews = () => {
  showAllReviews.value = true
  if (reviewsPage.value < reviewsTotalPages.value) {
    loadReviews(reviewsPage.value + 1)
  }
}

// 加载更多评价
const loadMoreReviews = () => {
  if (reviewsPage.value < reviewsTotalPages.value && !reviewsLoading.value) {
    loadReviews(reviewsPage.value + 1)
  }
}

// 图片预览
const openImagePreview = (images, index) => {
  imagePreview.value = {
    show: true,
    images,
    currentIndex: index
  }
}

const closeImagePreview = () => {
  imagePreview.value.show = false
}

const nextImage = () => {
  if (imagePreview.value.currentIndex < imagePreview.value.images.length - 1) {
    imagePreview.value.currentIndex++
  }
}

const prevImage = () => {
  if (imagePreview.value.currentIndex > 0) {
    imagePreview.value.currentIndex--
  }
}

const loadExpertData = async () => {
  loading.value = true
  error.value = ''
  try {
    const expertId = route.params.id || 1
    
    // 检查缓存
    const cacheKey = `expert_detail_${expertId}`
    const cachedData = storage.get(cacheKey)
    
    // 如果缓存存在
    if (cachedData) {
      expertData.value = cachedData
      // 加载语音数据
      await loadVoiceData(expertId)
      // 添加到浏览历史
      addToHistory(expertData.value)
      // 加载评价列表
      await loadReviews(1)
      // 默认选择第一个技能
      if (expertData.value.skills.length > 0) {
        selectedSkill.value = expertData.value.skills[0]
      }
      loading.value = false
      return
    }
    
    const response = await expertService.getExpertDetail(expertId)
    if (response.success) {
      expertData.value = response.data
      // 检查是否已收藏
      const favorites = getStorageData(STORAGE_KEYS.FAVORITES) || []
      isFavorite.value = favorites.some(item => item.id === expertData.value.id)
      // 加载语音数据
      await loadVoiceData(expertId)
      // 缓存数据（5分钟）
      storage.set(cacheKey, expertData.value, 5)
      // 添加到浏览历史
      addToHistory(expertData.value)
      // 加载评价列表
      await loadReviews(1)
      // 默认选择第一个技能
      if (expertData.value.skills.length > 0) {
        selectedSkill.value = expertData.value.skills[0]
      }
    } else {
      error.value = '获取大神详情失败'
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
  } finally {
    loading.value = false
  }
}

// 加载语音数据
const loadVoiceData = async (expertId) => {
  try {
    const voiceCacheKey = `expert_voice_${expertId}`
    const cachedVoice = storage.get(voiceCacheKey)
    
    if (cachedVoice) {
      if (!expertData.value.voiceIntroduction) {
        expertData.value.voiceIntroduction = {}
      }
      expertData.value.voiceIntroduction = {
        ...expertData.value.voiceIntroduction,
        ...cachedVoice
      }
      return
    }
    
    const voiceResponse = await expertService.getExpertVoice(expertId)
    if (voiceResponse.success) {
      if (!expertData.value.voiceIntroduction) {
        expertData.value.voiceIntroduction = {}
      }
      expertData.value.voiceIntroduction = {
        ...expertData.value.voiceIntroduction,
        ...voiceResponse.data
      }
      // 缓存语音数据（10分钟）
      storage.set(voiceCacheKey, voiceResponse.data, 10)
    }
  } catch (err) {
    console.error('加载语音数据失败:', err)
    // 语音数据加载失败不影响主页面显示
  }
}

const handleFollow = async () => {
  try {
    const expertId = expertData.value.id
    if (isFollowing.value) {
      const response = await expertService.unfollowExpert(expertId)
      if (response.success) {
        isFollowing.value = false
        showToast('取消关注成功')
        // 清除缓存
        clearExpertCache()
      }
    } else {
      const response = await expertService.followExpert(expertId)
      if (response.success) {
        isFollowing.value = true
        showToast('关注成功')
        // 清除缓存
        clearExpertCache()
      }
    }
  } catch (err) {
    const result = handleApiError(err)
    showToast(result.error, 'error')
  }
}

// 清除大神详情缓存
const clearExpertCache = () => {
  const expertId = expertData.value.id
  if (expertId) {
    const cacheKey = `expert_detail_${expertId}`
    storage.remove(cacheKey)
  }
}

// 本地存储相关函数
const STORAGE_KEYS = {
  FOLLOWING: 'user_following_list',
  FAVORITES: 'user_favorites_list',
  HISTORY: 'user_browse_history',
  PREFERENCES: 'user_preferences'
}

// 获取本地存储数据
const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('读取本地存储失败:', error)
    return null
  }
}

// 设置本地存储数据
const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('写入本地存储失败:', error)
  }
}

// 添加到浏览历史
const addToHistory = (expert) => {
  const history = getStorageData(STORAGE_KEYS.HISTORY) || []
  const existingIndex = history.findIndex(item => item.id === expert.id)
  
  if (existingIndex > -1) {
    history.splice(existingIndex, 1)
  }
  
  history.unshift({
    id: expert.id,
    name: expert.name,
    avatar: expert.avatar,
    title: expert.title,
    timestamp: Date.now()
  })
  
  // 只保留最近50条记录
  if (history.length > 50) {
    history.pop()
  }
  
  setStorageData(STORAGE_KEYS.HISTORY, history)
}

// 添加到收藏
const addToFavorites = (expert) => {
  const favorites = getStorageData(STORAGE_KEYS.FAVORITES) || []
  const exists = favorites.some(item => item.id === expert.id)
  
  if (!exists) {
    favorites.push({
      id: expert.id,
      name: expert.name,
      avatar: expert.avatar,
      title: expert.title,
      addedAt: Date.now()
    })
    setStorageData(STORAGE_KEYS.FAVORITES, favorites)
    return true
  }
  
  return false
}

// 从收藏中移除
const removeFromFavorites = (expertId) => {
  const favorites = getStorageData(STORAGE_KEYS.FAVORITES) || []
  const filtered = favorites.filter(item => item.id !== expertId)
  setStorageData(STORAGE_KEYS.FAVORITES, filtered)
}

// 添加到关注列表
const addToFollowing = (expert) => {
  const following = getStorageData(STORAGE_KEYS.FOLLOWING) || []
  const exists = following.some(item => item.id === expert.id)
  
  if (!exists) {
    following.push({
      id: expert.id,
      name: expert.name,
      avatar: expert.avatar,
      title: expert.title,
      followedAt: Date.now()
    })
    setStorageData(STORAGE_KEYS.FOLLOWING, following)
    return true
  }
  
  return false
}

// 从关注列表中移除
const removeFromFollowing = (expertId) => {
  const following = getStorageData(STORAGE_KEYS.FOLLOWING) || []
  const filtered = following.filter(item => item.id !== expertId)
  setStorageData(STORAGE_KEYS.FOLLOWING, filtered)
}

const handleOrder = async () => {
  if (!expertData.value.id) {
    showToast('大神ID不存在', 'error')
    return
  }
  
  if (!selectedSkill.value) {
    showToast('请选择技能', 'error')
    return
  }
  
  if (!selectedSkill.value.price || selectedSkill.value.price <= 0) {
    showToast('技能价格无效', 'error')
    return
  }
  
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) {
    showToast('请先登录', 'error')
    router.push('/login')
    return
  }
  
  isLoading.value = true
  router.push({
    path: '/confirm-order',
    query: {
      userId: expertData.value.id,
      skillId: selectedSkill.value.id,
      serviceTime: '',
      amount: selectedSkill.value.price
    }
  })
}

const handleFavorite = () => {
  const isAdded = addToFavorites(expertData.value)
  if (isAdded) {
    isFavorite.value = true
    showToast('收藏成功', 'success')
  } else {
    removeFromFavorites(expertData.value.id)
    isFavorite.value = false
    showToast('已取消收藏', 'success')
  }
}

const handleMessage = () => {
  if (!expertData.value.id) {
    showToast('专家ID不存在', 'error')
    return
  }
  router.push({
    path: '/messages',
    query: { 
      expertId: expertData.value.id,
      expertName: expertData.value.nickname
    }
  })
}

const handleBack = () => {
  router.back()
}

const handleSearch = () => {
  router.push('/search')
}

const handleNotification = () => {
  router.push('/notifications')
}

// 私聊功能
const handleChat = () => {
  if (!expertData.value.id) {
    showToast('专家ID不存在', 'error')
    return
  }
  router.push({
    path: `/chat/${expertData.value.id}`,
    query: { 
      expertId: expertData.value.id,
      expertName: expertData.value.nickname
    }
  })
}

// 选择技能
const selectSkill = (skill) => {
  selectedSkill.value = skill
  console.log('选择技能:', skill.name)
}

// 语音播放控制
const toggleAudio = () => {
  // 检查音频URL是否存在
  if (!expertData.value.voiceIntroduction.url) {
    showToast('暂无语音介绍', 'warning')
    return
  }
  
  if (!audioElement.value) {
    audioElement.value = new Audio(expertData.value.voiceIntroduction.url)
    audioElement.value.addEventListener('timeupdate', updateProgress)
    audioElement.value.addEventListener('ended', handleAudioEnd)
    audioElement.value.addEventListener('error', handleAudioError)
    audioElement.value.addEventListener('loadedmetadata', handleAudioLoaded)
  }

  if (isPlaying.value) {
    audioElement.value.pause()
    clearInterval(audioInterval.value)
    isPlaying.value = false
  } else {
    audioElement.value.play().catch(err => {
      console.error('音频播放失败:', err)
      showToast('音频播放失败', 'error')
      isPlaying.value = false
    })
    audioInterval.value = setInterval(() => {
      if (audioElement.value) {
        currentTime.value = Math.floor(audioElement.value.currentTime)
        const duration = audioElement.value.duration || 15
        progress.value = (currentTime.value / duration) * 100
      }
    }, 100)
    isPlaying.value = true
  }
}

const updateProgress = () => {
  if (audioElement.value) {
    currentTime.value = Math.floor(audioElement.value.currentTime)
    const duration = audioElement.value.duration || 15
    progress.value = (currentTime.value / duration) * 100
  }
}

const handleAudioEnd = () => {
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0
  clearInterval(audioInterval.value)
}

const handleAudioError = () => {
  console.error('音频加载失败')
  showToast('音频加载失败', 'error')
  isPlaying.value = false
  clearInterval(audioInterval.value)
}

const handleAudioLoaded = () => {
  console.log('音频加载完成')
  if (audioElement.value) {
    const duration = audioElement.value.duration
    if (duration) {
      const mins = Math.floor(duration / 60)
      const secs = Math.floor(duration % 60)
      expertData.value.voiceIntroduction.duration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  }
}

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 跳转音频进度
const seekAudio = throttle((event) => {
  if (!audioElement.value) return
  
  const rect = event.target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = x / rect.width
  const duration = audioElement.value.duration || 15
  
  audioElement.value.currentTime = percentage * duration
  currentTime.value = Math.floor(percentage * duration)
  progress.value = percentage * 100
}, 100)

const handleShare = () => {
  showToast('分享功能开发中', 'info')
}

const handleMore = () => {
  showToast('更多功能开发中', 'info')
}

onMounted(() => {
  loadExpertData()
  // 默认选择第一个技能
  if (expertData.value.skills.length > 0) {
    selectedSkill.value = expertData.value.skills[0]
  }
})

onUnmounted(() => {
  // 清理音频资源
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.removeEventListener('timeupdate', updateProgress)
    audioElement.value.removeEventListener('ended', handleAudioEnd)
    audioElement.value.removeEventListener('error', handleAudioError)
    audioElement.value.removeEventListener('loadedmetadata', handleAudioLoaded)
    audioElement.value = null
  }
  if (audioInterval.value) {
    clearInterval(audioInterval.value)
    audioInterval.value = null
  }
})
</script>

<style scoped>
/* 自定义样式 */

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0
}

/* 列表项动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px)
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px)
}

/* 按钮点击动画 */
@keyframes buttonClick {
  0% {
    transform: scale(1)
  }
  50% {
    transform: scale(0.95)
  }
  100% {
    transform: scale(1)
  }
}

.button-click {
  animation: buttonClick 0.2s ease
}

/* 波形动画 */
@keyframes waveform {
  0%, 100% {
    height: 8px
  }
  50% {
    height: 24px
  }
}

.waveform-active {
  animation: waveform 1s ease-in-out infinite
}

/* 加载动画 */
@keyframes spin {
  to {
    transform: rotate(360deg)
  }
}

.animate-spin {
  animation: spin 1s linear infinite
}

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1
  }
  50% {
    opacity: 0.5
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
}
</style>