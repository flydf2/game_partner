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

export function mockGetFavorites(page = 1, pageSize = 10) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟更多收藏数据
      const mockFavorites = [
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
        },
        {
          id: 3,
          expertId: '3',
          expertAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDI76aOeylc3VRSRNZ04zYnjdju83SPGLpYh8d2uB5bogOv5w6wJcvfx6AJMDR5RQKBUrAlNQptRHNf3XJ61WGVmFOAc3-gFksvrlt6w6F_TaBfQ6Mij2zaM_KjWfcqlVkL82KYbgijsqdy-ptNMAsnQRBVHpqk2dGVjd6UsWwcuOnY9ToQPlAZwJXaT0sdGvDFkoLuAn_IIt1cP9aJJ9LXF0dXPKQK0bAJi57JnH1pgIKL4F5lFuQICzWqRy0VNT1R6BfwuOFvKg',
          expertName: '安妮喵呜',
          game: 'pubg',
          rank: 'master',
          addedAt: '2026-03-21 16:45'
        },
        {
          id: 4,
          expertId: '4',
          expertAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Yx21l3XQH58JEjdPvp2NeoI5LIs_51ynV3rForFFjwT3Hd5AqMSy-sxYD_dlyN682W91abmSgg8KAw9tpHslBqThqBE3aE1ZVVOsHMHttJaF7wdtEpDJ2OL28yGHnfz11wPG1Jw2fXoB8C6dHlBSmulomn9y3CFDd8uDRgc2wm8DxSw67mMZ3pZTXdnJa4MLoz4Dl06hB9dHtby_V56tqiQv_vAAw9oI9xP2_AoxO74HKUfN1fVEaKcK9T4LY_KB9LY0itiXfHU',
          expertName: '星野 Kyo',
          game: 'honor_of_kings',
          rank: 'challenger',
          addedAt: '2026-03-20 09:30'
        },
        {
          id: 5,
          expertId: '5',
          expertAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA255ssriqx239upv8-12k7zCZRVehwBMDwNbxBDVWFHTXeU9kDiEO9QDelxUR7qMzQ75J-4ro7_ZMZwik9PTEdzzd455C4MqYkMBHBgZUIIE3UUxXuZUzd9hBOzXfu3LsQIb_K1cS4c8zbYJaZXj4FIJciSMjb3OZ7mNFzGgGCjvimrN_9WQg4FONTf5MEWUNC7cIxE0HJ_2v3fuqE_KzIwg_BDneDCMgvQT--ApEg5QvmzBze7lomDKVKJDidgKcF1y0voJA1l',
          expertName: '皮卡丘爱吃肉',
          game: 'lol',
          rank: 'diamond',
          addedAt: '2026-03-19 14:20'
        },
        {
          id: 6,
          expertId: '6',
          expertAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0dK_MZqKKAmyA4yP_BkKpGsS_W87iCSLeuAAmwt_w2J0Fv2TJ3nFinGP1J3GSQx67aimew8FhrXUj4yr1rs9GdeQQ0HoLz7PYrcmT-menQ1ggX6R3fg-gRg1AOiAechpMCNklo7nlzYm6oTif3LxCbdYzd3J-GAlZr6SEyxpjOmVPDUFE4dwfMogxpTTQg-RVyvcN33jdsEkwf8vjjX4NIE1tfsILkkmLj6dL8Mu-pfvMf__Z-Ik58KyaejQd1RAt3s-oj5nsyo8',
          expertName: '游戏小王子',
          game: 'valorant',
          rank: 'master',
          addedAt: '2026-03-18 11:15'
        },
        {
          id: 7,
          expertId: '7',
          expertAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo3hiZMbuWCmrkmqDp0MNg-nzMlqn4AgGNgFofJ-IJJ59AeEGJZox-r1xg8drTN14GtBID78Yfm0NN6Wl-MX_ZHWaF8-LdFumF5to5bPc46yM5zIaucC3a4KP-Y2-i2tCwQd-duGHsg9F8AzLemDvG9s_6W3hw-pjjJN-PKkQI7oILcDHGkalxMkbZWOmaqIaik3owuV2Ghbrqr3MraHwibw8jkhxJWFQhPSpHM7em0RfJhdOUnqGVa3qBY2EA9DWUXnYNrTFFiM4',
          expertName: '小甜甜',
          game: 'genshin',
          rank: 'adventure_rank_55',
          addedAt: '2026-03-17 15:40'
        },
        {
          id: 8,
          expertId: '8',
          expertAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU8XrMhk3VFwj3Ceer0yCVb-HelGKX5ryLoHAYthnekinYCfvHoJ83xSPEZdrL2tht2CTf_d1atj0kQiKVMY41s8kFOBgY2l5a9dPvoP6yXh3HyA9pdom7W1PkI1l7drYVsVSEeg-BnjsOK2tD_lvHVqzF3VZCAhg6pbcyZj11rhzX6V52RT4jlbNYqEKBRxP818vVewrnT3E6phVAdGXO9zQIWGaIvWWk6pXEzjpNwOh3xDn8FNjv-sGQOhsOt1srbfvB0MFCo-A',
          expertName: '电竞女神',
          game: 'csgo',
          rank: 'global_elite',
          addedAt: '2026-03-16 10:25'
        }
      ]
      
      // 计算分页
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedData = mockFavorites.slice(startIndex, endIndex)
      
      resolve({
        code: 0,
        data: {
          data: paginatedData,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(mockFavorites.length / pageSize),
            totalCount: mockFavorites.length
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

export function mockGetBrowseHistory(page = 1, pageSize = 10) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟更多浏览历史数据
      const mockHistory = [
        {
          id: '1',
          expertId: '1',
          type: 'playmate',
          name: '林间小鹿',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWd42wRhAneFPqDBu00-X6zV_3VmT3LwRUFe1rO4eEyOa-IDEPhh1HH7x2WWdyarjgr_4WzatpsdpqaJXJlMRwo9dtnaBbaYDQBj0-oao709scndaRZifLRuzJRgNVcSzd8XsuGJ-4uBbEUbdAlWFQz_6HkFw-AT6QvtHY4sIV4zpurtJ13FIBZJw5DYnKUc0lTPGLItY507UIdcj7nBxJ2WZ7zMMYQN6FvTlEsX9vRQQ51tpjD9-9ylRac-P1jqyPFi7WtKf__I',
          viewTime: '2026-03-23 14:30',
          game: 'honor_of_kings',
          skill: '王者',
          rating: 5.0,
          price: 45
        },
        {
          id: '2',
          expertId: '2',
          type: 'playmate',
          name: '影子猎手',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAkokFDlJJU2ut7ADXOxXgokfLf-nFbve3PmdniZPK8ZjoxO1reJWexxqbxEwDy4thsHQWxI68ySeYsam7yLDI2EWIKoa7no1yZya_-OvKHcnsOU5ukziXluccC3dUHzW8BMFTNlh6bLkgI8bMSDhUTMaTR2jWDsFNRzAKs9RzZ11om4Ki5c9Xj92fIm685lMzUrq9Bk1QuG6y3TXwjzpc6HZVTEFv-aZfUUXt5s020g03CNeOFTD-_F8HtoWP1VEGiCAo5k4gC9o',
          viewTime: '2026-03-23 10:00',
          game: 'lol',
          skill: 'LOL',
          rating: 4.9,
          price: 60
        },
        {
          id: '3',
          expertId: '3',
          type: 'playmate',
          name: '安妮喵呜',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDI76aOeylc3VRSRNZ04zYnjdju83SPGLpYh8d2uB5bogOv5w6wJcvfx6AJMDR5RQKBUrAlNQptRHNf3XJ61WGVmFOAc3-gFksvrlt6w6F_TaBfQ6Mij2zaM_KjWfcqlVkL82KYbgijsqdy-ptNMAsnQRBVHpqk2dGVjd6UsWwcuOnY9ToQPlAZwJXaT0sdGvDFkoLuAn_IIt1cP9aJJ9LXF0dXPKQK0bAJi57JnH1pgIKL4F5lFuQICzWqRy0VNT1R6BfwuOFvKg',
          viewTime: '2026-03-22 16:45',
          game: 'pubg',
          skill: '绝地求生',
          rating: 4.8,
          price: 55
        },
        {
          id: '4',
          expertId: '4',
          type: 'playmate',
          name: '星野 Kyo',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Yx21l3XQH58JEjdPvp2NeoI5LIs_51ynV3rForFFjwT3Hd5AqMSy-sxYD_dlyN682W91abmSgg8KAw9tpHslBqThqBE3aE1ZVVOsHMHttJaF7wdtEpDJ2OL28yGHnfz11wPG1Jw2fXoB8C6dHlBSmulomn9y3CFDd8uDRgc2wm8DxSw67mMZ3pZTXdnJa4MLoz4Dl06hB9dHtby_V56tqiQv_vAAw9oI9xP2_AoxO74HKUfN1fVEaKcK9T4LY_KB9LY0itiXfHU',
          viewTime: '2026-03-22 09:30',
          game: 'honor_of_kings',
          skill: '王者',
          rating: 4.9,
          price: 50
        },
        {
          id: '5',
          expertId: '5',
          type: 'playmate',
          name: '皮卡丘爱吃肉',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA255ssriqx239upv8-12k7zCZRVehwBMDwNbxBDVWFHTXeU9kDiEO9QDelxUR7qMzQ75J-4ro7_ZMZwik9PTEdzzd455C4MqYkMBHBgZUIIE3UUxXuZUzd9hBOzXfu3LsQIb_K1cS4c8zbYJaZXj4FIJciSMjb3OZ7mNFzGgGCjvimrN_9WQg4FONTf5MEWUNC7cIxE0HJ_2v3fuqE_KzIwg_BDneDCMgvQT--ApEg5QvmzBze7lomDKVKJDidgKcF1y0voJA1l',
          viewTime: '2026-03-21 14:20',
          game: 'lol',
          skill: 'LOL',
          rating: 5.0,
          price: 40
        },
        {
          id: '6',
          expertId: '6',
          type: 'playmate',
          name: '游戏小王子',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0dK_MZqKKAmyA4yP_BkKpGsS_W87iCSLeuAAmwt_w2J0Fv2TJ3nFinGP1J3GSQx67aimew8FhrXUj4yr1rs9GdeQQ0HoLz7PYrcmT-menQ1ggX6R3fg-gRg1AOiAechpMCNklo7nlzYm6oTif3LxCbdYzd3J-GAlZr6SEyxpjOmVPDUFE4dwfMogxpTTQg-RVyvcN33jdsEkwf8vjjX4NIE1tfsILkkmLj6dL8Mu-pfvMf__Z-Ik58KyaejQd1RAt3s-oj5nsyo8',
          viewTime: '2026-03-21 11:15',
          game: 'valorant',
          skill: 'Valorant',
          rating: 4.7,
          price: 35
        },
        {
          id: '7',
          expertId: '7',
          type: 'playmate',
          name: '小甜甜',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo3hiZMbuWCmrkmqDp0MNg-nzMlqn4AgGNgFofJ-IJJ59AeEGJZox-r1xg8drTN14GtBID78Yfm0NN6Wl-MX_ZHWaF8-LdFumF5to5bPc46yM5zIaucC3a4KP-Y2-i2tCwQd-duGHsg9F8AzLemDvG9s_6W3hw-pjjJN-PKkQI7oILcDHGkalxMkbZWOmaqIaik3owuV2Ghbrqr3MraHwibw8jkhxJWFQhPSpHM7em0RfJhdOUnqGVa3qBY2EA9DWUXnYNrTFFiM4',
          viewTime: '2026-03-20 15:40',
          game: 'genshin',
          skill: '原神',
          rating: 4.9,
          price: 48
        },
        {
          id: '8',
          expertId: '8',
          type: 'playmate',
          name: '电竞女神',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU8XrMhk3VFwj3Ceer0yCVb-HelGKX5ryLoHAYthnekinYCfvHoJ83xSPEZdrL2tht2CTf_d1atj0kQiKVMY41s8kFOBgY2l5a9dPvoP6yXh3HyA9pdom7W1PkI1l7drYVsVSEeg-BnjsOK2tD_lvHVqzF3VZCAhg6pbcyZj11rhzX6V52RT4jlbNYqEKBRxP818vVewrnT3E6phVAdGXO9zQIWGaIvWWk6pXEzjpNwOh3xDn8FNjv-sGQOhsOt1srbfvB0MFCo-A',
          viewTime: '2026-03-20 10:25',
          game: 'csgo',
          skill: 'CS:GO',
          rating: 5.0,
          price: 65
        }
      ]
      
      // 计算分页
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedData = mockHistory.slice(startIndex, endIndex)
      
      resolve({
        code: 0,
        data: {
          data: paginatedData,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(mockHistory.length / pageSize),
            totalCount: mockHistory.length
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
