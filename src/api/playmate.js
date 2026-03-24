import { request } from './config.js'

export const playmateAPI = {
  async getPlaymates(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.pageSize) queryParams.append('pageSize', params.pageSize)
    if (params.online) queryParams.append('online', params.online)
    if (params.priceRange) queryParams.append('priceRange', params.priceRange)
    if (params.rank) queryParams.append('rank', params.rank)
    if (params.gender) queryParams.append('gender', params.gender)
    if (params.game) queryParams.append('game', params.game)
    if (params.keyword) queryParams.append('keyword', params.keyword)

    const queryString = queryParams.toString()
    return request(`/playmates${queryString ? `?${queryString}` : ''}`)
  },

  async getPlaymateDetail(id) {
    return request(`/playmates/${id}`)
  },

  async searchPlaymates(keyword, params = {}) {
    const queryParams = new URLSearchParams({ keyword, ...params })
    return request(`/playmates/search?${queryParams.toString()}`)
  },

  async getSearchSuggestions(keyword) {
    return request(`/playmates/suggestions?keyword=${encodeURIComponent(keyword)}`)
  }
}