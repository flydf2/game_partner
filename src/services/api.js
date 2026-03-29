// API服务层
import { handleApiError } from '../utils/errorHandler'
import { API_BASE_URL } from '../api/config.js'
import { mockGetGames, mockGetPlaymates, mockGetCommunityPosts, mockGetRewardOrders } from '../api/mock-index.js'
import { get, post } from '../api/request.js'

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

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
    try {
      const response = await get('/categories')
      // 真实API返回: {success: true, data: [...]} 或 {success: true, data: {data: [...]}}
      if (response.success && response.data) {
        const categoriesData = Array.isArray(response.data) ? response.data : response.data.data || response.data.categories || []
        return { success: true, data: categoriesData }
      }
      return { success: false, data: [] }
    } catch (error) {
      console.error('API Error:', error)
      return handleApiError(error)
    }
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
    try {
      const response = await get('/games', { params: { category } })
      // 真实API返回: {success: true, data: [...]} 或 {success: true, data: {data: [...]}}
      if (response.success && response.data) {
        const gamesData = Array.isArray(response.data) ? response.data : response.data.data || []
        return { success: true, data: gamesData }
      }
      return { success: false, data: [] }
    } catch (error) {
      console.error('API Error:', error)
      return handleApiError(error)
    }
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
    try {
      const response = await get('/playmates', { params })
      // 真实API返回: {success: true, data: {data: [...], pagination: {...}}}
      if (response.success && response.data) {
        return { success: true, data: response.data.data || response.data }
      }
      return { success: false, data: [] }
    } catch (error) {
      console.error('API Error:', error)
      return handleApiError(error)
    }
  },
  
  // 获取特色陪玩
  getFeaturedPlaymate: async () => {
    if (USE_MOCK) {
      const mockResponse = await mockGetPlaymates()
      if (mockResponse.code === 0) {
        const playmateList = mockResponse.data.data
        if (playmateList.length > 2) {
          return { success: true, data: playmateList[2] };
        }
      }
      return { success: false, data: null }
    }
    try {
      const response = await get('/playmates')
      // 真实API返回: {success: true, data: {data: [...], pagination: {...}}}
      if (response.success && response.data) {
        const playmateList = response.data.data || response.data
        if (playmateList.length > 2) {
          return { success: true, data: playmateList[2] }
        }
      }
      return { success: false, data: null }
    } catch (error) {
      console.error('API Error:', error)
      return handleApiError(error)
    }
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
    try {
      const response = await get('/community/posts', { params })
      // 真实API返回: {success: true, data: {data: [...], pagination: {...}}}
      if (response.success && response.data) {
        return { success: true, data: response.data.data || response.data }
      }
      return { success: false, data: [] }
    } catch (error) {
      console.error('API Error:', error)
      return handleApiError(error)
    }
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
    try {
      const response = await get('/reward', { params })
      // 真实API返回: {success: true, data: {data: [...], pagination: {...}}}
      if (response.success && response.data) {
        return { success: true, data: response.data.data || response.data, pagination: response.data.pagination }
      }
      return { success: false, data: [] }
    } catch (error) {
      console.error('API Error:', error)
      return handleApiError(error)
    }
  }
};