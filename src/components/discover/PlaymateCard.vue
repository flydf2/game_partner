<template>
  <div
    class="bg-surface-container-lowest rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 space-y-3 sm:space-y-4 shadow-sm relative overflow-hidden flex flex-col cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
    @click="handleClick"
  >
    <div class="absolute top-0 right-0 p-3">
      <div class="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
        <span class="material-symbols-outlined text-primary text-[10px]" style="font-variation-settings: 'FILL' 1;">star</span>
        <span class="text-[10px] font-bold">{{ playmate.rating }}</span>
      </div>
    </div>

    <LazyImage
      :src="playmate.avatar"
      :alt="playmate.nickname"
      aspect-ratio="square"
      rounded="2xl"
      class="relative"
    >
      <div
        v-if="playmate.isOnline"
        class="absolute bottom-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"
      />
    </LazyImage>

    <div class="space-y-2">
      <div class="flex flex-wrap gap-1">
        <span
          v-for="(tag, index) in playmate.tags"
          :key="`tag-${index}`"
          class="px-2 py-0.5 bg-primary-container/30 text-on-primary-container text-[9px] font-bold rounded-lg"
        >
          {{ tag }}
        </span>
      </div>

      <div class="flex justify-between items-end">
        <div class="flex flex-col">
          <span class="font-bold text-sm">{{ playmate.nickname }}</span>
          <span class="text-primary text-xs font-black">¥{{ playmate.price }}/hr</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="material-symbols-outlined text-zinc-400 text-xs">favorite</span>
          <span class="text-xs text-zinc-500">{{ playmate.likes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LazyImage from '../common/LazyImage.vue'

const props = defineProps({
  playmate: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      nickname: '',
      avatar: '',
      rating: 0,
      price: 0,
      likes: 0,
      tags: [],
      isOnline: false
    })
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click', props.playmate.id)
}
</script>