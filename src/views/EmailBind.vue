<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { securityApi, handleApiError } from '../api/index.js'
import { useToast } from '../composables/useToast.js'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()
const { showToast } = useToast()

const email = ref('')
const verificationCode = ref('')
const error = ref('')
const loading = ref(false)
const countdown = ref(0)

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
}

const sendVerificationCode = async () => {
  if (!validateEmail()) {
    error.value = '请输入正确的邮箱地址'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const response = await securityApi.sendEmailCode(email.value)

    if (response.success) {
      showToast('验证码已发送到您的邮箱', 'success')
      startCountdown()
    } else {
      error.value = response.message || '验证码发送失败'
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error || '验证码发送失败，请重试'
    console.error('发送验证码失败:', err)
  } finally {
    loading.value = false
  }
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
  if (!validateEmail()) {
    error.value = '请输入正确的邮箱地址'
    return
  }
  if (!verificationCode.value) {
    error.value = '请输入验证码'
    return
  }

  loading.value = true
  try {
    const response = await securityApi.bindEmail({
      email: email.value,
      code: verificationCode.value
    })

    if (response.success) {
      showToast('邮箱绑定成功', 'success')
      router.back()
    } else {
      error.value = response.message || '绑定失败'
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error || '绑定失败，请重试'
    console.error('邮箱绑定失败:', err)
  } finally {
    loading.value = false
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
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <AppHeader
      title="邮箱绑定"
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
      <div class="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-on-surface mb-2">邮箱地址</label>
            <input
              v-model="email"
              type="email"
              class="w-full bg-surface-container p-4 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              placeholder="请输入邮箱地址"
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
              <li>• 一个账号只能绑定一个邮箱</li>
              <li>• 绑定后可用于登录和找回密码</li>
              <li>• 我们不会向您发送垃圾邮件</li>
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
