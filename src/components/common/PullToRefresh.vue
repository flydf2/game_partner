<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  onRefresh: {
    type: Function,
    required: true
  },
  minHeight: {
    type: Number,
    default: 400
  }
})

const isPulling = ref(false)
const pullDistance = ref(0)
const isRefreshing = ref(false)
const startY = ref(0)
const threshold = 80

const containerStyle = computed(() => {
  return {
    minHeight: `${props.minHeight}px`,
    transform: isPulling.value ? `translateY(${pullDistance.value}px)` : 'translateY(0)',
    transition: isPulling.value ? 'none' : 'transform 0.3s ease'
  }
})

const refreshIconStyle = computed(() => {
  const rotation = Math.min(pullDistance.value / threshold * 180, 180)
  return {
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 0.3s ease'
  }
})

const handleTouchStart = (e) => {
  if (isRefreshing.value) return
  
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop === 0) {
    isPulling.value = true
    startY.value = e.touches[0].clientY
  }
}

const handleTouchMove = (e) => {
  if (!isPulling.value || isRefreshing.value) return
  
  const currentY = e.touches[0].clientY
  const distance = currentY - startY.value
  
  if (distance > 0) {
    e.preventDefault()
    pullDistance.value = Math.min(distance * 0.5, threshold * 2)
  }
}

const handleTouchEnd = async () => {
  if (!isPulling.value) return
  
  if (pullDistance.value >= threshold) {
    isRefreshing.value = true
    pullDistance.value = threshold
    
    try {
      await props.onRefresh()
    } finally {
      isRefreshing.value = false
      pullDistance.value = 0
      isPulling.value = false
    }
  } else {
    pullDistance.value = 0
    isPulling.value = false
  }
}
</script>

<template>
  <div 
    class="relative"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- 刷新指示器 -->
    <div 
      v-if="pullDistance > 0 || isRefreshing"
      class="absolute top-0 left-0 right-0 flex justify-center items-center py-3 bg-surface-container-low"
      :style="{ transform: `translateY(-100%) translateY(${pullDistance}px)` }"
    >
      <div class="flex items-center gap-2">
        <div 
          v-if="!isRefreshing"
          class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"
          :style="refreshIconStyle"
        ></div>
        <div 
          v-else
          class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-sm font-medium text-on-surface-variant">
          {{ isRefreshing ? '刷新中...' : '下拉刷新' }}
        </span>
      </div>
    </div>
    
    <!-- 内容容器 -->
    <div 
      class="w-full"
      :style="containerStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>
