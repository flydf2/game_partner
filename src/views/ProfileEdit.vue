<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi, uploadApi } from '../api/index.js'

const router = useRouter()

onMounted(() => {
  loadUserInfo()
})

const userInfo = ref({
  avatar: '',
  nickname: '',
  gender: '',
  birthday: '',
  bio: '',
  location: ''
})

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref(false)

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'secret', label: '保密' }
]

const loadUserInfo = async () => {
  loading.value = true
  try {
    // 使用真实API获取用户信息
    const response = await userApi.getUserInfo()
    
    if (response.success) {
      userInfo.value = {
        avatar: response.data.avatar || '',
        nickname: response.data.nickname || '',
        gender: response.data.gender || '',
        birthday: response.data.birthday || '',
        bio: response.data.bio || '',
        location: response.data.location || ''
      }
    } else {
      error.value = response.message || '获取用户信息失败'
    }
  } catch (err) {
    error.value = '获取用户信息失败'
    console.error('获取用户信息失败:', err)
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  if (!userInfo.value.nickname) {
    error.value = '请填写昵称'
    return
  }

  saving.value = true
  error.value = ''
  
  try {
    // 使用真实API保存用户信息
    const response = await userApi.updateProfile(userInfo.value)
    
    if (response.success) {
      success.value = true
      
      setTimeout(() => {
        success.value = false
        router.back()
      }, 1500)
    } else {
      error.value = response.message || '保存失败，请稍后重试'
    }
  } catch (err) {
    error.value = '保存失败，请稍后重试'
    console.error('保存用户信息失败:', err)
  } finally {
    saving.value = false
  }
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      // 使用真实API上传头像
      const response = await uploadApi.uploadFile(file, 'avatar')
      
      if (response.success) {
        userInfo.value.avatar = response.data.url
      } else {
        error.value = '头像上传失败'
      }
    } catch (err) {
      error.value = '头像上传失败'
      console.error('头像上传失败:', err)
    }
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
        <h1 class="font-headline font-bold text-lg text-primary">编辑资料</h1>
      </div>
      <button
        @click="handleSave"
        :disabled="saving"
        class="text-primary font-bold text-sm px-4 py-2 rounded-full bg-primary-container/10 active:scale-95 transition-all disabled:opacity-50"
      >
        {{ saving ? '保存中...' : '保存' }}
      </button>
    </header>

    <main class="page-content pt-20 pb-32 space-y-6 space-y-6">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- 编辑表单 -->
      <div v-else class="space-y-6">
        <!-- 错误提示 -->
        <div v-if="error" class="bg-error-container/10 border border-error-container/20 rounded-2xl p-4 flex items-center gap-3">
          <span class="material-symbols-outlined text-error-container">error_outline</span>
          <span class="text-sm text-error-container">{{ error }}</span>
        </div>

        <!-- 成功提示 -->
        <div v-if="success" class="bg-success-container/10 border border-success-container/20 rounded-2xl p-4 flex items-center gap-3">
          <span class="material-symbols-outlined text-success">check_circle</span>
          <span class="text-sm text-success">保存成功</span>
        </div>

        <!-- 头像上传 -->
        <section class="bg-surface-container-lowest rounded-3xl p-6">
          <h2 class="text-sm font-bold text-on-surface mb-4">头像</h2>
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-container/30">
                <img :alt="userInfo.nickname" class="w-full h-full object-cover" :src="userInfo.avatar" />
              </div>
              <label class="absolute bottom-0 right-0 w-8 h-8 bg-primary-container rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                <span class="material-symbols-outlined text-on-primary-container text-lg">camera_alt</span>
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
              </label>
            </div>
            <div class="flex-1">
              <p class="text-sm text-on-surface font-medium">更换头像</p>
              <p class="text-xs text-on-surface-variant mt-1">支持 JPG、PNG 格式，建议尺寸 200x200</p>
            </div>
          </div>
        </section>

        <!-- 基本信息 -->
        <section class="bg-surface-container-lowest rounded-3xl p-6 space-y-6">
          <h2 class="text-sm font-bold text-on-surface">基本信息</h2>

          <!-- 昵称 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">昵称</label>
            <input
              v-model="userInfo.nickname"
              type="text"
              placeholder="请输入昵称"
              maxlength="20"
              class="w-full bg-surface-container-low rounded-2xl py-4 px-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
            />
            <p class="text-xs text-on-surface-variant text-right">{{ userInfo.nickname.length }}/20</p>
          </div>

          <!-- 性别 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">性别</label>
            <div class="flex gap-3">
              <button
                v-for="option in genderOptions"
                :key="option.value"
                @click="userInfo.gender = option.value"
                class="flex-1 py-3 rounded-2xl font-medium transition-all active:scale-95"
                :class="userInfo.gender === option.value ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-low text-on-surface-variant'"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- 生日 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">生日</label>
            <input
              v-model="userInfo.birthday"
              type="date"
              class="w-full bg-surface-container-low rounded-2xl py-4 px-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
            />
          </div>

          <!-- 所在地 -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-on-surface">所在地</label>
            <input
              v-model="userInfo.location"
              type="text"
              placeholder="请输入所在地"
              class="w-full bg-surface-container-low rounded-2xl py-4 px-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all"
            />
          </div>
        </section>

        <!-- 个人简介 -->
        <section class="bg-surface-container-lowest rounded-3xl p-6">
          <h2 class="text-sm font-bold text-on-surface mb-4">个人简介</h2>
          <textarea
            v-model="userInfo.bio"
            placeholder="介绍一下自己..."
            maxlength="200"
            rows="4"
            class="w-full bg-surface-container-low rounded-2xl py-4 px-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all resize-none"
          ></textarea>
          <p class="text-xs text-on-surface-variant text-right mt-2">{{ userInfo.bio.length }}/200</p>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>