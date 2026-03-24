<template>
  <header class="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm shadow-yellow-500/5 flex justify-between items-center px-6 py-4 w-full">
    <div class="flex items-center gap-4">
      <span 
        v-if="!showBack"
        class="material-symbols-outlined text-yellow-600 dark:text-yellow-400 active:scale-95 duration-200 ease-out cursor-pointer"
        @click="toggleMenu"
      >menu</span>
      <span 
        v-else
        class="material-symbols-outlined text-yellow-600 dark:text-yellow-400 active:scale-95 duration-200 ease-out cursor-pointer"
        @click="goBack"
      >arrow_back</span>
      <h1 class="font-headline font-bold text-lg tracking-tight text-yellow-600 dark:text-yellow-400">{{ title || '阳关陪玩' }}</h1>
    </div>
    <div class="flex items-center gap-4">
      <span 
        class="material-symbols-outlined text-zinc-500 cursor-pointer hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
        @click="goToSearch"
      >search</span>
      <router-link to="/profile" class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden hover:ring-2 hover:ring-yellow-500/50 transition-all">
        <img alt="User Avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoBTc_5bZuXQ8l_u2UKFazkITvVt5UY-tB83GE9qFMKnbb7Gz7DBuHH11MCcfExFpNociu2AurEP9Lt2NRc9nvSntdZ9hgcWNL_d-0yyyC7bLbO0F8qFUi1FZ_0xgHBG5ZWEfyBs3f5BMl_rBN4SHJoDd3xp76P8kx7eQBwXzcI46GuMySscFwGrnXs_YK9_ArHQEUVcsZUe0o_yRl84Nf4j3WwXor_Xd2gFFDgNuPdbSQuyQiPQkAovGTm7Cek_vM2ZGapACwBM4"/>
      </router-link>
    </div>
    <div class="absolute bottom-0 left-0 bg-zinc-100 dark:bg-zinc-800 h-[1px] w-full self-end opacity-20"></div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const userStore = useUserStore()

const toggleMenu = () => {
  userStore.toggleSidebar()
}

const goBack = () => {
  router.back()
}

const goToSearch = () => {
  router.push('/search')
}
</script>

<style scoped>
/* 组件样式 */
</style>
