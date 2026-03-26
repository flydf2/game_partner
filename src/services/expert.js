import { get, post, del } from '../api/request.js'

const API_BASE_URL = '/experts'

export const expertService = {
  async getExpertDetail(expertId) {
    const response = await get(`${API_BASE_URL}/${expertId}`)
    return response
  },

  async followExpert(expertId) {
    const response = await post(`${API_BASE_URL}/${expertId}/follow`)
    return response
  },

  async unfollowExpert(expertId) {
    const response = await del(`${API_BASE_URL}/${expertId}/follow`)
    return response
  },

  async getExpertReviews(expertId, page = 1, pageSize = 10) {
    const response = await get(`${API_BASE_URL}/${expertId}/reviews`, {
      params: { page, pageSize }
    })
    return response
  },

  async getExpertVoice(expertId) {
    const response = await get(`${API_BASE_URL}/${expertId}/voice`)
    return response
  }
}
