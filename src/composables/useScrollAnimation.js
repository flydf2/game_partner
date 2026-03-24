// 滚动动画钩子
import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollAnimation() {
  const isVisible = ref(false)
  const observer = ref(null)

  const observeElement = (element, options = {}) => {
    if (!element) return

    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    observer.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (observer.value) {
            observer.value.unobserve(element)
          }
        }
      })
    }, { ...defaultOptions, ...options })

    observer.value.observe(element)
  }

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect()
    }
  })

  return {
    isVisible,
    observeElement
  }
}