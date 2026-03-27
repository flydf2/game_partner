export function mockGetRecommendations() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          recommendations: [
            {
              id: 1,
              type: 'playmate',
              data: {
                id: 1,
                name: '星野 Kyo',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Yx21l3XQH58JEjdPvp2NeoI5LIs_51ynV3rForFFjwT3Hd5AqMSy-sxYD_dlyN682W91abmSgg8KAw9tpHslBqThqBE3aE1ZVVOsHMHttJaF7wdtEpDJ2OL28yGHnfz11wPG1Jw2fXoB8C6dHlBSmulomn9y3CFDd8uDRgc2wm8DxSw67mMZ3pZTXdnJa4MLoz4Dl06hB9dHtby_V56tqiQv_vAAw9oI9xP2_AoxO74HKUfN1fVEaKcK9T4LY_KB9LY0itiXfHU',
                game: '英雄联盟',
                skill: '最强王者',
                price: 50,
                rating: 4.9,
                reviews: 128,
                online: true
              }
            },
            {
              id: 2,
              type: 'activity',
              data: {
                id: 1,
                title: '新手福利活动',
                description: '首次下单享8折优惠',
                image: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=gaming%20activity%20banner&size=800x400',
                startDate: '2026-03-01',
                endDate: '2026-03-31'
              }
            },
            {
              id: 3,
              type: 'playmate',
              data: {
                id: 2,
                name: '小甜甜',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                game: '王者荣耀',
                skill: '荣耀王者',
                price: 40,
                rating: 4.8,
                reviews: 95,
                online: true
              }
            }
          ]
        }
      })
    }, 400)
  })
}

// 奖励订单相关数据
