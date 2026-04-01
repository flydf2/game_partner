<template>
  <div class="fixed bottom-0 left-0 z-50">
    <!-- 收缩状态 - 左下角浮动按钮 -->
    <div
      v-if="!isPrimaryPage && !isExpanded"
      class="fixed bottom-4 left-4 sm:bottom-6 sm:left-6"
    >
      <button
        @click="toggleExpand"
        class="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-400 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center text-zinc-900 active:scale-90 transition-transform hover:scale-105"
      >
        <span class="material-symbols-outlined text-xl sm:text-2xl" style="font-variation-settings: 'FILL' 1;">menu</span>
      </button>
    </div>

    <!-- 展开状态 - 完整导航栏 -->
    <nav
      v-if="isPrimaryPage || isExpanded"
      class="w-full flex justify-around items-center px-2 sm:px-4 pb-4 sm:pb-6 pt-2 sm:pt-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(255,215,0,0.08)] rounded-t-[18px] sm:rounded-t-[24px] transition-all duration-300"
      :class="{ 'fixed bottom-0 left-0': isPrimaryPage || isExpanded }"
    >
      <!-- 收起按钮 - 在一级页面和非一级页面展开时都显示 -->
      <button
        @click="toggleExpand"
        class="absolute -top-2.5 sm:-top-3 left-3 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center text-zinc-900 active:scale-90 transition-transform hover:scale-105"
      >
        <span
          class="material-symbols-outlined text-base sm:text-lg transition-transform duration-300"
          :class="{ 'rotate-180': !isExpanded }"
        >
          expand_more
        </span>
      </button>

      <!-- 导航项容器 -->
      <div class="flex justify-around items-center w-full" :class="{ 'pt-1.5 sm:pt-2': isPrimaryPage }">
        <!-- 首页 -->
        <router-link
          to="/"
          class="flex flex-col items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 transition-all active:scale-90 duration-300"
          :class="getNavItemClass('/')"
          @click="handleNavClick"
        >
          <span
            class="material-symbols-outlined text-lg sm:text-xl"
            :style="currentRoute === '/' ? { fontVariationSettings: 'FILL 1' } : {}"
          >
            home_filled
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[9px] sm:text-[10px] font-semibold tracking-wide mt-0.5">首页</span>
        </router-link>

        <!-- 发现 -->
        <router-link
          to="/discover"
          class="flex flex-col items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 transition-all active:scale-90 duration-300"
          :class="getNavItemClass('/discover')"
          @click="handleNavClick"
        >
          <span
            class="material-symbols-outlined text-lg sm:text-xl"
            :style="currentRoute === '/discover' ? { fontVariationSettings: 'FILL 1' } : {}"
          >
            explore
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[9px] sm:text-[10px] font-semibold tracking-wide mt-0.5">发现</span>
        </router-link>

        <!-- 聊天 -->
        <router-link
          to="/messages"
          class="flex flex-col items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 transition-all active:scale-90 duration-300"
          :class="getNavItemClass('/messages')"
          @click="handleNavClick"
        >
          <span
            class="material-symbols-outlined text-lg sm:text-xl"
            :style="currentRoute === '/messages' ? { fontVariationSettings: 'FILL 1' } : {}"
          >
            chat_bubble
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[9px] sm:text-[10px] font-semibold tracking-wide mt-0.5">聊天</span>
        </router-link>

        <!-- 社区 -->
        <router-link
          to="/community"
          class="flex flex-col items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 transition-all active:scale-90 duration-300"
          :class="getNavItemClass('/community')"
        >
          <span
            class="material-symbols-outlined text-lg sm:text-xl"
            :style="currentRoute === '/community' ? { fontVariationSettings: 'FILL 1' } : {}"
          >
            forum
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[9px] sm:text-[10px] font-semibold tracking-wide mt-0.5">社区</span>
        </router-link>

        <!-- 订单 -->
        <div class="relative" @click.stop>
          <router-link
            to="/orders"
            class="flex flex-col items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 transition-all active:scale-90 duration-300"
            :class="getNavItemClass('/orders')"
            @click="handleOrderClick"
          >
            <span
              class="material-symbols-outlined text-lg sm:text-xl"
              :style="currentRoute === '/orders' ? { fontVariationSettings: 'FILL 1' } : {}"
            >
              receipt_long
            </span>
            <span class="font-['Plus_Jakarta_Sans'] text-[9px] sm:text-[10px] font-semibold tracking-wide mt-0.5">订单</span>
          </router-link>
          
          <!-- 订单子菜单 -->
          <div 
            v-if="isOrderMenuOpen"
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 sm:mb-2 flex flex-col gap-1.5 sm:gap-2 bg-white dark:bg-zinc-800 rounded-xl sm:rounded-2xl shadow-xl p-1.5 sm:p-2 min-w-[140px] sm:min-w-[160px] animate-in fade-in slide-in-from-bottom-4 duration-200"
          >
            <button
              @click="handleOrderClick('all')"
              class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-left"
            >
              <span class="material-symbols-outlined text-primary text-base sm:text-lg">receipt_long</span>
              <span class="font-medium text-on-surface text-xs sm:text-sm">全部订单</span>
            </button>
            <button
              @click="handleOrderClick('pending')"
              class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-left"
            >
              <span class="material-symbols-outlined text-amber-500 text-base sm:text-lg">schedule</span>
              <span class="font-medium text-on-surface text-xs sm:text-sm">待确认</span>
            </button>
            <button
              @click="handleOrderClick('ongoing')"
              class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-left"
            >
              <span class="material-symbols-outlined text-primary text-base sm:text-lg">play_circle</span>
              <span class="font-medium text-on-surface text-xs sm:text-sm">进行中</span>
            </button>
            <button
              @click="handleOrderClick('completed')"
              class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-left"
            >
              <span class="material-symbols-outlined text-success text-base sm:text-lg">check_circle</span>
              <span class="font-medium text-on-surface text-xs sm:text-sm">已完成</span>
            </button>
            <button
              @click="handleOrderClick('cancelled')"
              class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-left"
            >
              <span class="material-symbols-outlined text-error text-base sm:text-lg">cancel</span>
              <span class="font-medium text-on-surface text-xs sm:text-sm">已取消</span>
            </button>
          </div>
        </div>

        <!-- 我的 -->
        <router-link
          to="/profile"
          class="flex flex-col items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 transition-all active:scale-90 duration-300"
          :class="getNavItemClass('/profile')"
          @click="handleNavClick"
        >
          <span
            class="material-symbols-outlined text-lg sm:text-xl"
            :style="currentRoute === '/profile' ? { fontVariationSettings: 'FILL 1' } : {}"
          >
            person
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[9px] sm:text-[10px] font-semibold tracking-wide mt-0.5">我的</span>
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

// 一级页面路径
const primaryPages = ['/', '/discover', '/messages', '/community', '/orders', '/profile', '/game-categories']

// 判断当前页面是否为一级页面
const isPrimaryPage = computed(() => {
  return primaryPages.some(page => currentRoute.value === page)
})

// 展开/收起状态
const isExpanded = ref(false)

// 订单菜单展开状态
const isOrderMenuOpen = ref(false)

// 监听路由变化，重置展开状态
watch(currentRoute, () => {
  // 一级页面默认展开
  if (isPrimaryPage.value) {
    isExpanded.value = true
    isOrderMenuOpen.value = false
  } else {
    // 其他页面默认收起
    isExpanded.value = false
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
    if (!isPrimaryPage.value) {
      isExpanded.value = false
    }
  } else {
    isOrderMenuOpen.value = !isOrderMenuOpen.value
  }
}

// 处理导航点击
const handleNavClick = () => {
  // 在非一级页面点击导航后自动收起
  if (!isPrimaryPage.value) {
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
