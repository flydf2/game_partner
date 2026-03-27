export function mockGetOrders(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockOrders = [
        {
          id: 1,
          expertAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
          expertName: '电竞少女',
          game: 'LOL',
          skill: '钻石段位',
          status: 'pending',
          statusText: '待进行',
          serviceTime: '2026-03-25 19:00-20:00',
          amount: 48
        },
        {
          id: 2,
          expertAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
          expertName: '游戏大师',
          game: 'CS:GO',
          skill: '大师段位',
          status: 'completed',
          statusText: '已完成',
          serviceTime: '2026-03-20 20:00-21:00',
          amount: 52
        },
        {
          id: 3,
          expertAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          expertName: '安妮喵呜',
          game: '绝地求生',
          skill: '温柔语聊',
          status: 'cancelled',
          statusText: '已取消',
          serviceTime: '2026-03-15 18:00-19:00',
          amount: 55
        }
      ]

      let filteredOrders = [...mockOrders]
      
      if (params.status && params.status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === params.status)
      }

      resolve({
        code: 0,
        data: {
          data: filteredOrders,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: filteredOrders.length
          }
        },
        msg: '获取订单成功'
      })
    }, 200)
  })
}

export function mockGetOrderConfirmation(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          order: {
            id: orderId,
            expertAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
            expertName: '电竞少女',
            game: 'LOL',
            skill: '钻石段位',
            serviceTime: '2026-03-25 19:00-20:00',
            duration: 60,
            price: 48,
            totalAmount: 48
          },
          expertInfo: {
            level: 45,
            title: '荣耀之巅',
            description: '5年游戏经验，擅长打野和上单',
            stats: {
              winRate: 85,
              followers: 12000,
              rating: 4.9
            }
          }
        },
        msg: '获取成功'
      })
    }, 300)
  })
}

export function mockGetOrderDetail(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          order: {
            id: orderId,
            expertAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
            expertName: '电竞少女',
            game: 'LOL',
            skill: '钻石段位',
            status: 'pending',
            statusText: '待进行',
            serviceTime: '2026-03-25 19:00-20:00',
            duration: 60,
            price: 48,
            totalAmount: 48,
            paymentMethod: 'balance',
            createdAt: '2026-03-24 10:00'
          },
          expertInfo: {
            level: 45,
            title: '荣耀之巅',
            description: '5年游戏经验，擅长打野和上单',
            stats: {
              winRate: 85,
              followers: 12000,
              rating: 4.9
            },
            skills: [
              {
                id: 1,
                name: 'LOL排位赛',
                price: 48,
                level: '钻石',
                description: '钻石及以下段位排位'
              }
            ]
          },
          chatMessages: [
            {
              id: 1,
              from: 'other',
              content: '你好，我准备好了，可以开始了吗？',
              time: '2026-03-25 18:30'
            }
          ]
        },
        msg: '获取成功'
      })
    }, 300)
  })
}

export function mockGetFavorites() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          data: [
            {
              id: 1,
              expertId: '1',
              expertAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              expertName: '林间小鹿',
              game: 'honor_of_kings',
              rank: 'challenger',
              title: '荣耀王者',
              description: '5年游戏经验，擅长打野和上单',
              rating: 4.9,
              orders: 128,
              level: 45,
              price: 48,
              unit: '局',
              tags: '技术好,耐心,讲解清晰',
              likes: 256,
              isOnline: true,
              addedAt: '2026-03-23 14:30'
            },
            {
              id: 2,
              expertId: '2',
              expertAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
              expertName: '影子猎手',
              game: 'lol',
              rank: 'challenger',
              title: '大师段位',
              description: '职业电竞选手，擅长中单和辅助',
              rating: 4.8,
              orders: 89,
              level: 42,
              price: 55,
              unit: '局',
              tags: '操作犀利,思路清晰,语聊',
              likes: 180,
              isOnline: false,
              addedAt: '2026-03-22 10:00'
            },
            {
              id: 3,
              expertId: '3',
              expertAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
              expertName: '游戏大师',
              game: 'csgo',
              rank: 'master',
              title: '精英段位',
              description: '多年CSGO经验，擅长排位加分',
              rating: 4.7,
              orders: 200,
              level: 48,
              price: 60,
              unit: '局',
              tags: '稳定,靠谱,带打排位',
              likes: 320,
              isOnline: true,
              addedAt: '2026-03-21 08:00'
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: 3
          }
        },
        msg: '获取成功'
      })
    }, 200)
  })
}

export function mockRemoveFavorite(favoriteId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: { message: '取消收藏成功' },
        msg: '操作成功'
      })
    }, 300)
  })
}

export function mockGetBrowseHistory() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          data: [
            {
              id: '1',
              expertId: '101',
              name: '林间小鹿',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              rating: 4.9,
              skill: '荣耀王者',
              game: '王者荣耀',
              price: 48,
              viewTime: '2026-03-25 14:30:00'
            },
            {
              id: '2',
              expertId: '102',
              name: '影子猎手',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
              rating: 4.8,
              skill: '大师段位',
              game: 'LOL',
              price: 55,
              viewTime: '2026-03-25 10:00:00'
            },
            {
              id: '3',
              expertId: '103',
              name: '电竞少女',
              avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
              rating: 4.95,
              skill: '钻石段位',
              game: '绝地求生',
              price: 50,
              viewTime: '2026-03-24 18:20:00'
            },
            {
              id: '4',
              expertId: '104',
              name: '游戏大师',
              avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
              rating: 4.7,
              skill: '精英段位',
              game: 'CS:GO',
              price: 60,
              viewTime: '2026-03-24 15:45:00'
            },
            {
              id: '5',
              expertId: '105',
              name: '星河漫步',
              avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
              rating: 4.98,
              skill: '最强王者',
              game: '王者荣耀',
              price: 88,
              viewTime: '2026-03-23 20:10:00'
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: 5
          }
        },
        msg: '获取成功'
      })
    }, 200)
  })
}

export function mockClearHistory() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: { message: '清空历史成功' },
        msg: '操作成功'
      })
    }, 300)
  })
}

export function mockGetWallet() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          balance: 1280.50,
          frozenBalance: 100.00,
          totalIncome: 5680.50,
          transactions: [
            {
              id: 1,
              type: 'income',
              amount: 48.00,
              description: '订单 #1001 收入',
              time: '2026-03-23 15:30'
            },
            {
              id: 2,
              type: 'expense',
              amount: 200.00,
              description: '提现申请',
              time: '2026-03-22 10:00'
            }
          ]
        },
        msg: '获取成功'
      })
    }, 200)
  })
}

export function mockRecharge(rechargeData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          transactionId: Date.now(),
          coinsAdded: rechargeData.coins,
          balance: 1280 + rechargeData.coins
        },
        msg: '充值成功'
      })
    }, 1000)
  })
}
