import { usePlaymateStore } from '../stores/playmate.js'
import { useApiStore, withLoading } from '../stores/api.js'
import { cache } from '../utils/cache.js'
import { API_BASE_URL } from './config.js'
import { 
  mockGetPlaymates, 
  mockGetSearchSuggestions,
  mockGetLeaderboard,
  mockGetExpertDetail,
  mockGetGames,
  mockGetActivities,
  mockGetOrders,
  mockGetUserInfo,
  mockGetFollowing,
  mockGetNotifications,
  mockGetMessages,
  mockGetChatMessages,
  mockGetFavorites,
  mockGetBrowseHistory,
  mockGetWallet,
  mockGetSettings,
  mockLogin,
  mockRegister,
  mockUpdateProfile,
  mockUpdateSettings,
  mockMarkNotificationRead,
  mockMarkAllNotificationsRead,
  mockGetUnreadCount,
  mockSubmitReview,
  mockSubmitWithdrawal,
  mockGetWithdrawalRecords,
  mockUploadFile,
  mockGetCategories,
  mockGetRecommendations,
  mockGetCommunityPosts,
  mockCreatePost,
  mockGetGamesByCategory,
  mockGetOrderConfirmation,
  mockGetRewardOrders,
  mockGrabRewardOrder,
  mockGetRewardOrderDetail,
  mockGetOrderDetail,
  mockGetSkills,
  mockAddSkill,
  mockUpdateSkill,
  mockDeleteSkill,
  mockGetAppeals,
  mockCreateAppeal,
  mockGetAppealDetail
} from './mock-index.js'

// 拦截器配置
const interceptors = {
  request: [],
  response: []
}

// 添加请求拦截器
export function addRequestInterceptor(interceptor) {
  interceptors.request.push(interceptor)
}

// 添加响应拦截器
export function addResponseInterceptor(interceptor) {
  interceptors.response.push(interceptor)
}

// 认证请求拦截器
addRequestInterceptor(async (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一处理后端响应格式
addResponseInterceptor(async ({ response, data }) => {
  // 后端返回格式: { code: 0, data: {...}, msg: "获取成功" }
  if (data.code === 0) {
    // 成功响应，返回标准化格式
    return {
      success: true,
      data: data.data,
      message: data.msg
    }
  } else {
    // 错误响应
    throw new Error(data.msg || `API error: code ${data.code}`)
  }
})

// 基础请求函数
async function request(url, options = {}) {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options,
    credentials: 'include' // 包含凭据，解决CORS问题
  }

  // 执行请求拦截器
  for (const interceptor of interceptors.request) {
    config = await interceptor(config) || config
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

    console.log('API Request:', `${API_BASE_URL}${url}`)
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...config,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)

    let responseData
    try {
      responseData = await response.json()
    } catch (error) {
      responseData = {}
    }

    console.log('API Response:', responseData)

    // 执行响应拦截器
    for (const interceptor of interceptors.response) {
      const result = await interceptor({ response, data: responseData })
      if (result !== undefined) {
        return result
      }
    }

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`)
    }
    
    return responseData
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// HTTP方法
export async function get(url, options = {}) {
  // 处理查询参数
  let finalUrl = url
  if (options.params) {
    const queryParams = new URLSearchParams()
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value)
      }
    }
    const queryString = queryParams.toString()
    if (queryString) {
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
    }
  }
  return request(finalUrl, {
    method: 'GET',
    ...options
  })
}

export async function post(url, data, options = {}) {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  })
}

export async function put(url, data, options = {}) {
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  })
}

export async function del(url, options = {}) {
  // 处理查询参数
  let finalUrl = url
  if (options.params) {
    const queryParams = new URLSearchParams()
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value)
      }
    }
    const queryString = queryParams.toString()
    if (queryString) {
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
    }
  }
  return request(finalUrl, {
    method: 'DELETE',
    ...options
  })
}

// 上传文件
export async function uploadFile(url, file, options = {}) {
  const formData = new FormData()
  formData.append('file', file)
  
  if (options.data) {
    for (const [key, value] of Object.entries(options.data)) {
      formData.append(key, value)
    }
  }

  return request(url, {
    method: 'POST',
    body: formData,
    headers: {
      ...options.headers
      // 不设置Content-Type，让浏览器自动设置
    },
    ...options
  })
}

// 重试机制
async function withRetry(fn, retries = 3, delay = 1000, maxDelay = 10000) {
  try {
    return await fn()
  } catch (error) {
    // 检查是否应该重试
    if (!shouldRetry(error)) {
      throw error
    }
    
    if (retries > 0) {
      const currentDelay = Math.min(delay, maxDelay)
      console.warn(`Request failed, retrying... (${retries} attempts left, delay: ${currentDelay}ms)`)
      await new Promise(resolve => setTimeout(resolve, currentDelay))
      return withRetry(fn, retries - 1, delay * 2, maxDelay) // 指数退避
    }
    throw error
  }
}

// 判断是否应该重试
function shouldRetry(error) {
  // 所有请求异常都不重试
  return false
}

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// 专家详情相关API
export const expertApi = {
  async getExpertDetail(expertId) {
    // 尝试从缓存获取
    const cacheKey = cache.generateKey('expert_detail', { expertId })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }
    
    // 缓存未命中，请求数据
    let data
    if (USE_MOCK) {
      data = await mockGetExpertDetail(expertId)
    } else {
      data = await withRetry(() => request(`/experts/${expertId}`))
    }
    
    // 存入缓存，缓存10分钟
    cache.set(cacheKey, data, 10 * 60 * 1000)
    
    return data
  },
  
  async followExpert(expertId) {
    // 清除专家详情缓存
    const cacheKey = cache.generateKey('expert_detail', { expertId })
    cache.remove(cacheKey)
    
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '关注成功'
          })
        }, 300)
      })
    } else {
      return await withRetry(() => post(`/experts/${expertId}/follow`))
    }
  },
  
  async unfollowExpert(expertId) {
    // 清除专家详情缓存
    const cacheKey = cache.generateKey('expert_detail', { expertId })
    cache.remove(cacheKey)
    
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '取消关注成功'
          })
        }, 300)
      })
    } else {
      return await withRetry(() => del(`/experts/${expertId}/follow`))
    }
  },
  
  async getExpertReviews(expertId, page = 1, pageSize = 10) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              reviews: [
                {
                  id: 1,
                  user: {
                    name: '小明',
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
                  },
                  rating: 5,
                  content: '非常专业，带我上了很多分，会继续找他。',
                  date: '2026-03-20',
                  images: []
                },
                {
                  id: 2,
                  user: {
                    name: '小红',
                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
                  },
                  rating: 4,
                  content: '技术不错，人也很幽默，推荐！',
                  date: '2026-03-19',
                  images: []
                }
              ],
              pagination: {
                currentPage: page,
                totalPages: 5,
                totalCount: 50
              }
            }
          })
        }, 400)
      })
    } else {
      return await withRetry(() => get(`/experts/${expertId}/reviews`, {
        params: { page, pageSize }
      }))
    }
  },
  
  async getExpertVoice(expertId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              voiceUrl: 'https://example.com/voice.mp3',
              duration: 120,
              waveform: [0.1, 0.3, 0.5, 0.7, 0.9, 0.7, 0.5, 0.3, 0.1]
            }
          })
        }, 300)
      })
    } else {
      return await withRetry(() => get(`/experts/${expertId}/voice`))
    }
  }
}

// 评价相关API
export const reviewApi = {
  async submitReview(reviewData) {
    if (USE_MOCK) {
      return await mockSubmitReview(reviewData)
    } else {
      return await withRetry(() => post('/reviews', reviewData))
    }
  }
}

// 提现相关API
export const withdrawalApi = {
  async submitWithdrawal(withdrawalData) {
    if (USE_MOCK) {
      return await mockSubmitWithdrawal(withdrawalData)
    } else {
      return await withRetry(() => post('/withdrawals', withdrawalData))
    }
  },
  
  async getWithdrawalRecords() {
    if (USE_MOCK) {
      return await mockGetWithdrawalRecords()
    } else {
      return await withRetry(() => get('/withdrawals'))
    }
  }
}

// 用户相关API
export const userApi = {
  async sendSmsCode(phone) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '验证码发送成功'
          })
        }, 500)
      })
    } else {
      return await withRetry(() => post('/auth/send-code', { phone }))
    }
  },

  async getUserInfo() {
    return withLoading('user_info', async () => {
      // 尝试从缓存获取
      const cacheKey = cache.generateKey('user_info')
      const cachedData = cache.get(cacheKey)
      
      if (cachedData) {
        return cachedData
      }
      
      // 缓存未命中，请求数据
      let data
      if (USE_MOCK) {
        data = await mockGetUserInfo()
      } else {
        data = await withRetry(() => get('/user/info'))
      }
      
      // 存入缓存，缓存5分钟
      cache.set(cacheKey, data, 5 * 60 * 1000)
      
      return data
    })()
  },
  
  async login(username, password) {
    return withLoading('user_login', async () => {
      if (USE_MOCK) {
        const response = await mockLogin(username, password)
        // 存储token
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        // 清除用户信息缓存
        cache.remove(cache.generateKey('user_info'))
        return response
      } else {
        const response = await withRetry(() => post('/auth/login', { username, password }))
        // 存储token
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        // 清除用户信息缓存
        cache.remove(cache.generateKey('user_info'))
        return response
      }
    })()
  },
  
  async register(userData) {
    return withLoading('user_register', async () => {
      if (USE_MOCK) {
        const response = await mockRegister(userData)
        // 存储token
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        // 清除用户信息缓存
        cache.remove(cache.generateKey('user_info'))
        return response
      } else {
        const response = await withRetry(() => post('/auth/register', userData))
        // 存储token
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        // 清除用户信息缓存
        cache.remove(cache.generateKey('user_info'))
        return response
      }
    })()
  },
  
  async updateProfile(profileData) {
    return withLoading('user_update_profile', async () => {
      if (USE_MOCK) {
        const response = await mockUpdateProfile(profileData)
        // 清除用户信息缓存
        cache.remove(cache.generateKey('user_info'))
        return response
      } else {
        const response = await withRetry(() => put('/user/profile', profileData))
        // 清除用户信息缓存
        cache.remove(cache.generateKey('user_info'))
        return response
      }
    })()
  },
  
  async getSettings() {
    return withLoading('user_get_settings', async () => {
      // 尝试从缓存获取
      const cacheKey = cache.generateKey('user_settings')
      const cachedData = cache.get(cacheKey)
      
      if (cachedData) {
        return cachedData
      }
      
      // 缓存未命中，请求数据
      let data
      if (USE_MOCK) {
        data = await mockGetSettings()
      } else {
        data = await withRetry(() => get('/user/settings'))
      }
      
      // 存入缓存，缓存30分钟
      cache.set(cacheKey, data, 30 * 60 * 1000)
      
      return data
    })()
  },
  
  async updateSettings(settings) {
    return withLoading('user_update_settings', async () => {
      if (USE_MOCK) {
        const response = await mockUpdateSettings(settings)
        // 清除设置缓存
        cache.remove(cache.generateKey('user_settings'))
        return response
      } else {
        const response = await withRetry(() => put('/user/settings', settings))
        // 清除设置缓存
        cache.remove(cache.generateKey('user_settings'))
        return response
      }
    })()
  },
  
  async logout() {
    return withLoading('user_logout', async () => {
      if (USE_MOCK) {
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: '退出登录成功'
            })
          }, 300)
        })
        // 清除token
        localStorage.removeItem('token')
        // 清除用户信息缓存
        cache.remove(cache.generateKey('user_info'))
        return response
      } else {
        const response = await withRetry(() => post('/auth/logout'))
        // 清除token
        localStorage.removeItem('token')
        // 清除用户信息缓存
        cache.remove(cache.generateKey('user_info'))
        return response
      }
    })()
  },
  
  async refreshToken() {
    return withLoading('user_refresh_token', async () => {
      if (USE_MOCK) {
        const response = await mockRefreshToken()
        // 存储新token
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        return response
      } else {
        const response = await withRetry(() => post('/auth/refresh'))
        // 存储新token
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        return response
      }
    })()
  },

  async getFollowing() {
    if (USE_MOCK) {
      return await mockGetFollowing()
    } else {
      return await withRetry(() => get('/user/following'))
    }
  },
  
  async followUser(userId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '关注成功'
          })
        }, 300)
      })
    } else {
      return await withRetry(() => post(`/user/following/${userId}`))
    }
  },
  
  async unfollowUser(userId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '取消关注成功'
          })
        }, 300)
      })
    } else {
      return await withRetry(() => del(`/user/following/${userId}`))
    }
  },
  
  async getFavorites() {
    if (USE_MOCK) {
      return await mockGetFavorites()
    } else {
      return await withRetry(() => get('/user/favorites'))
    }
  },
  
  async removeFavorite(favoriteId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '取消收藏成功'
          })
        }, 300)
      })
    } else {
      return await withRetry(() => del(`/user/favorites/${favoriteId}`))
    }
  },
  
  async getBrowseHistory() {
    if (USE_MOCK) {
      return await mockGetBrowseHistory()
    } else {
      return await withRetry(() => get('/user/history'))
    }
  },
  
  async clearHistory() {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '清空历史成功'
          })
        }, 300)
      })
    } else {
      return await withRetry(() => del('/user/history'))
    }
  },
  
  async getWallet() {
    if (USE_MOCK) {
      return await mockGetWallet()
    } else {
      return await withRetry(() => get('/user/wallet'))
    }
  },
  
  async recharge(rechargeData) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '充值成功',
            data: {
              transactionId: Date.now(),
              coinsAdded: rechargeData.coins,
              balance: 1280 + rechargeData.coins
            }
          })
        }, 1000)
      })
    } else {
      return await withRetry(() => post('/user/recharge', rechargeData))
    }
  }
}

// 通知相关API
export const notificationApi = {
  async getNotifications() {
    if (USE_MOCK) {
      return await mockGetNotifications()
    } else {
      return await withRetry(() => get('/notifications'))
    }
  },
  
  async markAsRead(notificationId) {
    if (USE_MOCK) {
      return await mockMarkNotificationRead(notificationId)
    } else {
      return await withRetry(() => put(`/notifications/${notificationId}/read`))
    }
  },
  
  async markAllAsRead() {
    if (USE_MOCK) {
      return await mockMarkAllNotificationsRead()
    } else {
      return await withRetry(() => put('/notifications/read-all'))
    }
  },
  
  async getUnreadCount() {
    if (USE_MOCK) {
      return await mockGetUnreadCount()
    } else {
      return await withRetry(() => get('/notifications/unread-count'))
    }
  }
}

// 消息相关API
export const messageApi = {
  async getConversations() {
    if (USE_MOCK) {
      return await mockGetMessages()
    } else {
      return await withRetry(() => get('/conversations'))
    }
  },

  async archiveConversation(conversationId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '归档成功'
          })
        }, 300)
      })
    } else {
      return await withRetry(() => put(`/conversations/${conversationId}/archive`))
    }
  },

  async markConversationAsRead(userId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '标记成功'
          })
        }, 300)
      })
    } else {
      return await withRetry(() => put(`/conversations/${userId}/read`))
    }
  },

  async getMessages(params = {}) {
    if (USE_MOCK) {
      return await mockGetMessages()
    } else {
      return await withRetry(() => get('/messages', { params }))
    }
  },
  
  async getChatMessages(userId) {
    if (USE_MOCK) {
      return await mockGetChatMessages(userId)
    } else {
      return await withRetry(() => get(`/messages/chat/${userId}`))
    }
  },
  
  async sendMessage(userId, content, type = 'text') {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: Date.now(),
              from: 'self',
              content: content,
              type: type,
              time: new Date().toLocaleString()
            }
          })
        }, 200)
      })
    } else {
      return await withRetry(() => post(`/messages/chat/${userId}`, { content, type }))
    }
  },

  async markMessageAsRead(messageId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '标记成功'
          })
        }, 300)
      })
    } else {
      return await withRetry(() => put(`/messages/${messageId}/read`))
    }
  }
}

// 订单相关API
export const orderApi = {
  async getOrders(status = 'all') {
    if (USE_MOCK) {
      return await mockGetOrders({ status })
    } else {
      return await withRetry(() => get('/orders', { params: { status } }))
    }
  },
  
  async getOrderDetail(orderId) {
    if (USE_MOCK) {
      return await mockGetOrderDetail(orderId)
    } else {
      return await withRetry(() => get(`/orders/${orderId}`))
    }
  },
  
  async createOrder(orderData) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              orderId: '1004',
              orderNumber: 'GP2026032315301001',
              status: 'pending',
              message: '订单创建成功'
            }
          })
        }, 800)
      })
    } else {
      const createOrderRequest = {
        playmateId: orderData.playmateId,
        skillId: orderData.skillId,
        game: orderData.game,
        skill: orderData.skill,
        serviceTime: orderData.serviceTime,
        amount: orderData.amount,
        quantity: orderData.quantity
      }
      return await withRetry(() => post('/orders', createOrderRequest))
    }
  },
  
  async cancelOrder(orderId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '订单已取消'
          })
        }, 500)
      })
    } else {
      return await withRetry(() => post(`/orders/${orderId}/cancel`))
    }
  },
  
  async confirmOrder(orderId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '订单已确认'
          })
        }, 500)
      })
    } else {
      return await withRetry(() => post(`/orders/${orderId}/confirm`))
    }
  },
  
  async acceptOrder(orderId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '订单已接单'
          })
        }, 500)
      })
    } else {
      return await withRetry(() => post(`/orders/${orderId}/accept`))
    }
  },
  
  async rejectOrder(orderId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '订单已拒绝'
          })
        }, 500)
      })
    } else {
      return await withRetry(() => post(`/orders/${orderId}/reject`))
    }
  }
}

// 游戏相关API
export const gameApi = {
  async getGames() {
    // 尝试从缓存获取
    const cacheKey = cache.generateKey('games')
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }
    
    // 缓存未命中，请求数据
    let data
    if (USE_MOCK) {
      data = await mockGetGames()
    } else {
      data = await withRetry(() => get('/games'))
    }
    
    // 存入缓存，缓存30分钟
    cache.set(cacheKey, data, 30 * 60 * 1000)
    
    return data
  }
}

// 活动相关API
export const activityApi = {
  async getActivities() {
    // 尝试从缓存获取
    const cacheKey = cache.generateKey('activities')
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }
    
    // 缓存未命中，请求数据
    let data
    if (USE_MOCK) {
      data = await mockGetActivities()
    } else {
      data = await withRetry(() => get('/activities'))
    }
    
    // 存入缓存，缓存15分钟
    cache.set(cacheKey, data, 15 * 60 * 1000)
    
    return data
  }
}

// 分类相关API
export const categoryApi = {
  async getCategories() {
    if (USE_MOCK) {
      return await mockGetCategories()
    } else {
      return await withRetry(() => get('/categories'))
    }
  }
}

// 推荐相关API
export const recommendationApi = {
  async getRecommendations() {
    if (USE_MOCK) {
      return await mockGetRecommendations()
    } else {
      return await withRetry(() => get('/recommendations'))
    }
  }
}

// 社区动态相关API
export const communityApi = {
  async getPosts(params = {}) {
    // 尝试从缓存获取
    const cacheKey = cache.generateKey('community_posts', params)
    const cachedData = cache.get(cacheKey)
    
    // if (cachedData) {
    //   return cachedData
    // }
    
    // 缓存未命中，请求数据
    let data
    if (USE_MOCK) {
      data = await mockGetCommunityPosts(params)
    } else {
      data = await withRetry(() => get('/community/posts', { params }))
    }
    
    // 存入缓存，缓存5分钟
    cache.set(cacheKey, data, 5 * 60 * 1000)
    
    return data
  },
  
  async getPostDetail(postId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: postId,
              user: {
                name: '林间风',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlkyk2DWoqAMqSUflUl265Ii7S--sjgKUnoHp_qkIK9uW4YWK4t57peM5UOx0i92fhird_hlkuwYjce1i1Ix_HS2QYkENbRjQQUHaf9k7KsxK7U_719an0BAAZY6q7T-oJ9O17vsi77mdMlksC6JbwPkj3JziYokPVUER-nDsZBSTTiMXrmSdKxN7ApaCB6R7rc1YLFHhTbIZVtrVpTZudIk6w8vA4jVA3Zusi4DRCceevuB13RK2Z6n3VYD-yhN22EmkUCuLdXxE',
                game: '英雄联盟'
              },
              time: '2小时前',
              content: '今天在峡谷遇到一个超级温柔的辅助，操作意识拉满！有人想一起组队排位吗？坐标艾欧尼亚，主玩AD。 ✨',
              images: [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBU8XrMhk3VFwj3Ceer0yCVb-HelGKX5ryLoHAYthnekinYCfvHoJ83xSPEZdrL2tht2CTf_d1atj0kQiKVMY41s8kFOBgY2l5a9dPvoP6yXh3HyA9pdom7W1PkI1l7drYVsVSEeg-BnjsOK2tD_lvHVqzF3VZCAhg6pbcyZj11rhzX6V52RT4jlbNYqEKBRxP818vVewrnT3E6phVAdGXO9zQIWGaIvWWk6pXEzjpNwOh3xDn8FNjv-sGQOhsOt1srbfvB0MFCo-A',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBq4AH6Y7D9L3js3AeN_vpUSza4-PdEYsZbo6sLRP3jUY5UwegYPx3xB9NLMbxzijv13O-siVI5RljmMLqN_Gr5WevHBvslpJbeCO97PCdtgKwNIXBrfQfGanIkq-uktmkkEyoBN9MXdNEwYcjzTObAUzdyii37QkpNmj9bZP7Bcl5uaq012JA-ku0hKny8SxUd9oCA63jFafkb_YzLfo3nDoPbHw27pT7fpKdYQd2sZiXMQL7sMljpCn5eqqS3c5aJtgaLu6pHQpU'
              ],
              likes: 1200,
              comments: 348,
              isFollowing: false,
              commentsList: [
                {
                  id: 1,
                  user: {
                    name: '小玩家',
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
                  },
                  content: '我也在艾欧尼亚，一起玩吧！',
                  time: '1小时前',
                  likes: 23
                },
                {
                  id: 2,
                  user: {
                    name: '辅助玩家',
                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
                  },
                  content: '我可以辅助你，加个好友',
                  time: '45分钟前',
                  likes: 15
                }
              ]
            }
          })
        }, 300)
      })
    } else {
      return await withRetry(() => get(`/community/posts/${postId}`))
    }
  },
  
  async likePost(postId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '点赞成功'
          })
        }, 200)
      })
    } else {
      return await withRetry(() => post(`/community/posts/${postId}/like`))
    }
  },
  
  async commentPost(postId, content) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: Date.now(),
              user: {
                name: '我',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              content: content,
              time: new Date().toLocaleString(),
              likes: 0
            },
            message: '评论成功'
          })
        }, 300)
      })
    } else {
      return await withRetry(() => post(`/community/posts/${postId}/comments`, { content }))
    }
  },
  
  async createPost(postData) {
    if (USE_MOCK) {
      return await mockCreatePost(postData)
    } else {
      return await withRetry(() => post('/community/posts', postData))
    }
  },
  
  async getTopicDetail(topicId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: topicId,
              title: '#王者荣耀',
              description: '集结最强召唤师！这里是《王者荣耀》官方讨论社区，分享你的高光时刻、上分心得，寻找志同道合的开黑队友。',
              cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJCdVR4SWlVmZS2MfQxv4neWDHVSFi46iFu7fIlPuVcLUzoMaMncSZHdLUkeV6uno5pL3MvmUa7m5q3jQFEiIa1tlYhxIxW43ul0iN37eeYHJZEAZD_Nonsn3SrL3j3htSrp0l3GDtWDA4dsGL-GTGfRJU5k7W99I3RnHFfw_bieodydRDntxEspPO8D_yu3K5n-8DSp_x_AKb77wFMUJe9DzUntWS-mfd2UsJzyUft_2rZPiJ1jRBVJQqDMGpVHTdG6aRdOaK2tU',
              participantCount: 125000,
              postCount: 482000,
              createdAt: '2026-01-01T00:00:00Z'
            }
          })
        }, 300)
      })
    } else {
      return await withRetry(() => get(`/community/topics/${topicId}`))
    }
  },
  
  async getTopicPosts(topicId, params = {}) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: [
              {
                id: 1,
                userId: 1,
                user: {
                  name: '剑指苍穹',
                  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ10qRqENmIAi_-MMiEshdFkX-aSmnRkudsddZR4FW7WhCzqrQdMH2KIXPgJCVXr8b7fX944RPjutGvQ4shGnSlYLsaBhFDad-_fyxZnMb1--5xyMvw4juS3jfolDyFbsFC5dU7Y3l1gw30SLuut1Z9Ac7QmypCRQdmwEvYTASnbWS79TnL0ZmotYOpCHS54rF8d0QCXy5Xw3S1sp8C5EsZeXLuu0KAlhrcc_ZaC43mNj6qQYO6ZIInFIrN5yxWjaL0Z2n3TZdPMM',
                  game: '王者荣耀',
                  level: 5
                },
                content: '终于打到了百星王者！这一路走来不容易，分享一下这赛季李白的铭文和出装思路，希望能帮到想上分的兄弟们。评论区见！👇',
                images: [
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDo6fNVwJI7_c7sD2VVTgI7AB85QnkMmhWv10RAbgHqib8nVo5DGcBJ7Wk11nZ_eYWPEdl1BOB2H7TSQKfSREnnwo8spOmKlEixjn0Gu5HQ3jiOv8hoMqaenhPX16yK6mun40pIzPgUoaQ-qj0YVM_iB5MbFgsn2t8Oqtyxal2J8wlrPCKUN-dWzpCYEEPbf4yH7pElZFaX_Fh3wjDiMSlVUH9M33szsPKbweicDOTmwW-NgrTplVAuzCjRoENxW-7aJ4DpmW_oApI',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDtwx6rZ9yE1G6JZuZcGmjHfXOWVOt5LimXa4U2cBwmp-bCxeyGjBtkeRU0CFxx4PgMDP8tQJc4eFd9_HnqzHiwhzAry1NZWss7uUKEORUCs7qm_uu7PamGPegP8qtOl-DNOnJTd5sXrSDMwhDetC3-9Z0GHAxU91OYT5hGfdsdVO2cyDaPoLo4tre6zZVArvB7HVx2CHlfDh2oM8lrIuKXamy52ZMPecWQrQGG8w8qd6Q9BccrQUHzQQF9ywnGfQT2UmoG-p9IhyI'
                ],
                likes: 1200,
                comments: 342,
                time: '15分钟前',
                isLiked: false,
                isFollowing: false
              },
              {
                id: 2,
                userId: 2,
                user: {
                  name: '猫猫爱辅助',
                  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlSH3ku74n6Kf_cMbfhCnPPakqK4B4geWUpkDacG_6qp1eyfvbLHERspFefSKEUgQ_wEpsalIRM0rnQM_qiwoHDvKz6Hc5bUjeb1dH4vYMNWRYcKmreiyDWfusvWgsHTgs3QvlgXMUrbSRMHeW6vQ0c3KGb_BJCVE7hxW5-X5TtvmDc4-sgWfAVAVQ-43UCnIa1-sXFoeZU-gzka9c_HEh3Ud-NZQfaVWX_i9dBr6S79zMRRCufus9Il3cjvXj0Oq1ncnScCitXlg',
                  game: '王者荣耀'
                },
                content: '坐标QQ区，段位至尊星耀，常玩大乔、瑶、蔡文姬。有大神带带吗？心态超好不压力。',
                images: [],
                likes: 89,
                comments: 12,
                time: '1小时前',
                isLiked: false,
                isFollowing: false
              },
              {
                id: 3,
                userId: 3,
                user: {
                  name: '电竞资讯站',
                  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCFfFMrDH5WFM9aHI3-TTQKOyskV3OoSEuuDpfyjNkOSKQkdSCOQSY3DeOX_s1zFyBE1DqvvPJBMv89sEFVIQMzy30l4Mu8LUG5pwJ4BmKzQ7yFKNpL72idSFHO3ZntJI5P85_1SoAB1kH9HRNx9200MTdLNJiDITz_pzu0Qwdb1DCyXQP5kH4l2Qz3NDhcICjXn2j_OyZ_F8JeulPbtEgltDEfyjo1XSpB1PowDoQzISPiGTPzc9_pal7MoYTzC1yeVw_PFr6jWU',
                  game: '王者荣耀',
                  level: 4
                },
                content: '新赛季爆料：全新法师英雄"星璇"即将上线，技能机制深度解析！',
                images: [
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuACWk7OafZcwmU6-0wrtmRSpMtI2lxy3pI4u8VeecG5RokzdajLvTU8nSA5A46kHoepSUkF-z5G87kCmu3_o8xcDic4cOX71GQmq-0lBKwFgVralus5q7GX_DNRNiQx5E_qwqFv7glL1JvCv1AhV0ZGGdK-4X2Q9iVEmOkl4sLZKCjhpKOMGhP6mDmCRNEsVeWIkZ8w582_qcsLPtDGlG4RoeAhOGzprMkrD3kIyuLCgwWK1Ia_xtcCXRkF9lmuR2gWA5ntWFgp8m8'
                ],
                likes: 3500,
                comments: 892,
                time: '2小时前',
                isLiked: false,
                isFollowing: false
              }
            ]
          })
        }, 300)
      })
    } else {
      return await withRetry(() => get(`/community/topics/${topicId}/posts`, { params }))
    }
  },
  
  async followTopic(topicId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '关注话题成功'
          })
        }, 200)
      })
    } else {
      return await withRetry(() => post(`/community/topics/${topicId}/follow`))
    }
  },
  
  async unfollowTopic(topicId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '取消关注话题成功'
          })
        }, 200)
      })
    } else {
      return await withRetry(() => del(`/community/topics/${topicId}/follow`))
    }
  }
}

// 游戏分类相关API
export const gameCategoryApi = {
  async getCategories() {
    // 尝试从缓存获取
    const cacheKey = cache.generateKey('game_categories')
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }
    
    // 缓存未命中，请求数据
    let data
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: [
              { id: 'moba', label: 'MOBA' },
              { id: 'shooting', label: '射击' },
              { id: 'competitive', label: '竞技' },
              { id: 'entertainment', label: '娱乐' },
              { id: 'online', label: '网游' },
              { id: 'console', label: '主机' }
            ]
          })
        }, 200)
      })
    } else {
      data = await withRetry(() => get('/game-categories'))
    }
    
    // 存入缓存，缓存1小时
    cache.set(cacheKey, data, 60 * 60 * 1000)
    
    return data
  },
  
  async getGamesByCategory(category) {
    // 尝试从缓存获取
    const cacheKey = cache.generateKey('games_by_category', { category })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }
    
    // 缓存未命中，请求数据
    let data
    if (USE_MOCK) {
      data = await mockGetGamesByCategory(category)
    } else {
      data = await withRetry(() => get(`/game-categories/${category}/games`))
    }
    
    // 存入缓存，缓存30分钟
    cache.set(cacheKey, data, 30 * 60 * 1000)
    
    return data
  }
}

// 订单确认相关API
export const orderConfirmationApi = {
  async getOrderConfirmation(orderId) {
    if (USE_MOCK) {
      return await mockGetOrderConfirmation(orderId)
    } else {
      return await withRetry(() => get(`/orders/${orderId}/confirmation`))
    }
  }
}

// 奖励订单相关API
export const rewardOrderApi = {
  async getRewardOrders(params = {}) {
    if (USE_MOCK) {
      return await mockGetRewardOrders(params)
    } else {
      return await withRetry(() => get('/reward-orders', { params }))
    }
  },
  
  async getRewardOrderDetail(orderId) {
    if (USE_MOCK) {
      return await mockGetRewardOrderDetail(orderId)
    } else {
      return await withRetry(() => get(`/reward-orders/${orderId}`))
    }
  },
  
  async grabRewardOrder(orderId) {
    if (USE_MOCK) {
      return await mockGrabRewardOrder(orderId)
    } else {
      return await withRetry(() => post(`/reward-orders/${orderId}/grab`))
    }
  }
}

// 申诉相关API
export const appealApi = {
  async getAppeals(params = {}) {
    if (USE_MOCK) {
      return await mockGetAppeals(params)
    } else {
      return await withRetry(() => get('/appeals', { params }))
    }
  },

  async createAppeal(appealData) {
    if (USE_MOCK) {
      return await mockCreateAppeal(appealData)
    } else {
      return await withRetry(() => post('/appeals', appealData))
    }
  },

  async getAppealDetail(appealId) {
    if (USE_MOCK) {
      return await mockGetAppealDetail(appealId)
    } else {
      return await withRetry(() => get(`/appeals/${appealId}`))
    }
  }
}

// 技能相关API
export const skillApi = {
  async getSkills(params = {}) {
    if (USE_MOCK) {
      return await mockGetSkills(params)
    } else {
      return await withRetry(() => get('/skills', { params }))
    }
  },

  async addSkill(skillData) {
    if (USE_MOCK) {
      return await mockAddSkill(skillData)
    } else {
      return await withRetry(() => post('/skills', skillData))
    }
  },

  async updateSkill(skillId, skillData) {
    if (USE_MOCK) {
      return await mockUpdateSkill(skillId, skillData)
    } else {
      return await withRetry(() => put(`/skills/${skillId}`, skillData))
    }
  },

  async deleteSkill(skillId) {
    if (USE_MOCK) {
      return await mockDeleteSkill(skillId)
    } else {
      return await withRetry(() => del(`/skills/${skillId}`))
    }
  }
}

// 文件上传API
export const uploadApi = {
  async uploadFile(file, type = 'avatar') {
    if (USE_MOCK) {
      return await mockUploadFile(file, type)
    } else {
      return await withRetry(() => uploadFile('/upload', file, {
        data: { type }
      }))
    }
  }
}

// API错误处理
export function handleApiError(error) {
  console.error('API Error:', error)
  
  // 网络错误
  if (!error.response) {
    if (error.message.includes('Network')) {
      return {
        success: false,
        error: '网络连接失败，请检查网络设置',
        code: 'NETWORK_ERROR'
      }
    } else if (error.message.includes('timeout')) {
      return {
        success: false,
        error: '请求超时，请稍后重试',
        code: 'TIMEOUT_ERROR'
      }
    }
  }
  
  // 服务器错误
  if (error.response && error.response.status >= 500) {
    return {
      success: false,
      error: '服务器内部错误，请稍后重试',
      code: 'SERVER_ERROR'
    }
  }
  
  // 客户端错误
  if (error.response && error.response.status >= 400 && error.response.status < 500) {
    if (error.response.status === 401) {
      return {
        success: false,
        error: '登录已过期，请重新登录',
        code: 'UNAUTHORIZED'
      }
    } else if (error.response.status === 403) {
      return {
        success: false,
        error: '没有权限执行此操作',
        code: 'FORBIDDEN'
      }
    } else if (error.response.status === 404) {
      return {
        success: false,
        error: '请求的资源不存在',
        code: 'NOT_FOUND'
      }
    }
  }
  
  // 业务错误
  if (error.data && error.data.message) {
    return {
      success: false,
      error: error.data.message,
      code: error.data.code || 'BUSINESS_ERROR'
    }
  }
  
  // 默认错误
  return {
    success: false,
    error: error.message || '网络请求失败，请稍后重试',
    code: 'UNKNOWN_ERROR'
  }
}

export async function fetchPlaymates(params = {}) {
  const store = usePlaymateStore()
  
  try {
    store.setLoading(true)
    store.setError(null)

    let response
    if (USE_MOCK) {
      response = await mockGetPlaymates(params)
    } else {
      response = await withRetry(() => get('/playmates', { params }))
    }
    
    // 处理响应格式
    // Mock返回: {code: 0, data: {data: [...], pagination: {...}}}
    // 真实API通过拦截器返回: {success: true, data: {...}}
    let playmateData = []
    let pagination = { currentPage: 1, totalPages: 1, totalCount: 0 }
    
    if (USE_MOCK) {
      // Mock数据格式
      if (response.code === 0) {
        playmateData = response.data?.data || []
        pagination = response.data?.pagination || pagination
      }
    } else {
      // 真实API格式（已通过拦截器处理）
      if (response.success) {
        playmateData = response.data?.data || response.data || []
        pagination = response.data?.pagination || pagination
      }
    }
    
    const processedPlaymateData = playmateData.map(playmate => ({
      ...playmate,
      tags: playmate.tags ? (Array.isArray(playmate.tags) ? playmate.tags : playmate.tags.split(',')) : [],
    }))
    if (params.page > 1) {
      store.appendPlaymates(processedPlaymateData)
    } else {
      store.setPlaymates(processedPlaymateData)
    }

    store.setPagination(
      pagination.currentPage,
      pagination.totalPages,
      pagination.totalCount
    )

    return response
  } catch (error) {
    store.setError(error.message || '获取陪玩列表失败')
    throw error
  } finally {
    store.setLoading(false)
  }
}

export async function fetchLeaderboard(params = {}) {
  const store = usePlaymateStore()
  
  try {
    store.setLoading(true)
    store.setError(null)

    let response
    if (USE_MOCK) {
      response = await mockGetLeaderboard(params)
    } else {
      response = await withRetry(() => get('/playmates/leaderboard', { params }))
    }
    
    let playmateData = []
    let pagination = { currentPage: 1, totalPages: 1, totalCount: 0 }
    
    if (USE_MOCK) {
      if (response.success) {
        playmateData = response.data?.data || response.data || []
        pagination = response.data?.pagination || pagination
      }
    } else {
      if (response.success) {
        playmateData = response.data?.data || response.data || []
        pagination = response.data?.pagination || pagination
      }
    }
    
    const processedPlaymateData = playmateData.map(playmate => ({
      ...playmate,
      tags: playmate.tags ? playmate.tags.split(',') : [],
    }))
    if (params.page > 1) {
      store.appendPlaymates(processedPlaymateData)
    } else {
      store.setPlaymates(processedPlaymateData)
    }

    store.setPagination(
      pagination.currentPage,
      pagination.totalPages,
      pagination.totalCount
    )

    return response
  } catch (error) {
    store.setError(error.message || '获取排行榜数据失败')
    throw error
  } finally {
    store.setLoading(false)
  }
}

export async function searchPlaymates(keyword, params = {}) {
  const store = usePlaymateStore()
  
  try {
    store.setLoading(true)
    store.setError(null)

    let response
    if (USE_MOCK) {
      response = await mockGetPlaymates({ ...params, keyword })
    } else {
      response = await withRetry(() => get('/playmates/search', { params: { ...params, keyword } }))
    }
    
    // 处理响应格式
    let playmateData = []
    let pagination = { currentPage: 1, totalPages: 1, totalCount: 0 }
    
    if (USE_MOCK) {
      if (response.code === 0) {
        playmateData = response.data?.data || []
        pagination = response.data?.pagination || pagination
      }
    } else {
      if (response.success) {
        playmateData = response.data?.data || response.data || []
        pagination = response.data?.pagination || pagination
      }
    }
    
    // 处理playmate数据，将description从字符串转换为数组（如果需要）
    const processedPlaymateData = playmateData.map(playmate => ({
      ...playmate,
      tags: playmate.tags ? playmate.tags.split(',') : [],
    }))
    console.info(processedPlaymateData)
    store.setPlaymates(processedPlaymateData)
    store.setPagination(
      pagination.currentPage || 1,
      pagination.totalPages || 1,
      pagination.totalCount || 0
    )

    return response
  } catch (error) {
    store.setError(error.message || '搜索失败')
    throw error
  } finally {
    store.setLoading(false)
  }
}

export async function getSearchSuggestions(keyword) {
  try {
    let response
    if (USE_MOCK) {
      response = await mockGetSearchSuggestions(keyword)
      // Mock返回: {success: true, data: [...]}
      if (response.success) {
        return response.data || []
      }
      return []
    } else {
      response = await withRetry(() => get('/playmates/suggestions', { params: { keyword } }))
      // 真实API返回: {success: true, data: [...]}
      if (response.success) {
        return response.data || []
      }
      return []
    }
  } catch (error) {
    console.error('获取搜索建议失败:', error)
    return []
  }
}

// 导出默认对象
export default {
  expert: expertApi,
  user: userApi,
  order: orderApi,
  notification: notificationApi,
  message: messageApi,
  game: gameApi,
  activity: activityApi,
  review: reviewApi,
  withdrawal: withdrawalApi,
  category: categoryApi,
  recommendation: recommendationApi,
  community: communityApi,
  gameCategory: gameCategoryApi,
  orderConfirmation: orderConfirmationApi,
  rewardOrder: rewardOrderApi,
  appeal: appealApi,
  skill: skillApi,
  upload: uploadApi,
  fetchPlaymates,
  fetchLeaderboard,
  searchPlaymates,
  getSearchSuggestions,
  handleApiError,
  addRequestInterceptor,
  addResponseInterceptor
}
