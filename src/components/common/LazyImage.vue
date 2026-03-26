<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  'aspect-ratio': {
    type: String,
    default: 'auto'
  },
  rounded: {
    type: String,
    default: '0'
  },
  placeholder: {
    type: String,
    default: 'https://randomuser.me/api/portraits/men/32.jpg'
  }
})

const isLoaded = ref(false)
const imgRef = ref(null)

onMounted(() => {
  if ('IntersectionObserver' in window && imgRef.value) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isLoaded.value = true
          observer.unobserve(entry.target)
        }
      })
    }, {
      threshold: 0.1
    })
    
    observer.observe(imgRef.value)
  } else {
    // 降级处理，直接加载图片
    isLoaded.value = true
  }
})
</script>

<template>
  <div 
    ref="imgRef"
    class="relative overflow-hidden"
    :style="{
      borderRadius: rounded,
      aspectRatio: aspectRatio
    }"
  >
    <!-- 加载占位（默认头像） -->
    <img
      v-if="!isLoaded"
      :src="placeholder"
      :alt="alt"
      class="w-full h-full object-cover transition-opacity duration-500"
    />
    
    <!-- 实际图片 -->
    <img
      v-if="isLoaded"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover transition-opacity duration-500"
    />
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>
