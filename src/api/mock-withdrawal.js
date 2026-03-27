export function mockSubmitWithdrawal(withdrawalData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const amount = parseFloat(withdrawalData.amount)
      
      if (amount < 10) {
        reject({
          success: false,
          message: '单笔最低提现 ¥10.00'
        })
        return
      }
      
      if (amount > 50000) {
        reject({
          success: false,
          message: '单笔提现金额不能超过 ¥50,000'
        })
        return
      }
      
      resolve({
        success: true,
        data: {
          id: Date.now(),
          amount: amount,
          method: withdrawalData.method,
          status: 'pending',
          fee: amount * 0.01,
          actualAmount: amount - (amount * 0.01),
          createdAt: new Date().toISOString()
        },
        message: '提现申请已提交，请等待审核'
      })
    }, 800)
  })
}

export function mockGetWithdrawalRecords() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 1,
            amount: 200.00,
            method: 'wechat',
            status: 'completed',
            statusText: '已完成',
            fee: 2.00,
            actualAmount: 198.00,
            createdAt: '2026-03-22 10:00',
            completedAt: '2026-03-22 14:30'
          },
          {
            id: 2,
            amount: 50.00,
            method: 'alipay',
            status: 'pending',
            statusText: '处理中',
            fee: 0.50,
            actualAmount: 49.50,
            createdAt: '2026-03-24 15:00'
          },
          {
            id: 3,
            amount: 100.00,
            method: 'wechat',
            status: 'rejected',
            statusText: '已拒绝',
            fee: 1.00,
            actualAmount: 99.00,
            createdAt: '2026-03-20 09:30',
            rejectReason: '账户信息与提现人不一致'
          }
        ]
      })
    }, 300)
  })
}
