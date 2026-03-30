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

function saveRefreshTokenToStorage(refreshToken) {
  try {
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    } else {
      localStorage.removeItem('refresh_token')
    }
  } catch (error) {
    console.error('Failed to save refresh token to storage:', error)
  }
}

function loadRefreshTokenFromStorage() {
  try {
    return localStorage.getItem('refresh_token')
  } catch (error) {
    console.error('Failed to load refresh token from storage:', error)
    return null
  }
}

export const useUserStore = defineStore('user', {
  state: () => {
    const storedUser = loadUserFromStorage()
    const token = localStorage.getItem('token')
    const refreshToken = loadRefreshTokenFromStorage()
    
    return {
      userInfo: storedUser,
      isLoading: false,
      error: null,
      isLoggedIn: !!(storedUser && token),
      isSidebarOpen: false,
      tokenExpiry: localStorage.getItem('token_expiry'),
      refreshToken: refreshToken,
      isRefreshing: false
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
            // 存储token过期时间（假设token有效期为2小时）
            const expiry = Date.now() + 2 * 60 * 60 * 1000
            this.tokenExpiry = expiry.toString()
            localStorage.setItem('token_expiry', this.tokenExpiry)
            // 存储刷新token
            if (response.data.refreshToken) {
              this.refreshToken = response.data.refreshToken
              saveRefreshTokenToStorage(response.data.refreshToken)
            }
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
            // 存储token过期时间（假设token有效期为2小时）
            const expiry = Date.now() + 2 * 60 * 60 * 1000
            this.tokenExpiry = expiry.toString()
            localStorage.setItem('token_expiry', this.tokenExpiry)
            // 存储刷新token
            if (response.data.refreshToken) {
              this.refreshToken = response.data.refreshToken
              saveRefreshTokenToStorage(response.data.refreshToken)
            }
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
        this.tokenExpiry = null
        this.refreshToken = null
        localStorage.removeItem('token')
        localStorage.removeItem('token_expiry')
        saveRefreshTokenToStorage(null)
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
        
        // 检查token是否即将过期
        this.checkTokenExpiry()
      } else if (token && !this.isLoggedIn) {
        this.getProfile().catch(() => {
          this.isLoggedIn = false
        })
      }
      
      return !!(token && this.isLoggedIn)
    },
    
    // 检查token是否即将过期
    checkTokenExpiry() {
      if (!this.tokenExpiry) return
      
      const expiry = parseInt(this.tokenExpiry)
      const now = Date.now()
      // 如果token在30分钟内过期，自动刷新
      if (expiry - now < 30 * 60 * 1000) {
        this.refreshTokenIfNeeded()
      }
    },
    
    // 刷新token
    async refreshTokenIfNeeded() {
      if (this.isRefreshing || !this.refreshToken) return
      
      try {
        this.isRefreshing = true
        const response = await userApi.refreshToken(this.refreshToken)
        
        if (response.success && response.data.token) {
          // 验证新token格式
          if (this.validateToken(response.data.token)) {
            // 更新token
            localStorage.setItem('token', response.data.token)
            // 更新token过期时间
            const expiry = Date.now() + 2 * 60 * 60 * 1000
            this.tokenExpiry = expiry.toString()
            localStorage.setItem('token_expiry', this.tokenExpiry)
            // 更新刷新token
            if (response.data.refreshToken) {
              this.refreshToken = response.data.refreshToken
              saveRefreshTokenToStorage(response.data.refreshToken)
            }
          } else {
            // token格式错误，清除登录状态
            this.logout()
          }
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        // 刷新失败，清除登录状态
        this.logout()
      } finally {
        this.isRefreshing = false
      }
    },
    
    // 验证token格式
    validateToken(token) {
      return typeof token === 'string' && /^[A-Za-z0-9-_\.]+$/.test(token)
    },
    
    // 检查token是否有效
    isTokenValid() {
      const token = localStorage.getItem('token')
      const expiry = localStorage.getItem('token_expiry')
      
      if (!token || !expiry) return false
      
      // 验证token格式
      if (!this.validateToken(token)) return false
      
      // 检查token是否过期
      const now = Date.now()
      const tokenExpiry = parseInt(expiry)
      return now < tokenExpiry
    }
  }
})
