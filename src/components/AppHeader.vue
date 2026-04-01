<template>
  <div>
    <header
      class="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 h-16 sm:h-24 bg-white dark:bg-zinc-900 shadow-sm"
      :class="headerClass"
    >
      <div class="flex items-center gap-2 sm:gap-4">
        <span
          v-if="showMenu"
          class="material-symbols-outlined active:scale-95 duration-200 ease-out cursor-pointer transition-transform"
          :class="iconClass"
          @click="handleMenuClick"
        >
          menu
        </span>
        <span
          v-if="showBack && !showMenu"
          @click="handleBackClick"
          class="material-symbols-outlined cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
          :class="iconClass"
        >
          arrow_back_ios
        </span>
        <h1
          class="font-bold text-base sm:text-lg tracking-tight transition-colors duration-300"
          :class="titleClass"
        >
          {{ title }}
        </h1>
      </div>
      <div class="flex items-center gap-2 sm:gap-3">
        <slot name="left-actions" />
        <button
          v-if="showNotifications"
          class="relative text-zinc-500 dark:text-zinc-400 hover:opacity-80 active:scale-95 transition-all"
          @click="handleNotificationsClick"
        >
          <span class="material-symbols-outlined">notifications</span>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-primary text-on-primary rounded-full flex items-center justify-center text-[7px] sm:text-[8px] font-bold"
          >
            {{ unreadCount }}
          </span>
        </button>
        <span
          v-if="showSearch"
          class="material-symbols-outlined cursor-pointer hover:opacity-80 active:scale-95 transition-all"
          :class="iconClass"
          @click="handleSearchClick"
        >
          search
        </span>
        <div
          v-if="showAvatar"
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-container-high overflow-hidden cursor-pointer active:scale-95 transition-transform"
          @click="handleProfileClick"
        >
          <img alt="User Avatar" class="w-full h-full object-cover" :src="avatarUrl" />
        </div>
        <slot name="right-actions" />
      </div>
    </header>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '阳光陪玩'
  },
  showBack: {
    type: Boolean,
    default: true
  },
  showMenu: {
    type: Boolean,
    default: false
  },
  showNotifications: {
    type: Boolean,
    default: true
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  showAvatar: {
    type: Boolean,
    default: true
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  avatarUrl: {
    type: String,
    default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNN7pNKogoJYe4wsv3o-FDAyvSBuhTul48i-mZ8WsuTaiMYduHla1_zSjL2SVhNTYWcl8KXkzkFWu37CDNXR17T-IqRbkRE3YSkz9RDnoBDmP-PV4kccs__KEv3e8g6ZgTTBbhrzVg7gEB1CRLgL8Gw62MMBPFzUD9Iqe68g2fv4HYlswHzjHItNgFjyODx_dufgH7IzM8JT7PIHeVxMyHtCYvaRKAjhGPpwmk79mWP-Se0BHWL9iJ2xgSD4kBoikIe8dxtqe1tRc'
  },
  isPrimaryPage: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back', 'menu', 'notifications', 'search', 'profile'])

const headerClass = computed(() => {
  return props.isPrimaryPage
    ? 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm shadow-yellow-500/5'
    : 'bg-surface flex items-center justify-between px-5 h-16 border-b border-outline-variant/20'
})

const iconClass = computed(() => {
  return props.isPrimaryPage
    ? 'text-yellow-600 dark:text-yellow-400'
    : 'text-primary'
})

const titleClass = computed(() => {
  return props.isPrimaryPage
    ? 'text-yellow-600 dark:text-yellow-400'
    : 'text-primary'
})

const handleBackClick = () => {
  emit('back')
}

const handleMenuClick = () => {
  emit('menu')
}

const handleNotificationsClick = () => {
  emit('notifications')
}

const handleSearchClick = () => {
  emit('search')
}

const handleProfileClick = () => {
  emit('profile')
}
</script>

<style scoped>
:root {
  --header-height: 96px; /* 对应 Tailwind 的 h-24 */
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
