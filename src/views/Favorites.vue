<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const favorites = ref([
  {
    id: 1,
    type: 'expert',
    expertId: '1',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    name: '电竞少女',
    game: '英雄联盟',
    skill: '钻石段位',
    price: 48,
    rating: 4.9,
    orders: 128,
    tags: ['技术陪练', '温柔语聊']
  },
  {
    id: 2,
    type: 'expert',
    expertId: '2',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    name: '游戏大师',
    game: 'CS:GO',
    skill: '大师段位',
    price: 52,
    rating: 4.8,
    orders: 95,
    tags: ['技术陪练', '战术指导']
  },
  {
    id: 3,
    type: 'expert',
    expertId: '3',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: '安妮喵呜',
    game: '绝地求生',
    skill: '温柔语聊',
    price: 55,
    rating: 5.0,
    orders: 236,
    tags: ['温柔语聊', '游戏陪伴']
  }
])

const loading = ref(false)
const error = ref('')

const handleExpertDetail = (expertId) => {
  router.push(`/expert/${expertId}`)
}

const handleRemoveFavorite = async (favoriteId) => {
  try {
    // 模拟取消收藏
    favorites.value = favorites.value.filter(f => f.id !== favoriteId)
  } catch (err) {
    console.error('取消收藏失败:', err)
  }
}

const handleBack = () => {
  router.back()
}
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
        <h1 class="font-headline font-bold text-lg text-primary">我的收藏</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="max-w-2xl mx-auto space-y-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-error/10 border border-error/20 rounded-3xl p-8 text-center">
        <span class="material-symbols-outlined text-error text-4xl mb-4">error_outline</span>
        <p class="text-sm text-error mb-4">{{ error }}</p>
        <button
          @click="loading = false; error = ''"
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
              @click="handleExpertDetail(favorite.expertId)"
              class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
            >
              <img :alt="favorite.name" class="w-full h-full object-cover" :src="favorite.avatar" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div
                  @click="handleExpertDetail(favorite.expertId)"
                  class="flex-1 min-w-0 cursor-pointer"
                >
                  <h3 class="font-bold text-on-surface truncate">{{ favorite.name }}</h3>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="material-symbols-outlined text-primary text-sm">star</span>
                    <span class="text-sm font-medium text-primary">{{ favorite.rating }}</span>
                    <span class="text-xs text-on-surface-variant">· {{ favorite.orders }}单</span>
                  </div>
                </div>
                <button
                  @click="handleRemoveFavorite(favorite.id)"
                  class="material-symbols-outlined text-outline hover:text-error transition-colors flex-shrink-0"
                >
                  favorite
                </button>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {{ favorite.game }}
                </span>
                <span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {{ favorite.skill }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex gap-1 flex-wrap">
                  <span
                    v-for="tag in favorite.tags"
                    :key="tag"
                    class="bg-surface-container text-on-surface-variant text-[10px] px-2 py-0.5 rounded"
                  >
                    {{ tag }}
                  </span>
                </div>
                <span class="text-lg font-bold text-primary">¥{{ favorite.price }}/小时</span>
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