import { defineStore } from 'pinia'
import { orderApi } from '../api/index.js'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
    total: 0
  }),
  
  getters: {
    getOrders: (state) => state.orders,
    getCurrentOrder: (state) => state.currentOrder,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getTotal: (state) => state.total
  },
  
  actions: {
    async createOrder(data) {
      try {
        this.isLoading = true
        this.error = null
        const response = await orderApi.createOrder(data)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async getOrderList(params) {
      try {
        this.isLoading = true
        this.error = null
        const response = await orderApi.getOrders(params.status || 'all')
        if (response.success || response.code === 0) {
          this.orders = response.data?.data || response.data || []
          this.total = this.orders.length
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
    
    async getOrderDetail(id) {
      try {
        this.isLoading = true
        this.error = null
        const response = await orderApi.getOrderDetail(id)
        this.currentOrder = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    clearCurrentOrder() {
      this.currentOrder = null
    },
    
    clearError() {
      this.error = null
    }
  }
})
