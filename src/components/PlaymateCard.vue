<template>
  <router-link 
    :to="`/expert/${id}`" 
    class="bg-surface-container-lowest rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 space-y-3 sm:space-y-4 shadow-sm relative overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95"
  >
    <div class="absolute top-0 right-0 p-3">
      <div class="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
        <span class="material-symbols-outlined text-primary text-[10px]" style="font-variation-settings: 'FILL' 1;">star</span>
        <span class="text-[10px] font-bold">{{ rating }}</span>
      </div>
    </div>
    <div class="w-full aspect-square rounded-2xl overflow-hidden bg-surface-container group">
      <img :alt="name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" :src="avatar"/>
    </div>
    <div class="space-y-2">
      <div class="flex flex-wrap gap-1">
        <span v-for="tag in tags" :key="tag" class="px-2 py-0.5 bg-primary-container/30 text-on-primary-container text-[9px] font-bold rounded-lg transition-all hover:bg-primary-container hover:text-white">
          {{ tag }}
        </span>
      </div>
      <div class="flex flex-col">
        <span class="font-bold text-sm transition-colors hover:text-primary">{{ name }}</span>
        <span class="text-primary text-xs font-black transition-transform hover:scale-105 inline-block">{{ price }}/hr</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
/* 组件样式 */
</style>
