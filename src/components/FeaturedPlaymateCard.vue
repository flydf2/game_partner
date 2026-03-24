<template>
  <router-link 
    :to="`/expert/${playmate.id}`" 
    class="col-span-2 bg-surface-container-lowest rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 shadow-sm flex items-center gap-4 sm:gap-5 relative overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95"
  >
    <div class="w-24 h-24 rounded-2xl overflow-hidden bg-surface-container flex-shrink-0 group">
      <img :alt="playmate.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" :src="playmate.avatar"/>
    </div>
    <div class="flex-grow space-y-2">
      <div class="flex justify-between items-start">
        <div class="flex flex-col">
          <span class="font-bold text-lg transition-colors hover:text-primary">{{ playmate.name }}</span>
          <span class="text-[10px] text-zinc-500 font-medium transition-colors hover:text-zinc-700">{{ playmate.description }}</span>
        </div>
        <span class="text-primary text-lg font-black transition-transform hover:scale-105 inline-block">¥{{ playmate.price }}/hr</span>
      </div>
      <div class="flex gap-2">
        <span v-for="tag in playmate.tags" :key="tag" class="px-3 py-1 bg-surface-container-low text-on-surface text-[10px] font-bold rounded-full transition-all hover:bg-primary-container hover:text-white">
          {{ tag }}
        </span>
      </div>
    </div>
    <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  playmate: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
/* 组件样式 */
</style>