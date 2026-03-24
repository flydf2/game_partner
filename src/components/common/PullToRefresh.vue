<template>
  <div
    ref="containerRef"
    class="relative overflow-hidden"
    :style="{ minHeight: `${minHeight}px` }"
  >
    <div
      class="absolute top-0 left-0 right-0 z-10 flex items-center justify-center transition-transform duration-300"
      :style="{ transform: `translateY(${translateY}px)` }"
    >
      <div class="flex items-center gap-2 text-zinc-500">
        <span
          class="material-symbols-outlined transition-transform duration-300"
          :class="{ 'rotate-180': canRelease }"
        >
          refresh
        </span>
        <span class="text-sm font-medium">{{ statusText }}</span>
      </div>
    </div>

    <div
      ref="contentRef"
      class="transition-transform duration-300"
      :style="{ transform: `translateY(${translateY}px)` }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  onRefresh: {
    type: Function,
    required: true
  },
  threshold: {
    type: Number,
    default: 60
  },
  minHeight: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['refresh'])

const containerRef = ref(null)
const contentRef = ref(null)
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)
const isRefreshing = ref(false)
const canRelease = ref(false)

const translateY = computed(() => {
  if (isRefreshing.value) {
    return props.threshold
  }
  return Math.min(Math.max(currentY.value, 0), props.threshold * 1.5)
})

const statusText = computed(() => {
  if (isRefreshing.value) {
    return '正在刷新...'
  }
  if (canRelease.value) {
    return '释放立即刷新'
  }
  return '下拉刷新'
})

function handleTouchStart(e) {
  if (isRefreshing.value) return
  
  const scrollTop = containerRef.value?.scrollTop || 0
  if (scrollTop > 0) return
  
  startY.value = e.touches[0].clientY
  isDragging.value = true
}

function handleTouchMove(e) {
  if (!isDragging.value || isRefreshing.value) return
  
  const scrollTop = containerRef.value?.scrollTop || 0
  if (scrollTop > 0) return
  
  currentY.value = e.touches[0].clientY - startY.value
  
  if (currentY.value < 0) {
    currentY.value = 0
    return
  }
  
  canRelease.value = currentY.value >= props.threshold
}

function handleTouchEnd() {
  if (!isDragging.value || isRefreshing.value) return
  
  isDragging.value = false
  
  if (canRelease.value) {
    performRefresh()
  } else {
    currentY.value = 0
  }
  
  canRelease.value = false
}

async function performRefresh() {
  isRefreshing.value = true
  currentY.value = props.threshold
  
  try {
    await props.onRefresh()
  } catch (error) {
    console.error('刷新失败:', error)
  } finally {
    setTimeout(() => {
      isRefreshing.value = false
      currentY.value = 0
    }, 500)
  }
}

onMounted(() => {
  const container = containerRef.value
  if (container) {
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
  }
})

onUnmounted(() => {
  const container = containerRef.value
  if (container) {
    container.removeEventListener('touchstart', handleTouchStart)
    container.removeEventListener('touchmove', handleTouchMove)
    container.removeEventListener('touchend', handleTouchEnd)
  }
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>
