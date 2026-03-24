<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const feedbackForm = ref({
  type: 'suggestion',
  content: '',
  contact: ''
})

const feedbackTypes = [
  { value: 'suggestion', label: '功能建议' },
  { value: 'bug', label: '问题反馈' },
  { value: 'complaint', label: '投诉举报' },
  { value: 'other', label: '其他' }
]

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const handleSubmit = async () => {
  if (!feedbackForm.value.content.trim()) {
    alert('请输入反馈内容')
    return
  }

  isSubmitting.value = true
  try {
    // 模拟提交反馈
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('提交反馈:', feedbackForm.value)
    submitSuccess.value = true
    // 3秒后返回设置页面
    setTimeout(() => {
      router.back()
    }, 3000)
  } catch (error) {
    console.error('提交反馈失败:', error)
    alert('提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <nav data-v-3b8a03f8="" class="bg-surface w-full top-0 sticky z-50">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">意见反馈</h1>
      </div>
      <div class="w-6"></div>
    </nav>

    <main class="pt-20 px-5 max-w-2xl mx-auto space-y-6">
      <!-- 提交成功提示 -->
      <div v-if="submitSuccess" class="bg-success-container rounded-3xl p-6 text-center">
        <div class="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-success text-3xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
        </div>
        <h2 class="text-lg font-bold text-on-success-container mb-2">提交成功</h2>
        <p class="text-sm text-on-success-container/80">感谢您的反馈，我们会认真处理！</p>
        <p class="text-xs text-on-success-container/60 mt-4">3秒后自动返回...</p>
      </div>

      <!-- 反馈表单 -->
      <div v-else>
        <!-- 反馈类型 -->
        <section>
          <h3 class="text-base font-bold text-on-surface mb-4">反馈类型</h3>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="type in feedbackTypes"
              :key="type.value"
              @click="feedbackForm.type = type.value"
              class="bg-surface-container-lowest rounded-2xl p-4 text-center transition-all cursor-pointer"
              :class="feedbackForm.type === type.value ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container'"
            >
              <span class="text-sm font-medium">{{ type.label }}</span>
            </div>
          </div>
        </section>

        <!-- 反馈内容 -->
        <section>
          <h3 class="text-base font-bold text-on-surface mb-4">反馈内容</h3>
          <textarea
            v-model="feedbackForm.content"
            class="w-full bg-surface-container-lowest rounded-2xl p-4 min-h-[150px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
            placeholder="请详细描述您的问题或建议..."
          ></textarea>
        </section>

        <!-- 联系方式 -->
        <section>
          <h3 class="text-base font-bold text-on-surface mb-4">联系方式 (选填)</h3>
          <input
            v-model="feedbackForm.contact"
            type="text"
            class="w-full bg-surface-container-lowest rounded-2xl p-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
            placeholder="请留下您的手机号或邮箱，方便我们回复"
          />
        </section>

        <!-- 提交按钮 -->
        <button
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="w-full py-4 rounded-full bg-primary-container text-on-primary-container font-bold text-sm shadow-lg shadow-primary-container/30 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? '提交中...' : '提交反馈' }}
        </button>

        <!-- 提示信息 -->
        <p class="text-xs text-on-surface-variant text-center">
          我们会认真处理每一条反馈，感谢您对发现大神的支持！
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>