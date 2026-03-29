<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32" >
    
    <AppHeader
      title="用户动态"
      @back="handleBack"
    />
    
    <main class="page-content pb-32">
      <!-- 用户信息 -->
      <div class="bg-surface-container-lowest p-5">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-primary-container/30">
            <img :src="userInfo.avatar" alt="User Avatar" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-on-surface">{{ userInfo.nickname }}</h3>
            <p class="text-xs text-on-surface-variant">ID: {{ userInfo.id }}</p>
            <div class="flex items-center gap-3 mt-2">
              <div class="text-center">
                <p class="text-sm font-bold">{{ userInfo.postCount }}</p>
                <p class="text-xs text-on-surface-variant">动态</p>
              </div>
              <div class="text-center">
                <p class="text-sm font-bold">{{ userInfo.followerCount }}</p>
                <p class="text-xs text-on-surface-variant">粉丝</p>
              </div>
              <div class="text-center">
                <p class="text-sm font-bold">{{ userInfo.followingCount }}</p>
                <p class="text-xs text-on-surface-variant">关注</p>
              </div>
            </div>
          </div>
          <button 
            :class="['px-4 py-2 rounded-full text-sm font-bold transition-all', isFollowing ? 'bg-surface-container text-on-surface' : 'bg-primary text-on-primary']"
            @click="handleFollow"
          >
            {{ isFollowing ? '已关注' : '关注' }}
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="p-5 space-y-4">
        <!-- 加载状态 -->
        <div v-if="loading" class="bg-surface-container-lowest rounded-3xl p-8 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3">
            <div class="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-on-surface-variant">加载中...</p>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="bg-surface-container-lowest rounded-3xl p-6">
          <div class="flex flex-col items-center gap-3">
            <span class="material-symbols-outlined text-error text-3xl">error_outline</span>
            <p class="text-sm text-error">{{ error }}</p>
            <button 
              class="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
              @click="loadPosts"
            >
              重试
            </button>
          </div>
        </div>

        <!-- 动态列表 -->
        <div v-else-if="posts.length > 0" class="space-y-4">
          <div 
            v-for="post in posts" 
            :key="post.id"
            class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 active:scale-[0.98] hover:bg-surface-container-low cursor-pointer"
            @click="handlePostDetail(post.id)"
          >
            <div class="flex items-start gap-3 mb-3">
              <div class="w-10 h-10 rounded-full overflow-hidden">
                <img :src="post.avatar" alt="Avatar" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-sm">{{ post.nickname }}</h4>
                <p class="text-xs text-on-surface-variant mt-1">{{ post.content }}</p>
              </div>
            </div>
            <div v-if="post.image" class="w-full rounded-2xl overflow-hidden mb-3">
              <img :src="post.image" alt="Post Image" class="w-full h-auto object-cover" />
            </div>
            <div class="flex items-center justify-between text-xs text-on-surface-variant">
              <span>{{ post.createdAt }}</span>
              <div class="flex items-center gap-4">
                <button class="flex items-center gap-1 transition-colors hover:text-primary" @click.stop="handleLike(post.id)">
                  <span class="material-symbols-outlined text-sm" :class="{ 'text-primary': post.isLiked }">favorite</span>
                  {{ post.likes }}
                </button>
                <button class="flex items-center gap-1 transition-colors hover:text-primary" @click.stop="handlePostDetail(post.id)">
                  <span class="material-symbols-outlined text-sm">comment</span>
                  {{ post.comments }}
                </button>
                <button class="flex items-center gap-1 transition-colors hover:text-primary">
                  <span class="material-symbols-outlined text-sm">share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="bg-surface-container-lowest rounded-3xl p-8 text-center">
          <div class="w-20 h-20 mx-auto bg-surface-container flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-outline text-4xl">post_add</span>
          </div>
          <p class="text-sm text-on-surface-variant">暂无发布的动态</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { communityApi, userApi, handleApiError } from '../api/index.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const userId = ref(route.params.id)
const loading = ref(false)
const error = ref('')
const posts = ref([])
const userInfo = ref({
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  nickname: '用户',
  id: '',
  postCount: 0,
  followerCount: 0,
  followingCount: 0
})
const isFollowing = ref(false)

const loadUserInfo = async () => {
  try {
    const response = await userApi.getUserInfo(userId.value)
    if (response.success || response.code === 0) {
      userInfo.value = {
        avatar: response.data.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
        nickname: response.data.nickname || response.data.username || '用户',
        id: response.data.id || '',
        postCount: response.data.postCount || 0,
        followerCount: response.data.followerCount || 0,
        followingCount: response.data.followingCount || 0
      }
      isFollowing.value = response.data.isFollowing || false
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
  }
}

const loadPosts = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await communityApi.getUserPosts(userId.value)
    if (response.success || response.code === 0) {
      posts.value = (response.data?.data || response.data || []).map(post => ({
        id: post.id,
        avatar: post.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
        nickname: post.nickname || '用户',
        content: post.content || '',
        image: post.image || '',
        likes: post.likes || 0,
        comments: post.comments || 0,
        isLiked: post.isLiked || false,
        createdAt: formatDate(post.createdAt)
      }))
    } else {
      throw new Error(response.message || response.msg || '获取动态失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取动态失败:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '未知时间'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const handlePostDetail = (postId) => {
  router.push(`/post/${postId}`)
}

const handleLike = async (postId) => {
  try {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    const response = await communityApi.likePost(postId)
    if (response.success || response.code === 0) {
      post.isLiked = !post.isLiked
      post.likes += post.isLiked ? 1 : -1
      showToast(post.isLiked ? '点赞成功' : '取消点赞', 'success')
    } else {
      throw new Error(response.message || response.msg || '操作失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    showToast(result.error, 'error')
    console.error('点赞操作失败:', err)
  }
}

const handleFollow = async () => {
  try {
    const response = await userApi.followUser(userId.value)
    if (response.success || response.code === 0) {
      isFollowing.value = !isFollowing.value
      userInfo.value.followerCount += isFollowing.value ? 1 : -1
      showToast(isFollowing.value ? '关注成功' : '取消关注', 'success')
    } else {
      throw new Error(response.message || response.msg || '操作失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    showToast(result.error, 'error')
    console.error('关注操作失败:', err)
  }
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  loadUserInfo()
  loadPosts()
})
</script>

<style scoped>
/* 组件样式 */

/* 页面滚动动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

main {
  animation: fadeIn 0.5s ease-out forwards;
}

/* 移动端适配 */
@media (max-width: 375px) {
  .p-5 {
    padding: 1rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
  
  .w-16 {
    width: 4rem;
  }
  
  .h-16 {
    height: 4rem;
  }
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 触摸反馈优化 */
button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
</style>