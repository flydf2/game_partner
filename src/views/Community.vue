<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
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
        
        return {
          ...post,
          images: imagesArray,
          isLiked: post.isLiked || false,
          isFollowing: post.isFollowing || false,
          likes: post.likes || 0,
          comments: post.comments || 0
        }
      })
    } else {
      throw new Error(response.message || response.msg || '获取帖子列表失败')
    }
  } catch (err) {
    error.value = err.message || '获取帖子列表失败'
    console.error('获取帖子列表失败:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { keyword: searchQuery.value } })
  }
}

const handleViewRewardOrders = () => {
  router.push('/reward')
}

const handleToggleRewardFilter = () => {
  onlyRewardPosts.value = !onlyRewardPosts.value
  fetchPosts()
}

const handleCategoryClick = (category) => {
  activeCategory.value = category
  fetchPosts()
}

const handlePostClick = (postId) => {
  router.push(`/post/${postId}`)
}

const handleUserClick = (userId) => {
  router.push(`/expert/${userId}`)
}

const handleLike = async (postId) => {
  try {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      if (!post.isLiked) {
        await communityApi.likePost(postId)
        post.isLiked = true
        post.likes = (post.likes || 0) + 1
      } else {
        await communityApi.unlikePost(postId)
        post.isLiked = false
        post.likes = (post.likes || 0) - 1
      }
    }
  } catch (err) {
    console.error('点赞操作失败:', err)
  }
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

const showToast = (message) => {
  toast.value.message = message
  toast.value.show = true
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const handleCreatePost = () => {
  router.push('/create-post')
}

const handleBack = () => {
  router.back()
}

const handleShare = (postId) => {
  console.log('分享帖子:', postId)
}

const handleComment = (postId) => {
  console.log('评论帖子:', postId)
}

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

const handleMenu = () => {
  router.push('/profile')
}

const handleNotifications = () => {
  router.push('/notifications')
}

const handleSearchHeader = () => {
  router.push('/search')
}

const handleProfile = () => {
  router.push('/profile')
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <AppHeader
      title="社区动态"
      is-primary-page
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearchHeader"
      @profile="handleProfile"
    />
    
    <main class="max-w-2xl mx-auto px-5 pt-24 pb-24 space-y-6">
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
          @click="handleToggleRewardFilter"
          :class="[
            'w-full rounded-3xl p-4 flex items-center justify-between transition-all active:scale-95',
            onlyRewardPosts
              ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700/50'
              : 'bg-surface-container-lowest hover:bg-surface-container-high'
          ]"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors" :class="[
              onlyRewardPosts ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' : 'bg-surface-container-lowest'
            ]">
              <span class="material-symbols-outlined text-xl">monetization_on</span>
            </div>
            <div>
              <h3 class="font-bold text-on-surface">仅看悬赏</h3>
              <p class="text-xs text-on-surface-variant">只显示有悬赏的帖子</p>
            </div>
          </div>
          <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors" :class="[
            onlyRewardPosts ? 'border-amber-500' : 'border-outline'
          ]">
            <span v-if="onlyRewardPosts" class="w-3 h-3 rounded-full bg-amber-500"></span>
          </div>
        </button>
      </section>

      <!-- Category Tabs -->
      <section class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="handleCategoryClick(category.id)"
          :class="[
            'px-6 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 whitespace-nowrap',
            activeCategory === category.id
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
          ]"
        >
          {{ category.label }}
        </button>
      </section>

      <!-- Posts List -->
      <div class="space-y-4">
        <div v-if="loading" class="flex justify-center py-12">
          <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <span class="material-symbols-outlined text-4xl text-outline mb-4">error_outline</span>
          <p class="text-sm text-on-surface-variant mb-4">{{ error }}</p>
          <button
            @click="fetchPosts"
            class="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
          >
            重试
          </button>
        </div>

        <div v-else-if="posts.length === 0" class="text-center py-16">
          <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
            <span class="material-symbols-outlined text-outline text-5xl">feed</span>
          </div>
          <h2 class="text-xl font-bold text-on-surface mb-2">暂无动态</h2>
          <p class="text-sm text-on-surface-variant">关注更多用户，会有动态显示在这里</p>
        </div>

        <article
          v-for="post in posts"
          :key="post.id"
          @click="handlePostClick(post.id)"
          class="bg-surface-container-lowest rounded-3xl p-5 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div class="flex items-center gap-3 mb-4">
            <img
              :src="post.userAvatar"
              :alt="post.userName"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-grow">
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm text-on-surface">{{ post.userName }}</span>
                <span class="text-[10px] text-outline">{{ post.game }}</span>
              </div>
              <span class="text-[10px] text-outline">{{ formatTime(post.createdAt) }}</span>
            </div>
            <button
              @click.stop="handleFollow(post.id, post.userId)"
              class="px-3 py-1 rounded-full text-xs font-semibold transition-colors active:scale-95"
              :class="[
                post.isFollowing
                  ? 'bg-surface-container text-on-surface-variant'
                  : 'bg-primary text-on-primary'
              ]"
            >
              {{ post.isFollowing ? '已关注' : '关注' }}
            </button>
          </div>

          <p class="text-sm text-on-surface mb-4">{{ post.content }}</p>

          <div v-if="post.images && post.images.length > 0" class="grid grid-cols-3 gap-2 mb-4">
            <img
              v-for="(image, index) in post.images"
              :key="index"
              :src="image"
              :alt="`Post image ${index + 1}`"
              class="w-full aspect-square rounded-xl object-cover cursor-pointer"
            />
          </div>

          <div class="flex items-center justify-between text-[10px] text-on-surface-variant">
            <div class="flex items-center gap-4">
              <button
                @click.stop="handleLike(post.id)"
                class="flex items-center gap-1.5 transition-colors active:scale-95 transition-transform"
                :class="post.isLiked ? 'text-error' : 'hover:text-error'"
              >
                <span class="material-symbols-outlined text-[1.25rem]" :class="post.isLiked ? 'fill-current' : ''">favorite</span>
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

      <div v-if="posts.length > 0 && !loading && !error" class="py-8">
        <div class="text-center">
          <p class="text-sm text-on-surface-variant">没有更多动态了</p>
        </div>
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

    <BottomNavBar />

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
