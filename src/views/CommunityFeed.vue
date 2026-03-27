<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockGetCommunityPosts } from '../api/mock-community.js'
import RewardPostCard from '../components/community/RewardPostCard.vue'
import StandardPostCard from '../components/community/StandardPostCard.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import TopAppBar from '../components/TopAppBar.vue'

const router = useRouter()

const activeCategory = ref('all')
const posts = ref([])
const loading = ref(false)
const categories = [
  { id: 'all', label: '全部' },
  { id: 'reward', label: '悬赏单' },
  { id: 'hot', label: '热门动态' },
  { id: 'guide', label: '攻略心得' }
]

const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await mockGetCommunityPosts({
      category: activeCategory.value === 'all' ? null : activeCategory.value
    })
    
    if (response.code === 0) {
      posts.value = response.data.data || []
    }
  } catch (error) {
    console.error('获取社区动态失败:', error)
  } finally {
    loading.value = false
  }
}

const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId
  fetchPosts()
}

const handlePostClick = (postId) => {
  router.push(`/post/${postId}`)
}

const handleLike = (postId) => {
  console.log('点赞帖子:', postId)
}

const handleComment = (postId) => {
  console.log('评论帖子:', postId)
}

const handleShare = (postId) => {
  console.log('分享帖子:', postId)
}

const handleFollow = (userId) => {
  console.log('关注用户:', userId)
}

const handleCreatePost = () => {
  router.push('/create-post')
}

const handleViewRewardOrders = () => {
  router.push('/reward-orders')
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <TopAppBar title="社区动态" show-back="false" />

    <main class="max-w-md mx-auto px-5 pt-6 space-y-8">
      <section class="space-y-6">
        <div class="flex items-end justify-between">
          <h2 class="text-3xl font-extrabold tracking-tight text-on-surface">社区动态</h2>
          <span class="text-label-sm font-medium text-primary bg-primary-container/20 px-3 py-1 rounded-full">24h 实时更新</span>
        </div>

        <div class="flex gap-3 overflow-x-auto no-scrollbar py-1">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="handleCategoryChange(category.id)"
            :class="[
              'flex-none px-6 py-2.5 rounded-full font-bold transition-all active:scale-95',
              activeCategory === category.id
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            ]"
          >
            {{ category.label }}
          </button>
        </div>
      </section>

      <section class="space-y-6">
        <RewardPostCard
          v-if="activeCategory === 'all' || activeCategory === 'reward'"
          v-for="post in posts.filter(p => p.type === 'reward')"
          :key="post.id"
          :post="post"
          @click="handlePostClick"
          @like="handleLike"
          @comment="handleComment"
          @share="handleShare"
          @follow="handleFollow"
        />

        <StandardPostCard
          v-if="activeCategory === 'all' || activeCategory === 'hot'"
          v-for="post in posts.filter(p => p.type === 'normal')"
          :key="post.id"
          :post="post"
          @click="handlePostClick"
          @like="handleLike"
          @comment="handleComment"
          @share="handleShare"
          @follow="handleFollow"
        />
      </section>
    </main>

    <button
      @click="handleCreatePost"
      class="fixed right-6 bottom-28 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-all z-40"
    >
      <span class="material-symbols-outlined text-3xl">edit</span>
    </button>

    <BottomNavBar />
  </div>
</template>
