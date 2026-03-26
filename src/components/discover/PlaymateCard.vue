<template>
  <div class="bg-surface-container-lowest rounded-[1.5rem] p-5 flex items-center gap-5 group active:scale-[0.98] transition-all duration-300">
    <div class="relative flex-none">
      <div class="w-20 h-20 rounded-2xl overflow-hidden shadow-md">
        <img class="w-full h-full object-cover" :alt="playmate.nickname" :src="playmate.avatar"/>
      </div>
      <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" v-if="playmate.isOnline"></div>
      <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-zinc-400 border-2 border-white rounded-full" v-else></div>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-lg font-bold text-on-surface truncate">{{ playmate.nickname }}</h3>
        <span class="text-primary font-bold header-font">¥{{ playmate.price }}/h</span>
      </div>
      <p class="text-sm text-on-surface-variant mb-2 flex items-center gap-1">
        <span class="material-symbols-outlined text-[16px]">videogame_asset</span>
        {{ playmate.game }} · {{ playmate.rank }}
      </p>
      <div class="flex gap-2">
        <span v-for="(tag, index) in playmate.tags" :key="`tag-${index}`" class="px-2 py-0.5 rounded-md bg-tertiary-container text-on-tertiary-container text-[10px] font-bold">{{ tag }}</span>
      </div>
    </div>
    <button class="ml-2 px-4 py-2 bg-primary-container text-on-primary-container font-black rounded-full text-xs active:scale-90 transition-transform" @click="handleBookClick">约TA</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  playmate: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      nickname: '',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      price: 0,
      tags: [],
      isOnline: false,
      game: '',
      rank: ''
    })
  }
})

const emit = defineEmits(['click'])
const router = useRouter()

function handleClick() {
  emit('click', props.playmate.id)
}

function handleBookClick() {
  router.push(`/expert/${props.playmate.id}`)
}
</script>