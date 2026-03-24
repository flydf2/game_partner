import { defineStore } from 'pinia'
import { mockService } from '../services/mock'

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
        const response = await apiService.order.create(data)
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
        const response = await mockService.getOrders(params)
        this.orders = response.list
        this.total = response.total
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
        const response = await apiService.order.getDetail(id)
        this.currentOrder = response
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
