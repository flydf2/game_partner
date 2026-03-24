<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeCategory = ref('hot')
const searchQuery = ref('')
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

const posts = ref([
  {
    id: 1,
    user: {
      name: '林间风',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlkyk2DWoqAMqSUflUl265Ii7S--sjgKUnoHp_qkIK9uW4YWK4t57peM5UOx0i92fhird_hlkuwYjce1i1Ix_HS2QYkENbRjQQUHaf9k7KsxK7U_719an0BAAZY6q7T-oJ9O17vsi77mdMlksC6JbwPkj3JziYokPVUER-nDsZBSTTiMXrmSdKxN7ApaCB6R7rc1YLFHhTbIZVtrVpTZudIk6w8vA4jVA3Zusi4DRCceevuB13RK2Z6n3VYD-yhN22EmkUCuLdXxE',
      game: '英雄联盟'
    },
    time: '2小时前',
    content: '今天在峡谷遇到一个超级温柔的辅助，操作意识拉满！有人想一起组队排位吗？坐标艾欧尼亚，主玩AD。 ✨',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBU8XrMhk3VFwj3Ceer0yCVb-HelGKX5ryLoHAYthnekinYCfvHoJ83xSPEZdrL2tht2CTf_d1atj0kQiKVMY41s8kFOBgY2l5a9dPvoP6yXh3HyA9pdom7W1PkI1l7drYVsVSEeg-BnjsOK2tD_lvHVqzF3VZCAhg6pbcyZj11rhzX6V52RT4jlbNYqEKBRxP818vVewrnT3E6phVAdGXO9zQIWGaIvWWk6pXEzjpNwOh3xDn8FNjv-sGQOhsOt1srbfvB0MFCo-A',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBq4AH6Y7D9L3js3AeN_vpUSza4-PdEYsZbo6sLRP3jUY5UwegYPx3xB9NLMbxzijv13O-siVI5RljmMLqN_Gr5WevHBvslpJbeCO97PCdtgKwNIXBrfQfGanIkq-uktmkkEyoBN9MXdNEwYcjzTObAUzdyii37QkpNmj9bZP7Bcl5uaq012JA-ku0hKny8SxUd9oCA63jFafkb_YzLfo3nDoPbHw27pT7fpKdYQd2sZiXMQL7sMljpCn5eqqS3c5aJtgaLu6pHQpU'
    ],
    likes: 1200,
    comments: 348,
    isFollowing: false
  },
  {
    id: 2,
    user: {
      name: '小禾悠悠',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo3hiZMbuWCmrkmqDp0MNg-nzMlqn4AgGNgFofJ-IJJ59AeEGJZox-r1xg8drTN14GtBID78Yfm0NN6Wl-MX_ZHWaF8-LdFumF5to5bPc46yM5zIaucC3a4KP-Y2-i2tCwQd-duGHsg9F8AzLemDvG9s_6W3hw-pjjJN-PKkQI7oILcDHGkalxMkbZWOmaqIaik3owuV2Ghbrqr3MraHwibw8jkhxJWFQhPSpHM7em0RfJhdOUnqGVa3qBY2EA9DWUXnYNrTFFiM4',
      game: '原神'
    },
    time: '5小时前',
    content: '终于抽到雷电将军了！大家快来吸吸欧气，顺便问下配队方案，目前有行秋和班尼特。🌸',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDpMESPnsbi4t03wXNISsduDaneNSUQYy8CFJQ6WGwywyqmkUeGY562sFOkLCu6pFjjqqs0sbxMrg9JwqOHdCcO-aFFA3Uh2XcpKXedBl_JMAAdIZ19iCVx6GQyYCwO0zuk9xRpZOHHqzfIgD7XyQBa6MYkyr_AyukGeEUUYDV7giFJThyUVuogxAZZYyU6SgGNT62RNNxPFRg1-urZjonnT0y8Zh-OZyb_7b7dlBnbONQqjw2jCO-qEHaONKJ-0zPtkTmZXZzvCrc'
    ],
    likes: 856,
    comments: 120,
    isNew: true
  },
  {
    id: 3,
    user: {
      name: 'Ace玩家',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwJXWYv1t2M1S8jlZ3nJwEK4xXnZfwXDgO_ryYTFAAPD3NJ6pmTUhpeJsra6qrl4sekbm3zZ7874XLIqf6W__ReW-xU87woTXwpcGzN5Q3b-1FAHT-7Q9ZJvEhBpGxJwr8JPIoII8MLGmKtsx2rIr1BNvzlerT6UrU1DTTnRE1vevhiuXzR1drRXXUNZdGjDRSQmxQUYJwpOCdchivrmLpaAcpR5c8eCBholl_o0fI_vrf4Lu_oTTxHGoqzJuNdhfVVbxvwguDqZQ',
      game: '绝地求生'
    },
    time: '昨天',
    content: '"今晚吃鸡，大吉大利！" 🍗\n好久没这么酣畅淋漓地打过药包了，感谢各位队友的灵性拉枪。',
    images: [],
    likes: 233,
    comments: 42
  }
])

const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId
  // 这里可以添加筛选逻辑
  console.log('筛选类别:', categoryId)
}

const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
  // 这里可以添加搜索逻辑
}

const showToast = (message) => {
  toast.value.message = message
  toast.value.show = true
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const handleFollow = (postId) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.isFollowing = !post.isFollowing
    showToast('关注成功！')
  }
}

const handleLike = (postId) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.likes += 1
    showToast('点赞成功！')
  }
}

const handleComment = (postId) => {
  console.log('评论:', postId)
  // 跳转到帖子详情页
  router.push(`/post/${postId}`)
}

const handleShare = (postId) => {
  console.log('分享:', postId)
  // 实现分享功能
  if (navigator.share) {
    navigator.share({
      title: '游戏社区动态',
      text: '来看看这个有趣的动态',
      url: window.location.href
    })
  } else {
    // 复制链接
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

const handlePostClick = (postId) => {
  console.log('查看详情:', postId)
  // 跳转到帖子详情页
  router.push(`/post/${postId}`)
}

const handleCreatePost = () => {
  console.log('创建动态')
  // 跳转到发布动态页面
  router.push('/create-post')
}

const handleViewRewardOrders = () => {
  console.log('查看悬赏订单')
  // 跳转到悬赏订单页面
  router.push('/reward-orders')
}

const handleBack = () => {
  router.back()
}

const handleUserClick = () => {
  console.log('点击用户信息，跳转到专家页面')
  router.push('/expert/3')
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
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

      <!-- Category Selector -->
      <section class="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 py-1">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="handleCategoryChange(category.id)"
          :class="[
            'flex-shrink-0 px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 shadow-sm',
            activeCategory === category.id
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
          ]"
        >
          {{ category.label }}
        </button>
      </section>

      <!-- Feed List -->
      <div class="space-y-4">
        <article
          v-for="post in posts"
          :key="post.id"
          class="bg-surface-container-lowest rounded-3xl p-5 border-none cursor-pointer hover:shadow-md transition-shadow"
          @click="handlePostClick(post.id)"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3" @click.stop="handleUserClick">
              <div class="w-12 h-12 rounded-full overflow-hidden bg-surface-container cursor-pointer hover:opacity-80 transition-opacity">
                <img :alt="post.user.name" class="w-full h-auto" :src="post.user.avatar" />
              </div>
              <div class="cursor-pointer">
                <h3 class="font-bold text-on-surface hover:text-primary transition-colors">{{ post.user.name }}</h3>
                <p class="text-[0.6875rem] text-outline">{{ post.time }} · {{ post.user.game }}</p>
              </div>
            </div>
            <button
              v-if="!post.isFollowing"
              @click.stop="handleFollow(post.id)"
              class="text-primary font-bold px-4 py-1.5 bg-primary-container/10 rounded-full text-sm active:scale-95 transition-transform"
            >
              关注
            </button>
            <span v-else-if="post.isNew" class="px-3 py-1 bg-tertiary-container/20 text-tertiary text-[0.6875rem] font-bold rounded-lg">
              新动态
            </span>
          </div>

          <p class="text-on-surface mb-4 leading-relaxed whitespace-pre-line">{{ post.content }}</p>

          <div v-if="post.images.length > 0" class="rounded-2xl overflow-hidden mb-4" :class="post.images.length > 1 ? 'grid grid-cols-2 gap-2' : ''">
            <div
              v-for="(image, index) in post.images"
              :key="index"
              class="aspect-video bg-surface-container overflow-hidden relative"
            >
              <img :alt="`Post image ${index + 1}`" class="w-full h-full object-cover" :src="image" />
              <div v-if="index === 0 && post.images.length === 1" class="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer">
                <div class="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110">
                  <span class="material-symbols-outlined text-[2rem]" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-surface-container-low/50 mt-2">
            <div class="flex items-center gap-6">
              <button @click.stop="handleLike(post.id)" class="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors active:scale-95 transition-transform">
                <span class="material-symbols-outlined text-[1.25rem]">favorite</span>
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