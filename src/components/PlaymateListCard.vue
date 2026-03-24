<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  playmate: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const handleClick = () => {
  router.push(`/expert/${props.playmate.id}`)
}

const statusText = computed(() => {
  return props.playmate.isOnline ? '正在空闲中 · 立即约玩' : '忙碌中 · 预约排队'
})

const statusColor = computed(() => {
  return props.playmate.isOnline ? 'text-green-600' : 'text-orange-600'
})
</script>

<template>
  <div 
    class="bg-surface-container-lowest rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group cursor-pointer"
    @click="handleClick"
  >
    <div class="relative">
      <div class="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-primary-container/30">
        <img 
          :alt="`${playmate.nickname} 头像`" 
          class="w-full h-full object-cover" 
          :src="playmate.avatar"
        />
      </div>
      <div 
        :class="[
          'absolute -bottom-1 -right-1 w-5 h-5 border-4 border-surface-container-lowest rounded-full',
          playmate.isOnline ? 'bg-green-500' : 'bg-orange-500'
        ]"
      ></div>
    </div>
    
    <div class="flex-grow text-center sm:text-left">
      <div class="flex items-center justify-center sm:justify-start gap-2 mb-1">
        <h3 class="font-headline font-bold text-lg text-on-surface">{{ playmate.nickname }}</h3>
        <span class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-bold">
          LV.{{ playmate.level || 42 }}
        </span>
      </div>
      
      <div class="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
        <span 
          v-for="(tag, index) in playmate.tags.slice(0, 3)" 
          :key="index"
          class="bg-surface-container-low text-on-surface-variant text-[11px] px-2 py-1 rounded-lg"
        >
          {{ tag }}
        </span>
      </div>
      
      <p :class="['text-[12px] font-bold flex items-center justify-center sm:justify-start gap-1', statusColor]">
        <span class="material-symbols-outlined text-[14px]">bolt</span>
        {{ statusText }}
      </p>
    </div>
    
    <div class="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
      <button 
        class="flex-1 sm:flex-none bg-surface-container-high text-on-surface-variant p-3 rounded-xl hover:bg-error-container hover:text-on-error transition-all group-hover:opacity-100"
        @click.stop
      >
        <span class="material-symbols-outlined text-xl">person_remove</span>
      </button>
      <button 
        class="flex-1 sm:flex-none bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
        @click.stop
      >
        <span class="material-symbols-outlined text-lg">chat_bubble</span>
        私信
      </button>
    </div>
  </div>
</template>
