<template>
  <div class="space-y-4">
    <div v-if="loading && playmates.length === 0" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="bg-error-container/10 rounded-2xl p-6 text-center">
      <span class="material-symbols-outlined text-4xl text-error mb-2">error</span>
      <p class="text-error font-bold">{{ error }}</p>
      <button
        class="mt-4 px-6 py-2 bg-primary-container text-on-primary-container rounded-full font-bold text-sm"
        @click="handleRetry"
      >
        重试
      </button>
    </div>

    <div v-else-if="playmates.length === 0" class="bg-surface-container-low rounded-2xl p-12 text-center">
      <span class="material-symbols-outlined text-6xl text-zinc-300 mb-4">search_off</span>
      <p class="text-zinc-500 font-bold text-lg">暂无符合条件的陪玩</p>
      <p class="text-zinc-400 text-sm mt-2">试试调整筛选条件或搜索关键词</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-4">
      <PlaymateCard
        v-for="(playmate, index) in playmates"
        :key="playmate.id"
        :playmate="playmate"
        @click="handleCardClick"
      />
    </div>

    <div v-if="loading && playmates.length > 0" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div
      v-if="!hasMore && playmates.length > 0"
      class="text-center py-4 text-zinc-400 text-sm"
    >
      没有更多了
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaymateStore } from '../../stores/playmate.js'
import { useToast } from '../../composables/useToast.js'
import PlaymateCard from './PlaymateCard.vue'

const router = useRouter()
const playmateStore = usePlaymateStore()
const { success } = useToast()

const playmates = computed(() => playmateStore.playmates)
const loading = computed(() => playmateStore.loading)
const error = computed(() => playmateStore.error)
const hasMore = computed(() => playmateStore.hasMore)

const emit = defineEmits(['retry'])

function handleCardClick(id) {
  router.push(`/expert/${id}`)
  success('正在跳转到大神详情页')
}

function handleRetry() {
  emit('retry')
}
</script>