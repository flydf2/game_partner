<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()

const orders = ref([])
const loading = ref(true)
const activeTab = ref('ongoing')
const error = ref(null)

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待选中' },
  { id: 'ongoing', label: '进行中' },
  { id: 'completed', label: '已结束' }
]

const loadOrders = async () => {
  try {
    loading.value = true
    error.value = null
    
    // 模拟数据
    orders.value = [
      {
        id: '1',
        title: '王者荣耀：巅峰赛上分',
        game: '王者荣耀',
        reward: 188.00,
        status: 'ongoing',
        statusText: '正在进行',
        publisher: {
          name: '超级大魔王',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ6pTTFu28KQVR6fyByWrZlbu8eiLyrmVqvfT5TjL6jt-5EVjYH9w_oF7bn456-s6oPpTPNYMIjM1YVQEBM5bAfDO6kKmeeKR3q0sauEGjm5oCf7uJ4UYddJcjcUc43mRmbW5badueZPvbhg0IbKK-W8PGkJbgNBPhCkcGV5uYhZEHN1J1rylcVZqw6hWls3zDwQRuLn00s_iPp_p1kLhM1eNCnGcDupmHT4O9yzRhJRpnxgwpsBqNZU6bDgVWXCMXTprBf16ENI4'
        },
        action: '进入语音房'
      },
      {
        id: '2',
        title: '原神：探索协助',
        game: '原神',
        reward: 88.00,
        status: 'pending',
        statusText: '等待房主选择',
        publisher: {
          name: '派蒙的厨师',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGdZG0j9ss-YwbObwdG58pijUcqoMgm0x4YfL6KyX5idPsqyVjaqg6KiRWLvtYudZvAAsT6T9ynvsOplUtghVkXEDm7jxLMwcOyjsKWrj9E0QY0DdGLuBwWcI6kXhhFQNygqhVbYqqhffgIPHUMP7mxJGk_bcvf47O8pgscDIAhi2iV2s7_ccqBTvYFe3eju0606f1jUhq7xaisDgpN8LBh56IFK8AX-hsKtLiltSvNQXAAhJEiHEyMvhrJbzGYSzO4mCZzVszbz4'
        },
        appliedTime: '14:20',
        canWithdraw: true
      },
      {
        id: '3',
        title: '和平精英：双人组队',
        game: '和平精英',
        reward: 65.00,
        status: 'completed',
        statusText: '已结算',
        publisher: {
          name: '战神A',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkehyRkbvvwe5wXbPMBlygTfY0697on6M1x0otvTqoQGir-tf5jx5_-NjeojTRAIwcovLGHIDqgxe29Buf-q4kqeT-U5vfQEb7PTLWtGC082QAAqC-jLASB36PTrHEznDzmbx0A4eRGsBBMgzSzddcEQvbsyJ8fN4u8V57h6lwKXwSQrlS_7Ai5Q01g8pc8jwELVAM2gxwT5QwQ8Dzt9THcP2kSbiNDPDfT_TQP-011cOx8vbbVhtbwBj56AM2afw0f37ueqAUD-s'
        },
        completed: true
      }
    ]
  } catch (err) {
    error.value = err.message
    console.error('加载订单失败:', err)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
}

const handleViewOrder = (orderId) => {
  router.push(`/grab-order/${orderId}/detail`)
}

const handleWithdraw = (orderId) => {
  // TODO: 实现撤回申请功能
  alert('撤回申请功能开发中')
}

const handleEnterVoiceRoom = (orderId) => {
  // TODO: 实现进入语音房功能
  alert('进入语音房功能开发中')
}

const handleMenu = () => {
  router.push('/profile')
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

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <AppHeader
      title="我的抢单"
      is-primary-page
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />
    
    <main class="pt-24 px-5 max-w-xl mx-auto space-y-8">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="w-24 h-24 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-error text-5xl">error_outline</span>
        </div>
        <h2 class="text-xl font-bold text-on-surface mb-2">加载失败</h2>
        <p class="text-sm text-on-surface-variant mb-4">{{ error }}</p>
        <button 
          @click="loadOrders"
          class="px-6 py-2.5 rounded-full bg-primary text-on-primary font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
        >
          重试
        </button>
      </div>

      <div v-else class="space-y-8">
        <!-- 状态导航标签栏 -->
        <nav class="flex items-center space-x-2 overflow-x-auto pb-2 hide-scrollbar">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="handleTabChange(tab.id)"
            :class="[
              'px-5 py-2.5 rounded-full text-sm font-semibold transition-all',
              activeTab === tab.id
                ? 'bg-primary-container text-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>

        <!-- 订单列表 -->
        <section class="space-y-6">
          <!-- 进行中订单 -->
          <div v-if="activeTab === 'ongoing' || activeTab === 'all'" class="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-5 border-l-4 border-primary-container transition-transform active:scale-[0.99]">
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <span class="text-[10px] font-bold tracking-wider text-primary uppercase bg-primary-container/20 px-2 py-0.5 rounded-sm">正在进行</span>
                <h3 class="text-lg font-bold font-headline leading-tight">{{ orders.find(o => o.status === 'ongoing')?.title || '王者荣耀：巅峰赛上分' }}</h3>
                <div class="flex items-center gap-2 mt-2">
                  <div class="w-6 h-6 rounded-full overflow-hidden bg-surface-container">
                    <img 
                      :alt="orders.find(o => o.status === 'ongoing')?.publisher?.name || '超级大魔王'" 
                      class="w-full h-full object-cover"
                      :src="orders.find(o => o.status === 'ongoing')?.publisher?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ6pTTFu28KQVR6fyByWrZlbu8eiLyrmVqvfT5TjL6jt-5EVjYH9w_oF7bn456-s6oPpTPNYMIjM1YVQEBM5bAfDO6kKmeeKR3q0sauEGjm5oCf7uJ4UYddJcjcUc43mRmbW5badueZPvbhg0IbKK-W8PGkJbgNBPhCkcGV5uYhZEHN1J1rylcVZqw6hWls3zDwQRuLn00s_iPp_p1kLhM1eNCnGcDupmHT4O9yzRhJRpnxgwpsBqNZU6bDgVWXCMXTprBf16ENI4'"
                    />
                  </div>
                  <span class="text-sm text-on-surface-variant">房主：<span class="text-on-surface font-medium">{{ orders.find(o => o.status === 'ongoing')?.publisher?.name || '超级大魔王' }}</span></span>
                </div>
              </div>
              <div class="text-right">
                <span class="text-2xl font-extrabold font-headline text-primary">¥{{ orders.find(o => o.status === 'ongoing')?.reward || 188.00 }}</span>
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button 
                @click="handleEnterVoiceRoom"
                class="flex-1 bg-primary-container text-primary font-bold py-3 rounded-full text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">mic</span>
                进入语音房
              </button>
              <button 
                @click="handleViewOrder(orders.find(o => o.status === 'ongoing')?.id)"
                class="flex-1 bg-surface-container-low text-on-surface font-semibold py-3 rounded-full text-sm hover:bg-surface-container-high active:scale-95 transition-transform"
              >
                查看详情
              </button>
            </div>
          </div>

          <!-- 待选中订单 -->
          <div v-if="activeTab === 'pending' || activeTab === 'all'" class="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-4 opacity-90">
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-secondary"></span>
                  <span class="text-xs font-medium text-secondary">等待房主选择</span>
                </div>
                <h3 class="text-lg font-bold font-headline leading-tight">{{ orders.find(o => o.status === 'pending')?.title || '原神：探索协助' }}</h3>
                <div class="flex items-center gap-2 mt-2">
                  <div class="w-6 h-6 rounded-full overflow-hidden bg-surface-container">
                    <img 
                      :alt="orders.find(o => o.status === 'pending')?.publisher?.name || '派蒙的厨师'" 
                      class="w-full h-full object-cover"
                      :src="orders.find(o => o.status === 'pending')?.publisher?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGdZG0j9ss-YwbObwdG58pijUcqoMgm0x4YfL6KyX5idPsqyVjaqg6KiRWLvtYudZvAAsT6T9ynvsOplUtghVkXEDm7jxLMwcOyjsKWrj9E0QY0DdGLuBwWcI6kXhhFQNygqhVbYqqhffgIPHUMP7mxJGk_bcvf47O8pgscDIAhi2iV2s7_ccqBTvYFe3eju0606f1jUhq7xaisDgpN8LBh56IFK8AX-hsKtLiltSvNQXAAhJEiHEyMvhrJbzGYSzO4mCZzVszbz4'"
                    />
                  </div>
                  <span class="text-sm text-on-surface-variant">房主：<span class="text-on-surface font-medium">{{ orders.find(o => o.status === 'pending')?.publisher?.name || '派蒙的厨师' }}</span></span>
                </div>
              </div>
              <div class="bg-surface-container-low px-3 py-1.5 rounded-lg text-[10px] font-bold text-on-surface-variant font-headline uppercase">
                Pending
              </div>
            </div>
            <div class="bg-surface-container-low/50 rounded-xl px-4 py-3 flex items-center justify-between">
              <span class="text-sm text-on-surface-variant">已于 {{ orders.find(o => o.status === 'pending')?.appliedTime || '14:20' }} 提交申请</span>
              <button 
                v-if="orders.find(o => o.status === 'pending')?.canWithdraw"
                @click="handleWithdraw"
                class="text-secondary text-sm font-bold"
              >
                撤回
              </button>
            </div>
          </div>

          <!-- 已结束订单 -->
          <div v-if="activeTab === 'completed' || activeTab === 'all'" class="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-surface-container-high rotate-45 flex items-end justify-center pb-2">
              <span class="material-symbols-outlined text-on-surface-variant/30 text-3xl -rotate-45">task_alt</span>
            </div>
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <span class="text-xs font-medium text-on-surface-variant/60">已结算</span>
                <h3 class="text-lg font-bold font-headline leading-tight text-on-surface-variant">{{ orders.find(o => o.status === 'completed')?.title || '和平精英：双人组队' }}</h3>
                <div class="flex items-center gap-2 mt-2">
                  <div class="w-6 h-6 rounded-full overflow-hidden grayscale">
                    <img 
                      :alt="orders.find(o => o.status === 'completed')?.publisher?.name || '战神A'" 
                      class="w-full h-full object-cover"
                      :src="orders.find(o => o.status === 'completed')?.publisher?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkehyRkbvvwe5wXbPMBlygTfY0697on6M1x0otvTqoQGir-tf5jx5_-NjeojTRAIwcovLGHIDqgxe29Buf-q4kqeT-U5vfQEb7PTLWtGC082QAAqC-jLASB36PTrHEznDzmbx0A4eRGsBBMgzSzddcEQvbsyJ8fN4u8V57h6lwKXwSQrlS_7Ai5Q01g8pc8jwELVAM2gxwT5QwQ8Dzt9THcP2kSbiNDPDfT_TQP-011cOx8vbbVhtbwBj56AM2afw0f37ueqAUD-s'"
                    />
                  </div>
                  <span class="text-sm text-on-surface-variant/60">房主：{{ orders.find(o => o.status === 'completed')?.publisher?.name || '战神A' }}</span>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xl font-bold font-headline text-on-surface-variant">¥{{ orders.find(o => o.status === 'completed')?.reward || 65.00 }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 空状态提示 -->
        <div v-if="!loading && !error && orders.length === 0" class="pt-8 text-center opacity-40">
          <span class="material-symbols-outlined text-4xl mb-2">history</span>
          <p class="text-xs font-medium uppercase tracking-widest">仅显示最近30天的活动</p>
        </div>
      </div>
    </main>

    <BottomNavBar />

    <!-- 底部导航栏 -->
    <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 py-3 pb-safe bg-white/80 backdrop-blur-xl shadow-[0_-4px_20px_0_rgba(0,0,0,0.04)] rounded-t-[1.5rem]">
      <a class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 transition-transform duration-200" href="#">
        <span class="material-symbols-outlined">home</span>
        <span class="font-headline text-[10px] font-medium">首页</span>
      </a>
      <a class="flex flex-col items-center justify-center bg-primary-container text-primary rounded-full px-4 py-1.5 active:scale-90 transition-transform duration-200" href="#">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">confirmation_number</span>
        <span class="font-headline text-[10px] font-medium">抢单</span>
      </a>
      <a class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 transition-transform duration-200" href="#">
        <span class="material-symbols-outlined">chat_bubble</span>
        <span class="font-headline text-[10px] font-medium">消息</span>
      </a>
      <a class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 transition-transform duration-200" href="#">
        <span class="material-symbols-outlined">person</span>
        <span class="font-headline text-[10px] font-medium">我的</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
