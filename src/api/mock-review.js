export const mockReviewTags = [
  { id: 'professional', label: '专业度高' },
  { id: 'friendly', label: '态度友好' },
  { id: 'patient', label: '耐心指导' },
  { id: 'punctual', label: '准时开始' },
  { id: 'skilled', label: '技术精湛' },
  { id: 'communicative', label: '沟通顺畅' },
  { id: 'fun', label: '体验愉快' },
  { id: 'recommend', label: '值得推荐' }
]

export function mockGetReviewTags() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockReviewTags
      })
    }, 200)
  })
}

export function mockSubmitReview(reviewData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: Date.now(),
          ...reviewData,
          createdAt: new Date().toISOString()
        },
        message: '评价提交成功'
      })
    }, 500)
  })
}

// 订单确认相关数据
