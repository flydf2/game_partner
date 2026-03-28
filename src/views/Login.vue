<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const userStore = useUserStore()
const { showToast } = useToast()

const loginForm = ref({
  phone: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!loginForm.value.phone || !loginForm.value.password) {
    error.value = '请填写完整信息'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    await userStore.login({
      phone: loginForm.value.phone,
      password: loginForm.value.password
    })
    
    showToast('登录成功', 'success')
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    error.value = err.message || '登录失败，请检查账号密码'
    showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const handleRegister = () => {
  router.push('/register')
}

const handleForgotPassword = () => {
  router.push('/forgot-password')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col">
    <main class="page-content flex-grow flex flex-col justify-center py-12">
      <div class="space-y-8">
        <!-- Logo区域 -->
        <div class="text-center space-y-4">
          <div class="w-20 h-20 mx-auto bg-primary-container rounded-3xl flex items-center justify-center shadow-lg shadow-primary-container/20">
            <span class="material-symbols-outlined text-primary text-4xl" style="font-variation-settings: 'FILL' 1;">
              sports_esports
            </span>
          </div>
          <div>
            <h1 class="text-3xl font-extrabold font-headline text-on-surface tracking-tight">欢迎回来</h1>
            <p class="text-sm text-on-surface-variant mt-2">登录您的账号继续使用</p>
          </div>
        </div>

        <!-- 登录表单 -->
        <div class="space-y-6">
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
                v-model="loginForm.phone"
                type="tel"
                placeholder="请输入手机号"
                class="w-full bg-surface-container-low rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              />
            </div>
          </div>

          <!-- 密码输入 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">密码</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">lock</span>
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
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

          <!-- 忘记密码 -->
          <div class="flex justify-end">
            <button
              @click="handleForgotPassword"
              class="text-sm text-primary font-medium hover:underline"
            >
              忘记密码？
            </button>
          </div>

          <!-- 登录按钮 -->
          <button
            @click="handleLogin"
            :disabled="loading"
            class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-2xl shadow-lg shadow-primary-container/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ loading ? '登录中...' : '登录' }}</span>
          </button>

          <!-- 注册链接 -->
          <div class="text-center">
            <span class="text-sm text-on-surface-variant">还没有账号？</span>
            <button
              @click="handleRegister"
              class="text-sm text-primary font-bold hover:underline ml-1"
            >
              立即注册
            </button>
          </div>
        </div>

        <!-- 第三方登录 -->
        <div class="space-y-4">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-surface-container-high"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-surface text-on-surface-variant">或使用以下方式登录</span>
            </div>
          </div>

          <div class="flex justify-center gap-4">
            <button class="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95">
              <span class="material-symbols-outlined text-2xl text-green-600">wechat</span>
            </button>
            <button class="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95">
              <span class="material-symbols-outlined text-2xl text-blue-600">qq</span>
            </button>
            <button class="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95">
              <span class="material-symbols-outlined text-2xl text-red-600">apple</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部协议 -->
    <footer class="px-6 py-4 text-center">
      <p class="text-xs text-on-surface-variant">
        登录即表示同意
        <a href="/user-agreement" class="text-primary hover:underline">用户服务协议</a>
        和
        <a href="/user-agreement" class="text-primary hover:underline">隐私政策</a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>