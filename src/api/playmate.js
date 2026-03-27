import { request } from './config.js'

export const playmateAPI = {
  async getLeaderboard(params = {}) {
    const queryParams = new URLSearchParams()
    
    queryParams.append('page', params.page || 1)
    queryParams.append('pageSize', params.pageSize || 20)
    if (params.period) queryParams.append('period', params.period)
    if (params.game) queryParams.append('game', params.game)
    
    const queryString = queryParams.toString()
    return request(`/playmates/leaderboard${queryString ? `?${queryString}` : ''}`)
  },

  async getPlaymates(params = {}) {
    // 确保分页参数存在
    const queryParams = new URLSearchParams()
    
    queryParams.append('page', params.page || 1)
    queryParams.append('pageSize', params.pageSize || 20)
    
    if (params.online) queryParams.append('online', params.online)
    if (params.priceRange) queryParams.append('priceRange', params.priceRange)
    if (params.rank) queryParams.append('rank', params.rank)
    if (params.gender) queryParams.append('gender', params.gender)
    if (params.game) queryParams.append('game', params.game)
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)

    const queryString = queryParams.toString()
    return request(`/playmates${queryString ? `?${queryString}` : ''}`)
  },

  async getPlaymateDetail(id) {
    return request(`/playmates/${id}`)
  },

  async searchPlaymates(keyword, params = {}) {
    // 确保分页参数存在
    const queryParams = new URLSearchParams()
    
    queryParams.append('keyword', keyword)
    queryParams.append('page', params.page || 1)
    queryParams.append('pageSize', params.pageSize || 20)
    
    if (params.online) queryParams.append('online', params.online)
    if (params.priceRange) queryParams.append('priceRange', params.priceRange)
    if (params.rank) queryParams.append('rank', params.rank)
    if (params.gender) queryParams.append('gender', params.gender)
    if (params.game) queryParams.append('game', params.game)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    
    return request(`/playmates/search?${queryParams.toString()}`)
  },

  async getSearchSuggestions(keyword) {
    return request(`/playmates/suggestions?keyword=${encodeURIComponent(keyword)}`)
  },

  // ==================== Reward Orders CRUD ====================

  /**
   * 获取奖励订单列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.game - 游戏筛选
   * @param {string} params.status - 订单状态筛选
   * @param {string} params.paymentMethod - 支付方式筛选
   * @param {string} params.keyword - 关键词搜索
   * @returns {Promise} 奖励订单列表
   */
  async getRewardOrders(params = {}) {
    const queryParams = new URLSearchParams()
    
    queryParams.append('page', params.page || 1)
    queryParams.append('pageSize', params.pageSize || 20)
    
    if (params.game) queryParams.append('game', params.game)
    if (params.status) queryParams.append('status', params.status)
    if (params.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod)
    if (params.keyword) queryParams.append('keyword', params.keyword)

    const queryString = queryParams.toString()
    return request(`/reward${queryString ? `?${queryString}` : ''}`)
  },

  /**
   * 获取奖励订单详情
   * @param {number} orderId - 订单ID
   * @returns {Promise} 订单详情
   */
  async getRewardOrderDetail(orderId) {
    return request(`/reward/${orderId}`)
  },

  /**
   * 创建奖励订单
   * @param {Object} data - 订单数据
   * @param {string} data.game - 游戏名称
   * @param {string} data.content - 订单内容
   * @param {number} data.reward - 奖励金额
   * @param {string} data.paymentMethod - 支付方式 (prepay/postpay)
   * @param {string} data.tags - 标签
   * @returns {Promise} 创建的订单
   */
  async createRewardOrder(data) {
    return request('/reward', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /**
   * 更新奖励订单
   * @param {number} orderId - 订单ID
   * @param {Object} data - 更新数据
   * @param {string} data.game - 游戏名称
   * @param {string} data.content - 订单内容
   * @param {number} data.reward - 奖励金额
   * @param {string} data.paymentMethod - 支付方式
   * @param {string} data.status - 订单状态
   * @param {string} data.tags - 标签
   * @returns {Promise} 更新后的订单
   */
  async updateRewardOrder(orderId, data) {
    return request(`/reward/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  /**
   * 删除奖励订单
   * @param {number} orderId - 订单ID
   * @returns {Promise} 删除结果
   */
  async deleteRewardOrder(orderId) {
    return request(`/reward/${orderId}`, {
      method: 'DELETE'
    })
  },

  /**
   * 抢奖励订单
   * @param {number} orderId - 订单ID
   * @returns {Promise} 抢单结果
   */
  async grabRewardOrder(orderId) {
    return request(`/reward/${orderId}/grab`, {
      method: 'POST'
    })
  }
}
