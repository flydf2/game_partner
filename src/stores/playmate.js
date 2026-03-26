import { defineStore } from 'pinia'
import { playmateAPI } from '../api/playmate.js'

export const usePlaymateStore = defineStore('playmate', {
  state: () => ({
    playmates: [],
    currentPlaymate: null,
    isLoading: false,
    loading: false,
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: true
  }),
  
  getters: {
    getPlaymates: (state) => state.playmates,
    getCurrentPlaymate: (state) => state.currentPlaymate,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getTotal: (state) => state.total,
    loading: (state) => state.loading || state.isLoading
  },
  
  actions: {
    async getPlaymateList(params) {
      try {
        this.isLoading = true
        this.error = null
        const response = await playmateAPI.getPlaymates(params)
        if (response.code === 0) {
          // 处理数据格式，确保正确解析data.data和data.pagination
          const playmateData = response.data.data || []
          this.playmates = playmateData.map(playmate => ({
            ...playmate,
            tags: playmate.tags ? playmate.tags.split(',') : [],
          }))
          console.info(this.playmates)
          this.total = response.data.pagination?.totalCount || 0
          this.setPagination(
            response.data.pagination?.currentPage || 1,
            response.data.pagination?.totalPages || 1,
            response.data.pagination?.totalCount || 0
          )
          return response.data
        } else {
          throw new Error(response.msg || '获取失败')
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async getPlaymateDetail(id) {
      try {
        this.isLoading = true
        this.error = null
        const response = await playmateAPI.getPlaymateDetail(id)
        if (response.code === 0) {
          this.currentPlaymate = response.data
          return response.data
        } else {
          throw new Error(response.msg || '获取失败')
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async searchPlaymates(keyword, params = {}) {
      try {
        this.isLoading = true
        this.error = null
        const response = await playmateAPI.searchPlaymates(keyword, params)
        
        // 处理不同格式的响应
        let playmateData = []
        let pagination = { currentPage: 1, totalPages: 1, totalCount: 0 }
        
        if (response.code === 0) {
          // 真实API格式
          playmateData = response.data.data || []
          pagination = response.data.pagination || pagination
        } else if (response.success) {
          // Mock数据格式
          playmateData = response.data || []
          pagination = response.pagination || pagination
        }
        
        this.playmates = playmateData.map(playmate => ({
          ...playmate,
          tags: playmate.tags ? playmate.tags.split(',') : [],
        }))
        this.total = pagination.totalCount || 0
        this.setPagination(
          pagination.currentPage || 1,
          pagination.totalPages || 1,
          pagination.totalCount || 0
        )
        return playmateData
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    clearCurrentPlaymate() {
      this.currentPlaymate = null
    },
    
    clearError() {
      this.error = null
    },
    
    setLoading(value) {
      this.loading = value
      this.isLoading = value
    },
    
    setError(value) {
      this.error = value
    },
    
    setPlaymates(value) {
      this.playmates = value
    },
    
    appendPlaymates(value) {
      this.playmates = [...this.playmates, ...value]
    },
    
    setPagination(currentPage, totalPages, totalCount) {
      this.currentPage = currentPage
      this.totalPages = totalPages
      this.totalCount = totalCount
      this.hasMore = currentPage < totalPages
    },
    
    incrementPage() {
      this.currentPage++
    },
    
    resetState() {
      this.playmates = []
      this.currentPage = 1
      this.totalPages = 1
      this.totalCount = 0
      this.hasMore = true
      this.error = null
    }
  }
})
