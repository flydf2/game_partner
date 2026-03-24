import { defineStore } from 'pinia'

// API请求状态管理store
export const useApiStore = defineStore('api', {
  state: () => ({
    // 正在进行的请求数量
    pendingRequests: 0,
    // 具体请求的loading状态
    loading: {},
    // 错误信息
    errors: {}
  }),
  
  getters: {
    // 是否有任何请求正在进行
    isLoading: (state) => state.pendingRequests > 0,
    
    // 获取特定请求的loading状态
    getLoading: (state) => (key) => {
      return state.loading[key] || false
    },
    
    // 获取特定请求的错误信息
    getError: (state) => (key) => {
      return state.errors[key] || null
    }
  },
  
  actions: {
    // 开始请求
    startRequest(key) {
      this.pendingRequests++
      this.loading[key] = true
      this.errors[key] = null
    },
    
    // 结束请求
    endRequest(key) {
      if (this.pendingRequests > 0) {
        this.pendingRequests--
      }
      this.loading[key] = false
    },
    
    // 设置错误
    setError(key, error) {
      this.errors[key] = error
    },
    
    // 清除错误
    clearError(key) {
      this.errors[key] = null
    },
    
    // 清除所有错误
    clearAllErrors() {
      this.errors = {}
    }
  }
})

// API请求包装器，自动管理loading状态
export function withLoading(key, fn) {
  return async function(...args) {
    const apiStore = useApiStore()
    
    try {
      apiStore.startRequest(key)
      const result = await fn(...args)
      apiStore.endRequest(key)
      return result
    } catch (error) {
      apiStore.setError(key, error)
      apiStore.endRequest(key)
      throw error
    }
  }
}