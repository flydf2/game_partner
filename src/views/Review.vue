<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { reviewApi } from '../api'

const router = useRouter()
const route = useRoute()

const routeParams = route.params
const playmateId = ref(routeParams.playmateId ? parseInt(routeParams.playmateId) : 41)
const orderId = ref(routeParams.id ? parseInt(routeParams.id) : 1001)

const orderData = ref({
  playmate: {
    name: '沐沐酱',
    avatar: 'https://lh3.googleusercontent.com/AB6AXuAvBZJ1bNVIFN-np7subUrFxA6Bhyg7VwosCo5tIJr4ufDIjGLxMmrwxv9qeTH-ZsiY-KtYt9J49NDYUwSm8uUvp6TyqIgAczehL0SaZZp4vvZxyhCMR662q2YtVgWvel38x4CCw1MWyOQCbUlKMeU4-a9FeDJe_VyT6hz2STzfT170AB-G0TZGxWpjOukBRGDztoxZ5OVhmI71uzoxOZgEUtc5c1c74or2UPFcS92VdcDzVE6KIFBpLBG2ALcUlhQ_qhyxw2t0lY4',
    game: '王者荣耀',
    service: '排位上分'
  },
  duration: '1小时',
  price: 47.50
})

const rating = ref(0)
const ratingOptions = [1, 2, 3, 4, 5]

const selectedTags = ref([])
const availableTags = [
  { id: 'professional', label: '专业度高' },
  { id: 'friendly', label: '态度友好' },
  { id: 'patient', label: '耐心指导' },
  { id: 'punctual', label: '准时开始' },
  { id: 'skilled', label: '技术精湛' },
  { id: 'communicative', label: '沟通顺畅' },
  { id: 'fun', label: '体验愉快' },
  { id: 'recommend', label: '值得推荐' }
]

const comment = ref('')
const submitting = ref(false)

const handleBack = () => {
  router.back()
}

const handleRating = (value) => {
  rating.value = value
}

const handleTagToggle = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagId)
  }
}

const handleSubmit = async () => {
  if (rating.value === 0) {
    alert('请选择评分')
    return
  }
  
  try {
    submitting.value = true
    
    const reviewData = {
      playmateId: playmateId.value,
      orderId: orderId.value || undefined,
      rating: rating.value,
      tags: selectedTags.value,
      content: comment.value
    }
    
    const response = await reviewApi.submitReview(reviewData)
    
    if (response.success) {
      alert('评价提交成功！')
      router.push('/orders')
    } else {
      alert('评价提交失败，请重试')
    }
  } catch (error) {
    console.error('提交评价失败:', error)
    alert('评价提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleSkip = () => {
  console.log('跳过评价')
  router.push('/orders')
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-background pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">评价服务</h1>
      </div>
      <div class="w-6"></div>
      <div class="absolute bottom-0 left-0 bg-zinc-100 dark:bg-zinc-800 h-[1px] w-full self-end opacity-20"></div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6 max-w-md mx-auto space-y-8">
      <!-- Order Summary -->
      <section class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-xl overflow-hidden bg-surface-container">
            <img :alt="orderData.playmate.name" class="w-full h-full object-cover" :src="orderData.playmate.avatar" />
          </div>
          <div class="flex-1">
            <h2 class="font-headline font-bold text-lg text-on-surface">{{ orderData.playmate.name }}</h2>
            <p class="text-on-surface-variant text-sm">{{ orderData.playmate.game }} • {{ orderData.playmate.service }}</p>
            <p class="text-on-surface-variant text-xs mt-1">{{ orderData.duration }} • ¥{{ orderData.price.toFixed(2) }}</p>
          </div>
        </div>
      </section>

      <!-- Rating Section -->
      <section class="space-y-4">
        <h3 class="font-headline text-lg font-bold text-on-surface">服务评分</h3>
        <div class="flex items-center justify-center gap-4 py-4">
          <button
            v-for="option in ratingOptions"
            :key="option"
            @click="handleRating(option)"
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90',
              rating >= option
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
            ]"
          >
            <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">star</span>
          </button>
        </div>
        <p class="text-center text-on-surface-variant text-sm">
          {{ rating === 0 ? '请选择评分' : rating === 5 ? '非常满意' : rating >= 3 ? '基本满意' : '需要改进' }}
        </p>
      </section>

      <!-- Tags Selection -->
      <section class="space-y-4">
        <h3 class="font-headline text-lg font-bold text-on-surface">选择标签</h3>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="tag in availableTags"
            :key="tag.id"
            @click="handleTagToggle(tag.id)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95',
              selectedTags.includes(tag.id)
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            ]"
          >
            {{ tag.label }}
          </button>
        </div>
      </section>

      <!-- Comment Section -->
      <section class="space-y-4">
        <h3 class="font-headline text-lg font-bold text-on-surface">详细评价</h3>
        <textarea
          v-model="comment"
          class="w-full bg-surface-container-lowest rounded-2xl p-4 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary-container/30 transition-all resize-none"
          placeholder="分享您的服务体验，帮助其他用户做出更好的选择..."
          rows="5"
        ></textarea>
        <p class="text-right text-on-surface-variant text-xs">{{ comment.length }}/500</p>
      </section>

      <!-- Submit Buttons -->
      <section class="space-y-3">
        <button
          @click="handleSubmit"
          :disabled="submitting"
          :class="[
            'w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-2xl transition-transform shadow-lg shadow-primary-container/20',
            submitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
          ]"
        >
          {{ submitting ? '提交中...' : '提交评价' }}
        </button>
        <button
          @click="handleSkip"
          :disabled="submitting"
          :class="[
            'w-full bg-surface-container-low text-on-surface-variant font-headline font-medium py-3 rounded-2xl transition-transform',
            submitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
          ]"
        >
          跳过评价
        </button>
      </section>
    </main>
  </div>
</template>

<style scoped>
textarea:focus {
  outline: none;
}
</style>