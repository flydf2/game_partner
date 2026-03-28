<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi, handleApiError } from '../api/index.js'
import ListPageHeader from '../components/ListPageHeader.vue'

const router = useRouter()

const favorites = ref([])
const loading = ref(false)
const error = ref('')

const loadFavorites = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await userApi.getFavorites()
    if (response.success || response.code === 0) {
      const favoritesData = response.data?.data || response.data || []
      favorites.value = favoritesData.map(favorite => ({
        ...favorite,
        avatar: favorite.expertAvatar || favorite.avatar ? (favorite.expertAvatar || favorite.avatar).trim().replace(/^`|`$/g, '') : '',
        id: favorite.id || favorite.expertId,
        name: favorite.expertName || favorite.name,
        nickname: favorite.expertName || favorite.nickname || favorite.name,
        rank: favorite.rank || favorite.skill
      }))
    } else {
      throw new Error(response.message || response.msg || '获取收藏列表失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取收藏列表失败:', err)
  } finally {
    loading.value = false
  }
}

const handleExpertDetail = (expertId) => {
  router.push(`/expert/${expertId}`)
}

const handleRemoveFavorite = async (favoriteId) => {
  try {
    const response = await userApi.removeFavorite(favoriteId)
    if (response.success || response.code === 0) {
      favorites.value = favorites.value.filter(f => f.id !== favoriteId)
    } else {
      throw new Error(response.message || response.msg || '取消收藏失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('取消收藏失败:', err)
  }
}

const handleMenu = () => {
  router.push('/profile')
}

const handleNotifications = () => {
  router.push('/notifications')
}

const handleSearch = () => {
  router.push('/search')
}

const handleProfile = () => {
  router.push('/profile')
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
  loadFavorites()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <ListPageHeader
      title="我的收藏"
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6 pt-20">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-error/10 border border-error/20 rounded-3xl p-8 text-center">
        <span class="material-symbols-outlined text-error text-4xl mb-4">error_outline</span>
        <p class="text-sm text-error mb-4">{{ error }}</p>
        <button
          @click="loadFavorites"
          class="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          重试
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="favorites.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-outline text-5xl">favorite_border</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">暂无收藏</h2>
        <p class="text-sm text-on-surface-variant mb-6">快去发现心仪的大神吧</p>
        <button
          @click="router.push('/discover')"
          class="px-8 py-3 bg-primary-container text-on-primary-container rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          去发现
        </button>
      </div>

      <!-- 收藏列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="favorite in favorites"
          :key="favorite.id"
          class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 hover:shadow-md"
        >
          <div class="flex items-start gap-4">
            <div
              @click="handleExpertDetail(favorite.expertId || favorite.id)"
              class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer relative"
            >
              <img :alt="favorite.nickname || favorite.name" class="w-full h-full object-cover" :src="favorite.expertAvatar || favorite.avatar" />
              <!-- 在线状态 -->
              <div 
                v-if="favorite.isOnline" 
                class="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div
                    @click="handleExpertDetail(favorite.expertId || favorite.id)"
                    class="flex-1 min-w-0 cursor-pointer"
                  >
                    <div class="flex items-center gap-2">
                      <h3 class="font-bold text-on-surface truncate">{{ favorite.expertName || favorite.nickname || favorite.name }}</h3>
                      <span v-if="favorite.title" class="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">{{ favorite.title }}</span>
                    </div>
                    <p class="text-xs text-on-surface-variant mt-1 truncate">{{ favorite.description }}</p>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="material-symbols-outlined text-primary text-sm">star</span>
                    <span class="text-sm font-medium text-primary">{{ favorite.rating }}</span>
                    <span class="text-xs text-on-surface-variant">· {{ favorite.orders || 0 }}单</span>
                  </div>
                </div>
                <button
                  @click="handleRemoveFavorite(favorite.id)"
                  class="material-symbols-outlined text-outline hover:text-error transition-colors flex-shrink-0"
                >
                  favorite
                </button>
              </div>
              
              <!-- 游戏信息 -->
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {{ favorite.game }}
                </span>
                <span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {{ favorite.rank || favorite.skill }}
                </span>
              </div>
              
              <!-- 标签 -->
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  v-for="tag in formatTags(favorite.tags)"
                  :key="tag"
                  class="bg-surface-container text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-medium"
                >
                  {{ tag }}
                </span>
              </div>
              
              <!-- 统计信息 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 text-xs text-on-surface-variant">
                  <div class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">favorite</span>
                    <span>{{ favorite.likes || 0 }}赞</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">level</span>
                    <span>Lv{{ favorite.level || 1 }}</span>
                  </div>
                </div>
                <span class="text-lg font-bold text-primary">¥{{ favorite.price }}/{{ favorite.unit || '局' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>