<template>
  <div class="relative overflow-hidden" :class="containerClasses">
    <div
      v-if="!loaded"
      class="absolute inset-0 bg-surface-container animate-pulse flex items-center justify-center"
    >
      <span class="material-symbols-outlined text-zinc-300 text-4xl">image</span>
    </div>
    <img
      ref="imageRef"
      :src="actualSrc"
      :alt="alt"
      :class="imageClasses"
      :loading="loadingStrategy"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  lazy: {
    type: Boolean,
    default: true
  },
  aspectRatio: {
    type: String,
    default: 'square'
  },
  rounded: {
    type: String,
    default: 'lg'
  }
})

const emit = defineEmits(['load', 'error'])

const imageRef = ref(null)
const loaded = ref(false)
const actualSrc = ref('')
const hasError = ref(false)

const containerClasses = computed(() => {
  const ratioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-video'
  }
  
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  }
  
  return [
    ratioClasses[props.aspectRatio] || ratioClasses.square,
    roundedClasses[props.rounded] || roundedClasses.lg
  ].join(' ')
})

const imageClasses = computed(() => {
  return [
    'w-full h-full object-cover transition-opacity duration-300',
    loaded.value ? 'opacity-100' : 'opacity-0'
  ].join(' ')
})

const loadingStrategy = computed(() => {
  return props.lazy ? 'lazy' : 'eager'
})

function handleLoad() {
  loaded.value = true
  hasError.value = false
  emit('load')
}

function handleError() {
  hasError.value = true
  loaded.value = true
  emit('error')
}

onMounted(() => {
  if (props.placeholder) {
    actualSrc.value = props.placeholder
  }
  
  if (!props.lazy) {
    actualSrc.value = props.src
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            actualSrc.value = props.src
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px'
      }
    )
    
    if (imageRef.value) {
      observer.observe(imageRef.value)
    }
    
    onUnmounted(() => {
      observer.disconnect()
    })
  }
})
</script>
