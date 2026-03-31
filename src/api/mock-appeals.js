export const mockAppeals = [
  {
    id: 1,
    createdAt: '2026-03-29T10:30:00+08:00',
    updatedAt: '2026-03-29T10:30:00+08:00',
    userId: 1,
    orderId: 1,
    type: 'order',
    title: '订单未完成',
    content: '我下单后，陪玩没有按时上线',
    images: 'https://example.com/image1.jpg,https://example.com/image2.jpg',
    status: 'pending',
    response: '',
    handledBy: null,
    handledAt: null,
    contactInfo: '13800138001',
    priority: 'high'
  },
  {
    id: 2,
    createdAt: '2026-03-27T14:20:00+08:00',
    updatedAt: '2026-03-27T15:34:22+08:00',
    userId: 2,
    orderId: 2,
    type: 'payment',
    title: '支付失败',
    content: '我已经支付了订单，但是系统显示未支付',
    images: 'https://example.com/image3.jpg',
    status: 'processing',
    response: '正在处理中',
    handledBy: 1,
    handledAt: '2026-03-27T15:34:22+08:00',
    contactInfo: '13900139001',
    priority: 'normal'
  },
  {
    id: 3,
    createdAt: '2026-03-26T08:45:00+08:00',
    updatedAt: '2026-03-26T15:34:22+08:00',
    userId: 3,
    orderId: 3,
    type: 'service',
    title: '服务质量差',
    content: '陪玩的技术水平与描述不符',
    images: 'https://example.com/image4.jpg,https://example.com/image5.jpg',
    status: 'resolved',
    response: '已退款处理',
    handledBy: 2,
    handledAt: '2026-03-26T15:34:22+08:00',
    contactInfo: '13700137001',
    priority: 'high'
  },
  {
    id: 4,
    createdAt: '2026-03-25T09:00:00+08:00',
    updatedAt: '2026-03-25T15:34:22+08:00',
    userId: 4,
    orderId: 4,
    type: 'other',
    title: '其他问题',
    content: '我有一些关于平台使用的问题',
    images: '',
    status: 'rejected',
    response: '请联系客服解决',
    handledBy: 3,
    handledAt: '2026-03-25T15:34:22+08:00',
    contactInfo: '13600136001',
    priority: 'low'
  },
  {
    id: 5,
    createdAt: '2026-03-28T11:00:00+08:00',
    updatedAt: '2026-03-28T11:00:00+08:00',
    userId: 5,
    orderId: 5,
    type: 'order',
    title: '订单取消问题',
    content: '我想取消订单，但是系统不允许',
    images: 'https://example.com/image6.jpg',
    status: 'pending',
    response: '',
    handledBy: null,
    handledAt: null,
    contactInfo: '13500135001',
    priority: 'normal'
  }
]

const PAGE_SIZE = 10

export function getAppeals(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params.page || 1
      const status = params.status

      let filteredAppeals = mockAppeals
      if (status && status !== 'all') {
        filteredAppeals = mockAppeals.filter(appeal => appeal.status === status)
      }

      const startIndex = (page - 1) * PAGE_SIZE
      const endIndex = startIndex + PAGE_SIZE
      const paginatedData = filteredAppeals.slice(startIndex, endIndex)

      resolve({
        code: 0,
        data: {
          data: paginatedData,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(filteredAppeals.length / PAGE_SIZE),
            totalCount: filteredAppeals.length
          }
        },
        msg: '获取申诉列表成功'
      })
    }, 500)
  })
}

export function submitAppeal(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAppeal = {
        id: mockAppeals.length + 1,
        type: data.type || 'other',
        content: data.content,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      }
      mockAppeals.unshift(newAppeal)
      resolve({
        code: 0,
        data: newAppeal,
        msg: '提交申诉成功'
      })
    }, 500)
  })
}

export function getAppealDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appeal = mockAppeals.find(item => item.id === parseInt(id))
      if (appeal) {
        resolve({
          code: 0,
          data: appeal,
          msg: '获取申诉详情成功'
        })
      } else {
        resolve({
          code: 404,
          data: null,
          msg: '申诉不存在'
        })
      }
    }, 500)
  })
}

export const mockCreateAppeal = submitAppeal
export const mockGetAppealDetail = getAppealDetail
export const mockGetAppeals = getAppeals
