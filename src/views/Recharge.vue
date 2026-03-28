<template>
  <div class="recharge">
    <div class="page-header">
      <div class="back-button" @click="goBack">
        <img src="@/assets/icons/back.svg" alt="返回" />
      </div>
      <h1>{{ $route.meta.title }}</h1>
      <div class="header-right"></div>
    </div>
    
    <div class="recharge-content">
      <div class="section">
        <h2>充值金额</h2>
        <div class="amount-options">
          <div 
            class="amount-item" 
            v-for="amount in amountOptions" 
            :key="amount.value"
            :class="{ active: selectedAmount === amount.value }"
            @click="selectAmount(amount.value)"
          >
            {{ amount.label }}
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>支付方式</h2>
        <div class="payment-options">
          <div 
            class="payment-item" 
            v-for="payment in paymentOptions" 
            :key="payment.id"
            :class="{ active: selectedPayment === payment.id }"
            @click="selectPayment(payment.id)"
          >
            <img :src="payment.icon" alt="支付方式" class="payment-icon" />
            <span class="payment-name">{{ payment.name }}</span>
            <img v-if="selectedPayment === payment.id" src="@/assets/icons/check.svg" alt="选中" class="check-icon" />
          </div>
        </div>
      </div>
      
      <div class="recharge-button">
        <button @click="confirmRecharge">立即充值</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Recharge',
  data() {
    return {
      selectedAmount: 100,
      selectedPayment: 'wechat',
      amountOptions: [
        { label: '100元', value: 100 },
        { label: '200元', value: 200 },
        { label: '500元', value: 500 },
        { label: '1000元', value: 1000 },
        { label: '2000元', value: 2000 },
        { label: '5000元', value: 5000 }
      ],
      paymentOptions: [
        {
          id: 'wechat',
          name: '微信支付',
          icon: 'https://via.placeholder.com/40'
        },
        {
          id: 'alipay',
          name: '支付宝',
          icon: 'https://via.placeholder.com/40'
        },
        {
          id: 'bank',
          name: '银行卡',
          icon: 'https://via.placeholder.com/40'
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    selectAmount(amount) {
      this.selectedAmount = amount
    },
    selectPayment(paymentId) {
      this.selectedPayment = paymentId
    },
    confirmRecharge() {
      // 这里应该调用支付接口
      alert(`确认充值 ${this.selectedAmount} 元，使用 ${this.paymentOptions.find(p => p.id === this.selectedPayment).name}`)
      // 支付成功后跳转到钱包页面
      this.$router.push('/profile/wallet')
    }
  }
}
</script>

<style scoped>
.recharge {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 44px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.back-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 24px;
  height: 24px;
}

.page-header h1 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  width: 44px;
}

.recharge-content {
  padding: 16px;
}

.section {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.amount-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.amount-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.amount-item.active {
  border-color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
  color: #1890ff;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-item.active {
  border-color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
}

.payment-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.payment-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #1890ff;
}

.recharge-button {
  margin-top: 32px;
}

.recharge-button button {
  width: 100%;
  padding: 14px;
  background-color: #1890ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recharge-button button:hover {
  background-color: #40a9ff;
}

.recharge-button button:active {
  background-color: #096dd9;
}
</style>