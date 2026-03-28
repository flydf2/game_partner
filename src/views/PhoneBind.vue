<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const phoneNumber = ref('')
const verificationCode = ref('')
const error = ref('')
const loading = ref(false)
const countdown = ref(0)

const validatePhone = () => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phoneNumber.value)
}

const sendVerificationCode = () => {
  if (!validatePhone()) {
    error.value = '请输入正确的手机号码'
    return
  }
  
  error.value = ''
  loading.value = true
  
  // 模拟发送验证码
  console.log('发送验证码到:', phoneNumber.value)
  
  setTimeout(() => {
    loading.value = false
    alert('验证码已发送到您的手机')
    startCountdown()
  }, 1000)
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSubmit = async () => {
  if (!validatePhone()) {
    error.value = '请输入正确的手机号码'
    return
  }
  if (!verificationCode.value) {
    error.value = '请输入验证码'
    return
  }
  
  loading.value = true
  try {
    // 模拟API调用
    console.log('绑定手机:', {
      phoneNumber: phoneNumber.value,
      verificationCode: verificationCode.value
    })
    
    // 模拟成功
    setTimeout(() => {
      loading.value = false
      alert('手机绑定成功')
      router.back()
    }, 1000)
  } catch (err) {
    loading.value = false
    error.value = '绑定失败，请重试'
  }
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16">
      <div class="flex items-center gap-4">
        <span
          @click="handleBack"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">手机绑定</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="page-content pt-24 pb-32 space-y-6 space-y-6">
      <div class="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-on-surface mb-2">手机号码</label>
            <input
              v-model="phoneNumber"
              type="tel"
              class="w-full bg-surface-container p-4 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              placeholder="请输入手机号码"
              maxlength="11"
            />
          </div>
          
          <div>
            <label class="block text-sm font-bold text-on-surface mb-2">验证码</label>
            <div class="flex gap-3">
              <input
                v-model="verificationCode"
                type="text"
                class="flex-1 bg-surface-container p-4 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
                placeholder="请输入验证码"
                maxlength="6"
              />
              <button
                @click="sendVerificationCode"
                :disabled="loading || countdown > 0"
                class="w-32 bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary-container/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading">发送中...</span>
                <span v-else-if="countdown > 0">{{ countdown }}s</span>
                <span v-else>获取验证码</span>
              </button>
            </div>
          </div>
          
          <div v-if="error" class="bg-error/10 border border-error/20 rounded-xl p-4">
            <p class="text-sm text-error">{{ error }}</p>
          </div>
          
          <button
            @click="handleSubmit"
            :disabled="loading"
            class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary-container/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">绑定中...</span>
            <span v-else>确认绑定</span>
          </button>
        </div>
      </div>
      
      <div class="bg-primary-container/10 p-4 rounded-xl">
        <div class="flex gap-3 items-start">
          <span class="material-symbols-outlined text-primary text-lg">info</span>
          <div class="space-y-1">
            <p class="text-xs font-bold text-on-primary-container">绑定提示</p>
            <ul class="text-[10px] text-on-primary-container/70 leading-relaxed space-y-1">
              <li>• 一个账号只能绑定一个手机号码</li>
              <li>• 绑定后可用于登录和找回密码</li>
              <li>• 我们不会向您发送垃圾短信</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>