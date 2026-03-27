export const mockRewardOrders = [
  {
    id: 1,
    userId: 1001,
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    userName: '游戏达人',
    game: '英雄联盟',
    content: '寻找钻石以上段位的陪玩，一起冲大师！',
    reward: 100,
    paymentMethod: 'prepay',
    status: 'available',
    createdAt: '2026-03-23 15:30',
    tags: ['钻石', '排位', '上分'],
    requirements: ['钻石以上段位', '有稳定网络', '能准时上线']
  },
  {
    id: 2,
    userId: 1002,
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    userName: '电竞少女',
    game: '王者荣耀',
    content: '寻找荣耀王者陪玩，教我玩貂蝉',
    reward: 80,
    paymentMethod: 'postpay',
    status: 'available',
    createdAt: '2026-03-23 14:20',
    tags: ['荣耀王者', '貂蝉', '教学'],
    requirements: ['荣耀王者及以上', '擅长貂蝉', '有耐心']
  },
  {
    id: 3,
    userId: 1003,
    userAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    userName: '绝地求生',
    game: '绝地求生',
    content: '寻找KD3.0以上的陪玩，一起吃鸡',
    reward: 120,
    paymentMethod: 'prepay',
    status: 'available',
    createdAt: '2026-03-23 13:10',
    tags: ['KD3.0', '吃鸡', '技术流'],
    requirements: ['KD3.0以上', '有吃鸡经验', '能配合战术']
  },
  {
    id: 4,
    userId: 1004,
    userAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    userName: '原神爱好者',
    game: '原神',
    content: '寻找原神陪玩，一起打深渊12层',
    reward: 60,
    paymentMethod: 'postpay',
    status: 'available',
    createdAt: '2026-03-23 12:00',
    tags: ['原神', '深渊', '攻略'],
    requirements: ['深渊12层经验', '熟悉角色搭配', '有教学能力']
  },
  {
    id: 5,
    userId: 1005,
    userAvatar: 'https://randomuser.me/api/portraits/men/66.jpg',
    userName: 'CSGO玩家',
    game: 'CS:GO',
    content: '寻找Global Elite陪玩，练习枪法',
    reward: 150,
    paymentMethod: 'prepay',
    status: 'available',
    createdAt: '2026-03-23 11:30',
    tags: ['Global Elite', '枪法', '练习'],
    requirements: ['Global Elite段位', '枪法稳定', '有教学经验']
  }
]

export function mockGetRewardOrders(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredOrders = [...mockRewardOrders]
      
      if (params.status) {
        filteredOrders = filteredOrders.filter(order => order.status === params.status)
      }
      
      if (params.game) {
        filteredOrders = filteredOrders.filter(order => order.game === params.game)
      }
      
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const paginatedData = filteredOrders.slice((page-1)*pageSize, page*pageSize)
      
      resolve({
        success: true,
        data: {
          data: paginatedData,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(filteredOrders.length / pageSize),
            totalCount: filteredOrders.length
          }
        },
        message: '获取成功'
      })
    }, 300)
  })
}

export function mockGetRewardOrderDetail(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = mockRewardOrders.find(o => String(o.id) === String(orderId))
      if (order) {
        resolve({
          code: 0,
          data: {
            id: order.id,
            title: order.game + ' ' + (order.paymentMethod === 'prepay' ? '预付' : '现付') + '悬赏单',
            userId: order.userId,
            userAvatar: order.userAvatar,
            userName: order.userName,
            game: order.game,
            content: order.content,
            reward: order.reward,
            paymentMethod: order.paymentMethod,
            status: order.status,
            createdAt: order.createdAt,
            tags: order.tags,
            requirements: order.requirements,
            contactInfo: {
              phone: '138****8888',
              wechat: 'game****1234'
            }
          },
          msg: '获取成功'
        })
      } else {
        resolve({
          code: -1,
          data: {},
          msg: '订单不存在'
        })
      }
    }, 300)
  })
}

export function mockGrabRewardOrder(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          orderId: orderId,
          status: 'grabbed',
          message: '抢单成功'
        }
      })
    }, 500)
  })
}
