import { get, post, del } from './request.js'
import { cache } from '../utils/cache.js'

// 是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// 导入 Mock 服务作为备用
import mockTournamentService from './mock-tournament.js'

// 重试机制
async function withRetry(fn, retries = 3, delay = 1000, maxDelay = 10000) {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0) {
      const currentDelay = Math.min(delay, maxDelay)
      console.warn(`Request failed, retrying... (${retries} attempts left, delay: ${currentDelay}ms)`)
      await new Promise(resolve => setTimeout(resolve, currentDelay))
      return withRetry(fn, retries - 1, delay * 2, maxDelay)
    }
    throw error
  }
}

// 赛事相关 API
export const tournamentApi = {
  // 获取赛事列表
  async getTournamentList(params = {}) {
    const cacheKey = cache.generateKey('tournament_list', params)
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }
    
    try {
      let data
      if (USE_MOCK) {
        data = await mockTournamentService.getTournamentList(params)
      } else {
        data = await withRetry(() => get('/tournaments', { params }))
      }
      
      // 缓存 5 分钟
      cache.set(cacheKey, data, 5 * 60 * 1000)
      return data
    } catch (error) {
      console.error('获取赛事列表失败:', error)
      throw error
    }
  },

  // 获取赛事详情
  async getTournamentDetail(tournamentId) {
    const cacheKey = cache.generateKey('tournament_detail', { tournamentId })
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      return cachedData
    }
    
    try {
      let data
      if (USE_MOCK) {
        data = await mockTournamentService.getTournamentDetail(tournamentId)
      } else {
        const response = await withRetry(() => get(`/tournaments/${tournamentId}`))
        // 处理后端返回格式
        if (response.code === 0) {
          data = response.data
        } else if (response.success) {
          data = response.data
        } else {
          data = response
        }
      }
      
      // 缓存 10 分钟
      cache.set(cacheKey, data, 10 * 60 * 1000)
      return data
    } catch (error) {
      console.error('获取赛事详情失败:', error)
      throw error
    }
  },

  // 获取参赛队伍
  async getTournamentTeams(tournamentId) {
    try {
      if (USE_MOCK) {
        return await mockTournamentService.getTournamentTeams(tournamentId)
      } else {
        const response = await withRetry(() => get(`/tournaments/${tournamentId}/teams`))
        if (response.code === 0) {
          return response.data || []
        } else if (response.success) {
          return response.data || []
        }
        return response || []
      }
    } catch (error) {
      console.error('获取参赛队伍失败:', error)
      throw error
    }
  },

  // 获取赛程安排
  async getTournamentMatches(tournamentId) {
    try {
      if (USE_MOCK) {
        return await mockTournamentService.getTournamentMatches(tournamentId)
      } else {
        const response = await withRetry(() => get(`/tournaments/${tournamentId}/matches`))
        if (response.code === 0) {
          return response.data || []
        } else if (response.success) {
          return response.data || []
        }
        return response || []
      }
    } catch (error) {
      console.error('获取赛程安排失败:', error)
      throw error
    }
  },

  // 报名参赛
  async joinTournament(tournamentId, teamInfo) {
    try {
      // 清除赛事详情缓存
      const cacheKey = cache.generateKey('tournament_detail', { tournamentId })
      cache.remove(cacheKey)
      
      if (USE_MOCK) {
        return await mockTournamentService.joinTournament(tournamentId, teamInfo)
      } else {
        const response = await withRetry(() => post(`/tournaments/${tournamentId}/join`, teamInfo))
        if (response.code === 0) {
          return { success: true, message: response.msg || '报名成功', data: response.data }
        } else if (response.success) {
          return response
        }
        return { success: true, data: response }
      }
    } catch (error) {
      console.error('报名参赛失败:', error)
      throw error
    }
  },

  // 取消报名
  async cancelJoin(tournamentId) {
    try {
      // 清除赛事详情缓存
      const cacheKey = cache.generateKey('tournament_detail', { tournamentId })
      cache.remove(cacheKey)
      
      if (USE_MOCK) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true, message: '取消报名成功' })
          }, 300)
        })
      } else {
        const response = await withRetry(() => del(`/tournaments/${tournamentId}/join`))
        if (response.code === 0) {
          return { success: true, message: response.msg || '取消报名成功', data: response.data }
        } else if (response.success) {
          return response
        }
        return { success: true, data: response }
      }
    } catch (error) {
      console.error('取消报名失败:', error)
      throw error
    }
  },

  // 获取我的赛事
  async getMyTournaments(params = {}) {
    try {
      if (USE_MOCK) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              data: {
                list: [],
                total: 0
              }
            })
          }, 300)
        })
      } else {
        const response = await withRetry(() => get('/tournaments/my', { params }))
        if (response.code === 0) {
          return { success: true, data: response.data, message: response.msg }
        } else if (response.success) {
          return response
        }
        return { success: true, data: response }
      }
    } catch (error) {
      console.error('获取我的赛事失败:', error)
      throw error
    }
  }
}

export default tournamentApi
