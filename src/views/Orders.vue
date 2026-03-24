<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TopAppBar from '../components/TopAppBar.vue'

const router = useRouter()

const activeTab = ref('all')
const orders = ref([
  {
    id: 1,
    status: 'ongoing',
    statusText: '进行中',
    statusClass: 'bg-tertiary-container/20 text-on-tertiary-container',
    playmate: {
      name: 'Luna_Gamer',
      game: 'League of Legends',
      service: 'Ranked Carry',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBlP-dDH5L4uhhCvFnaGzn1KNipNI3vRECaf0dNus0QFQB4wshcgFZxRyvD1zwjrKM63RJpyjqKZ5x-QzMGsEncZZcLdLimJP5enKrkSXsMSzWuP_HSRsfCEb0DjoSnc-RgBMddRklJhASmptoTB_bIgAwzYRXdCzQx8X_9qRwyu7a638NjfuKax4mYW6JcKbXNLgWbtYSzrD8Z0a3loMG_xd8O6LXH0zUFKgytl6w5_oWCxGIMb03SSJ0CdLDNJLGOfLTpoAgiKU'
    },
    time: 'Today, 20:00',
    duration: '2小时 • 1局',
    price: 45.00
  },
  {
    id: 2,
    status: 'completed',
    statusText: '已完成',
    statusClass: 'bg-surface-container-high text-on-surface-variant',
    playmate: {
      name: 'MochiMeow',
      game: 'Genshin Impact',
      service: 'Exploration',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoZ4bsSgqut4Pu2mximOY5_WV3kBtQIaIl3MLkzgS8WYbcGYIJ1qCZhxaswsiz5VsSpkNXBCxCJZXENcNW51s79ic_Qps8nrvNYbMfo4d2IQOzFdohZ8LpAzcdBo2pa5rccbiMV4AuSfOspCcT5F89qUWpIrbRAPDB3Jg6YS8mWcQ1tjj8Du3mK86A2c5wzvWfLHpC1pEOzk4UH0nFv-Rpvlx9nddtq9q_jhUpqz0pbFixkXk-sVtroHvKWh2mP9rygI6x0L1u4r8'
    },
    time: '昨天, 14:30',
    duration: '1小时 • 娱乐上分',
    price: 18.00
  },
  {
    id: 3,
    status: 'pending',
    statusText: '待确认',
    statusClass: 'bg-primary-container text-on-primary-container',
    playmate: {
      name: 'Ace_Striker',
      game: 'Valorant',
      service: 'Duo Queue',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZkLw7Z2hvgTLvmnMy4uP9PtPlJbNOJEPKXTN0b1_kWk6T1ZMIefafb8O7brh_y6YYitEh4gQKq6tS6hmRGJhPhEvgiPRtbtWtGNEVgyxGH0NOBsT6BS6BD4pEEDiGjITAOQqzBItp52oa20RWq97DZvLvg5auLeZxeNbdQjtD20X6lJcb7bxLVc6kkn-Vyxj2Ha-HNTO7rD56xgCbPz3wQUm4msl1GAkYgseE2hA1evc5BGQnWpxu5oFxUbptmRah9A3eXtXGIw'
    },
    time: '11月24日, 19:00',
    duration: '等待确认中...',
    price: 32.50
  },
  {
    id: 4,
    status: 'cancelled',
    statusText: '已取消',
    statusClass: 'bg-error-container/10 text-error',
    playmate: {
      name: 'Shadow_Ninja',
      game: 'PUBG',
      service: 'Squad Help',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2YmIJNnItMbXeENVsj7hCFgNbIJUjT8aXZVxjC2k5blZm9fKx46QynWnInSZ_I8Ay1ttQ4w12gnCWAUxA-jb2LM6yB5a36__MOMcjaUN3O912Yd-zArsYawj55SnQe-xCXQbKMN54RC00vN_8CGc5WcqDkFJxIEX4be0e-g9ktnGNB5o_L-ZxMpkkCzqAstyEip7TRkkrxOHSlqqSQ3Xn30x7CeiAwfykm_m18fD2v8gA1RD6hQ7VNijHXnpEhUvnfeKinI4Q'
    },
    time: '11月20日',
    duration: '用户已取消申请',
    price: 25.00
  }
])

const filteredOrders = ref(orders.value)

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待确认' },
  { id: 'ongoing', label: '进行中' },
  { id: 'completed', label: '已完成' },
  { id: 'cancelled', label: '已取消' }
]

const handleTabChange = (tabId) => {
  activeTab.value = tabId
  if (tabId === 'all') {
    filteredOrders.value = orders.value
  } else {
    filteredOrders.value = orders.value.filter(order => order.status === tabId)
  }
}

const handleContact = (orderId) => {
  console.log('联系Ta:', orderId)
  // 跳转到聊天页面
  router.push(`/chat/${orderId}`)
}

const handleEnterRoom = (orderId) => {
  console.log('进入房间:', orderId)
  // 这里可以添加进入房间的逻辑
  alert('进入房间功能已开发')
}

const handleOrderAgain = (orderId) => {
  console.log('再来一单:', orderId)
  // 跳转到确认订单页面
  router.push('/confirm-order')
}

const handleReview = (orderId) => {
  console.log('去评价:', orderId)
  router.push(`/review/${orderId}`)
}

const handleCancelOrder = (orderId) => {
  console.log('取消订单:', orderId)
  // 这里可以添加取消订单的逻辑
  alert('订单已取消')
}

const handleViewDetails = (orderId) => {
  console.log('查看详情:', orderId)
  // 跳转到订单详情页面
  router.push(`/order/${orderId}`)
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-32">
    <TopAppBar title="我的订单" />

    <main class="w-full max-w-md pb-32">
      <!-- Status Tabs -->
      <div class="px-5 py-4 sticky top-16 bg-background z-40">
        <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="handleTabChange(tab.id)"
            :class="[
              'flex-none px-5 py-2 rounded-full font-headline text-sm transition-all',
              activeTab === tab.id
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant font-medium hover:bg-surface-container-high'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Orders List -->
      <div class="px-5 space-y-4">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          :class="[
            'bg-surface-container-lowest rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden',
            order.status === 'cancelled' ? 'opacity-70 grayscale-[0.5]' : ''
          ]"
        >
          <div class="absolute top-0 right-0">
            <div :class="['text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider', order.statusClass]">
              {{ order.statusText }}
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-primary-container/10 flex items-center justify-center">
              <img :alt="order.playmate.name" class="w-full h-full object-cover" :src="order.playmate.avatar" />
            </div>
            <div>
              <h3 class="font-headline font-bold text-on-surface text-base">{{ order.playmate.name }}</h3>
              <p class="text-on-surface-variant text-xs font-medium">{{ order.playmate.game }} • {{ order.playmate.service }}</p>
            </div>
          </div>

          <div v-if="order.status !== 'cancelled'" class="bg-surface-container-low rounded-xl p-3 flex justify-between items-center">
            <div class="space-y-1">
              <div class="flex items-center gap-1.5 text-on-surface-variant">
                <span class="material-symbols-outlined text-sm">
                  {{ order.status === 'ongoing' ? 'schedule' : order.status === 'completed' ? 'event_available' : 'hourglass_empty' }}
                </span>
                <span class="text-xs">{{ order.time }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-on-surface-variant">
                <span class="material-symbols-outlined text-sm">timelapse</span>
                <span class="text-xs">{{ order.duration }}</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">总价</p>
              <p class="text-xl font-headline font-extrabold" :class="order.status === 'completed' ? 'text-on-surface-variant' : 'text-primary'">
                ${{ order.price.toFixed(2) }}
              </p>
            </div>
          </div>

          <div v-if="order.status === 'cancelled'" class="flex justify-between items-center text-on-surface-variant">
            <span class="text-xs italic">{{ order.duration }}</span>
            <button @click="handleViewDetails(order.id)" class="text-xs font-bold text-primary underline active:scale-95 transition-transform">查看详情</button>
          </div>

          <div v-if="order.status === 'ongoing'" class="flex gap-3 pt-1">
            <button @click="handleContact(order.id)" class="flex-1 py-2.5 rounded-full bg-surface-container-high text-primary font-headline font-bold text-sm active:scale-95 transition-transform">
              联系Ta
            </button>
            <button @click="handleEnterRoom(order.id)" class="flex-1 py-2.5 rounded-full bg-primary text-on-primary-fixed font-headline font-bold text-sm shadow-md active:scale-95 transition-transform">
              进入房间
            </button>
          </div>

          <div v-if="order.status === 'completed'" class="flex gap-3 pt-1">
            <button @click="handleOrderAgain(order.id)" class="flex-1 py-2.5 rounded-full border border-outline-variant/20 text-on-surface-variant font-headline font-bold text-sm active:scale-95 transition-transform">
              再来一单
            </button>
            <button @click="handleReview(order.id)" class="flex-1 py-2.5 rounded-full bg-tertiary-container text-on-tertiary-container font-headline font-bold text-sm shadow-md active:scale-95 transition-transform">
              去评价
            </button>
          </div>

          <div v-if="order.status === 'pending'" class="flex gap-3 pt-1">
            <button @click="handleCancelOrder(order.id)" class="w-full py-2.5 rounded-full bg-surface-container-high text-error font-headline font-bold text-sm active:scale-95 transition-transform">
              取消订单
            </button>
          </div>
        </div>
      </div>
    </main>
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