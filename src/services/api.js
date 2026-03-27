// API服务层
import { handleApiError } from '../utils/errorHandler'
import { API_BASE_URL } from '../api/config.js'
import { mockGetGames, mockGetPlaymates, mockGetCommunityPosts, mockGetRewardOrders } from '../api/mock-index.js'

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// API请求函数
const request = async (url, options = {}) => {
  try {
    let fullUrl = `${API_BASE_URL}${url}`
    
    // 构建请求配置
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }
    
    // 添加认证token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 处理查询参数
    if (options.params && config.method === 'GET') {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined && value !== null) {
          params.append(key, value)
        }
      }
      const paramsString = params.toString()
      if (paramsString) {
        fullUrl = `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${paramsString}`
      }
    }
    
    // 处理请求体
    if (options.body) {
      config.body = JSON.stringify(options.body)
    }
    
    console.log('API Request:', fullUrl, config)
    
    const response = await fetch(fullUrl, config)
    const responseData = await response.json()
    
    console.log('API Response:', responseData)
    
    if (!response.ok) {
      throw new Error(responseData.msg || responseData.message || `HTTP error! status: ${response.status}`)
    }
    
    // 处理后端返回格式: { code: 0, data: {...}, msg: "获取成功" }
    if (responseData.code === 0) {
      return { success: true, data: responseData.data }
    } else {
      throw new Error(responseData.msg || `API error: code ${responseData.code}`)
    }
  } catch (error) {
    console.error('API Error:', error)
    return handleApiError(error)
  }
};

// 具体API方法
export const api = {
  // 获取游戏分类
  getCategories: async () => {
    if (USE_MOCK) {
      const response = await mockGetCategories()
      // Mock返回格式: {success: true, data: {categories: [...]}}
      if (response.success) {
        return { success: true, data: response.data.categories }
      }
      return { success: false, data: [] }
    }
    const response = await request('/categories')
    // 真实API返回: {success: true, data: [...]} 或 {success: true, data: {data: [...]}}
    if (response.success && response.data) {
      const categoriesData = Array.isArray(response.data) ? response.data : response.data.data || response.data.categories || []
      return { success: true, data: categoriesData }
    }
    return { success: false, data: [] }
  },
  
  // 获取游戏列表
  getGames: async (category) => {
    if (USE_MOCK) {
      const response = await mockGetGames()
      // Mock返回格式: {success: true, data: [...]}
      if (response.success) {
        let gamesData = response.data
        if (category) {
          gamesData = gamesData.filter(game => game.category === category)
        }
        return { success: true, data: gamesData }
      }
      return { success: false, data: [] }
    }
    const response = await request('/games', { params: { category } })
    // 真实API返回: {success: true, data: [...]} 或 {success: true, data: {data: [...]}}
    if (response.success && response.data) {
      const gamesData = Array.isArray(response.data) ? response.data : response.data.data || []
      return { success: true, data: gamesData }
    }
    return { success: false, data: [] }
  },
  
  // 获取陪玩列表
  getPlaymates: async (params = {}) => {
    if (USE_MOCK) {
      const response = await mockGetPlaymates(params)
      // Mock返回格式: {code: 0, data: {data: [...], pagination: {...}}}
      if (response.code === 0) {
        return { success: true, data: response.data.data }
      }
      return { success: false, data: [] }
    }
    const response = await request('/playmates', { params })
    // 真实API返回: {success: true, data: {data: [...], pagination: {...}}}
    if (response.success && response.data) {
      return { success: true, data: response.data.data || response.data }
    }
    return { success: false, data: [] }
  },
  
  // 获取特色陪玩
  getFeaturedPlaymate: async () => {
    let response
    if (USE_MOCK) {
      const mockResponse = await mockGetPlaymates()
      if (mockResponse.code === 0) {
        response = { success: true, data: mockResponse.data.data }
      } else {
        response = { success: false, data: [] }
      }
    } else {
      response = await request('/playmates')
      // 真实API返回: {success: true, data: {data: [...], pagination: {...}}}
      if (response.success && response.data) {
        const playmateList = response.data.data || response.data
        if (playmateList.length > 2) {
          return { success: true, data: playmateList[2] }
        }
      }
      return { success: false, data: null }
    }
    
    if (response.success && response.data && response.data.length > 2) {
      return { success: true, data: response.data[2] }; // 返回第三个陪玩作为特色
    }
    return { success: false, data: null };
  },
  
  // 获取社区帖子
  getCommunityPosts: async (params = {}) => {
    if (USE_MOCK) {
      const response = await mockGetCommunityPosts(params)
      // Mock返回格式: {code: 0, data: {data: [...], pagination: {...}}}
      if (response.code === 0) {
        return { success: true, data: response.data.data }
      }
      return { success: false, data: [] }
    }
    const response = await request('/community/posts', { params })
    // 真实API返回: {success: true, data: {data: [...], pagination: {...}}}
    if (response.success && response.data) {
      return { success: true, data: response.data.data || response.data }
    }
    return { success: false, data: [] }
  },
  
  // 获取悬赏订单
  getRewardOrders: async (params = {}) => {
    if (USE_MOCK) {
      const response = await mockGetRewardOrders(params)
      // Mock返回格式: {success: true, data: {data: [...], pagination: {...}}}
      if (response.success && response.data) {
        return { success: true, data: response.data.data, pagination: response.data.pagination }
      }
      return { success: false, data: [] }
    }
    const response = await request('/reward-orders', { params })
    // 真实API返回: {success: true, data: {data: [...], pagination: {...}}}
    if (response.success && response.data) {
      return { success: true, data: response.data.data || response.data, pagination: response.data.pagination }
    }
    return { success: false, data: [] }
  }
};