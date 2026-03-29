import { get, post, put, del } from './request.js'

export const playmateAPI = {
  async getLeaderboard(params = {}) {
    // 确保分页参数存在
    const queryParams = {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      ...params
    }
    return get('/playmates/leaderboard', { params: queryParams })
  },

  async getPlaymates(params = {}) {
    // 确保分页参数存在
    const queryParams = {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      ...params
    }
    return get('/playmates', { params: queryParams })
  },

  async getPlaymateDetail(id) {
    return get(`/playmates/${id}`)
  },

  async searchPlaymates(keyword, params = {}) {
    // 确保分页参数存在
    const queryParams = {
      keyword,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      ...params
    }
    return get('/playmates/search', { params: queryParams })
  },

  async getSearchSuggestions(keyword) {
    return get('/playmates/suggestions', { params: { keyword } })
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
    // 确保分页参数存在
    const queryParams = {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      ...params
    }
    return get('/reward', { params: queryParams })
  },

  /**
   * 获取奖励订单详情
   * @param {number} orderId - 订单ID
   * @returns {Promise} 订单详情
   */
  async getRewardOrderDetail(orderId) {
    return get(`/reward/${orderId}`)
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
    return post('/reward', data)
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
    return put(`/reward/${orderId}`, data)
  },

  /**
   * 删除奖励订单
   * @param {number} orderId - 订单ID
   * @returns {Promise} 删除结果
   */
  async deleteRewardOrder(orderId) {
    return del(`/reward/${orderId}`)
  },

  /**
   * 抢奖励订单
   * @param {number} orderId - 订单ID
   * @returns {Promise} 抢单结果
   */
  async grabRewardOrder(orderId) {
    return post(`/reward/${orderId}/grab`)
  }
}
