<template>
  <header class="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm shadow-yellow-500/5 flex items-center justify-between px-6 py-4">
    <div class="flex items-center gap-4">
      <span
        v-if="showMenu"
        class="material-symbols-outlined text-yellow-600 dark:text-yellow-400 active:scale-95 duration-200 ease-out cursor-pointer"
        @click="handleMenuClick"
      >
        menu
      </span>
      <h1 class="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-yellow-600 dark:text-yellow-400">
        {{ title || '阳光陪玩' }}
      </h1>
    </div>
    <div class="flex items-center gap-3">
      <button
        v-if="showNotifications"
        class="relative text-zinc-500 dark:text-zinc-400 hover:opacity-80 active:scale-95 transition-all"
        @click="handleNotificationsClick"
      >
        <span class="material-symbols-outlined">notifications</span>
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 w-4 h-4 bg-primary text-on-primary rounded-full flex items-center justify-center text-[8px] font-bold"
        >
          {{ unreadCount }}
        </span>
      </button>
      <span
        v-if="showSearch"
        class="material-symbols-outlined text-zinc-500 dark:text-zinc-400 cursor-pointer hover:opacity-80 active:scale-95 transition-all"
        @click="handleSearchClick"
      >
        search
      </span>
      <div
        v-if="showAvatar"
        class="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden cursor-pointer active:scale-95 transition-transform"
        @click="handleProfileClick"
      >
        <img alt="User Avatar" class="w-full h-full object-cover" :src="avatarUrl" />
      </div>
    </div>
    <div class="absolute bottom-0 left-0 bg-zinc-100 dark:bg-zinc-800 h-[1px] w-full self-end opacity-20"></div>
  </header>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '阳光陪玩'
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
  }
})

const emit = defineEmits(['menu', 'notifications', 'search', 'profile'])

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
</style>
