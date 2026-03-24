<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const orderId = ref(route.params.id)
const order = ref(null)
const loading = ref(true)
const isSubmitting = ref(false)

const loadOrderDetail = async () => {
  try {
    loading.value = true
    // 模拟数据
    order.value = {
      id: orderId.value,
      title: '寻找英雄联盟钻石段位陪玩',
      content: '想找个钻石段位的陪玩，一起上分，要求脾气好，技术稳定',
      reward: 80,
      game: '英雄联盟',
      publisher: {
        name: '游戏达人',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        level: 25,
        gameLevel: '黄金' // 发布者的游戏等级
      },
      createdAt: '2小时前',
      paymentMethod: 'prepay',
      tags: ['钻石', '上分', '脾气好'],
      requirements: [
        '钻石及以上段位',
        '脾气好，不喷人',
        '技术稳定，有耐心',
        '熟悉当前版本强势英雄'
      ]
    }
  } catch (error) {
    console.error('加载订单详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handleGrabOrder = async () => {
  isSubmitting.value = true
  try {
    // 模拟抢单请求
    console.log('抢单:', orderId.value)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 抢单成功，跳转到订单详情
    router.push(`/order/${orderId.value}`)
  } catch (error) {
    console.error('抢单失败:', error)
    alert('抢单失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  loadOrderDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-surface-container-low/50">
      <div class="flex items-center gap-4">
        <span
          @click="handleCancel"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">抢单确认</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="pt-20 px-5 max-w-2xl mx-auto space-y-6">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="order" class="space-y-6">
        <!-- 订单信息 -->
        <section class="bg-surface-container-lowest rounded-3xl p-5">
          <h2 class="text-xl font-bold text-on-surface mb-4">{{ order.title }}</h2>
          <p class="text-sm text-on-surface-variant mb-4">{{ order.content }}</p>

          <div class="flex flex-wrap gap-2 mb-4">
            <span class="px-2 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">{{ order.game }}</span>
            <span v-for="tag in order.tags" :key="tag" class="px-2 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">{{ tag }}</span>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden">
                <img :alt="order.publisher.name" class="w-full h-full object-cover" :src="order.publisher.avatar" />
              </div>
              <div>
                <h3 class="font-bold text-on-surface">{{ order.publisher.name }}</h3>
                <p class="text-xs text-on-surface-variant">等级 {{ order.publisher.level }} · {{ order.publisher.gameLevel }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xl font-headline font-bold text-primary">¥{{ order.reward }}</p>
              <p class="text-xs text-on-surface-variant">{{ order.paymentMethod === 'prepay' ? '预支付' : '确认后支付' }}</p>
            </div>
          </div>
        </section>

        <!-- 要求 -->
        <section class="bg-surface-container-lowest rounded-3xl p-5">
          <h3 class="font-bold text-on-surface mb-3">发布要求</h3>
          <ul class="space-y-2">
            <li v-for="(requirement, index) in order.requirements" :key="index" class="flex items-start gap-2">
              <span class="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
              <span class="text-sm text-on-surface-variant">{{ requirement }}</span>
            </li>
          </ul>
        </section>

        <!-- 注意事项 -->
        <section class="bg-tertiary-container/10 rounded-3xl p-4">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-tertiary">info</span>
            <div class="text-sm text-on-surface-variant">
              <p class="mb-1">抢单注意事项：</p>
              <ul class="list-disc list-inside space-y-1 text-xs">
                <li>请确保您符合发布者的要求</li>
                <li>抢单后请及时联系发布者</li>
                <li>服务完成后请及时确认</li>
                <li>如有问题请联系客服</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-surface-container rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-outline text-5xl">error_outline</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">订单不存在</h2>
        <p class="text-sm text-on-surface-variant">请返回重试</p>
      </div>
    </main>

    <!-- 底部操作栏 -->
    <div v-if="order" class="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-5 bg-surface/80 backdrop-blur-lg z-40 border-t border-surface-container-low/50">
      <div class="flex gap-3">
        <button
          @click="handleCancel"
          class="flex-1 py-3 rounded-full border border-outline-variant/20 text-on-surface-variant font-headline font-bold text-sm active:scale-95 transition-transform"
        >
          取消
        </button>
        <button
          @click="handleGrabOrder"
          :disabled="isSubmitting"
          class="flex-1 py-3 rounded-full bg-primary text-on-primary-fixed font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
          :class="isSubmitting ? 'opacity-50 cursor-not-allowed' : ''"
        >
          {{ isSubmitting ? '抢单中...' : '确认抢单' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>