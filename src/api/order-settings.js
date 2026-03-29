import { get, post, put } from './index.js'

const API_BASE_URL = '/expert/order-settings'

export const orderSettingsApi = {
  async getOrderSettings() {
    const response = await get(API_BASE_URL)
    return response
  },

  async updateStatus(status) {
    const response = await put(`${API_BASE_URL}/status`, { status })
    return response
  },

  async updateTimeSlots(timeSlots) {
    const response = await put(`${API_BASE_URL}/time-slots`, timeSlots)
    return response
  },

  async updateAutoReply(replyText) {
    const response = await put(`${API_BASE_URL}/auto-reply`, { replyText })
    return response
  },

  async getServices() {
    const response = await get(`${API_BASE_URL}/services`)
    return response
  },

  async updateServicePrice(serviceId, price) {
    const response = await put(`${API_BASE_URL}/services/${serviceId}/price`, { price })
    return response
  },

  async getTodayRecommendations() {
    const response = await get(`${API_BASE_URL}/today-recommendations`)
    return response
  }
}
