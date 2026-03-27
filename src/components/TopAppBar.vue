<template>
  <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16">
    <div class="flex items-center gap-4">
      <span
        @click="goBack"
        class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
      >
        arrow_back_ios
      </span>
      <h1 class="font-headline font-bold text-lg text-primary">{{ title || '阳关陪玩' }}</h1>
    </div>
    <a
      href="http://localhost:5173/community"
      class="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-zinc-900 rounded-xl font-semibold text-sm transition-colors active:scale-95"
    >
      <span class="material-symbols-outlined text-base">forum</span>
      <span>社区</span>
    </a>
    <div class="w-6"></div>
    <div class="absolute bottom-0 left-0 bg-zinc-100 dark:bg-zinc-800 h-[1px] w-full self-end opacity-20"></div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
/* 组件样式 */
</style>
