import { get } from './index.js'

const API_BASE_URL = '/match-history'

export const matchHistoryApi = {
  async getMatchHistory() {
    const response = await get(API_BASE_URL)
    return response
  },

  async getRecentMatches(page = 1, pageSize = 20) {
    const response = await get(`${API_BASE_URL}/matches`, {
      params: { page, pageSize }
    })
    return response
  },

  async getMatchDetail(matchId) {
    const response = await get(`${API_BASE_URL}/matches/${matchId}`)
    return response
  }
}
