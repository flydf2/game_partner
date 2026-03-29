<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { securityApi, handleApiError } from '../api/index.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const { showToast } = useToast()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const validateForm = () => {
  if (!currentPassword.value) {
    error.value = '请输入当前密码'
    return false
  }
  if (!newPassword.value) {
    error.value = '请输入新密码'
    return false
  }
  if (newPassword.value.length < 6) {
    error.value = '新密码长度不能少于6位'
    return false
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return false
  }
  error.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const response = await securityApi.changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })

    if (response.success) {
      showToast('密码修改成功', 'success')
      router.back()
    } else {
      error.value = response.message || '密码修改失败'
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error || '密码修改失败，请重试'
    console.error('密码修改失败:', err)
  } finally {
    loading.value = false
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
        <h1 class="font-headline font-bold text-lg text-primary">修改密码</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="page-content pt-24 pb-32 space-y-6 space-y-6">
      <div class="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-on-surface mb-2">当前密码</label>
            <input
              v-model="currentPassword"
              type="password"
              class="w-full bg-surface-container p-4 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              placeholder="请输入当前密码"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-on-surface mb-2">新密码</label>
            <input
              v-model="newPassword"
              type="password"
              class="w-full bg-surface-container p-4 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              placeholder="请输入新密码（至少6位）"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-on-surface mb-2">确认新密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="w-full bg-surface-container p-4 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
              placeholder="请再次输入新密码"
            />
          </div>

          <div v-if="error" class="bg-error/10 border border-error/20 rounded-xl p-4">
            <p class="text-sm text-error">{{ error }}</p>
          </div>

          <button
            @click="handleSubmit"
            :disabled="loading"
            class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary-container/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">修改中...</span>
            <span v-else>确认修改</span>
          </button>
        </div>
      </div>

      <div class="bg-primary-container/10 p-4 rounded-xl">
        <div class="flex gap-3 items-start">
          <span class="material-symbols-outlined text-primary text-lg">info</span>
          <div class="space-y-1">
            <p class="text-xs font-bold text-on-primary-container">密码安全提示</p>
            <ul class="text-[10px] text-on-primary-container/70 leading-relaxed space-y-1">
              <li>• 密码长度至少6位</li>
              <li>• 包含字母和数字</li>
              <li>• 不要使用常见密码</li>
              <li>• 定期更换密码</li>
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
