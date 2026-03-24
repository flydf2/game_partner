<template>
  <div class="min-h-screen bg-surface font-body text-on-surface selection:bg-primary-container">
    <!-- TopAppBar -->
    <TopAppBar />
    
    <main class="pt-20 pb-28 px-5 space-y-8">
      <!-- 路由内容 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- BottomNavBar -->
    <BottomNavBar />
    
    <!-- FAB (Floating Action Button) -->
    <div class="fixed bottom-28 right-6 z-40">
      <button class="w-14 h-14 bg-primary rounded-full shadow-2xl flex items-center justify-center text-on-primary-container active:scale-90 transition-transform">
        <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">add</span>
      </button>
    </div>

    <!-- Sidebar -->
    <Sidebar />

    <!-- ToastContainer -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { addRequestInterceptor, addResponseInterceptor, userApi } from './api/index.js'
import { useToast } from './composables/useToast.js'

// 动态导入组件，实现懒加载
const TopAppBar = defineAsyncComponent(() => import('./components/TopAppBar.vue'))
const BottomNavBar = defineAsyncComponent(() => import('./components/BottomNavBar.vue'))
const Sidebar = defineAsyncComponent(() => import('./components/Sidebar.vue'))
const ToastContainer = defineAsyncComponent(() => import('./components/common/ToastContainer.vue'))

const router = useRouter()
const { showToast } = useToast()

// 添加请求拦截器，添加认证 token
addRequestInterceptor(async (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 添加响应拦截器，处理错误
addResponseInterceptor(async ({ response, data }) => {
  if (!response.ok) {
    // 处理 401 未授权
    if (response.status === 401) {
      // 清除 token 并跳转到登录页
      localStorage.removeItem('token')
      router.push('/login')
      showToast('登录已过期，请重新登录', 'error')
    }
    throw new Error(data.message || `请求失败: ${response.status}`)
  }
  return data
})

onMounted(() => {
  // 检查登录状态
  checkLoginStatus()
})

async function checkLoginStatus() {
  try {
    const response = await userApi.getUserInfo()
    if (response.success) {
      console.log('用户已登录:', response.data)
    }
  } catch (error) {
    console.error('检查登录状态失败:', error)
  }
}
</script>



<style scoped>
/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>