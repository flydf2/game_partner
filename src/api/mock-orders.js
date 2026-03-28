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
              expertAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWd42wRhAneFPqDBu00-X6zV_3VmT3LwRUFe1rO4eEyOa-IDEPhh1HH7x2WWdyarjgr_4WzatpsdpqaJXJlMRwo9dtnaBbaYDQBj0-oao709scndaRZifLRuzJRgNVcSzd8XsuGJ-4uBbEUbdAlWFQz_6HkFw-AT6QvtHY4sIV4zpurtJ13FIBZJw5DYnKUc0lTPGLItY507UIdcj7nBxJ2WZ7zMMYQN6FvTlEsX9vRQQ51tpjD9-9ylRac-P1jqyPFi7WtKf__I',
              expertName: '林间小鹿',
              game: 'honor_of_kings',
              rank: 'challenger',
              addedAt: '2026-03-23 14:30'
            },
            {
              id: 2,
              expertId: '2',
              expertAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAkokFDlJJU2ut7ADXOxXgokfLf-nFbve3PmdniZPK8ZjoxO1reJWexxqbxEwDy4thsHQWxI68ySeYsam7yLDI2EWIKoa7no1yZya_-OvKHcnsOU5ukziXluccC3dUHzW8BMFTNlh6bLkgI8bMSDhUTMaTR2jWDsFNRzAKs9RzZ11om4Ki5c9Xj92fIm685lMzUrq9Bk1QuG6y3TXwjzpc6HZVTEFv-aZfUUXt5s020g03CNeOFTD-_F8HtoWP1VEGiCAo5k4gC9o',
              expertName: '影子猎手',
              game: 'lol',
              rank: 'challenger',
              addedAt: '2026-03-22 10:00'
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: 2
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
              type: 'playmate',
              title: '林间小鹿',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWd42wRhAneFPqDBu00-X6zV_3VmT3LwRUFe1rO4eEyOa-IDEPhh1HH7x2WWdyarjgr_4WzatpsdpqaJXJlMRwo9dtnaBbaYDQBj0-oao709scndaRZifLRuzJRgNVcSzd8XsuGJ-4uBbEUbdAlWFQz_6HkFw-AT6QvtHY4sIV4zpurtJ13FIBZJw5DYnKUc0lTPGLItY507UIdcj7nBxJ2WZ7zMMYQN6FvTlEsX9vRQQ51tpjD9-9ylRac-P1jqyPFi7WtKf__I',
              time: '2026-03-23 14:30',
              game: 'honor_of_kings'
            },
            {
              id: '2',
              type: 'playmate',
              title: '影子猎手',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAkokFDlJJU2ut7ADXOxXgokfLf-nFbve3PmdniZPK8ZjoxO1reJWexxqbxEwDy4thsHQWxI68ySeYsam7yLDI2EWIKoa7no1yZya_-OvKHcnsOU5ukziXluccC3dUHzW8BMFTNlh6bLkgI8bMSDhUTMaTR2jWDsFNRzAKs9RzZ11om4Ki5c9Xj92fIm685lMzUrq9Bk1QuG6y3TXwjzpc6HZVTEFv-aZfUUXt5s020g03CNeOFTD-_F8HtoWP1VEGiCAo5k4gC9o',
              time: '2026-03-23 10:00',
              game: 'lol'
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: 2
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
