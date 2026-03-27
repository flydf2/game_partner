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
    class="bg-surface-container-lowest rounded-3xl p-5 shadow-sm space-y-4 cursor-pointer"
    @click="handleCardClick"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-3" @click.stop="handleFollow(post.user?.id || post.user?.userId)">
        <div class="w-10 h-10 rounded-full overflow-hidden">
          <LazyImage
            :src="post.user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'"
            :alt="post.user?.name || '用户'"
            :rounded="'50%'"
            :aspect-ratio="'1/1'"
          />
        </div>
        <div>
          <p class="font-bold text-on-surface text-sm">{{ post.user?.name || '用户' }}</p>
          <p class="text-[10px] text-outline">{{ post.time || '刚刚' }}</p>
        </div>
      </div>
      <button
        class="text-outline hover:text-primary transition-colors"
        @click.stop
      >
        <span class="material-symbols-outlined">more_horiz</span>
      </button>
    </div>

    <p class="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
      {{ post.content }}
    </p>

    <div
      v-if="post.images && post.images.length > 0"
      class="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden"
    >
      <div
        v-for="(image, index) in post.images.slice(0, 4)"
        :key="index"
        class="w-full h-40 overflow-hidden"
      >
        <LazyImage
          :src="image"
          :alt="`动态图片 ${index + 1}`"
          :rounded="'0'"
          :aspect-ratio="'1/1'"
        />
      </div>
    </div>

    <div class="flex items-center gap-6 pt-2">
      <button
        class="flex items-center gap-1.5 text-outline hover:text-primary transition-colors active:scale-95 transition-transform"
        @click.stop="handleLike"
      >
        <span class="material-symbols-outlined text-[20px]" :style="{ fontVariationSettings: isLiked ? 'FILL 1' : 'FILL 0' }">favorite</span>
        <span class="text-xs font-bold">{{ post.likes || 0 }}</span>
      </button>
      <button
        class="flex items-center gap-1.5 text-outline hover:text-primary transition-colors active:scale-95 transition-transform"
        @click.stop="handleComment"
      >
        <span class="material-symbols-outlined text-[20px]">chat_bubble</span>
        <span class="text-xs font-bold">{{ post.comments || 0 }}</span>
      </button>
      <button
        class="flex items-center gap-1.5 text-outline hover:text-primary transition-colors active:scale-95 transition-transform"
        @click.stop="handleShare"
      >
        <span class="material-symbols-outlined text-[20px]">share</span>
      </button>
    </div>
  </article>
</template>
