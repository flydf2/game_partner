<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { communityApi } from '../api/index.js'

const route = useRoute()
const router = useRouter()

const postId = ref(route.params.id || '1')
const post = ref(null)
const comments = ref([])
const newComment = ref('')
const loading = ref(true)
const error = ref(null)

const loadPostDetail = async () => {
  try {
    loading.value = true
    error.value = null
    
    // 使用真实 API 获取帖子详情
    const response = await communityApi.getPostDetail(postId.value)
    
    if (response.success || response.code === 0) {
      // 处理 API 返回的数据格式
      const postData = response.data?.data || response.data
      
      // 转换 images 字符串为数组
      let imagesArray = []
      if (postData.images) {
        if (Array.isArray(postData.images)) {
          imagesArray = postData.images
        } else {
          imagesArray = postData.images.split(',')
        }
      }
      
      // 构建完整的帖子数据结构
      post.value = {
        ...postData,
        images: imagesArray,
        user: postData.user || {
          id: postData.userId || postData.user_id || '1',
          name: postData.user?.name || `用户${postData.userId || postData.user_id || '1'}`,
          avatar: postData.user?.avatar || `https://randomuser.me/api/portraits/${(postData.userId || postData.user_id || 1) % 2 === 0 ? 'women' : 'men'}/${(postData.userId || postData.user_id || 1) % 70 + 1}.jpg`,
          game: postData.user?.game || postData.game || '未知游戏'
        },
        time: postData.time || formatTime(postData.createdAt),
        isLiked: postData.isLiked || false,
        isFollowing: postData.isFollowing || false
      }
      
      // 处理评论
      comments.value = (postData.commentsList || []).map(comment => ({
        ...comment,
        user: comment.user || {
          id: comment.userId || comment.user_id || '1',
          name: comment.user?.name || `用户${comment.userId || comment.user_id || '1'}`,
          avatar: comment.user?.avatar || `https://randomuser.me/api/portraits/${(comment.userId || comment.user_id || 1) % 2 === 0 ? 'women' : 'men'}/${(comment.userId || comment.user_id || 1) % 70 + 1}.jpg`
        },
        time: comment.time || formatTime(comment.createdAt)
      }))
    } else {
      error.value = response.message || response.msg || '加载失败'
    }
  } catch (err) {
    console.error('加载帖子详情失败:', err)
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 时间格式化函数
const formatTime = (dateString) => {
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

const handleLike = async () => {
  if (post.value) {
    try {
      const response = await communityApi.likePost(postId.value)
      if (response.success) {
        post.value.isLiked = !post.value.isLiked
        post.value.likes += post.value.isLiked ? 1 : -1
      }
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }
}

const handleComment = async () => {
  if (!newComment.value.trim()) return
  
  try {
    const response = await communityApi.commentPost(postId.value, newComment.value.trim())
    if (response.success && response.data) {
      comments.value.unshift(response.data)
      post.value.comments++
      newComment.value = ''
    }
  } catch (error) {
    console.error('评论失败:', error)
  }
}

const handleShare = () => {
  if (post.value && post.value.user) {
    if (navigator.share) {
      navigator.share({
        title: post.value.user.name + '的动态',
        text: post.value.content,
        url: window.location.href
      })
    } else {
      // 复制链接
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }
}

const handleFollow = async () => {
  if (post.value && post.value.user) {
    try {
      // 这里需要根据实际 API 设计调用关注接口
      // 假设用户ID在 post.user.id 中
      if (post.value.user.id) {
        // 这里应该调用关注用户的 API
        // 暂时先更新本地状态
        post.value.isFollowing = !post.value.isFollowing
      }
    } catch (error) {
      console.error('关注失败:', error)
    }
  }
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  loadPostDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <nav data-v-3b8a03f8="" class="bg-surface w-full top-0 sticky z-50">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">帖子详情</h1>
      </div>
      <div class="w-6"></div>
    </nav>

    <main v-if="loading" class="pt-20 px-5 max-w-2xl mx-auto">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </main>

    <main v-else-if="error" class="pt-20 px-5 max-w-2xl mx-auto">
      <div class="flex flex-col items-center justify-center py-12 space-y-4">
        <span class="material-symbols-outlined text-4xl text-error">error_outline</span>
        <p class="text-error text-center">{{ error }}</p>
        <button 
          @click="loadPostDetail"
          class="px-6 py-2 bg-primary text-primary-container rounded-full font-medium hover:opacity-80 transition-opacity"
        >
          重试
        </button>
      </div>
    </main>

    <main v-else-if="post" class="pt-20 px-5 max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
      <!-- 帖子内容 -->
      <article class="bg-surface-container-lowest rounded-3xl p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
              <img :alt="post.user?.name || '用户'" class="w-full h-auto" :src="post.user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'" />
            </div>
            <div>
              <h3 class="font-bold text-on-surface">{{ post.user?.name || '用户' }}</h3>
              <p class="text-[0.6875rem] text-outline">{{ post.time }} · {{ post.user?.game || '未知游戏' }}</p>
            </div>
          </div>
          <button
            v-if="!post.isFollowing && post.user?.id"
            @click="handleFollow"
            class="text-primary font-bold px-4 py-1.5 bg-primary-container/10 rounded-full text-sm active:scale-95 transition-transform"
          >
            关注
          </button>
        </div>

        <p class="text-on-surface mb-4 leading-relaxed whitespace-pre-line">{{ post.content }}</p>

        <div v-if="post.images.length > 0" class="rounded-2xl overflow-hidden mb-4" :class="post.images.length > 1 ? 'grid grid-cols-2 gap-2' : ''">
          <div
            v-for="(image, index) in post.images"
            :key="index"
            class="aspect-video bg-surface-container overflow-hidden relative"
          >
            <img :alt="`Post image ${index + 1}`" class="w-full h-full object-cover" :src="image" />
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-surface-container-low/50 mt-2">
          <div class="flex items-center gap-6">
            <button @click="handleLike" class="flex items-center gap-1.5 transition-colors" :class="post.isLiked ? 'text-primary' : 'text-on-surface-variant hover:text-primary'">
              <span class="material-symbols-outlined text-[1.25rem]" :style="{ 'font-variation-settings': post.isLiked ? 'FILL 1' : 'FILL 0' }">favorite</span>
              <span class="text-xs font-medium">{{ post.likes }}</span>
            </button>
            <button class="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-[1.25rem]">chat_bubble</span>
              <span class="text-xs font-medium">{{ post.comments }}</span>
            </button>
          </div>
          <button @click="handleShare" class="text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined text-[1.25rem]">share</span>
          </button>
        </div>
      </article>

      <!-- 评论区 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-lg font-bold font-headline text-on-surface mb-4">评论 ({{ post.comments }})</h2>
        
        <!-- 评论列表 -->
        <div class="space-y-4 mb-4">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="flex items-start gap-3"
          >
            <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
              <img :alt="comment.user.name" class="w-full h-auto" :src="comment.user.avatar" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-bold text-sm">{{ comment.user.name }}</h4>
                <span class="text-xs text-on-surface-variant">{{ comment.time }}</span>
              </div>
              <p class="text-sm text-on-surface">{{ comment.content }}</p>
            </div>
          </div>
        </div>
        
        <!-- 评论输入 -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="My Avatar" class="w-full h-auto" />
          </div>
          <div class="flex-1 relative">
            <input
              v-model="newComment"
              type="text"
              class="w-full bg-surface-container p-3 rounded-full text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              placeholder="写下你的评论..."
              @keyup.enter="handleComment"
            />
          </div>
          <button
            @click="handleComment"
            class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container hover:opacity-80 transition-opacity active:scale-95"
          >
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>