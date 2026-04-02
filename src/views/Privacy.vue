<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()
const userStore = useUserStore()

// 页面加载时模拟登录
onMounted(() => {
  if (!userStore.getIsLoggedIn) {
    userStore.mockLogin()
  }
})

const privacyItems = ref([
  {
    key: 'profile-visibility',
    label: '个人资料可见性',
    icon: 'visibility',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    toggle: true,
    value: true,
    description: '控制谁可以查看您的个人资料'
  },
  {
    key: 'location',
    label: '位置信息',
    icon: 'location_on',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    toggle: true,
    value: false,
    description: '是否允许应用获取您的位置信息'
  },
  {
    key: 'activity',
    label: '活动状态',
    icon: 'access_time',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    toggle: true,
    value: true,
    description: '显示您的在线状态和最近活动'
  },
  {
    key: 'messages',
    label: '消息隐私',
    icon: 'message',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    description: '控制谁可以向您发送消息'
  },
  {
    key: 'data',
    label: '数据管理',
    icon: 'data_object',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    description: '查看和管理您的个人数据'
  }
])

const handleToggleChange = (key, value) => {
  const item = privacyItems.value.find(item => item.key === key)
  if (item) {
    item.value = value
    console.log('隐私设置开关切换:', key, value)
  }
}

const handleItemClick = (key) => {
  console.log('隐私设置项点击:', key)
  
  switch (key) {
    case 'messages':
      // 消息隐私设置
      console.log('进入消息隐私设置')
      break
    case 'data':
      // 数据管理
      console.log('进入数据管理')
      break
    default:
      break
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
      title="隐私设置"
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
      <div class="bg-surface-container-lowest rounded-3xl overflow-hidden">
        <div
          v-for="item in privacyItems"
          :key="item.key"
          class="flex items-center gap-4 p-5 hover:bg-surface-container-low transition-colors cursor-pointer duration-200"
          :class="{ 'border-b border-surface-container': item !== privacyItems[privacyItems.length - 1] }"
          @click="item.toggle ? handleToggleChange(item.key, !item.value) : handleItemClick(item.key)"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="item.iconBg">
            <span class="material-symbols-outlined" :class="item.iconColor" style="font-variation-settings: 'FILL' 1;">{{ item.icon }}</span>
          </div>
          <div class="flex-1">
            <span class="font-semibold text-on-surface block">{{ item.label }}</span>
            <span class="text-xs text-on-surface-variant block mt-1">{{ item.description }}</span>
          </div>
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
          <span v-else class="material-symbols-outlined text-outline text-lg transition-transform duration-200 hover:translate-x-1">chevron_right</span>
        </div>
      </div>

      <div class="bg-primary-container/10 p-4 rounded-xl">
        <div class="flex gap-3 items-start">
          <span class="material-symbols-outlined text-primary text-lg">info</span>
          <div class="space-y-1">
            <p class="text-xs font-bold text-on-primary-container">隐私提示</p>
            <ul class="text-[10px] text-on-primary-container/70 leading-relaxed space-y-1">
              <li>• 您可以控制个人资料的可见性</li>
              <li>• 位置信息仅用于推荐附近的游戏伙伴</li>
              <li>• 您可以随时修改隐私设置</li>
              <li>• 我们不会向第三方分享您的个人数据</li>
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