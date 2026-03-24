<template>
  <div class="min-h-screen bg-surface">
    <!-- 顶部导航栏 -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-surface_container_highest backdrop-blur-md">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <button @click="handleBack" class="flex items-center space-x-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="text-title-md font-medium">返回</span>
        </button>
        <div class="flex items-center space-x-4">
          <button @click="handleSearch" class="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-surface_container_low">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
          <button @click="handleNotification" class="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-surface_container_low">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </button>
        </div>
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
        <div class="h-64 bg-gradient-to-r from-primary_container to-secondary_container">
          <!-- 背景图 -->
          <img 
            src="https://neeko-copilot.bytedance.net/api/text2image?prompt=gaming%20background%20with%20sunset&size=1024x512" 
            alt="背景图" 
            class="w-full h-full object-cover opacity-70"
            loading="lazy"
            decoding="async"
          />
        </div>
        <!-- 个人信息区域 -->
        <div class="container mx-auto px-4 -mt-20">
          <!-- 个人信息卡片 -->
          <div class="bg-surface_container_lowest rounded-xl p-4 sm:p-6 shadow-sm">
            <div class="flex flex-col sm:flex-row items-start">
              <!-- 头像 -->
              <div class="relative mr-0 sm:mr-4 mb-4 sm:mb-0 mx-auto sm:mx-0">
                <img 
                  :src="expertData.avatar" 
                  :alt="expertData.name" 
                  class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-surface"
                  loading="lazy"
                  decoding="async"
                  onerror="this.src='https://via.placeholder.com/150'"
                />
                <div class="absolute -bottom-1 -right-1 bg-primary_container text-on_primary_container text-xs font-bold px-2 py-1 rounded-full">
                  Lv.{{ expertData.level }}
                </div>
              </div>
              <!-- 个人信息 -->
              <div class="flex-1 w-full">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div class="text-center sm:text-left">
                    <h1 class="text-headline-sm sm:text-headline-md font-bold">{{ expertData.name }}</h1>
                    <p class="text-body-md text-on_surface_variant">{{ expertData.title }}</p>
                  </div>
                  <div class="flex space-x-2 w-full sm:w-auto">
                    <button @click="handleFollow" class="flex-1 sm:flex-none bg-surface_container_low text-primary px-4 py-2 rounded-full text-body-md font-medium transition-all hover:bg-primary_container hover:text-on_primary_container active:scale-95">
                      {{ isFollowing ? '已关注' : '关注' }}
                    </button>
                    <button @click="handleChat" class="flex-1 sm:flex-none bg-primary_container text-on_primary_container px-4 py-2 rounded-full text-body-md font-medium transition-all hover:opacity-90 active:scale-95">
                      私聊
                    </button>
                  </div>
                </div>
                <p class="text-body-md mt-3 text-center sm:text-left">{{ expertData.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 统计数据 -->
      <section class="container mx-auto px-4 py-6">
        <!-- 统计数据卡片 -->
        <div class="bg-surface_container_lowest rounded-xl p-6 shadow-sm">
          <div class="grid grid-cols-3 gap-4 sm:gap-6">
            <div class="text-center">
              <div class="text-display-lg font-bold text-on_surface sm:text-headline-md">{{ expertData.stats.winRate }}%</div>
              <div class="text-body-md text-on_surface_variant">胜率</div>
            </div>
            <div class="text-center">
              <div class="text-display-lg font-bold text-on_surface sm:text-headline-md">{{ expertData.stats.followers.toLocaleString() }}</div>
              <div class="text-body-md text-on_surface_variant">粉丝数</div>
            </div>
            <div class="text-center">
              <div class="text-display-lg font-bold text-on_surface sm:text-headline-md">{{ expertData.stats.rating }}</div>
              <div class="text-body-md text-on_surface_variant">评分</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 技能专区 -->
      <section class="container mx-auto px-4 py-6">
        <h2 class="text-headline-md font-bold mb-4">技能专区</h2>
        <!-- 技能卡片列表 -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div 
            v-for="skill in expertData.skills" 
            :key="skill.id" 
            @click="selectSkill(skill)"
            :class="['bg-surface_container_lowest rounded-xl p-6 shadow-sm transition-all cursor-pointer hover:shadow-md', selectedSkill?.id === skill.id ? 'ring-2 ring-primary_container' : '']"
          >
            <div class="flex items-center justify-between sm:flex-col sm:items-start">
              <div class="flex items-center sm:w-full sm:mb-3">
                <div class="w-12 h-12 bg-primary_container/20 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <div>
                  <div class="flex items-center">
                    <h3 class="text-title-md font-bold mr-2">{{ skill.name }}</h3>
                    <span class="bg-tertiary_container text-on_tertiary_container text-label-sm px-2 py-1 rounded-full">
                      {{ skill.level }}
                    </span>
                  </div>
                  <p class="text-body-md text-on_surface_variant">{{ skill.description }}</p>
                </div>
              </div>
              <div class="text-right sm:text-left sm:w-full">
                <div class="text-display-lg font-bold text-on_surface">¥{{ skill.price }}</div>
                <div class="text-label-sm text-on_surface_variant">/小时</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 语音介绍 -->
      <section class="container mx-auto px-4 py-6">
        <h2 class="text-headline-md font-bold mb-4">语音介绍</h2>
        <!-- 语音播放器 -->
        <div class="bg-surface_container_lowest rounded-xl p-6 shadow-sm">
          <div class="flex items-center space-x-4">
            <!-- 播放按钮 -->
            <button @click="toggleAudio" class="w-12 h-12 bg-primary_container rounded-full flex items-center justify-center transition-all hover:opacity-90">
              <svg v-if="!isPlaying" class="w-6 h-6 text-on_primary_container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <svg v-else class="w-6 h-6 text-on_primary_container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
            <!-- 波形可视化 -->
            <div class="flex-1">
              <div class="flex items-center space-x-1 mb-2">
                <div v-for="i in 20" :key="i" class="h-4 bg-primary_container/30 rounded-full transition-all" :style="{ width: `${Math.random() * 10 + 5}px`, height: isPlaying ? `${Math.random() * 16 + 8}px` : '8px' }"></div>
              </div>
              <!-- 进度条 -->
              <div class="flex items-center space-x-3">
                <span class="text-label-sm text-on_surface_variant">{{ formatTime(currentTime) }}</span>
                <div class="flex-1 h-1 bg-surface_container_low rounded-full overflow-hidden cursor-pointer" @click="seekAudio">
                  <div class="h-full bg-primary_container transition-all" :style="{ width: `${progress}%` }"></div>
                </div>
                <span class="text-label-sm text-on_surface_variant">{{ expertData.voiceIntroduction.duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 用户评价 -->
      <section class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-headline-md font-bold">用户评价</h2>
          <button 
            v-if="!showAllReviews && reviews.length > 0" 
            @click="handleShowAllReviews" 
            class="text-primary text-body-md active:scale-95 transition-all"
          >
            查看全部
          </button>
        </div>
        <!-- 评价列表 -->
        <div class="grid grid-cols-1 gap-4">
          <div v-for="review in (showAllReviews ? reviews : reviews.slice(0, 2))" :key="review.id" class="bg-surface_container_lowest rounded-xl p-6 shadow-sm">
            <div class="flex items-start">
              <!-- 用户头像 -->
              <img 
                :src="review.user.avatar" 
                :alt="review.user.name" 
                class="w-12 h-12 rounded-full object-cover mr-4"
                loading="lazy"
                decoding="async"
                onerror="this.src='https://via.placeholder.com/150'"
              />
              <!-- 评价内容 -->
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-title-md font-bold">{{ review.user.name }}</h3>
                  <div class="flex items-center">
                    <div class="flex mr-2">
                      <svg v-for="i in 5" :key="i" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" :class="i <= review.rating ? 'text-primary_container' : 'text-surface_container_low'"/>
                      </svg>
                    </div>
                    <span class="text-body-md">{{ review.rating }}</span>
                  </div>
                </div>
                <p class="text-body-md mb-3">{{ review.content }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-label-sm text-on_surface_variant">{{ review.date }}</span>
                  <!-- 评价图片 -->
                  <div v-if="review.images && review.images.length > 0" class="flex space-x-2">
                    <img 
                      v-for="(image, index) in review.images" 
                      :key="index" 
                      :src="image" 
                      alt="评价图片" 
                      class="w-12 h-12 rounded-lg object-cover cursor-pointer active:scale-95 transition-all"
                      @click="openImagePreview(review.images, index)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 加载更多按钮 -->
        <div v-if="showAllReviews && reviewsPage < reviewsTotalPages" class="mt-4 text-center">
          <button 
            @click="loadMoreReviews" 
            :disabled="reviewsLoading"
            class="bg-surface_container_low text-primary px-6 py-2 rounded-full font-medium active:scale-95 transition-all"
          >
            {{ reviewsLoading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </section>
      </div>
    </main>

    <!-- 固定底部下单栏 -->
    <footer class="fixed bottom-0 left-0 right-0 bg-surface_container_highest backdrop-blur-md border-t border-surface_tint/10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="handleFavorite" class="w-10 h-10 flex items-center justify-center rounded-full bg-surface_container_low active:scale-95 transition-all">
              <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </button>
            <button @click="handleMessage" class="w-10 h-10 flex items-center justify-center rounded-full bg-surface_container_low active:scale-95 transition-all">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </button>
          </div>
          <div class="flex items-center space-x-3">
            <div class="text-right">
              <div class="text-label-sm text-on_surface_variant">{{ selectedSkill ? '当前选择' : '起价' }}</div>
              <div class="text-display-lg font-bold text-on_surface">¥{{ selectedSkill ? selectedSkill.price : expertData.skills[0]?.price || 0 }}</div>
            </div>
            <button @click="handleOrder" :disabled="isLoading || !selectedSkill" class="bg-primary_container text-on_primary_container px-6 py-2 rounded-full font-medium flex items-center active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isLoading" class="mr-2 w-4 h-4 border-2 border-on_primary_container border-t-transparent rounded-full animate-spin"></span>
              {{ isLoading ? '下单中...' : '立即下单' }}
            </button>
          </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { expertApi, orderApi, handleApiError } from '../api/index.js'
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
        reviews.value = cachedReviews.reviews
        reviewsPage.value = cachedReviews.pagination.currentPage
        reviewsTotalPages.value = cachedReviews.pagination.totalPages
        reviewsLoading.value = false
        return
      }
    }
    
    const response = await expertApi.getExpertReviews(expertId, page, 10)
    if (response.success) {
      if (page === 1) {
        reviews.value = response.data.reviews
        // 缓存第一页数据（3分钟）
        const cacheKey = `expert_reviews_${expertId}`
        storage.set(cacheKey, response.data, 3)
      } else {
        reviews.value = [...reviews.value, ...response.data.reviews]
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
    
    const response = await expertApi.getExpertDetail(expertId)
    if (response.success) {
      expertData.value = response.data
      // 缓存数据（5分钟）
      storage.set(cacheKey, response.data, 5)
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

const handleFollow = async () => {
  try {
    const expertId = expertData.value.id
    if (isFollowing.value) {
      const response = await expertApi.unfollowExpert(expertId)
      if (response.success) {
        isFollowing.value = false
        showToast('取消关注成功')
        // 清除缓存
        clearExpertCache()
      }
    } else {
      const response = await expertApi.followExpert(expertId)
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
  // 表单验证
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
  
  // 检查用户是否已登录
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) {
    showToast('请先登录', 'error')
    router.push('/login')
    return
  }
  
  isLoading.value = true
  try {
    const orderData = {
      expertId: expertData.value.id,
      skillId: selectedSkill.value.id,
      amount: selectedSkill.value.price
    }
    const response = await orderApi.createOrder(orderData)
    if (response.success) {
      showToast('订单创建成功', 'success')
      // 跳转到订单确认页面
      router.push('/confirm-order')
    }
  } catch (err) {
    const result = handleApiError(err)
    showToast(result.error, 'error')
  } finally {
    isLoading.value = false
  }
}

const handleFavorite = () => {
  const isAdded = addToFavorites(expertData.value)
  if (isAdded) {
    showToast('收藏成功', 'success')
  } else {
    removeFromFavorites(expertData.value.id)
    showToast('已取消收藏', 'success')
  }
}

const handleMessage = () => {
  console.log('给大神留言')
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
  console.log('打开私聊窗口')
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