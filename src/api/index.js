import { usePlaymateStore } from '../stores/playmate.js'
import { useApiStore, withLoading } from '../stores/api.js'
import { cache } from '../utils/cache.js'
import { API_BASE_URL } from './config.js'
import { 
  mockGetPlaymates, 
  mockGetSearchSuggestions,
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
  mockGetOrderDetail
} from './mock.js'

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
        game: orderData.game,
        skill: orderData.skill,
        serviceTime: orderData.serviceTime,
        amount: orderData.amount
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
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: [
              {
                id: 'SP202310240092',
                type: '违规言论/引战',
                status: 'processing',
                statusText: '处理中',
                statusClass: 'bg-primary-container/20 text-primary',
                target: {
                  name: '夜火狂潮',
                  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbFFFTOLXk3uh3QYfT5K_O_xwli3756CWmaRPqDURn9hQdMMVr69OFKFYEukdPgpij-8M4aF0yOB8_9gnq9msePksq2gNyksu7Hkg7P-D35FvPBA2Twqv76_3GXssW6kh69xJayXRj3FCsOiIYAaPAlkp5YLofI2Wslskx-FnkMhpF6MMJlsszgOF44PrEgT5KnzAF1JGKBQvsLyc-BpgyvqRjkfkJTD6-ugewCJITW4SZdjMZ_eNFAL71PG_4uVmFZoTbVoilpW0'
                },
                submitTime: '2023.10.24 14:20'
              },
              {
                id: 'SP202310220145',
                type: '消极比赛/挂机',
                status: 'completed',
                statusText: '已完成',
                statusClass: 'bg-emerald-100 text-emerald-700',
                target: {
                  name: '小甜心软软',
                  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh9xMrg68oicE9e-VAIhkrdgB1TkNcEtOcvR3FySiy-94rXsb84VQ4BrXjM2LNCCZbLlFep70TkMaAG8UPDOhjF2rolCEzNfjo2qxKZ5OVTvk9p0VjQooN9hnjHyviPZDE_C8I1mwk0p_3a7zwtRplZx3bi-LaJ5iSDXBeasRWzS7qap6X_QquQkk4wj3lYqsRWzKW_AMARsM0VMQxUylN0AGwq_3Bx5yVh7htFKk6AKYjs7hUVfnCLnXsj4Ftbf4HEdzH7_bHfCE'
                },
                submitTime: '2023.10.22 09:15'
              },
              {
                id: 'SP202310210887',
                type: '代练嫌疑',
                status: 'pending',
                statusText: '待处理',
                statusClass: 'bg-neutral-200 text-neutral-500',
                target: {
                  name: '野王带你飞',
                  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgCfdtE87j_277mqHdGOrVB5ODdk3PB9qPrI4KHjwEwSoOCXY0PeDGmnjvQOV4amb7ApX9KpPnJdC_O441R5hJqPFtRFp53BwPBmmq_OdGBWQlxjL4KuGZcflFM3yGX98CoBIX2NP7o698CcpxL-c5ojRrLjgGZu-Nu3phfR801amAJqexlBDP66TlaB2FgQdLiURLe3N5rsHVf4WI86UXNKfO-rHzaRM2REmbRbUiHP737OFWo18X-rfw-c0iVZCVRILangWQY0A'
                },
                submitTime: '2023.10.21 21:00'
              }
            ]
          })
        }, 300)
      })
    } else {
      return await withRetry(() => get('/appeals', { params }))
    }
  },

  async createAppeal(appealData) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '申诉提交成功'
          })
        }, 500)
      })
    } else {
      return await withRetry(() => post('/appeals', appealData))
    }
  }
}

// 技能相关API
export const skillApi = {
  async getSkills(params = {}) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: [
              {
                id: 1,
                game: 'LOL',
                skill: '钻石段位',
                level: 'advanced',
                levelText: '高级',
                certificationStatus: '已认证',
                serviceCount: 45,
                rating: 4.8
              },
              {
                id: 2,
                game: 'CS:GO',
                skill: '大师陪玩',
                level: 'expert',
                levelText: '专家',
                certificationStatus: '已认证',
                serviceCount: 32,
                rating: 4.9
              },
              {
                id: 3,
                game: 'PUBG',
                skill: '吃鸡大神',
                level: 'intermediate',
                levelText: '中级',
                certificationStatus: '待认证',
                serviceCount: 15,
                rating: 4.5
              }
            ]
          })
        }, 300)
      })
    } else {
      return await withRetry(() => get('/skills', { params }))
    }
  },

  async addSkill(skillData) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '添加技能成功'
          })
        }, 500)
      })
    } else {
      return await withRetry(() => post('/skills', skillData))
    }
  },

  async updateSkill(skillId, skillData) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '更新技能成功'
          })
        }, 500)
      })
    } else {
      return await withRetry(() => put(`/skills/${skillId}`, skillData))
    }
  },

  async deleteSkill(skillId) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '删除技能成功'
          })
        }, 300)
      })
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
    store.setError(error.message || '获取陪玩列表失败')
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
      if (response.success) {
        playmateData = response.data || []
        pagination = response.pagination || pagination
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
  searchPlaymates,
  getSearchSuggestions,
  handleApiError,
  addRequestInterceptor,
  addResponseInterceptor
}
