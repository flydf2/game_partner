<template>
  <section class="space-y-4">
    <div class="flex justify-between items-end">
      <h3 class="text-xl font-headline font-bold text-on-surface tracking-tight">{{ title }}</h3>
      <span 
        class="text-xs font-semibold text-primary underline decoration-2 underline-offset-4 hover:text-primary/80 transition-colors cursor-pointer"
        @click="handleViewAll"
      >查看全部</span>
    </div>
    <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2">
      <div 
        v-for="game in games" 
        :key="game.id" 
        class="flex-shrink-0 w-24 sm:w-28 h-32 sm:h-36 bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 sm:gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer"
        @click="handleGameClick(game.id)"
      >
        <div class="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary-container flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary-container/80">
          <span class="material-symbols-outlined text-primary text-2xl sm:text-3xl transition-transform duration-300 hover:scale-110">
            {{ game.icon }}
          </span>
        </div>
        <span class="font-bold text-sm transition-colors duration-300 hover:text-primary">{{ game.name }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '热门游戏'
  },
  games: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['view-all', 'game-click'])

const handleViewAll = () => {
  emit('view-all')
}

const handleGameClick = (gameId) => {
  emit('game-click', gameId)
}
</script>

<style scoped>
/* 组件样式 */
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>