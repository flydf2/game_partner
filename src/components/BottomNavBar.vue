<template>
  <div class="fixed bottom-0 left-0 z-50">
    <!-- 收缩状态 - 左下角浮动按钮 -->
    <div
      v-if="isCollapsedPage && !isExpanded"
      class="fixed bottom-6 left-6"
    >
      <button
        @click="toggleExpand"
        class="w-14 h-14 bg-yellow-400 rounded-full shadow-2xl flex items-center justify-center text-zinc-900 active:scale-90 transition-transform hover:scale-110"
      >
        <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">menu</span>
      </button>
    </div>

    <!-- 展开状态 - 完整导航栏 -->
    <nav
      v-else
      class="w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(255,215,0,0.08)] rounded-t-[24px] transition-all duration-300"
      :class="{ 'fixed bottom-0 left-0': !isCollapsedPage || isExpanded }"
    >
      <!-- 收起按钮 - 只在非收缩页面显示 -->
      <button
        v-if="!isCollapsedPage"
        @click="toggleExpand"
        class="absolute -top-3 left-4 w-8 h-8 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center text-zinc-900 active:scale-90 transition-transform hover:scale-110"
      >
        <span
          class="material-symbols-outlined text-lg transition-transform duration-300"
          :class="{ 'rotate-180': !isExpanded }"
        >
          expand_more
        </span>
      </button>

      <!-- 关闭按钮 - 只在收缩页面展开时显示 -->
      <button
        v-if="isCollapsedPage && isExpanded"
        @click="toggleExpand"
        class="absolute -top-3 right-4 w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full shadow-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 active:scale-90 transition-transform hover:scale-110"
      >
        <span class="material-symbols-outlined text-lg">close</span>
      </button>

      <!-- 导航项容器 -->
      <div class="flex justify-around items-center w-full" :class="{ 'pt-2': !isCollapsedPage }">
        <!-- 首页 -->
        <router-link
          to="/"
          class="flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 duration-300"
          :class="getNavItemClass('/')"
          @click="handleNavClick"
        >
          <span
            class="material-symbols-outlined"
            :style="currentRoute === '/' ? { fontVariationSettings: 'FILL 1' } : {}"
          >
            home_filled
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold tracking-wide mt-0.5">首页</span>
        </router-link>

        <!-- 发现 -->
        <router-link
          to="/discover"
          class="flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 duration-300"
          :class="getNavItemClass('/discover')"
          @click="handleNavClick"
        >
          <span
            class="material-symbols-outlined"
            :style="currentRoute === '/discover' ? { fontVariationSettings: 'FILL 1' } : {}"
          >
            explore
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold tracking-wide mt-0.5">发现</span>
        </router-link>

        <!-- 排行榜 -->
        <router-link
          to="/leaderboard"
          class="flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 duration-300"
          :class="getNavItemClass('/leaderboard')"
          @click="handleNavClick"
        >
          <span
            class="material-symbols-outlined"
            :style="currentRoute === '/leaderboard' ? { fontVariationSettings: 'FILL 1' } : {}"
          >
            emoji_events
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold tracking-wide mt-0.5">排行</span>
        </router-link>

        <!-- 聊天 -->
        <router-link
          to="/messages"
          class="flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 duration-300"
          :class="getNavItemClass('/messages')"
          @click="handleNavClick"
        >
          <span
            class="material-symbols-outlined"
            :style="currentRoute === '/messages' ? { fontVariationSettings: 'FILL 1' } : {}"
          >
            chat_bubble
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold tracking-wide mt-0.5">聊天</span>
        </router-link>

        <!-- 订单 -->
        <div class="relative" @click.stop>
          <router-link
            to="/orders"
            class="flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 duration-300"
            :class="getNavItemClass('/orders')"
            @click="handleOrderClick"
          >
            <span
              class="material-symbols-outlined"
              :style="currentRoute === '/orders' ? { fontVariationSettings: 'FILL 1' } : {}"
            >
              receipt_long
            </span>
            <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold tracking-wide mt-0.5">订单</span>
          </router-link>
          
          <!-- 订单子菜单 -->
          <div 
            v-if="isOrderMenuOpen"
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col gap-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-2 min-w-[160px] animate-in fade-in slide-in-from-bottom-4 duration-200"
          >
            <button
              @click="handleOrderClick('all')"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-left"
            >
              <span class="material-symbols-outlined text-primary text-lg">receipt_long</span>
              <span class="font-medium text-on-surface">全部订单</span>
            </button>
            <button
              @click="handleOrderClick('pending')"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-left"
            >
              <span class="material-symbols-outlined text-amber-500 text-lg">schedule</span>
              <span class="font-medium text-on-surface">待确认</span>
            </button>
            <button
              @click="handleOrderClick('ongoing')"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-left"
            >
              <span class="material-symbols-outlined text-primary text-lg">play_circle</span>
              <span class="font-medium text-on-surface">进行中</span>
            </button>
            <button
              @click="handleOrderClick('completed')"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-left"
            >
              <span class="material-symbols-outlined text-success text-lg">check_circle</span>
              <span class="font-medium text-on-surface">已完成</span>
            </button>
            <button
              @click="handleOrderClick('cancelled')"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-left"
            >
              <span class="material-symbols-outlined text-error text-lg">cancel</span>
              <span class="font-medium text-on-surface">已取消</span>
            </button>
          </div>
        </div>

        <!-- 我的 -->
        <router-link
          to="/profile"
          class="flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 duration-300"
          :class="getNavItemClass('/profile')"
          @click="handleNavClick"
        >
          <span
            class="material-symbols-outlined"
            :style="currentRoute === '/profile' ? { fontVariationSettings: 'FILL 1' } : {}"
          >
            person
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold tracking-wide mt-0.5">我的</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 当前路由
const currentRoute = computed(() => route.path)

// 需要收缩导航栏的页面路径
const collapsedPages = [
  '/chat/',
  '/create-post',
  '/expert/',
  '/withdrawal'
]

// 判断当前页面是否需要收缩导航栏
const isCollapsedPage = computed(() => {
  return collapsedPages.some(page => currentRoute.value.startsWith(page))
})

// 展开/收起状态
const isExpanded = ref(false)

// 订单菜单展开状态
const isOrderMenuOpen = ref(false)

// 监听路由变化，重置展开状态
watch(currentRoute, () => {
  // 如果是收缩页面，默认收起
  if (isCollapsedPage.value) {
    isExpanded.value = false
    isOrderMenuOpen.value = false
  } else {
    // 其他页面默认展开
    isExpanded.value = true
  }
}, { immediate: true })

// 点击外部关闭订单菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isOrderMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 切换展开/收起状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 处理订单点击
const handleOrderClick = (filterType) => {
  if (filterType) {
    isOrderMenuOpen.value = false
    router.push(`/orders?status=${filterType}`)
  } else {
    isOrderMenuOpen.value = !isOrderMenuOpen.value
  }
}

// 处理导航点击
const handleNavClick = () => {
  // 在收缩页面点击导航后自动收起
  if (isCollapsedPage.value) {
    isExpanded.value = false
  }
}

// 获取导航项样式
const getNavItemClass = (path) => {
  const isActive = currentRoute.value === path
  return {
    'bg-yellow-400 text-zinc-900 rounded-2xl scale-105': isActive,
    'text-zinc-400 hover:text-yellow-500': !isActive
  }
}
</script>

<style scoped>
/* 组件样式 */
</style>
