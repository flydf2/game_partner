import { defineStore } from 'pinia'
import { mockService } from '../services/mock'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isLoading: false,
    error: null,
    isLoggedIn: false,
    isSidebarOpen: false
  }),
  
  getters: {
    getUserInfo: (state) => state.userInfo,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getIsLoggedIn: (state) => state.isLoggedIn,
    getIsSidebarOpen: (state) => state.isSidebarOpen
  },
  
  actions: {
    async login(data) {
      try {
        this.isLoading = true
        this.error = null
        const response = await apiService.user.login(data)
        this.userInfo = response.user
        this.isLoggedIn = true
        localStorage.setItem('token', response.token)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async register(data) {
      try {
        this.isLoading = true
        this.error = null
        const response = await apiService.user.register(data)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async getProfile() {
      try {
        this.isLoading = true
        this.error = null
        const response = await mockService.getUserInfo()
        this.userInfo = response
        this.isLoggedIn = true
        return response
      } catch (error) {
        this.error = error.message
        this.isLoggedIn = false
        localStorage.removeItem('token')
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    logout() {
      this.userInfo = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
    },
    
    clearError() {
      this.error = null
    },
    
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    
    closeSidebar() {
      this.isSidebarOpen = false
    }
  }
})
