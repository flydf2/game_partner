export function mockGetActivities() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 1,
            title: '新人专享首单优惠',
            description: '首次下单立减10元，限时优惠',
            discount: 10,
            type: 'discount',
            validUntil: '2026-04-30'
          },
          {
            id: 2,
            title: '周末狂欢活动',
            description: '周末下单享8折优惠',
            discount: 20,
            type: 'weekend',
            validUntil: '2026-03-31'
          }
        ]
      })
    }, 200)
  })
}

