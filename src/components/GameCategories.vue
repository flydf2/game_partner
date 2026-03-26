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
        class="flex-shrink-0 w-28 h-36 bg-surface-container-lowest rounded-3xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        @click="handleGameClick(game.id)"
      >
        <div 
          class="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110"
          :class="getGameThemeClass(game.id).container"
        >
          <img 
            v-if="game.image"
            :src="game.image"
            :alt="game.name"
            class="w-full h-full object-contain"
          />
          <span 
            v-else
            class="material-symbols-outlined text-3xl transition-transform duration-300 hover:scale-110"
            :class="getGameThemeClass(game.id).text"
          >
            {{ game.icon }}
          </span>
        </div>
        <span class="font-bold text-sm transition-colors duration-300 hover:text-primary truncate w-full text-center">{{ game.name }}</span>
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

const getGameThemeClass = (gameId) => {
  const themeMap = {
    'lol': {
      container: 'bg-primary-container',
      text: 'text-primary'
    },
    'valorant': {
      container: 'bg-secondary-container',
      text: 'text-secondary'
    },
    'honor_of_kings': {
      container: 'bg-tertiary-container',
      text: 'text-on-tertiary-container'
    },
    'genshin': {
      container: 'bg-surface-container-high',
      text: 'text-on-surface-variant'
    },
    'pubg': {
      container: 'bg-primary-container',
      text: 'text-primary'
    },
    'csgo': {
      container: 'bg-secondary-container',
      text: 'text-secondary'
    }
  }
  
  return themeMap[gameId] || {
    container: 'bg-primary-container',
    text: 'text-primary'
  }
}
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>