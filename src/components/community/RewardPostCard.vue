<script setup>
import { ref } from 'vue'
import LazyImage from '../../components/common/LazyImage.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'like', 'comment', 'share', 'follow'])

const isLiked = ref(props.post.isLiked || false)
const isFollowing = ref(props.post.isFollowing || false)

const handleLike = () => {
  isLiked.value = !isLiked.value
  emit('like', props.post.id)
}

const handleComment = () => {
  emit('comment', props.post.id)
}

const handleShare = () => {
  emit('share', props.post.id)
}

const handleFollow = () => {
  isFollowing.value = !isFollowing.value
  emit('follow', props.post.user?.id || props.post.user?.userId)
}

const handleCardClick = () => {
  emit('click', props.post.id)
}
</script>

<template>
  <article
    class="bg-primary-container rounded-3xl p-6 shadow-[0_8px_30px_rgba(255,215,0,0.15)] relative overflow-hidden group cursor-pointer"
    @click="handleCardClick"
  >
    <div class="absolute -right-12 -top-12 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
    
    <div class="flex justify-between items-start relative z-10 mb-6">
      <div class="flex items-center gap-3" @click.stop="handleFollow(post.user?.id || post.user?.userId)">
        <div class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/50">
          <LazyImage
            :src="post.user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'"
            :alt="post.user?.name || '用户'"
            :rounded="'50%'"
            :aspect-ratio="'1/1'"
          />
        </div>
        <div>
          <p class="font-bold text-on-primary-container leading-tight">{{ post.user?.name || '用户' }}</p>
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">military_tech</span>
            <span class="text-[10px] font-bold tracking-wider uppercase opacity-80">PRO LEVEL</span>
          </div>
        </div>
      </div>
      <div class="bg-white/40 backdrop-blur-md px-3 py-1 rounded-xl" @click.stop>
        <span class="text-xs font-black text-on-primary-container">紧急悬赏</span>
      </div>
    </div>

    <div class="space-y-4 relative z-10 mb-6">
      <div class="flex items-baseline gap-2">
        <span class="text-4xl font-black tracking-tighter text-on-primary-container">¥{{ post.rewardInfo?.rewardAmount || 50 }}</span>
        <span class="text-sm font-bold text-on-primary-container/60">/ 小时</span>
      </div>
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-on-primary-container/80">
          <span class="material-symbols-outlined text-lg">sports_esports</span>
          <p class="text-sm font-bold">{{ post.rewardInfo?.game || '王者荣耀' }} - {{ post.rewardInfo?.role || '巅峰赛冲分' }}</p>
        </div>
        <div class="flex items-center gap-2 text-on-primary-container/80">
          <span class="material-symbols-outlined text-lg">schedule</span>
          <p class="text-sm font-medium">预计时长: {{ post.rewardInfo?.hours || 3 }}小时 (现在开始)</p>
        </div>
      </div>
      <p class="text-sm text-on-primary-container/90 leading-relaxed font-medium bg-white/20 p-4 rounded-2xl">
        {{ post.content }}
      </p>
    </div>

    <button
      class="w-full bg-on-primary-container text-primary-container py-4 rounded-2xl font-black text-base shadow-lg shadow-on-primary-container/20 active:scale-[0.98] transition-all"
      @click.stop="handleCardClick"
    >
      立即抢单
    </button>
  </article>
</template>
