<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const userStore = useUserStore()
const { showToast } = useToast()

const registerForm = ref({
  username: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const countdown = ref(0)
const agreed = ref(false)

const handleSendCode = async () => {
  if (!registerForm.value.phone) {
    error.value = '请输入手机号'
    return
  }

  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    error.value = '请输入正确的手机号'
    return
  }

  try {
    await userStore.sendSmsCode(registerForm.value.phone)
    showToast('验证码发送成功', 'success')
    
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (err) {
    error.value = err.message || '发送验证码失败'
    showToast(error.value, 'error')
  }
}

const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.phone || !registerForm.value.code || 
      !registerForm.value.password || !registerForm.value.confirmPassword) {
    error.value = '请填写完整信息'
    return
  }

  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    error.value = '请输入正确的手机号'
    return
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }

  if (registerForm.value.password.length < 6) {
    error.value = '密码长度不能少于6位'
    return
  }

  if (!agreed.value) {
    error.value = '请同意用户服务协议'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    await userStore.register({
      username: registerForm.value.username,
      phone: registerForm.value.phone,
      code: registerForm.value.code,
      password: registerForm.value.password
    })
    
    showToast('注册成功', 'success')
    router.push('/')
  } catch (err) {
    error.value = err.message || '注册失败，请稍后重试'
    showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
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
              sports_esports
            </span>
          </div>
          <div>
            <h1 class="text-3xl font-extrabold font-headline text-on-surface tracking-tight">创建账号</h1>
            <p class="text-sm text-on-surface-variant mt-2">填写信息开始您的游戏之旅</p>
          </div>
        </div>

        <!-- 注册表单 -->
        <div class="space-y-5">
          <!-- 错误提示 -->
          <div v-if="error" class="bg-error/10 border border-error/20 rounded-2xl p-4 flex items-center gap-3">
            <span class="material-symbols-outlined text-error">error_outline</span>
            <span class="text-sm text-error">{{ error }}</span>
          </div>

          <!-- 用户名输入 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">用户名</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">person</span>
              <input
                v-model="registerForm.username"
                type="text"
                placeholder="请输入用户名"
                class="w-full bg-surface-container-low rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              />
            </div>
          </div>

          <!-- 手机号输入 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">手机号</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">phone</span>
              <input
                v-model="registerForm.phone"
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
                  v-model="registerForm.code"
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

          <!-- 密码输入 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">密码</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">lock</span>
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码（至少6位）"
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
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="请再次输入密码"
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

          <!-- 用户协议 -->
          <div class="flex items-start gap-3">
            <button
              @click="agreed = !agreed"
              class="mt-0.5 w-5 h-5 rounded border-2 border-surface-container-high flex items-center justify-center transition-colors"
              :class="agreed ? 'bg-primary-container border-primary-container' : 'border-surface-container-high'"
            >
              <span v-if="agreed" class="material-symbols-outlined text-white text-sm" style="font-variation-settings: 'FILL' 1;">check</span>
            </button>
            <span class="text-sm text-on-surface-variant">
              我已阅读并同意
              <a href="/user-agreement" class="text-primary hover:underline">用户服务协议</a>
              和
              <a href="/user-agreement" class="text-primary hover:underline">隐私政策</a>
            </span>
          </div>

          <!-- 注册按钮 -->
          <button
            @click="handleRegister"
            :disabled="loading"
            class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-2xl shadow-lg shadow-primary-container/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ loading ? '注册中...' : '注册' }}</span>
          </button>

          <!-- 登录链接 -->
          <div class="text-center">
            <span class="text-sm text-on-surface-variant">已有账号？</span>
            <button
              @click="router.push('/login')"
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