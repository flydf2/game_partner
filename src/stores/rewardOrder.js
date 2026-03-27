import { defineStore } from 'pinia'
import { rewardOrderApi } from '../api/index.js'

export const useRewardOrderStore = defineStore('rewardOrder', {
  state: () => ({
    orders: [],
    currentOrder: null,
    applicants: [],
    isLoading: false,
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 1
  }),
  
  getters: {
    getOrders: (state) => state.orders,
    getCurrentOrder: (state) => state.currentOrder,
    getApplicants: (state) => state.applicants,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getTotal: (state) => state.total,
    getCurrentPage: (state) => state.currentPage,
    getTotalPages: (state) => state.totalPages
  },
  
  actions: {
    async getRewardOrders(params = {}) {
      try {
        this.isLoading = true
        this.error = null
        const response = await rewardOrderApi.getRewardOrders(params)
        
        if (response.success) {
          const ordersData = response.data.data || response.data || []
          const pagination = response.data.pagination || {}
          
          this.orders = ordersData
          this.total = pagination.totalCount || ordersData.length
          this.currentPage = pagination.currentPage || 1
          this.totalPages = pagination.totalPages || 1
        } else {
          throw new Error(response.message || response.msg || '获取订单列表失败')
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async getMyRewardOrders(params = {}) {
      try {
        this.isLoading = true
        this.error = null
        const response = await rewardOrderApi.getMyRewardOrders(params)
        
        if (response.success) {
          const ordersData = response.data.data || response.data || []
          this.orders = ordersData
        } else {
          throw new Error(response.message || response.msg || '获取我的订单失败')
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async getRewardOrderDetail(orderId) {
      try {
        this.isLoading = true
        this.error = null
        const response = await rewardOrderApi.getRewardOrderDetail(orderId)
        
        if (response.success) {
          this.currentOrder = response.data
        } else {
          throw new Error(response.message || response.msg || '获取订单详情失败')
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async getApplicants(orderId) {
      try {
        const response = await rewardOrderApi.getApplicants(orderId)
        
        if (response.success) {
          this.applicants = response.data || []
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async selectApplicant(orderId, applicantId) {
      try {
        const response = await rewardOrderApi.selectApplicant(orderId, applicantId)
        
        if (response.success) {
          await this.getApplicants(orderId)
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async grabRewardOrder(orderId) {
      try {
        const response = await rewardOrderApi.grabRewardOrder(orderId)
        
        if (response.success) {
          await this.getRewardOrderDetail(orderId)
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async publishRewardOrder(orderId) {
      try {
        const response = await rewardOrderApi.publishRewardOrder(orderId)
        
        if (response.success) {
          await this.getRewardOrderDetail(orderId)
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async publishReward(publishData) {
      try {
        const response = await rewardOrderApi.publishReward(publishData)
        
        if (response.success) {
          await this.getRewardOrderDetail(response.data.orderId)
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async payRewardOrder(orderId, paymentData) {
      try {
        const response = await rewardOrderApi.payRewardOrder(orderId, paymentData)
        
        if (response.success) {
          await this.getRewardOrderDetail(orderId)
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async confirmService(orderId, reviewData) {
      try {
        const response = await rewardOrderApi.confirmService(orderId, reviewData)
        
        if (response.success) {
          await this.getRewardOrderDetail(orderId)
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    clearCurrentOrder() {
      this.currentOrder = null
    },
    
    clearApplicants() {
      this.applicants = []
    },
    
    clearError() {
      this.error = null
    },
    
    resetState() {
      this.orders = []
      this.currentOrder = null
      this.applicants = []
      this.total = 0
      this.currentPage = 1
      this.totalPages = 1
      this.error = null
    }
  }
})
