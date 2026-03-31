<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { communityApi, userApi } from '../api/index.js'
import { useModal } from '../composables/useModal.js'

const route = useRoute()
const router = useRouter()
const { success: showSuccess, error: showError, info: showInfo } = useModal()

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

    const response = await communityApi.getPostDetail(postId.value)

    if (response.success || response.code === 0) {
      const postData = response.data?.data || response.data

      let imagesArray = []
      if (postData.images) {
        if (Array.isArray(postData.images)) {
          imagesArray = postData.images
        } else {
          imagesArray = postData.images.split(',')
        }
      }

      let rewardInfo = null
      if (postData.extJson) {
        try {
          rewardInfo = typeof postData.extJson === 'string' ? JSON.parse(postData.extJson) : postData.extJson
        } catch (e) {
          console.error('解析 extJson 失败:', e)
        }
      }

      post.value = {
        ...postData,
        type: postData.type || 'normal',
        rewardInfo: rewardInfo,
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

      if (postData.commentsList && postData.commentsList.length > 0) {
        comments.value = postData.commentsList.map(comment => ({
          ...comment,
          user: comment.user || {
            id: comment.userId || comment.user_id || '1',
            name: comment.user?.name || `用户${comment.userId || comment.user_id || '1'}`,
            avatar: comment.user?.avatar || `https://randomuser.me/api/portraits/${(comment.userId || comment.user_id || 1) % 2 === 0 ? 'women' : 'men'}/${(comment.userId || comment.user_id || 1) % 70 + 1}.jpg`
          },
          time: comment.time || formatTime(comment.createdAt)
        }))
      }
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

const loadComments = async () => {
  try {
    const response = await communityApi.getComments(postId.value)

    if (response.success || response.code === 0) {
      const commentsData = response.data?.data || response.data || []

      comments.value = commentsData.map(comment => ({
        ...comment,
        user: comment.user || {
          id: comment.userId || comment.user_id || '1',
          name: comment.user?.name || `用户${comment.userId || comment.user_id || '1'}`,
          avatar: comment.user?.avatar || `https://randomuser.me/api/portraits/${(comment.userId || comment.user_id || 1) % 2 === 0 ? 'women' : 'men'}/${(comment.userId || comment.user_id || 1) % 70 + 1}.jpg`
        },
        time: comment.time || formatTime(comment.createdAt)
      }))
    }
  } catch (err) {
    console.error('加载评论失败:', err)
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
      showSuccess('链接已复制到剪贴板')
    }
  }
}

const handleFollow = async () => {
  if (post.value && post.value.user) {
    try {
      if (post.value.user.id) {
        if (post.value.isFollowing) {
          // 取消关注
          const response = await userApi.unfollowUser(post.value.user.id)
          if (response.success) {
            post.value.isFollowing = false
          }
        } else {
          // 关注
          const response = await userApi.followUser(post.value.user.id)
          if (response.success) {
            post.value.isFollowing = true
          }
        }
      }
    } catch (error) {
      console.error('关注失败:', error)
    }
  }
}

const handleBack = () => {
  router.back()
}

const isAuthor = ref(false)
const postBids = ref([])

const checkIsAuthor = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  isAuthor.value = post.value?.user?.id === currentUser.id || post.value?.user?.userId === currentUser.id
}

const loadBids = async () => {
  if (post.value?.id) {
    try {
      const response = await communityApi.getBids(post.value.id)
      if (response.success && response.data) {
        postBids.value = response.data
      }
    } catch (error) {
      console.error('加载抢单列表失败:', error)
    }
  }
}

const handleBid = async () => {
  if (!post.value?.id) return
  
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    
    const bidData = {
      postId: post.value.id,
      userId: currentUser.id,
      message: '我想接这个单子',
      status: 'pending'
    }
    
    const response = await communityApi.createBid(bidData)
    
    if (response.success) {
      post.value.isBidding = true
      postBids.value.unshift(response.data)
    }
  } catch (error) {
    console.error('抢单失败:', error)
    showError('抢单失败，请稍后重试')
  }
}

const cancelBid = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    const myBid = postBids.value.find(bid => bid.userId === currentUser.id)
    
    if (myBid) {
      const response = await communityApi.cancelBid(myBid.id)
      
      if (response.success) {
        post.value.isBidding = false
        postBids.value = postBids.value.filter(bid => bid.id !== myBid.id)
      }
    }
  } catch (error) {
    console.error('取消抢单失败:', error)
    showError('取消失败，请稍后重试')
  }
}

const acceptBid = async (bid) => {
  try {
    const response = await communityApi.acceptBid(bid.id)
    
    if (response.success) {
      bid.status = 'accepted'
      post.value.rewardInfo.status = 'completed'
      showSuccess('接单成功，已通知用户')
    }
  } catch (error) {
    console.error('接单失败:', error)
    showError('接单失败，请稍后重试')
  }
}

const rejectBid = async (bid) => {
  try {
    const response = await communityApi.rejectBid(bid.id)
    
    if (response.success) {
      bid.status = 'rejected'
      showSuccess('已拒绝该抢单申请')
    }
  } catch (error) {
    console.error('拒绝失败:', error)
    showError('拒绝失败，请稍后重试')
  }
}

onMounted(() => {
  loadPostDetail().then(() => {
    checkIsAuthor()
    if (post.value?.type === 'reward') {
      loadBids()
    }
  })
  loadComments()
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

    <main v-if="loading" class="page-content pt-20 py-12">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </main>

    <main v-else-if="error" class="page-content pt-20 py-12">
      <div class="flex flex-col items-center justify-center space-y-4">
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

    <main v-else-if="post" class="page-content pt-24 pb-32 space-y-6">
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
            v-if="post.user?.id"
            @click="handleFollow"
            :class="post.isFollowing ? 'text-on-surface-variant font-medium px-4 py-1.5 bg-surface-container rounded-full text-sm active:scale-95 transition-transform' : 'text-primary font-bold px-4 py-1.5 bg-primary-container/10 rounded-full text-sm active:scale-95 transition-transform'"
          >
            {{ post.isFollowing ? '已关注' : '关注' }}
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

      <!-- 悬赏订单展示 -->
      <article v-if="post.type === 'reward' && post.rewardInfo" class="bg-surface-container-lowest rounded-3xl p-5">
        <div class="flex items-center gap-2 mb-4">
          <span class="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full">
            💰 悬赏订单
          </span>
          <span class="text-xs text-on-surface-variant">
            {{ post.rewardInfo.rewardAmount }} {{ post.rewardInfo.rewardType }} · 截止：{{ post.rewardInfo.deadline }}
          </span>
        </div>

        <div class="bg-surface-container-high rounded-2xl p-4 mb-4 border border-primary-container/10">
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

        <!-- 抢单功能 -->
        <div v-if="post.rewardInfo.status === 'available'" class="space-y-4">
          <!-- 抢单按钮 -->
          <button
            v-if="!post.isBidding"
            @click="handleBid"
            class="w-full py-3.5 bg-primary text-on-primary rounded-full font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-primary-container/20"
          >
            立即抢单
          </button>

          <!-- 已抢单状态 -->
          <div v-else class="flex items-center justify-between bg-primary-container/10 rounded-2xl p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center">
                <span class="material-symbols-outlined text-sm">check_circle</span>
              </div>
              <div>
                <p class="text-sm font-bold text-on-surface">已提交抢单申请</p>
                <p class="text-xs text-on-surface-variant">等待作者审核中...</p>
              </div>
            </div>
            <button
              @click="cancelBid"
              class="text-error text-xs font-bold px-3 py-1.5 bg-error-container/10 rounded-full active:scale-95 transition-transform"
            >
              取消
            </button>
          </div>

          <!-- 抢单列表（作者视角） -->
          <div v-if="isAuthor" class="space-y-3">
            <h3 class="text-sm font-bold text-on-surface">抢单申请 ({{ bidList.length }})</h3>
            <div
              v-for="bid in bidList"
              :key="bid.id"
              class="flex items-center gap-3 p-3 bg-surface-container-high rounded-2xl border border-surface-container"
            >
              <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                <img :src="bid.user.avatar" :alt="bid.user.name" class="w-full h-auto" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-bold text-on-surface">{{ bid.user.name }}</p>
                  <span class="text-xs text-on-surface-variant">{{ bid.time }}</span>
                </div>
                <p class="text-xs text-on-surface-variant">{{ bid.message }}</p>
              </div>
              <button
                v-if="bid.status === 'pending'"
                @click="acceptBid(bid)"
                class="px-3 py-1.5 bg-primary text-on-primary rounded-full text-xs font-bold active:scale-95 transition-transform"
              >
                接单
              </button>
              <span v-else-if="bid.status === 'accepted'" class="text-xs text-success font-bold">已接单</span>
              <span v-else-if="bid.status === 'rejected'" class="text-xs text-error font-bold">已拒绝</span>
            </div>
          </div>
        </div>

        <!-- 订单已完成 -->
        <div v-else-if="post.rewardInfo.status === 'completed'" class="flex items-center gap-3 p-4 bg-success-container/10 rounded-2xl">
          <div class="w-10 h-10 rounded-full bg-success text-on-success flex items-center justify-center">
            <span class="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <p class="text-sm font-bold text-success">订单已完成</p>
            <p class="text-xs text-on-surface-variant">服务已交付，金钱已划拨</p>
          </div>
        </div>

        <!-- 订单已取消 -->
        <div v-else-if="post.rewardInfo.status === 'cancelled'" class="flex items-center gap-3 p-4 bg-error-container/10 rounded-2xl">
          <div class="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center">
            <span class="material-symbols-outlined">cancel</span>
          </div>
          <div>
            <p class="text-sm font-bold text-error">订单已取消</p>
            <p class="text-xs text-on-surface-variant">悬赏金已退回</p>
          </div>
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