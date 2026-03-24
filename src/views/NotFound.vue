<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}

const handleGoBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface flex items-center justify-center p-5">
    <div class="text-center max-w-sm">
      <div class="mb-8">
        <div class="text-[120px] font-bold text-primary/20 font-headline leading-none">404</div>
        <div class="text-2xl font-bold text-on-surface mt-4">页面未找到</div>
      </div>

      <div class="mb-8">
        <p class="text-on-surface-variant text-sm leading-relaxed">
          抱歉，您访问的页面不存在或已被移除。<br />
          请检查URL是否正确，或返回首页。
        </p>
      </div>

      <div class="space-y-3">
        <button
          @click="handleGoHome"
          class="w-full py-4 bg-primary text-on-primary rounded-full font-bold text-base active:scale-95 transition-all hover:shadow-lg hover:shadow-primary/20"
        >
          返回首页
        </button>
        <button
          @click="handleGoBack"
          class="w-full py-4 bg-surface-container text-on-surface rounded-full font-bold text-base active:scale-95 transition-all hover:bg-surface-container-high"
        >
          返回上一页
        </button>
      </div>

      <div class="mt-12 flex justify-center gap-4">
        <div class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>