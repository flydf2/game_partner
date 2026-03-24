<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const postId = ref(route.params.id || '1')
const post = ref(null)
const comments = ref([])
const newComment = ref('')
const loading = ref(true)

const loadPostDetail = async () => {
  try {
    loading.value = true
    // 模拟数据
    post.value = {
      id: postId.value,
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
      isLiked: false,
      isFollowing: false
    }
    
    // 模拟评论数据
    comments.value = [
      {
        id: 1,
        user: {
          name: '小禾悠悠',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo3hiZMbuWCmrkmqDp0MNg-nzMlqn4AgGNgFofJ-IJJ59AeEGJZox-r1xg8drTN14GtBID78Yfm0NN6Wl-MX_ZHWaF8-LdFumF5to5bPc46yM5zIaucC3a4KP-Y2-i2tCwQd-duGHsg9F8AzLemDvG9s_6W3hw-pjjJN-PKkQI7oILcDHGkalxMkbZWOmaqIaik3owuV2Ghbrqr3MraHwibw8jkhxJWFQhPSpHM7em0RfJhdOUnqGVa3qBY2EA9DWUXnYNrTFFiM4'
        },
        time: '1小时前',
        content: '我也在艾欧尼亚，一起玩啊！'
      },
      {
        id: 2,
        user: {
          name: 'Ace玩家',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwJXWYv1t2M1S8jlZ3nJwEK4xXnZfwXDgO_ryYTFAAPD3NJ6pmTUhpeJsra6qrl4sekbm3zZ7874XLIqf6W__ReW-xU87woTXwpcGzN5Q3b-1FAHT-7Q9ZJvEhBpGxJwr8JPIoII8MLGmKtsx2rIr1BNvzlerT6UrU1DTTnRE1vevhiuXzR1drRXXUNZdGjDRSQmxQUYJwpOCdchivrmLpaAcpR5c8eCBholl_o0fI_vrf4Lu_oTTxHGoqzJuNdhfVVbxvwguDqZQ'
        },
        time: '30分钟前',
        content: '辅助玩家报道！'
      }
    ]
  } catch (error) {
    console.error('加载帖子详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handleLike = () => {
  if (post.value) {
    post.value.isLiked = !post.value.isLiked
    post.value.likes += post.value.isLiked ? 1 : -1
  }
}

const handleComment = () => {
  if (!newComment.value.trim()) return
  
  const comment = {
    id: Date.now(),
    user: {
      name: '我',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    time: '刚刚',
    content: newComment.value.trim()
  }
  
  comments.value.unshift(comment)
  post.value.comments++
  newComment.value = ''
}

const handleShare = () => {
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

const handleFollow = () => {
  if (post.value) {
    post.value.isFollowing = !post.value.isFollowing
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

    <main v-else-if="post" class="pt-20 px-5 max-w-2xl mx-auto space-y-4">
      <!-- 帖子内容 -->
      <article class="bg-surface-container-lowest rounded-3xl p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
              <img :alt="post.user.name" class="w-full h-auto" :src="post.user.avatar" />
            </div>
            <div>
              <h3 class="font-bold text-on-surface">{{ post.user.name }}</h3>
              <p class="text-[0.6875rem] text-outline">{{ post.time }} · {{ post.user.game }}</p>
            </div>
          </div>
          <button
            v-if="!post.isFollowing"
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