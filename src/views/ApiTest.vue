<template>
  <div class="min-h-screen bg-surface text-on-surface p-6">
    <h1 class="text-2xl font-bold mb-8">API 调试页面</h1>
    
    <!-- API 调用状态 -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-4">API 调用状态</h2>
      <div v-if="loading" class="flex items-center gap-2 text-primary">
        <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span>加载中...</span>
      </div>
      <div v-else-if="error" class="text-error mb-4">{{ error }}</div>
      <div v-else-if="apiResponse" class="bg-surface-container-lowest p-4 rounded-lg">
        <pre class="text-sm overflow-auto">{{ JSON.stringify(apiResponse, null, 2) }}</pre>
      </div>
    </div>
    
    <!-- API 调用按钮 -->
    <div class="space-y-4">
      <button 
        @click="testGetGames"
        class="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 active:scale-95 transition-all"
      >
        测试 GET /games
      </button>
      
      <button 
        @click="testGetPlaymates"
        class="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 active:scale-95 transition-all"
      >
        测试 GET /playmates
      </button>
      
      <button 
        @click="testGetFeaturedPlaymate"
        class="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 active:scale-95 transition-all"
      >
        测试 GET /playmates (特色陪玩)
      </button>
    </div>
    
    <!-- 配置信息 -->
    <div class="mt-8 p-4 bg-surface-container-lowest rounded-lg">
      <h3 class="font-semibold mb-2">配置信息</h3>
      <p><strong>API Base URL:</strong> {{ apiBaseUrl }}</p>
      <p><strong>使用 Mock:</strong> {{ useMock }}</p>
      <p><strong>是否登录:</strong> {{ isLoggedIn }}</p>
      <p><strong>Token:</strong> {{ token ? '已设置' : '未设置' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../services/api.js'
import { API_BASE_URL } from '../api/config.js'
import { useUserStore } from '../stores/user.js'

const userStore = useUserStore()

const loading = ref(false)
const error = ref('')
const apiResponse = ref(null)

const apiBaseUrl = computed(() => API_BASE_URL)
const useMock = computed(() => import.meta.env.VITE_USE_MOCK === 'true')
const isLoggedIn = computed(() => userStore.getIsLoggedIn)
const token = computed(() => localStorage.getItem('token'))

const testApi = async (apiCall, description) => {
  loading.value = true
  error.value = ''
  apiResponse.value = null
  
  try {
    console.log(`测试 API: ${description}`)
    const response = await apiCall()
    apiResponse.value = response
    console.log('API 响应:', response)
  } catch (err) {
    error.value = err.message
    console.error('API 错误:', err)
  } finally {
    loading.value = false
  }
}

const testGetGames = () => {
  testApi(api.getGames, 'GET /games')
}

const testGetPlaymates = () => {
  testApi(api.getPlaymates, 'GET /playmates')
}

const testGetFeaturedPlaymate = () => {
  testApi(api.getFeaturedPlaymate, 'GET /playmates (特色陪玩)')
}

onMounted(() => {
  console.log('API 调试页面已加载')
  console.log('API Base URL:', API_BASE_URL)
  console.log('使用 Mock:', useMock.value)
})
</script>

<style scoped>
pre {
  max-height: 300px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>