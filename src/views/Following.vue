<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userApi, handleApiError } from '../api/index.js'

const router = useRouter()

const following = ref([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)
const loadingMore = ref(false)

const loadFollowing = async (page = 1, append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }
  error.value = ''
  
  try {
    const response = await userApi.getFollowing(page)
    if (response.success || response.code === 0) {
      const followingData = response.data?.data || response.data || []
      const processedData = followingData.map(user => ({
        ...user,
        avatar: user.avatar ? user.avatar.trim().replace(/^`|`$/g, '') : '',
        isFollowing: true // 默认所有返回的用户都是已关注状态
      }))
      
      if (append) {
        following.value = [...following.value, ...processedData]
      } else {
        following.value = processedData
      }
      
      // 更新分页信息
      if (response.data?.pagination) {
        currentPage.value = response.data.pagination.currentPage
        totalPages.value = response.data.pagination.totalPages
        totalCount.value = response.data.pagination.totalCount
      }
    } else {
      throw new Error(response.message || response.msg || '获取关注列表失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取关注列表失败:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = async () => {
  if (currentPage.value < totalPages.value && !loadingMore.value) {
    await loadFollowing(currentPage.value + 1, true)
  }
}

const handleUserDetail = (userId) => {
  router.push(`/expert/${userId}`)
}

const handleUnfollow = async (userId) => {
  try {
    const response = await userApi.unfollowUser(userId)
    if (response.success || response.code === 0) {
      const user = following.value.find(u => u.userId === userId)
      if (user) {
        user.isFollowing = false
      }
      // 从列表中移除已取消关注的用户
      following.value = following.value.filter(u => u.userId !== userId)
    } else {
      throw new Error(response.message || response.msg || '取消关注失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('取消关注失败:', err)
  }
}

const handleFollow = async (userId) => {
  try {
    const response = await userApi.followUser(userId)
    if (response.success || response.code === 0) {
      const user = following.value.find(u => u.userId === userId)
      if (user) {
        user.isFollowing = true
      }
    } else {
      throw new Error(response.message || response.msg || '关注失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('关注失败:', err)
  }
}

const handleBack = () => {
  router.back()
}

// 格式化标签为数组
const formatTags = (tags) => {
  if (!tags) return []
  return tags.split(',').map(tag => tag.trim())
}

onMounted(() => {
  loadFollowing()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">我的关注</h1>
      </div>
      <div class="text-sm text-on-surface-variant">{{ totalCount }}人</div>
    </header>

    <main class="page-content pt-20 pb-32 space-y-6">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-error/10 border border-error/20 rounded-3xl p-8 text-center">
        <span class="material-symbols-outlined text-error text-4xl mb-4">error_outline</span>
        <p class="text-sm text-error mb-4">{{ error }}</p>
        <button
          @click="loadFollowing"
          class="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          重试
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="following.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-outline text-5xl">person_off</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无关注</h2>
        <p class="text-sm text-on-surface-variant mb-6">快去关注心仪的大神吧</p>
        <button
          @click="router.push('/discover')"
          class="px-8 py-3 bg-primary-container text-on-primary-container rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          去发现
        </button>
      </div>

      <!-- 关注列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="user in following"
          :key="user.id"
          class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 hover:shadow-md"
        >
          <div class="flex items-start gap-4">
            <div
              @click="handleUserDetail(user.userId)"
              class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer relative"
            >
              <img :alt="user.nickname" class="w-full h-full object-cover" :src="user.avatar" />
              <!-- 在线状态 -->
              <div 
                v-if="user.isOnline" 
                class="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div
                  @click="handleUserDetail(user.userId)"
                  class="flex-1 min-w-0 cursor-pointer"
                >
                  <div class="flex items-center gap-2">
                    <h3 class="font-bold text-on-surface truncate">{{ user.nickname }}</h3>
                    <span v-if="user.title" class="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">{{ user.title }}</span>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-1 truncate">{{ user.description }}</p>
                </div>
                <button
                  @click="user.isFollowing ? handleUnfollow(user.userId) : handleFollow(user.userId)"
                  class="px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 flex-shrink-0 ml-2"
                  :class="user.isFollowing ? 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high' : 'bg-primary-container text-on-primary-container'"
                >
                  {{ user.isFollowing ? '已关注' : '关注' }}
                </button>
              </div>
              
              <!-- 游戏信息 -->
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {{ user.game }}
                </span>
                <span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {{ user.rank }}
                </span>
              </div>
              
              <!-- 标签 -->
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  v-for="tag in formatTags(user.tags)"
                  :key="tag"
                  class="bg-surface-container text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-medium"
                >
                  {{ tag }}
                </span>
              </div>
              
              <!-- 统计信息 -->
              <div class="flex items-center gap-4 text-xs text-on-surface-variant">
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">star</span>
                  <span>{{ user.rating }}分</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">attach_money</span>
                  <span>¥{{ user.price }}/局</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">favorite</span>
                  <span>{{ user.likes }}赞</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">level</span>
                  <span>Lv{{ user.level }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多 -->
        <div v-if="currentPage < totalPages" class="text-center py-6">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="px-8 py-3 bg-surface-container text-on-surface-variant rounded-full text-sm font-bold active:scale-95 transition-all disabled:opacity-50"
          >
            <span v-if="loadingMore">加载中...</span>
            <span v-else>加载更多</span>
          </button>
        </div>
        
        <!-- 没有更多数据 -->
        <div v-else-if="following.length > 0" class="text-center py-6 text-sm text-on-surface-variant">
          没有更多数据了
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>