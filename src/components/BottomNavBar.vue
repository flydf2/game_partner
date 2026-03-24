<template>
  <nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(255,215,0,0.08)] z-50 rounded-t-[24px]">
    <!-- 首页 -->
    <router-link 
      to="/" 
      class="flex flex-col items-center justify-center px-5 py-2 transition-all active:scale-90 duration-300 cubic-bezier(0.34,1.56,0.64,1)"
      :class="{
        'bg-yellow-400 dark:bg-yellow-500 text-zinc-900 rounded-2xl scale-105': currentRoute === '/',
        'text-zinc-400 dark:text-zinc-500 hover:text-yellow-500': currentRoute !== '/'
      }"
    >
      <span class="material-symbols-outlined" :style="currentRoute === '/' ? { fontVariationSettings: 'FILL 1' } : {}">
        home_filled
      </span>
      <span class="font-headline text-[11px] font-semibold tracking-wide">首页</span>
    </router-link>
    <!-- 发现 -->
    <router-link 
      to="/discover" 
      class="flex flex-col items-center justify-center px-5 py-2 transition-all active:scale-90 duration-300"
      :class="{
        'bg-yellow-400 dark:bg-yellow-500 text-zinc-900 rounded-2xl scale-105': currentRoute === '/discover',
        'text-zinc-400 dark:text-zinc-500 hover:text-yellow-500': currentRoute !== '/discover'
      }"
    >
      <span class="material-symbols-outlined" :style="currentRoute === '/discover' ? { fontVariationSettings: 'FILL 1' } : {}">
        explore
      </span>
      <span class="font-headline text-[11px] font-semibold tracking-wide">发现</span>
    </router-link>
    <!-- 社区 -->
    <router-link 
      to="/community" 
      class="flex flex-col items-center justify-center px-5 py-2 transition-all active:scale-90 duration-300"
      :class="{
        'bg-yellow-400 dark:bg-yellow-500 text-zinc-900 rounded-2xl scale-105': currentRoute === '/community',
        'text-zinc-400 dark:text-zinc-500 hover:text-yellow-500': currentRoute !== '/community'
      }"
    >
      <span class="material-symbols-outlined" :style="currentRoute === '/community' ? { fontVariationSettings: 'FILL 1' } : {}">
        people
      </span>
      <span class="font-headline text-[11px] font-semibold tracking-wide">社区</span>
    </router-link>
    <!-- 聊天 -->
    <router-link 
      to="/messages" 
      class="flex flex-col items-center justify-center px-5 py-2 transition-all active:scale-90 duration-300"
      :class="{
        'bg-yellow-400 dark:bg-yellow-500 text-zinc-900 rounded-2xl scale-105': currentRoute === '/messages',
        'text-zinc-400 dark:text-zinc-500 hover:text-yellow-500': currentRoute !== '/messages'
      }"
    >
      <span class="material-symbols-outlined" :style="currentRoute === '/messages' ? { fontVariationSettings: 'FILL 1' } : {}">
        chat_bubble
      </span>
      <span class="font-headline text-[11px] font-semibold tracking-wide">聊天</span>
    </router-link>
    <!-- 订单 -->
    <router-link 
      to="/orders" 
      class="flex flex-col items-center justify-center px-5 py-2 transition-all active:scale-90 duration-300"
      :class="{
        'bg-yellow-400 dark:bg-yellow-500 text-zinc-900 rounded-2xl scale-105': currentRoute === '/orders',
        'text-zinc-400 dark:text-zinc-500 hover:text-yellow-500': currentRoute !== '/orders'
      }"
    >
      <span class="material-symbols-outlined" :style="currentRoute === '/orders' ? { fontVariationSettings: 'FILL 1' } : {}">
        receipt_long
      </span>
      <span class="font-headline text-[11px] font-semibold tracking-wide">订单</span>
    </router-link>
    <!-- 我的 -->
    <router-link 
      to="/profile" 
      class="flex flex-col items-center justify-center px-5 py-2 transition-all active:scale-90 duration-300"
      :class="{
        'bg-yellow-400 dark:bg-yellow-500 text-zinc-900 rounded-2xl scale-105': currentRoute === '/profile',
        'text-zinc-400 dark:text-zinc-500 hover:text-yellow-500': currentRoute !== '/profile'
      }"
    >
      <span class="material-symbols-outlined" :style="currentRoute === '/profile' ? { fontVariationSettings: 'FILL 1' } : {}">
        person
      </span>
      <span class="font-headline text-[11px] font-semibold tracking-wide">我的</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => route.path)
</script>

<style scoped>
/* 组件样式 */
</style>
