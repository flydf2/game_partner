<template>
  <div 
    class="fixed inset-0 z-50 flex" 
    v-if="isSidebarOpen"
  >
    <!-- 背景遮罩 -->
    <div 
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="closeSidebar"
    ></div>
    
    <!-- 侧边栏 -->
    <div class="relative w-64 h-full bg-surface shadow-2xl transform transition-transform duration-300 ease-in-out">
      <!-- 侧边栏头部 -->
      <div class="p-6 border-b border-surface-container-low">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full overflow-hidden">
            <img 
              alt="User Avatar" 
              class="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoBTc_5bZuXQ8l_u2UKFazkITvVt5UY-tB83GE9qFMKnbb7Gz7DBuHH11MCcfExFpNociu2AurEP9Lt2NRc9nvSntdZ9hgcWNL_d-0yyyC7bLbO0F8qFUi1FZ_0xgHBG5ZWEfyBs3f5BMl_rBN4SHJoDd3xp76P8kx7eQBwXzcI46GuMySscFwGrnXs_YK9_ArHQEUVcsZUe0o_yRl84Nf4j3WwXor_Xd2gFFDgNuPdbSQuyQiPQkAovGTm7Cek_vM2ZGapACwBM4"
            />
          </div>
          <div>
            <h2 class="font-headline font-bold text-primary">发现大神</h2>
            <p class="text-xs text-on-surface-variant">欢迎回来</p>
          </div>
        </div>
      </div>
      
      <!-- 侧边栏菜单 -->
      <nav class="p-4 space-y-2">
        <router-link 
          to="/" 
          class="flex items-center gap-3 p-3 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
          @click="closeSidebar"
        >
          <span class="material-symbols-outlined">home</span>
          <span>首页</span>
        </router-link>
        
        <router-link 
          to="/discover" 
          class="flex items-center gap-3 p-3 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
          @click="closeSidebar"
        >
          <span class="material-symbols-outlined">explore</span>
          <span>发现</span>
        </router-link>
        
        <router-link 
          to="/orders" 
          class="flex items-center gap-3 p-3 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
          @click="closeSidebar"
        >
          <span class="material-symbols-outlined">receipt</span>
          <span>订单</span>
        </router-link>
        
        <router-link 
          to="/profile" 
          class="flex items-center gap-3 p-3 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
          @click="closeSidebar"
        >
          <span class="material-symbols-outlined">person</span>
          <span>个人中心</span>
        </router-link>
        
        <router-link 
          to="/settings" 
          class="flex items-center gap-3 p-3 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
          @click="closeSidebar"
        >
          <span class="material-symbols-outlined">settings</span>
          <span>设置</span>
        </router-link>
      </nav>
      
      <!-- 侧边栏底部 -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-container-low">
        <router-link 
          to="/user-agreement" 
          class="flex items-center gap-3 p-3 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
          @click="closeSidebar"
        >
          <span class="material-symbols-outlined">description</span>
          <span>用户协议</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const isSidebarOpen = userStore.getIsSidebarOpen

const closeSidebar = () => {
  userStore.closeSidebar()
}
</script>

<style scoped>
/* 组件样式 */
</style>