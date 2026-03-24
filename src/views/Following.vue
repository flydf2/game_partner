<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const following = ref([
  {
    id: 1,
    userId: '1',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    name: '电竞少女',
    bio: '钻石段位，技术陪练',
    games: ['英雄联盟'],
    followers: 1280,
    isFollowing: true
  },
  {
    id: 2,
    userId: '2',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    name: '游戏大师',
    bio: 'CS:GO大师段位，战术指导',
    games: ['CS:GO', 'Valorant'],
    followers: 956,
    isFollowing: true
  },
  {
    id: 3,
    userId: '3',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: '安妮喵呜',
    bio: '温柔语聊，游戏陪伴',
    games: ['绝地求生', '王者荣耀'],
    followers: 2368,
    isFollowing: true
  }
])

const loading = ref(false)
const error = ref('')

const handleUserDetail = (userId) => {
  router.push(`/expert/${userId}`)
}

const handleUnfollow = async (userId) => {
  try {
    // 模拟取消关注
    const user = following.value.find(u => u.userId === userId)
    if (user) {
      user.isFollowing = false
      user.followers--
    }
  } catch (err) {
    console.error('取消关注失败:', err)
  }
}

const handleFollow = async (userId) => {
  try {
    // 模拟关注
    const user = following.value.find(u => u.userId === userId)
    if (user) {
      user.isFollowing = true
      user.followers++
    }
  } catch (err) {
    console.error('关注失败:', err)
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
        <h1 class="font-headline font-bold text-lg text-primary">我的关注</h1>
      </div>
      <div class="text-sm text-on-surface-variant">{{ following.length }}人</div>
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
              class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
            >
              <img :alt="user.name" class="w-full h-full object-cover" :src="user.avatar" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div
                  @click="handleUserDetail(user.userId)"
                  class="flex-1 min-w-0 cursor-pointer"
                >
                  <h3 class="font-bold text-on-surface truncate">{{ user.name }}</h3>
                  <p class="text-xs text-on-surface-variant mt-1 truncate">{{ user.bio }}</p>
                </div>
                <button
                  @click="user.isFollowing ? handleUnfollow(user.userId) : handleFollow(user.userId)"
                  class="px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 flex-shrink-0 ml-2"
                  :class="user.isFollowing ? 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high' : 'bg-primary-container text-on-primary-container'"
                >
                  {{ user.isFollowing ? '已关注' : '关注' }}
                </button>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <span
                  v-for="game in user.games"
                  :key="game"
                  class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-medium"
                >
                  {{ game }}
                </span>
              </div>
              <div class="flex items-center gap-1 text-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-sm">people</span>
                <span>{{ user.followers }} 粉丝</span>
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