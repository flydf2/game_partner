<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const postContent = ref('')
const selectedImages = ref([])
const selectedCategory = ref('mood')
const isSubmitting = ref(false)

const categories = [
  { id: 'mood', label: '心情' },
  { id: 'game', label: '游戏' },
  { id: 'social', label: '交友' },
  { id: 'guide', label: '攻略' }
]

const isRewardPost = ref(false)
const rewardAmount = ref('')
const paymentMethod = ref('prepay') // prepay: 预支付, postpay: 确认后支付

const handleImageUpload = (event) => {
  const files = event.target.files
  if (files.length > 0) {
    // 限制最多上传3张图片
    const images = Array.from(files).slice(0, 3)
    selectedImages.value = images.map(file => URL.createObjectURL(file))
  }
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (!postContent.value.trim()) {
    alert('请输入动态内容')
    return
  }

  if (isRewardPost.value) {
    if (!rewardAmount.value || parseFloat(rewardAmount.value) <= 0) {
      alert('请输入有效的悬赏金额')
      return
    }
  }

  isSubmitting.value = true
  try {
    // 模拟发布请求
    const postData = {
      content: postContent.value,
      images: selectedImages.value,
      category: selectedCategory.value,
      isReward: isRewardPost.value,
      rewardAmount: isRewardPost.value ? parseFloat(rewardAmount.value) : 0,
      paymentMethod: isRewardPost.value ? paymentMethod.value : null
    }
    
    console.log('发布动态:', postData)
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isRewardPost.value) {
      // 对于悬赏动态，根据支付方式进行处理
      if (paymentMethod.value === 'prepay') {
        // 跳转到支付页面
        console.log('跳转到支付页面')
        alert('即将跳转到支付页面')
        // 这里应该跳转到支付页面，暂时返回社区
        router.push('/community')
      } else {
        // 确认后支付，直接发布
        console.log('发布悬赏动态，确认后支付')
        router.push('/community')
      }
    } else {
      // 普通动态，直接发布
      router.push('/community')
    }
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-surface-container-low/50">
      <div class="flex items-center gap-4">
        <span
          @click="handleCancel"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">发布动态</h1>
      </div>
      <button
            @click="handleSubmit"
            :disabled="isSubmitting || !postContent.trim()"
            class="text-primary font-bold text-sm px-4 py-2 rounded-full transition-all"
            :class="isSubmitting || !postContent.trim() ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'"
          >
        {{ isSubmitting ? '发布中...' : '发布' }}
      </button>
    </header>

    <main class="pt-20 px-5 max-w-2xl mx-auto space-y-6">
      <!-- 内容输入 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <textarea
          v-model="postContent"
          class="w-full bg-transparent border-none resize-none focus:ring-0 text-on-surface placeholder:text-outline min-h-[200px]"
          placeholder="分享你的游戏心得、心情故事或组队需求..."
        ></textarea>
      </section>

      <!-- 图片上传 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-base font-bold mb-4">添加图片</h2>
        <div class="flex gap-3">
          <label
            v-if="selectedImages.length < 3"
            class="w-24 h-24 bg-surface-container rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleImageUpload"
            />
            <span class="material-symbols-outlined text-outline">add_photo_alternate</span>
            <span class="text-xs text-outline mt-1">添加图片</span>
          </label>
          <div
            v-for="(image, index) in selectedImages"
            :key="index"
            class="relative w-24 h-24 rounded-2xl overflow-hidden"
          >
            <img :src="image" alt="Preview" class="w-full h-full object-cover" />
            <button
              @click="removeImage(index)"
              class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <span class="material-symbols-outlined text-xs">close</span>
            </button>
          </div>
        </div>
        <p v-if="selectedImages.length > 0" class="text-xs text-outline mt-2">
          已选择 {{ selectedImages.length }}/{{ 3 }} 张图片
        </p>
      </section>

      <!-- 分类选择 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-base font-bold mb-4">选择分类</h2>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              selectedCategory === category.id
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            ]"
          >
            {{ category.label }}
          </button>
        </div>
      </section>

      <!-- 悬赏找陪玩 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold">悬赏找陪玩</h2>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="isRewardPost"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
          </label>
        </div>
        
        <div v-if="isRewardPost" class="space-y-4">
          <!-- 悬赏金额 -->
          <div>
            <label class="block text-sm font-medium text-on-surface-variant mb-2">悬赏金额 (¥)</label>
            <input
              v-model="rewardAmount"
              type="number"
              min="1"
              step="1"
              class="w-full bg-surface-container rounded-2xl p-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              placeholder="请输入悬赏金额"
            />
          </div>
          
          <!-- 支付方式 -->
          <div>
            <label class="block text-sm font-medium text-on-surface-variant mb-2">支付方式</label>
            <div class="space-y-2">
              <label class="flex items-center justify-between p-3 bg-surface-container rounded-2xl cursor-pointer hover:bg-surface-container-high transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
                    <span class="material-symbols-outlined text-xs text-on-primary-container">credit_card</span>
                  </div>
                  <span class="text-sm font-medium">预支付</span>
                </div>
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="prepay"
                  class="w-5 h-5 text-primary border-surface-container-high focus:ring-primary-container"
                />
              </label>
              <label class="flex items-center justify-between p-3 bg-surface-container rounded-2xl cursor-pointer hover:bg-surface-container-high transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center">
                    <span class="material-symbols-outlined text-xs text-on-secondary-container">check_circle</span>
                  </div>
                  <span class="text-sm font-medium">确认后支付</span>
                </div>
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="postpay"
                  class="w-5 h-5 text-primary border-surface-container-high focus:ring-primary-container"
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- 发布须知 -->
      <section class="bg-tertiary-container/10 rounded-3xl p-4">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-tertiary">info</span>
          <div class="text-sm text-on-surface-variant">
            <p class="mb-1">发布须知：</p>
            <ul class="list-disc list-inside space-y-1 text-xs">
              <li>请勿发布违规内容</li>
              <li>尊重他人，文明交流</li>
              <li>保护个人隐私</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>