<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useModal } from '../composables/useModal.js'

const router = useRouter()
const { info: showInfo } = useModal()

const securityItems = ref([
  {
    key: 'password',
    label: '修改密码',
    icon: 'lock',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    description: '定期修改密码提高账户安全性'
  },
  {
    key: 'phone',
    label: '手机绑定',
    icon: 'phone_android',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    description: '绑定手机号，提高账户安全'
  },
  {
    key: 'email',
    label: '邮箱绑定',
    icon: 'email',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    description: '绑定邮箱，接收重要通知'
  },
  {
    key: 'devices',
    label: '登录设备管理',
    icon: 'devices',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    description: '查看和管理登录设备'
  },
  {
    key: 'two-factor',
    label: '两步验证',
    icon: 'security',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    description: '开启两步验证，提高账户安全'
  }
])

const handleItemClick = (key) => {
  console.log('安全设置项点击:', key)
  switch (key) {
    case 'password':
      router.push('/profile/security/password')
      break
    case 'phone':
      router.push('/profile/security/phone')
      break
    case 'email':
      router.push('/profile/security/email')
      break
    case 'devices':
      console.log('登录设备管理功能开发中')
      showInfo('登录设备管理功能开发中')
      break
    case 'two-factor':
      console.log('两步验证功能开发中')
      showInfo('两步验证功能开发中')
      break
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
        <h1 class="font-headline font-bold text-lg text-primary">账号安全</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="page-content pt-24 pb-32 space-y-6 space-y-4">
      <div class="bg-surface-container-lowest rounded-3xl overflow-hidden">
        <div
          v-for="item in securityItems"
          :key="item.key"
          class="flex items-center gap-4 p-5 hover:bg-surface-container-low transition-colors cursor-pointer duration-200"
          :class="{ 'border-b border-surface-container': item !== securityItems[securityItems.length - 1] }"
          @click="handleItemClick(item.key)"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="item.iconBg">
            <span class="material-symbols-outlined" :class="item.iconColor" style="font-variation-settings: 'FILL' 1;">{{ item.icon }}</span>
          </div>
          <div class="flex-1">
            <span class="font-semibold text-on-surface block">{{ item.label }}</span>
            <span class="text-xs text-on-surface-variant block mt-1">{{ item.description }}</span>
          </div>
          <span class="material-symbols-outlined text-outline text-lg transition-transform duration-200 hover:translate-x-1">chevron_right</span>
        </div>
      </div>

      <div class="bg-primary-container/10 p-4 rounded-xl">
        <div class="flex gap-3 items-start">
          <span class="material-symbols-outlined text-primary text-lg">info</span>
          <div class="space-y-1">
            <p class="text-xs font-bold text-on-primary-container">安全提示</p>
            <ul class="text-[10px] text-on-primary-container/70 leading-relaxed space-y-1">
              <li>• 定期修改密码，使用强密码</li>
              <li>• 不要向他人透露验证码</li>
              <li>• 开启两步验证提高账户安全</li>
              <li>• 定期检查登录设备</li>
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