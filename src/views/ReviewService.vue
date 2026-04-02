<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { expertApi, reviewApi } from '../api'
import { useModal } from '../composables/useModal.js'
import AppHeader from '../components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const { success: showSuccess, error: showError } = useModal()

const expertId = ref(route.query.expertId || '1')
const orderId = ref(route.query.orderId || '1')
const expert = ref(null)
const loading = ref(true)
const submitting = ref(false)

const rating = ref(0)
const reviewContent = ref('')
const selectedTags = ref([])

const tags = ref([
  { id: 1, label: '技术好', icon: 'star' },
  { id: 2, label: '态度好', icon: 'favorite' },
  { id: 3, label: '准时', icon: 'schedule' },
  { id: 4, label: '耐心', icon: 'sentiment_satisfied' }
])

const isSubmitDisabled = computed(() => {
  return rating.value === 0 || reviewContent.value.trim().length === 0 || submitting.value
})

const loadExpertDetail = async () => {
  try {
    loading.value = true
    const response = await expertApi.getExpertDetail(expertId.value)
    expert.value = response.data
  } catch (error) {
    console.error('加载大神详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handleStarClick = (value) => {
  rating.value = value
}

const handleTagClick = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagId)
  }
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    
    const reviewData = {
      expertId: expertId.value,
      orderId: orderId.value,
      rating: rating.value,
      content: reviewContent.value,
      tags: selectedTags.value
    }
    
    const response = await reviewApi.submitReview(reviewData)
    
    if (response.success) {
      showSuccess('评价提交成功！')
      router.push('/orders')
    } else {
      showError('评价提交失败，请重试')
    }
  } catch (error) {
    console.error('提交评价失败:', error)
    showError('评价提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleBack = () => {
  router.back()
}

const handleNotifications = () => {
  router.push('/notifications')
}

const handleSearch = () => {
  router.push('/search')
}

const handleProfile = () => {
  router.push('/profile')
}

onMounted(() => {
  loadExpertDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col">
    <AppHeader
      title="评价服务"
      :show-back="true"
      :show-notifications="true"
      :show-search="true"
      :show-avatar="true"
      @back="handleBack"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content flex-grow flex flex-col items-center">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="expert" class="w-full max-w-md mx-auto">
        <section class="mb-10 mt-4">
          <div class="inline-flex items-center justify-center p-4 bg-primary-container rounded-3xl mb-6 shadow-sm">
            <img :alt="expert.nickname" class="w-20 h-20 rounded-full object-cover" :src="expert.avatar" />
          </div>
          <h2 class="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2 text-center">
            评价服务
          </h2>
          <p class="text-on-surface-variant leading-relaxed opacity-80 text-center">
            您的反馈将帮助我们提供更好的服务
          </p>
        </section>

        <div class="space-y-6">
          <div class="group">
            <label class="block font-label text-xs font-semibold text-on-surface-variant mb-2 px-1">服务评分</label>
            <div class="flex items-center justify-center gap-2">
              <button
                v-for="star in 5"
                :key="star"
                @click="handleStarClick(star)"
                class="transition-transform active:scale-95"
              >
                <span
                  class="material-symbols-outlined text-4xl"
                  :class="star <= rating ? 'text-primary' : 'text-outline-variant'"
                  :style="star <= rating ? 'font-variation-settings: FILL 1;' : ''"
                >
                  star
                </span>
              </button>
            </div>
          </div>

          <div class="group">
            <label class="block font-label text-xs font-semibold text-on-surface-variant mb-2 px-1">服务标签</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in tags"
                :key="tag.id"
                @click="handleTagClick(tag.id)"
                :class="[
                  'flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95',
                  selectedTags.includes(tag.id)
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                ]"
              >
                <span class="material-symbols-outlined text-lg">{{ tag.icon }}</span>
                {{ tag.label }}
              </button>
            </div>
          </div>

          <div class="group">
            <label class="block font-label text-xs font-semibold text-on-surface-variant mb-2 px-1">详细评价</label>
            <textarea
              v-model="reviewContent"
              class="w-full bg-surface-container-high rounded-2xl p-4 min-h-[120px] focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all resize-none"
              placeholder="请分享您的服务体验..."
            ></textarea>
          </div>
        </div>

        <section class="mt-12 flex flex-col gap-4">
          <button
            @click="handleSubmit"
            :disabled="isSubmitDisabled"
            :class="[
              'w-full py-5 font-headline font-extrabold text-lg rounded-full shadow-[0_12px_24px_-8px_rgba(255,215,0,0.4)] active:scale-[0.98] active:bg-primary-dim transition-all flex items-center justify-center gap-2',
              isSubmitDisabled
                ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                : 'bg-primary-container text-on-primary-container cursor-pointer'
            ]"
          >
            {{ submitting ? '提交中...' : '提交评价' }}
            <span v-if="!submitting" class="material-symbols-outlined">send</span>
            <span v-else class="material-symbols-outlined animate-spin">hourglass_empty</span>
          </button>
        </section>
      </div>
    </main>
  </div>
</template>
