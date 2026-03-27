<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { communityApi, userApi } from '../api/index.js'
import LazyImage from '../components/common/LazyImage.vue'

const router = useRouter()

const activeCategory = ref('hot')
const searchQuery = ref('')
const onlyRewardPosts = ref(false)
const toast = ref({
  show: false,
  message: ''
})

const categories = [
  { id: 'hot', label: '热门' },
  { id: 'game', label: '游戏' },
  { id: 'mood', label: '心情' },
  { id: 'social', label: '交友' },
  { id: 'guide', label: '攻略' }
]

const posts = ref([])
const loading = ref(false)
const error = ref(null)

const fetchPosts = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await communityApi.getPosts({
      category: activeCategory.value,
      onlyReward: onlyRewardPosts.value ? 1 : 0
    })
    
    if (response.success || response.code === 0) {
      const rawPosts = response.data?.data || response.data || []
      posts.value = rawPosts.map(post => {
        let imagesArray = []
        if (post.images) {
          if (Array.isArray(post.images)) {
            imagesArray = post.images
          } else {
            imagesArray = post.images.split(',')
          }
        }
        
        let rewardInfo = null
        if (post.extJson) {
          try {
            rewardInfo = typeof post.extJson === 'string' ? JSON.parse(post.extJson) : post.extJson
          } catch (e) {
            console.error('解析 extJson 失败:', e)
          }
        }
        
        return {
          ...post,
          type: post.type || 'normal',
          rewardInfo: rewardInfo,
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
      throw new Error(response.message || response.msg || '获取帖子失败')
    }
  } catch (err) {
    error.value = err.message
    console.error('获取社区帖子失败:', err)
  } finally {
    loading.value = false
  }
}

const handleCategoryChange = async (categoryId) => {
  activeCategory.value = categoryId
  await fetchPosts()
}

const toggleRewardFilter = async () => {
  onlyRewardPosts.value = !onlyRewardPosts.value
  if (onlyRewardPosts.value) {
    activeCategory.value = 'hot'
  }
  await fetchPosts()
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await communityApi.getPosts({
      category: activeCategory.value,
      keyword: searchQuery.value.trim(),
      onlyReward: onlyRewardPosts.value ? 1 : 0
    })
    
    if (response.success || response.code === 0) {
      const rawPosts = response.data?.data || response.data || []
      posts.value = rawPosts.map(post => {
        let imagesArray = []
        if (post.images) {
          if (Array.isArray(post.images)) {
            imagesArray = post.images
          } else {
            imagesArray = post.images.split(',')
          }
        }
        
        let rewardInfo = null
        if (post.extJson) {
          try {
            rewardInfo = typeof post.extJson === 'string' ? JSON.parse(post.extJson) : post.extJson
          } catch (e) {
            console.error('解析 extJson 失败:', e)
          }
        }
        
        return {
          ...post,
          type: post.type || 'normal',
          rewardInfo: rewardInfo,
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
      throw new Error(response.message || response.msg || '搜索失败')
    }
  } catch (err) {
    error.value = err.message
    console.error('搜索帖子失败:', err)
  } finally {
    loading.value = false
  }
}

const showToast = (message) => {
  toast.value.message = message
  toast.value.show = true
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const handleFollow = async (postId, userId) => {
  try {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      if (!post.isFollowing) {
        await userApi.followUser(userId)
        post.isFollowing = true
        showToast('关注成功！')
      } else {
        await userApi.unfollowUser(userId)
        post.isFollowing = false
        showToast('取消关注成功！')
      }
    }
  } catch (err) {
    console.error('关注操作失败:', err)
    showToast('操作失败，请稍后重试')
  }
}

const handleLike = async (postId) => {
  try {
    const response = await communityApi.likePost(postId)
    if (response.success) {
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.likes += 1
        showToast('点赞成功！')
      }
    } else {
      throw new Error(response.message || '点赞失败')
    }
  } catch (err) {
    console.error('点赞失败:', err)
    showToast('点赞失败，请稍后重试')
  }
}

const handleComment = (postId) => {
  // 跳转到帖子详情页
  router.push(`/post/${postId}`)
}

const handleShare = (postId) => {
  // 实现分享功能
  if (navigator.share) {
    navigator.share({
      title: '游戏社区动态',
      text: '来看看这个有趣的动态',
      url: `${window.location.origin}/post/${postId}`
    })
  } else {
    // 复制链接
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
    showToast('链接已复制到剪贴板')
  }
}

const handlePostClick = (postId) => {
  // 跳转到帖子详情页
  router.push(`/post/${postId}`)
}

const handleCreatePost = () => {
  // 跳转到发布动态页面
  router.push('/create-post')
}

const handleViewRewardOrders = () => {
  // 跳转到悬赏订单页面
  router.push('/reward')
}

const handleBack = () => {
  router.back()
}

const handleUserClick = (userId) => {
  // 跳转到用户详情页
  router.push(`/expert/${userId}`)
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

// 组件挂载时获取帖子
onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
      <!-- Search Section -->
      <section class="w-full">
        <div class="bg-surface-container-high rounded-3xl flex items-center px-4 py-3 gap-3 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container/30 transition-all">
          <span class="material-symbols-outlined text-outline">search</span>
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            class="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline p-0"
            placeholder="搜索你感兴趣的动态..."
            type="text"
          />
        </div>
      </section>

      <!-- Reward Orders Button -->
      <section class="w-full">
        <button
          @click="handleViewRewardOrders"
          class="w-full bg-surface-container-lowest rounded-3xl p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors active:scale-95"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary">
              <span class="material-symbols-outlined">attach_money</span>
            </div>
            <div>
              <h3 class="font-bold text-on-surface">悬赏订单</h3>
              <p class="text-xs text-on-surface-variant">查看并抢单，赚取额外收益</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-outline">chevron_right</span>
        </button>
      </section>

      <!-- Reward Filter Toggle -->
      <section class="w-full">
        <button
          @click="toggleRewardFilter"
          :class="[
            'w-full rounded-3xl p-4 flex items-center justify-between transition-all active:scale-95',
            onlyRewardPosts
              ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700/50'
              : 'bg-surface-container-lowest hover:bg-surface-container-high'
          ]"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors" :class="[
              onlyRewardPosts 
                ? 'bg-amber-200 dark:bg-amber-800/50 text-amber-700 dark:text-amber-400' 
                : 'bg-primary-container/10 text-primary'
            ]">
              <span class="material-symbols-outlined">monetization_on</span>
            </div>
            <div>
              <h3 class="font-bold text-on-surface" :class="[
                onlyRewardPosts ? 'text-amber-700 dark:text-amber-400' : 'text-on-surface'
              ]">仅看悬赏贴</h3>
              <p class="text-xs text-on-surface-variant">
                {{ onlyRewardPosts ? '已开启悬赏筛选' : '查看悬赏订单，赚取额外收益' }}
              </p>
            </div>
          </div>
          <span class="material-symbols-outlined text-outline">chevron_right</span>
        </button>
      </section>

      <!-- Category Selector -->
      <section class="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 py-1">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="handleCategoryChange(category.id)"
          :class="[
            'flex-shrink-0 px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 shadow-sm',
            activeCategory === category.id
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
          ]"
        >
          {{ category.label }}
        </button>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-on-surface-variant">加载中...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
        <span class="material-symbols-outlined text-4xl text-error mb-4">error_outline</span>
        <p class="text-center text-error mb-4">{{ error }}</p>
        <button
          @click="fetchPosts"
          class="px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold active:scale-95 transition-transform"
        >
          重试
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="posts.length === 0" class="flex flex-col items-center justify-center py-20">
        <span class="material-symbols-outlined text-4xl text-outline mb-4">article</span>
        <p class="text-center text-on-surface-variant mb-4">暂无动态</p>
        <button
          @click="handleCreatePost"
          class="px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold active:scale-95 transition-transform"
        >
          发布动态
        </button>
      </div>

      <!-- Feed List -->
      <div v-else class="space-y-4">
        <article
          v-for="post in posts"
          :key="post.id"
          class="bg-surface-container-lowest rounded-3xl p-5 border-none cursor-pointer hover:shadow-md transition-shadow"
          :class="{ 'border border-primary-container/20': post.type === 'reward' }"
          @click="handlePostClick(post.id)"
        >
          <!-- 悬赏订单标签 -->
          <div v-if="post.type === 'reward'" class="flex items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full">
              💰 悬赏订单
            </span>
            <span class="text-xs text-on-surface-variant">
              {{ post.rewardInfo?.rewardAmount }} {{ post.rewardInfo?.rewardType }} · {{ post.rewardInfo?.hours }}小时 · 截止：{{ post.rewardInfo?.deadline }}
            </span>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3" @click.stop="handleUserClick(post.user?.id || post.user?.userId)">
              <div class="w-12 h-12 rounded-full overflow-hidden bg-surface-container cursor-pointer hover:opacity-80 transition-opacity">
                <LazyImage 
                  :src="post.user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'" 
                  :alt="post.user?.name || '用户'" 
                  :rounded="'50%'"
                  :aspect-ratio="'1/1'"
                />
              </div>
              <div class="cursor-pointer">
                <h3 class="font-bold text-on-surface hover:text-primary transition-colors">{{ post.user?.name || '用户' }}</h3>
                <div class="flex items-center gap-2">
                  <p class="text-[0.6875rem] text-outline">{{ post.time }} · {{ post.user?.game || '未知游戏' }}</p>
                  <span v-if="post.category" class="px-2 py-0.5 bg-secondary-container/20 text-secondary text-[0.625rem] font-bold rounded">
                    {{ categories.find(c => c.id === post.category)?.label || post.category }}
                  </span>
                </div>
              </div>
            </div>
            <button
              v-if="!post.isFollowing && (post.user?.id || post.user?.userId)"
              @click.stop="handleFollow(post.id, post.user?.id || post.user?.userId)"
              class="text-primary font-bold px-4 py-1.5 bg-primary-container/10 rounded-full text-sm active:scale-95 transition-transform"
            >
              关注
            </button>
            <span v-else-if="post.isNew" class="px-3 py-1 bg-tertiary-container/20 text-tertiary text-[0.6875rem] font-bold rounded-lg">
              新动态
            </span>
          </div>

          <p class="text-on-surface mb-4 leading-relaxed whitespace-pre-line">{{ post.content }}</p>

          <!-- 悬赏订单信息展示 -->
          <div v-if="post.type === 'reward' && post.rewardInfo" class="bg-surface-container-high rounded-2xl p-4 mb-4 border border-primary-container/10">
            <div class="flex items-start justify-between mb-3">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-2xl font-bold text-primary">{{ post.rewardInfo.rewardAmount }}</span>
                  <span class="text-sm text-on-surface-variant">{{ post.rewardInfo.rewardType }}</span>
                </div>
                <div class="text-xs text-on-surface-variant">
                  <span>游戏：{{ post.rewardInfo.game }}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-on-surface-variant mb-1">截止时间</div>
                <div class="text-sm font-semibold text-amber-600 dark:text-amber-400">{{ post.rewardInfo.deadline }}</div>
              </div>
            </div>
            <div class="border-t border-surface-container-low/50 pt-3">
              <div class="text-xs font-semibold text-on-surface mb-1">需求要求：</div>
              <p class="text-xs text-on-surface-variant leading-relaxed">{{ post.rewardInfo.requirements }}</p>
            </div>
          </div>

          <div v-if="post.images && post.images.length > 0" class="rounded-2xl overflow-hidden mb-4" :class="{
            'grid gap-2': post.images.length > 1,
            'grid-cols-2': post.images.length > 1 && post.images.length <= 4,
            'grid-cols-3': post.images.length > 4
          }">
            <div
              v-for="(image, index) in post.images.slice(0, 9)"
              :key="index"
              :class="{
                'aspect-video': post.images.length === 1,
                'aspect-square': post.images.length > 1
              }"
              class="bg-surface-container overflow-hidden relative"
            >
              <LazyImage 
                :src="image" 
                :alt="`Post image ${index + 1}`" 
                :rounded="'0.75rem'"
                :aspect-ratio="post.images.length === 1 ? '16/9' : '1/1'"
              />
              <div v-if="index === 0 && post.images.length === 1" class="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer">
                <div class="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110">
                  <span class="material-symbols-outlined text-[2rem]" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                </div>
              </div>
              <div v-if="index === 8 && post.images.length > 9" class="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl">
                +{{ post.images.length - 9 }}
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-surface-container-low/50 mt-2">
            <div class="flex items-center gap-6">
              <button @click.stop="handleLike(post.id)" class="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors active:scale-95 transition-transform">
                <span class="material-symbols-outlined text-[1.25rem]">favorite</span>
                <span class="text-xs font-medium">{{ post.likes }}</span>
              </button>
              <button @click.stop="handleComment(post.id)" class="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors active:scale-95 transition-transform">
                <span class="material-symbols-outlined text-[1.25rem]">chat_bubble</span>
                <span class="text-xs font-medium">{{ post.comments }}</span>
              </button>
            </div>
            <button @click.stop="handleShare(post.id)" class="text-on-surface-variant hover:text-primary transition-colors active:scale-95 transition-transform">
              <span class="material-symbols-outlined text-[1.25rem]">share</span>
            </button>
          </div>
        </article>
      </div>
    </main>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-bold shadow-lg z-50 animate-fade-in-out">
      {{ toast.message }}
    </div>

    <!-- 发布按钮 -->
    <button
      @click="handleCreatePost"
      class="fixed bottom-24 right-5 w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:bg-primary-container active:scale-95 transition-all z-40"
    >
      <span class="material-symbols-outlined text-2xl">add</span>
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

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  10% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  90% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}

.animate-fade-in-out {
  animation: fadeInOut 2s ease-in-out forwards;
}
</style>