import { defineStore } from 'pinia'
import { mockService } from '../services/mock'

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
        const response = await mockService.getPlaymates(params)
        this.playmates = response.list
        this.total = response.total
        return response
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
        const response = await mockService.getPlaymateDetail(id)
        this.currentPlaymate = response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async searchPlaymates(params) {
      try {
        this.isLoading = true
        this.error = null
        const response = await mockService.searchPlaymates(params)
        this.playmates = response.list
        this.total = response.total
        return response
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
