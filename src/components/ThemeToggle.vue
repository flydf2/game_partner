<template>
  <button 
    @click="toggleTheme"
    class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center transition-all hover:bg-surface-container-high active:scale-95"
    :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
  >
    <span class="material-symbols-outlined text-on-surface transition-transform duration-300" :class="{ 'rotate-180': isDark }">
      {{ isDark ? 'light_mode' : 'dark_mode' }}
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme.js'

const themeStore = useThemeStore()

const isDark = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>