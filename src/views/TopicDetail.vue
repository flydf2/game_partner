<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { communityApi } from '../api/index.js'
import LazyImage from '../components/common/LazyImage.vue'
import { mockGames } from '../api/mock-category.js'

const route = useRoute()
const router = useRouter()

const topicName = ref(decodeURIComponent(route.params.id || '英雄联盟'))
const topic = ref(null)
const posts = ref([])
const activeTab = ref('hot')
const loading = ref(false)
const error = ref(null)
const toast = ref({
  show: false,
  message: ''
})

const gameMap = computed(() => {
  const map = {}
  mockGames.forEach(game => {
    map[game.name] = game
  })
  return map
})

const currentGame = computed(() => {
  return gameMap.value[topicName.value] || null
})

const tabs = [
  { id: 'hot', label: '最热动态' },
  { id: 'new', label: '最新发布' },
  { id: 'guide', label: '大神心得' },
  { id: 'team', label: '开黑组队' }
]

const fetchTopicDetail = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await communityApi.getTopicDetail(topicName.value)
    
    if (response.success || response.code === 0) {
      const topicData = response.data?.data || response.data
      const game = currentGame.value
      topic.value = {
        ...topicData,
        cover: topicData.cover || (game ? `https://via.placeholder.com/400/6c5a00/ffffff?text=${encodeURIComponent(game.name)}` : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJCdVR4SWlVmZS2MfQxv4neWDHVSFi46iFu7fIlPuVcLUzoMaMncSZHdLUkeV6uno5pL3MvmUa7m5q3jQFEiIa1tlYhxIxW43ul0iN37eeYHJZEAZD_Nonsn3SrL3j3htSrp0l3GDtWDA4dsGL-GTGfRJU5k7W99I3RnHFfw_bieodydRDntxEspPO8D_yu3K5n-8DSp_x_AKb77wFMUJe9DzUntWS-mfd2UsJzyUft_2rZPiJ1jRBVJQqDMGpVHTdG6aRdOaK2tU'),
        title: topicData.title || (game ? `#${game.name}` : '#王者荣耀'),
        description: topicData.description || (game ? `这里是《${game.name}》官方讨论社区，分享你的高光时刻、上分心得，寻找志同道合的开黑队友。` : '集结最强召唤师！这里是《王者荣耀》官方讨论社区，分享你的高光时刻、上分心得，寻找志同道合的开黑队友。'),
        participantCount: topicData.participantCount || 125000,
        postCount: topicData.postCount || 482000
      }
    } else {
      throw new Error(response.message || response.msg || '获取话题详情失败')
    }
  } catch (err) {
    error.value = err.message
    console.error('获取话题详情失败:', err)
  } finally {
    loading.value = false
  }
}

const fetchPosts = async () => {
  if (loading.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await communityApi.getTopicPosts(topicId.value, {
      category: activeTab.value
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
          user: post.user || {
            id: post.userId || post.user_id || '1',
            name: post.user?.name || `用户${post.userId || post.user_id || '1'}`,
            avatar: post.user?.avatar || `https://randomuser.me/api/portraits/${(post.userId || post.user_id || 1) % 2 === 0 ? 'women' : 'men'}/${(post.userId || post.user_id || 1) % 70 + 1}.jpg`,
            game: post.user?.game || post.game || '未知游戏',
            level: post.user?.level || post.level || null
          },
          time: post.time || formatTime(post.createdAt),
          isLiked: post.isLiked || false,
          isFollowing: post.isFollowing || false,
          images: imagesArray
        }
      })
    } else {
      throw new Error(response.message || response.msg || '获取动态失败')
    }
  } catch (err) {
    error.value = err.message
    console.error('获取动态失败:', err)
  } finally {
    loading.value = false
  }
}

const handleTabChange = async (tabId) => {
  activeTab.value = tabId
  await fetchPosts()
}

const handleFollowTopic = async () => {
  try {
    await communityApi.followTopic(topicId.value)
    showToast('关注成功！')
  } catch (err) {
    console.error('关注话题失败:', err)
    showToast('操作失败，请稍后重试')
  }
}

const handleCreatePost = () => {
  router.push('/create-post')
}

const handlePostClick = (postId) => {
  router.push(`/post/${postId}`)
}

const handleUserClick = (userId) => {
  router.push(`/expert/${userId}`)
}

const handleFollowUser = async (postId, userId) => {
  try {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      if (!post.isFollowing) {
        await communityApi.followUser(userId)
        post.isFollowing = true
        showToast('关注成功！')
      } else {
        await communityApi.unfollowUser(userId)
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
  router.push(`/post/${postId}`)
}

const handleShare = (postId) => {
  if (navigator.share) {
    navigator.share({
      title: '游戏社区动态',
      text: '来看看这个有趣的动态',
      url: `${window.location.origin}/post/${postId}`
    })
  } else {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
    showToast('链接已复制到剪贴板')
  }
}

const showToast = (message) => {
  toast.value.message = message
  toast.value.show = true
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
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

const handleBack = () => {
  router.back()
}

const handleClaimExpert = () => {
  router.push('/expert-verification')
}

onMounted(() => {
  fetchTopicDetail()
  fetchPosts()
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-32">
    <nav class="fixed top-0 w-full z-50 bg-[#f6f6f6] dark:bg-neutral-900">
      <div class="flex items-center justify-between px-5 h-16 w-full">
        <div class="flex items-center gap-3">
          <span
            @click="handleBack"
            class="material-symbols-outlined text-[#6c5a00] dark:text-[#FFD700] cursor-pointer hover:bg-[#FFD700]/10 rounded-full p-2 transition-colors active:scale-95 duration-200"
          >
            arrow_back_ios
          </span>
          <h1 class="text-[#6c5a00] dark:text-[#FFD700] font-headline font-black tracking-tighter text-lg">SunnyPlay</h1>
        </div>
        <div class="flex items-center gap-4">
          <button class="p-2 rounded-full hover:bg-[#FFD700]/10 transition-colors active:scale-95 duration-200">
            <span class="material-symbols-outlined text-[#6c5a00] dark:text-[#FFD700]">notifications</span>
          </button>
        </div>
      </div>
      <div class="bg-neutral-200/50 dark:bg-neutral-800/50 h-[1px] w-full"></div>
    </nav>

    <main class="page-content pt-24 space-y-8">
      <section class="relative">
        <div class="flex flex-col md:flex-row gap-6 items-start">
          <div class="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-[2rem] overflow-hidden bg-primary-container shadow-sm rotate-3">
            <LazyImage
              :src="topic?.cover"
              :alt="topic?.title || '话题封面'"
              :rounded="'2rem'"
              :aspect-ratio="'1/1'"
              class="w-full h-full object-cover -rotate-3 scale-110"
            />
          </div>
          <div class="flex-grow space-y-4">
            <div class="flex justify-between items-start">
              <div class="space-y-4">
                <div class="inline-flex items-center px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-[10px] font-bold tracking-wider">
                  HOT TOPIC
                </div>
                <h1 class="text-4xl md:text-5xl font-headline font-extrabold text-on-surface leading-none tracking-tight">
                  {{ topic?.title || '#王者荣耀' }}
                </h1>
              </div>
              <button
                @click="handleClaimExpert"
                class="px-5 py-2 bg-primary-container text-primary rounded-full text-sm font-bold hover:bg-primary/90 transition-colors active:scale-95"
              >
                认领大神
              </button>
            </div>
            <p class="text-on-surface-variant text-sm max-w-md leading-relaxed">
              {{ topic?.description || '集结最强召唤师！这里是《王者荣耀》官方讨论社区，分享你的高光时刻、上分心得，寻找志同道合的开黑队友。' }}
            </p>
            <div class="flex gap-8">
              <div>
                <span class="block text-2xl font-headline font-bold text-primary">{{ topic?.participantCount ? (topic.participantCount / 10000).toFixed(1) + 'w' : '12.5w' }}</span>
                <span class="text-xs text-on-surface-variant">参与人数</span>
              </div>
              <div>
                <span class="block text-2xl font-headline font-bold text-primary">{{ topic?.postCount ? (topic.postCount / 10000).toFixed(1) + 'w' : '48.2w' }}</span>
                <span class="text-xs text-on-surface-variant">动态总数</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabChange(tab.id)"
          :class="[
            'shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-colors',
            activeTab === tab.id
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-on-surface-variant">加载中...</p>
      </div>

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

      <div v-else class="grid grid-cols-1 gap-6">
        <article
          v-for="post in posts"
          :key="post.id"
          class="group bg-surface-container-lowest p-5 rounded-[1.5rem] space-y-4 shadow-sm hover:shadow-md transition-shadow"
          @click="handlePostClick(post.id)"
        >
          <div class="flex justify-between items-start">
            <div class="flex gap-3">
              <div
                class="w-12 h-12 rounded-full overflow-hidden bg-surface-container-low cursor-pointer hover:opacity-80 transition-opacity"
                @click.stop="handleUserClick(post.user?.id || post.user?.userId)"
              >
                <LazyImage
                  :src="post.user?.avatar"
                  :alt="post.user?.name"
                  :rounded="'50%'"
                  :aspect-ratio="'1/1'"
                />
              </div>
              <div
                class="cursor-pointer"
                @click.stop="handleUserClick(post.user?.id || post.user?.userId)"
              >
                <h3 class="font-bold text-on-surface flex items-center gap-1">
                  {{ post.user?.name || '用户' }}
                  <span
                    v-if="post.user?.level"
                    class="material-symbols-outlined text-sm text-[#FFD700]"
                    style="font-variation-settings: 'FILL' 1;"
                  >
                    military_tech
                  </span>
                </h3>
                <p class="text-[10px] text-on-surface-variant">{{ post.time }} · {{ post.user?.game || '刚刚拿到五连绝世' }}</p>
              </div>
            </div>
            <button
              v-if="!post.isFollowing && (post.user?.id || post.user?.userId)"
              @click.stop="handleFollowUser(post.id, post.user?.id || post.user?.userId)"
              class="text-primary text-xs font-bold px-4 py-1.5 bg-primary-container/20 rounded-full active:scale-95 transition-transform"
            >
              + 关注
            </button>
          </div>

          <p class="text-on-surface text-sm leading-relaxed whitespace-pre-line">
            {{ post.content }}
          </p>

          <div
            v-if="post.images && post.images.length > 0"
            class="grid grid-cols-2 gap-3 aspect-video"
          >
            <div
              v-for="(image, index) in post.images.slice(0, 2)"
              :key="index"
              class="w-full h-full object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
              @click.stop="handlePostClick(post.id)"
            >
              <LazyImage
                :src="image"
                :alt="`Post image ${index + 1}`"
                :rounded="'0.75rem'"
                :aspect-ratio="'16/9'"
              />
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <div class="flex gap-6">
              <button
                @click.stop="handleLike(post.id)"
                class="flex items-center gap-1.5 text-on-surface-variant text-sm hover:text-primary transition-colors active:scale-95 transition-transform"
              >
                <span class="material-symbols-outlined text-[20px]">favorite</span>
                <span>{{ post.likes || '1.2k' }}</span>
              </button>
              <button
                @click.stop="handleComment(post.id)"
                class="flex items-center gap-1.5 text-on-surface-variant text-sm hover:text-primary transition-colors active:scale-95 transition-transform"
              >
                <span class="material-symbols-outlined text-[20px]">mode_comment</span>
                <span>{{ post.comments || '342' }}</span>
              </button>
            </div>
            <button
              @click.stop="handleShare(post.id)"
              class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors active:scale-95 transition-transform"
            >
              share
            </button>
          </div>
        </article>
      </div>
    </main>

    <button
      @click="handleCreatePost"
      class="fixed bottom-24 right-6 w-14 h-14 bg-primary-container text-primary rounded-full shadow-[0_8px_30px_rgb(255,215,9,0.4)] flex items-center justify-center active:scale-90 transition-all z-40"
    >
      <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'wght' 600;">edit</span>
    </button>

    <div v-if="toast.show" class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-bold shadow-lg z-50 animate-fade-in-out">
      {{ toast.message }}
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
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
