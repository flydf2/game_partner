import { defineStore } from 'pinia'
import { userApi } from '../api/index.js'

const USER_STORAGE_KEY = 'gamepartner_user'

function loadUserFromStorage() {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load user from storage:', error)
  }
  return null
}

function saveUserToStorage(userInfo) {
  try {
    if (userInfo) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  } catch (error) {
    console.error('Failed to save user to storage:', error)
  }
}

export const useUserStore = defineStore('user', {
  state: () => {
    const storedUser = loadUserFromStorage()
    const token = localStorage.getItem('token')
    
    return {
      userInfo: storedUser,
      isLoading: false,
      error: null,
      isLoggedIn: !!(storedUser && token),
      isSidebarOpen: false
    }
  },
  
  getters: {
    getUserInfo: (state) => state.userInfo,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getIsLoggedIn: (state) => state.isLoggedIn,
    getIsSidebarOpen: (state) => state.isSidebarOpen
  },
  
  actions: {
    // 临时方法：模拟登录状态
    mockLogin() {
      const mockToken = 'mock_token_' + Date.now()
      const mockUser = {
        id: '1000001',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        nickname: '游戏达人',
        vipLevel: 3
      }
      
      localStorage.setItem('token', mockToken)
      this.userInfo = mockUser
      this.isLoggedIn = true
      saveUserToStorage(mockUser)
      console.log('模拟登录成功')
    },
    
    async sendSmsCode(phone) {
      try {
        this.isLoading = true
        this.error = null
        await userApi.sendSmsCode(phone)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async login(data) {
      try {
        this.isLoading = true
        this.error = null
        const response = await userApi.login(data.phone, data.password)
        
        if (response.success) {
          this.userInfo = response.data.user || response.data
          this.isLoggedIn = true
          if (response.data.token) {
            localStorage.setItem('token', response.data.token)
          }
          saveUserToStorage(this.userInfo)
        }
        
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
        const response = await userApi.register(data)
        
        if (response.success) {
          this.userInfo = response.data.user || response.data
          this.isLoggedIn = true
          if (response.data.token) {
            localStorage.setItem('token', response.data.token)
          }
          saveUserToStorage(this.userInfo)
        }
        
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
        const response = await userApi.getUserInfo()
        
        if (response.success) {
          this.userInfo = response.data
          this.isLoggedIn = true
          saveUserToStorage(this.userInfo)
        }
        
        return response
      } catch (error) {
        this.error = error.message
        this.isLoggedIn = false
        localStorage.removeItem('token')
        saveUserToStorage(null)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async logout() {
      try {
        await userApi.logout()
      } catch (error) {
        console.error('Logout API error:', error)
      } finally {
        this.userInfo = null
        this.isLoggedIn = false
        localStorage.removeItem('token')
        saveUserToStorage(null)
      }
    },
    
    clearError() {
      this.error = null
    },
    
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    
    closeSidebar() {
      this.isSidebarOpen = false
    },
    
    setUser(userData) {
      this.userInfo = userData
      this.isLoggedIn = true
      saveUserToStorage(userData)
    },
    
    checkAuth() {
      const token = localStorage.getItem('token')
      const storedUser = loadUserFromStorage()
      
      if (token && storedUser) {
        this.userInfo = storedUser
        this.isLoggedIn = true
        
        if (!this.userInfo) {
          this.getProfile().catch(() => {
            this.isLoggedIn = false
          })
        }
      } else if (token && !this.isLoggedIn) {
        this.getProfile().catch(() => {
          this.isLoggedIn = false
        })
      }
      
      return !!(token && this.isLoggedIn)
    }
  }
})
