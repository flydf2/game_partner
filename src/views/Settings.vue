<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { cache } from '../utils/cache.js'


const router = useRouter()

const getCacheSize = () => {
  let totalSize = 0
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('game_partner_cache_')) {
        const value = localStorage.getItem(key)
        if (value) {
          totalSize += new Blob([value]).size
        }
      }
    }
  } catch (err) {
    console.error('获取缓存大小失败:', err)
  }
  const sizeInKB = totalSize / 1024
  if (sizeInKB < 1024) {
    return `${sizeInKB.toFixed(1)} KB`
  }
  return `${(sizeInKB / 1024).toFixed(1)} MB`
}

const settings = ref([
  {
    category: '账号设置',
    items: [
      { key: 'profile', label: '个人资料', icon: 'person', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
      { key: 'security', label: '账号安全', icon: 'security', iconBg: 'bg-green-50', iconColor: 'text-green-600' },
      { key: 'privacy', label: '隐私设置', icon: 'lock', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' }
    ]
  },
  {
    category: '通知设置',
    items: [
      { key: 'notifications', label: '消息通知', icon: 'notifications', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', toggle: true, value: true },
      { key: 'sound', label: '声音提醒', icon: 'volume_up', iconBg: 'bg-pink-50', iconColor: 'text-pink-600', toggle: true, value: true }
    ]
  },
  {
    category: '通用设置',
    items: [
      { key: 'language', label: '语言', icon: 'language', iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600', value: '简体中文' },
      { key: 'theme', label: '主题', icon: 'palette', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', value: '跟随系统' },
      { key: 'clear', label: '清除缓存', icon: 'cleaning_services', iconBg: 'bg-gray-50', iconColor: 'text-gray-600', value: getCacheSize() }
    ]
  },
  {
    category: '关于',
    items: [
      { key: 'about', label: '关于我们', icon: 'info', iconBg: 'bg-teal-50', iconColor: 'text-teal-600' },
      { key: 'feedback', label: '意见反馈', icon: 'feedback', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
      { key: 'agreement', label: '用户协议', icon: 'description', iconBg: 'bg-lime-50', iconColor: 'text-lime-600' }
    ]
  }
])

const showLogoutDialog = ref(false)

const handleItemClick = (key) => {
  console.log('设置项点击:', key)
  switch (key) {
    case 'profile':
      router.push('/profile/edit')
      break
    case 'security':
      router.push('/profile/security')
      break
    case 'privacy':
      router.push('/profile/privacy')
      break
    case 'language':
      // 这里可以添加语言选择逻辑
      break
    case 'theme':
      // 这里可以添加主题选择逻辑
      break
    case 'clear':
      // 清除缓存逻辑
      clearCache()
      break
    case 'about':
      router.push('/about-us')
      break
    case 'feedback':
      router.push('/feedback')
      break
    case 'agreement':
      router.push('/user-agreement')
      break
  }
}

const handleToggleChange = (key, value) => {
  console.log('开关切换:', key, value)
  // 更新本地设置
  updateSetting(key, value)
}

const updateSetting = (key, value) => {
  // 找到对应的设置项并更新
  for (const category of settings.value) {
    for (const item of category.items) {
      if (item.key === key) {
        item.value = value
        break
      }
    }
  }
  // 这里可以添加本地存储逻辑，保存设置
}

const clearCache = () => {
  cache.clear()
  console.log('清除缓存成功')
  for (const category of settings.value) {
    for (const item of category.items) {
      if (item.key === 'clear') {
        item.value = getCacheSize()
        break
      }
    }
  }
}

const handleBack = () => {
  router.back()
}

const handleLogout = async () => {
  try {
    localStorage.removeItem('auth_token')
    showLogoutDialog.value = false
    router.push('/login')
  } catch (err) {
    console.error('退出登录失败:', err)
  }
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
        <h1 class="font-headline font-bold text-lg text-primary">设置</h1>
      </div>
      <div class="w-6"></div>
    </nav>

    <main class="pt-20 px-5 max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6 space-y-6">
      <div v-for="(category, index) in settings" :key="category.category" class="space-y-4">
        <h2 class="text-sm font-bold text-on-surface-variant px-1">{{ category.category }}</h2>
        
        <div class="bg-surface-container-lowest rounded-3xl overflow-hidden">
          <div
            v-for="item in category.items"
            :key="item.key"
            class="flex items-center gap-4 p-5 hover:bg-surface-container-low transition-colors cursor-pointer duration-200"
            :class="{ 'border-b border-surface-container': item !== category.items[category.items.length - 1] }"
            @click="item.toggle ? handleToggleChange(item.key, !item.value) : handleItemClick(item.key)"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="item.iconBg">
              <span class="material-symbols-outlined" :class="item.iconColor" style="font-variation-settings: 'FILL' 1;">{{ item.icon }}</span>
            </div>
            <span class="flex-1 font-semibold text-on-surface">{{ item.label }}</span>
            <div class="flex items-center gap-2">
              <span v-if="item.value && !item.toggle" class="text-sm text-on-surface-variant">{{ item.value }}</span>
              <div v-if="item.toggle" class="relative">
                <button
                  class="w-12 h-7 rounded-full transition-colors duration-200"
                  :class="item.value ? 'bg-primary-container' : 'bg-surface-container-high'"
                >
                  <div
                    class="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                    :class="item.value ? 'translate-x-5' : 'translate-x-1'"
                  ></div>
                </button>
              </div>
              <span v-if="!item.toggle" class="material-symbols-outlined text-outline text-lg transition-transform duration-200 hover:translate-x-1">chevron_right</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 退出登录按钮 -->
      <button
        @click="showLogoutDialog = true"
        class="w-full py-4 rounded-full bg-white text-error font-bold text-sm shadow-sm active:scale-95 transition-all duration-200 hover:bg-red-50"
      >
        退出登录
      </button>

      <p class="text-center text-xs text-on-surface-variant">版本 1.0.0</p>
    </main>

    <!-- 退出登录确认对话框 -->
    <div v-if="showLogoutDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div class="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-sm animate-in fade-in-90 slide-in-from-bottom-5">
        <h3 class="text-lg font-bold text-on-surface font-headline mb-4 text-center">确认退出登录</h3>
        <p class="text-sm text-on-surface-variant mb-6 text-center">您确定要退出当前账号吗？</p>
        <div class="flex gap-4">
          <button
            class="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-low"
            @click="showLogoutDialog = false"
          >
            取消
          </button>
          <button
            class="flex-1 py-3 rounded-full bg-error text-white font-bold text-sm transition-all active:scale-95 hover:bg-error-dim"
            @click="handleLogout"
          >
            确定退出
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>