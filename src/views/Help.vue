<template>
  <div class="min-h-screen bg-background text-on-background font-body pb-24">
    <AppHeader
      title="帮助与客服"
      :show-back="true"
      :show-notifications="true"
      :show-search="true"
      :show-avatar="true"
      @back="handleBack"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content space-y-6">
      <!-- 常见问题 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-sm font-bold text-on-surface mb-4">常见问题</h2>
        <div class="space-y-3">
          <div 
            v-for="faq in faqs"
            :key="faq.id"
            class="border-b border-surface-container last:border-0 pb-3 last:pb-0"
          >
            <button 
              class="w-full flex justify-between items-start text-left"
              @click="toggleFaq(faq.id)"
            >
              <span class="text-sm font-medium text-on-surface">{{ faq.question }}</span>
              <span class="material-symbols-outlined text-outline transition-transform duration-200" :class="{ 'rotate-180': expandedFaq === faq.id }">
                expand_more
              </span>
            </button>
            <div 
              v-if="expandedFaq === faq.id"
              class="mt-2 text-xs text-on-surface-variant leading-relaxed"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </section>

      <!-- 联系我们 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-sm font-bold text-on-surface mb-4">联系我们</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <span class="material-symbols-outlined">email</span>
            </div>
            <div>
              <h3 class="text-sm font-medium text-on-surface mb-1">邮箱</h3>
              <p class="text-xs text-on-surface-variant">support@gamepartner.com</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <span class="material-symbols-outlined">phone</span>
            </div>
            <div>
              <h3 class="text-sm font-medium text-on-surface mb-1">电话</h3>
              <p class="text-xs text-on-surface-variant">400-123-4567</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <span class="material-symbols-outlined">chat</span>
            </div>
            <div>
              <h3 class="text-sm font-medium text-on-surface mb-1">在线客服</h3>
              <p class="text-xs text-on-surface-variant">工作日 9:00-18:00</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 服务时间 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-sm font-bold text-on-surface mb-4">服务时间</h2>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs text-on-surface-variant">周一至周五</span>
            <span class="text-xs font-medium">9:00 - 18:00</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-on-surface-variant">周六至周日</span>
            <span class="text-xs font-medium">10:00 - 16:00</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-on-surface-variant">节假日</span>
            <span class="text-xs font-medium">10:00 - 16:00</span>
          </div>
        </div>
      </section>

      <!-- 提交问题 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-sm font-bold text-on-surface mb-4">提交问题</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-on-surface mb-2">问题类型</label>
            <select 
              v-model="problemType"
              class="w-full px-4 py-3 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">选择问题类型</option>
              <option value="order">订单问题</option>
              <option value="payment">支付问题</option>
              <option value="account">账号问题</option>
              <option value="technical">技术问题</option>
              <option value="other">其他问题</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-on-surface mb-2">问题描述</label>
            <textarea 
              v-model="problemDescription"
              class="w-full px-4 py-3 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
              rows="4"
              placeholder="请详细描述您遇到的问题..."
            ></textarea>
          </div>
          <button 
            class="w-full py-3 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all hover:bg-primary-dim"
            @click="handleSubmitProblem"
          >
            提交问题
          </button>
        </div>
      </section>
    </main>

    <!-- 联系客服对话框 -->
    <div v-if="showContactDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div class="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-sm animate-in fade-in-90 slide-in-from-bottom-5">
        <h3 class="text-lg font-bold text-on-surface font-headline mb-4">联系客服</h3>
        <div class="space-y-4">
          <div class="flex items-center gap-4 p-4 bg-surface-container rounded-2xl">
            <div class="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary">
              <span class="material-symbols-outlined">support_agent</span>
            </div>
            <div>
              <h4 class="text-sm font-medium text-on-surface">在线客服</h4>
              <p class="text-xs text-on-surface-variant">工作日 9:00-18:00</p>
            </div>
          </div>
          <div class="space-y-3">
            <button 
              class="w-full flex items-center justify-center gap-3 py-3 bg-primary text-on-primary rounded-2xl text-sm font-bold active:scale-95 transition-all"
            >
              <span class="material-symbols-outlined">chat</span>
              在线聊天
            </button>
            <button 
              class="w-full flex items-center justify-center gap-3 py-3 bg-surface-container text-on-surface rounded-2xl text-sm font-bold active:scale-95 transition-all"
            >
              <span class="material-symbols-outlined">phone</span>
              电话联系
            </button>
            <button 
              class="w-full flex items-center justify-center gap-3 py-3 bg-surface-container text-on-surface rounded-2xl text-sm font-bold active:scale-95 transition-all"
            >
              <span class="material-symbols-outlined">email</span>
              发送邮件
            </button>
          </div>
        </div>
        <button 
          class="mt-6 w-full py-3 bg-surface-container text-on-surface font-bold text-sm rounded-full transition-all active:scale-95 hover:bg-surface-container-low"
          @click="showContactDialog = false"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useModal } from '../composables/useModal.js'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()
const { warning: showWarning, success: showSuccess, error: showError } = useModal()

const expandedFaq = ref(null)
const showContactDialog = ref(false)
const problemType = ref('')
const problemDescription = ref('')

const faqs = ref([
  {
    id: 1,
    question: '如何成为游戏大神？',
    answer: '您可以在个人中心点击"申请认证"，按照提示提交相关证明材料，我们会在3个工作日内完成审核。认证通过后，您就可以成为游戏大神，开始提供游戏服务了。'
  },
  {
    id: 2,
    question: '如何取消订单？',
    answer: '在订单详情页面，点击"取消订单"按钮，选择取消原因，提交后等待系统处理。如果订单已经开始，需要联系客服进行处理。'
  },
  {
    id: 3,
    question: '如何提现收益？',
    answer: '在个人中心的钱包页面，点击"提现"按钮，选择提现方式，输入提现金额，按照提示完成操作。提现申请会在1-3个工作日内处理到账。'
  },
  {
    id: 4,
    question: '账号被封禁怎么办？',
    answer: '如果您的账号被封禁，可以在帮助与客服页面提交问题，选择"账号问题"类型，详细描述情况，我们会尽快处理您的申诉。'
  },
  {
    id: 5,
    question: '如何修改个人资料？',
    answer: '在个人中心页面，点击头像或编辑资料按钮，进入编辑资料页面，您可以修改昵称、头像、个人简介等信息。'
  }
])

const toggleFaq = (faqId) => {
  expandedFaq.value = expandedFaq.value === faqId ? null : faqId
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

const handleContactSupport = () => {
  showContactDialog.value = true
}

const handleSubmitProblem = async () => {
  if (!problemType.value || !problemDescription.value) {
    showWarning('请填写完整问题信息')
    return
  }
  
  try {
    // 模拟提交问题
    console.log('提交问题:', {
      type: problemType.value,
      description: problemDescription.value
    })
    
    showSuccess('问题提交成功，我们会尽快处理')
    problemType.value = ''
    problemDescription.value = ''
  } catch (err) {
    showError('提交失败，请重试')
  }
}

onMounted(() => {
  // 页面加载时的初始化操作
})
</script>

<style scoped>
/* 页面滚动动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

section {
  animation: fadeIn 0.5s ease-out forwards;
}

section:nth-child(1) { animation-delay: 0.1s; }
section:nth-child(2) { animation-delay: 0.2s; }
section:nth-child(3) { animation-delay: 0.3s; }
section:nth-child(4) { animation-delay: 0.4s; }

/* 触摸反馈优化 */
button, a {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* 旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
}
</style>