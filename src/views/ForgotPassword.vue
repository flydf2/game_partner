<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const resetForm = ref({
  phone: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const countdown = ref(0)

const handleSendCode = async () => {
  if (!resetForm.value.phone) {
    error.value = '请输入手机号'
    return
  }

  if (!/^1[3-9]\d{9}$/.test(resetForm.value.phone)) {
    error.value = '请输入正确的手机号'
    return
  }

  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (err) {
    error.value = '发送验证码失败'
  }
}

const handleReset = async () => {
  if (!resetForm.value.phone || !resetForm.value.code || 
      !resetForm.value.newPassword || !resetForm.value.confirmPassword) {
    error.value = '请填写完整信息'
    return
  }

  if (!/^1[3-9]\d{9}$/.test(resetForm.value.phone)) {
    error.value = '请输入正确的手机号'
    return
  }

  if (resetForm.value.newPassword !== resetForm.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }

  if (resetForm.value.newPassword.length < 6) {
    error.value = '密码长度不能少于6位'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    // 模拟重置密码请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟重置成功
    success.value = true
  } catch (err) {
    error.value = '重置密码失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
}

const handleLogin = () => {
  router.push('/login')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col">
    <main class="flex-grow flex flex-col justify-center px-6 py-12">
      <div class="max-w-md mx-auto w-full space-y-8">
        <!-- 返回按钮 -->
        <button
          @click="handleBack"
          class="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span class="material-symbols-outlined">arrow_back</span>
          <span class="text-sm font-medium">返回</span>
        </button>

        <!-- Logo区域 -->
        <div class="text-center space-y-4">
          <div class="w-20 h-20 mx-auto bg-primary-container rounded-3xl flex items-center justify-center shadow-lg shadow-primary-container/20">
            <span class="material-symbols-outlined text-primary text-4xl" style="font-variation-settings: 'FILL' 1;">
              lock_reset
            </span>
          </div>
          <div>
            <h1 class="text-3xl font-extrabold font-headline text-on-surface tracking-tight">重置密码</h1>
            <p class="text-sm text-on-surface-variant mt-2">通过手机号验证重置您的密码</p>
          </div>
        </div>

        <!-- 成功状态 -->
        <div v-if="success" class="text-center space-y-6">
          <div class="w-24 h-24 mx-auto bg-success-container/20 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-success text-5xl" style="font-variation-settings: 'FILL' 1;">
              check_circle
            </span>
          </div>
          <div class="space-y-2">
            <h2 class="text-2xl font-bold text-on-surface">密码重置成功</h2>
            <p class="text-sm text-on-surface-variant">您现在可以使用新密码登录了</p>
          </div>
          <button
            @click="handleLogin"
            class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-2xl shadow-lg shadow-primary-container/20 active:scale-[0.98] transition-all duration-200"
          >
            立即登录
          </button>
        </div>

        <!-- 重置表单 -->
        <div v-else class="space-y-5">
          <!-- 错误提示 -->
          <div v-if="error" class="bg-error/10 border border-error/20 rounded-2xl p-4 flex items-center gap-3">
            <span class="material-symbols-outlined text-error">error_outline</span>
            <span class="text-sm text-error">{{ error }}</span>
          </div>

          <!-- 手机号输入 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">手机号</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">phone</span>
              <input
                v-model="resetForm.phone"
                type="tel"
                placeholder="请输入手机号"
                class="w-full bg-surface-container-low rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              />
            </div>
          </div>

          <!-- 验证码输入 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">验证码</label>
            <div class="flex gap-3">
              <div class="relative flex-1">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">verified</span>
                <input
                  v-model="resetForm.code"
                  type="text"
                  placeholder="请输入验证码"
                  class="w-full bg-surface-container-low rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
                />
              </div>
              <button
                @click="handleSendCode"
                :disabled="countdown > 0"
                class="px-6 bg-primary-container text-on-primary-container font-bold rounded-2xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
              </button>
            </div>
          </div>

          <!-- 新密码输入 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">新密码</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">lock</span>
              <input
                v-model="resetForm.newPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入新密码（至少6位）"
                class="w-full bg-surface-container-low rounded-2xl py-4 pl-12 pr-12 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              />
              <button
                @click="togglePasswordVisibility"
                class="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-primary transition-colors"
              >
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </button>
            </div>
          </div>

          <!-- 确认密码输入 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">确认密码</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">lock</span>
              <input
                v-model="resetForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="请再次输入新密码"
                class="w-full bg-surface-container-low rounded-2xl py-4 pl-12 pr-12 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              />
              <button
                @click="toggleConfirmPasswordVisibility"
                class="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-primary transition-colors"
              >
                {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
              </button>
            </div>
          </div>

          <!-- 重置按钮 -->
          <button
            @click="handleReset"
            :disabled="loading"
            class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-2xl shadow-lg shadow-primary-container/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ loading ? '重置中...' : '重置密码' }}</span>
          </button>

          <!-- 登录链接 -->
          <div class="text-center">
            <span class="text-sm text-on-surface-variant">想起密码了？</span>
            <button
              @click="handleLogin"
              class="text-sm text-primary font-bold hover:underline ml-1"
            >
              立即登录
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>