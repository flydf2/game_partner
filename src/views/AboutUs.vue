<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const appInfo = ref({
  name: '发现大神',
  version: '1.0.0',
  description: '专业的游戏陪玩平台，连接玩家与大神，提供高质量的游戏陪玩服务。',
  features: [
    '专业陪玩',
    '安全交易',
    '优质服务',
    '多样游戏'
  ],
  contact: {
    email: 'support@findmaster.com',
    phone: '400-123-4567',
    wechat: 'FindMasterOfficial'
  },
  social: [
    { name: '微信公众号', icon: 'chat' },
    { name: '微博', icon: 'public' },
    { name: '抖音', icon: 'play_circle' },
    { name: 'B站', icon: 'movie' }
  ]
})

const handleBack = () => {
  router.back()
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
        <h1 class="font-headline font-bold text-lg text-primary">关于我们</h1>
      </div>
      <div class="w-6"></div>
    </nav>

    <main class="pt-20 px-5 max-w-2xl mx-auto space-y-6">
      <!-- 应用信息 -->
      <section class="bg-surface-container-lowest rounded-3xl p-6 text-center">
        <div class="w-20 h-20 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="material-symbols-outlined text-primary text-4xl" style="font-variation-settings: 'FILL' 1;">emoji_events</span>
        </div>
        <h2 class="text-2xl font-headline font-bold text-on-surface mb-2">{{ appInfo.name }}</h2>
        <p class="text-sm text-on-surface-variant mb-4">版本 {{ appInfo.version }}</p>
        <p class="text-sm text-on-surface-variant leading-relaxed">{{ appInfo.description }}</p>
      </section>

      <!-- 核心功能 -->
      <section>
        <h3 class="text-base font-bold text-on-surface mb-4">核心功能</h3>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="(feature, index) in appInfo.features" :key="index" class="bg-surface-container-lowest rounded-2xl p-4 text-center">
            <span class="text-sm font-medium text-on-surface">{{ feature }}</span>
          </div>
        </div>
      </section>

      <!-- 联系我们 -->
      <section class="bg-surface-container-lowest rounded-3xl p-6">
        <h3 class="text-base font-bold text-on-surface mb-4">联系我们</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-primary">mail</span>
            <span class="text-sm text-on-surface">{{ appInfo.contact.email }}</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-primary">phone</span>
            <span class="text-sm text-on-surface">{{ appInfo.contact.phone }}</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-primary">chat</span>
            <span class="text-sm text-on-surface">{{ appInfo.contact.wechat }}</span>
          </div>
        </div>
      </section>

      <!-- 社交媒体 -->
      <section>
        <h3 class="text-base font-bold text-on-surface mb-4">关注我们</h3>
        <div class="flex gap-4">
          <div v-for="(social, index) in appInfo.social" :key="index" class="flex flex-col items-center gap-1">
            <div class="w-12 h-12 bg-surface-container-lowest rounded-2xl flex items-center justify-center">
              <span class="material-symbols-outlined text-primary">{{ social.icon }}</span>
            </div>
            <span class="text-xs text-on-surface-variant">{{ social.name }}</span>
          </div>
        </div>
      </section>

      <!-- 版权信息 -->
      <section class="text-center">
        <p class="text-xs text-on-surface-variant mb-2">© 2026 发现大神. 保留所有权利.</p>
        <p class="text-xs text-on-surface-variant">本应用仅用于提供游戏陪玩服务，与游戏厂商无直接关联。</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>