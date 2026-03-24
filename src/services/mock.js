// Mock数据服务

// 热门游戏数据
export const mockGames = [
  {
    id: 1,
    name: 'LOL',
    icon: 'videogame_asset',
    color: 'primary'
  },
  {
    id: 2,
    name: 'Valorant',
    icon: 'target',
    color: 'secondary'
  },
  {
    id: 3,
    name: '王者荣耀',
    icon: 'shield',
    color: 'tertiary'
  },
  {
    id: 4,
    name: '原神',
    icon: 'auto_awesome',
    color: 'surface'
  }
]

// 优秀陪玩数据
export const mockPlaymates = [
  {
    id: '1',
    name: '林间小鹿',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWd42wRhAneFPqDBu00-X6zV_3VmT3LwRUFe1rO4eEyOa-IDEPhh1HH7x2WWdyarjgr_4WzatpsdpqaJXJlMRwo9dtnaBbaYDQBj0-oao709scndaRZifLRuzJRgNVcSzd8XsuGJ-4uBbEUbdAlWFQz_6HkFw-AT6QvtHY4sIV4zpurtJ13FIBZJw5DYnKUc0lTPGLItY507UIdcj7nBxJ2WZ7zMMYQN6FvTlEsX9vRQQ51tpjD9-9ylRac-P1jqyPFi7WtKf__I',
    rating: 5.0,
    price: '¥45',
    tags: ['王者', '萌妹'],
    description: '大家好，我是林间小鹿，一名专业的王者荣耀陪玩。我擅长法师和辅助位置，有着丰富的游戏经验和教学经验。我性格开朗，善于沟通，能够为你提供愉快的游戏体验。',
    stats: {
      hours: '1,200+',
      orders: 356,
      rating: 99
    },
    services: [
      {
        name: '普通陪玩',
        price: '¥45/hr',
        description: '1小时起订'
      },
      {
        name: '排位上分',
        price: '¥60/hr',
        description: '保证胜率'
      },
      {
        name: '教学指导',
        price: '¥80/hr',
        description: '一对一教学'
      }
    ]
  },
  {
    id: '2',
    name: '影子猎手',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAkokFDlJJU2ut7ADXOxXgokfLf-nFbve3PmdniZPK8ZjoxO1reJWexxqbxEwDy4thsHQWxI68ySeYsam7yLDI2EWIKoa7no1yZya_-OvKHcnsOU5ukziXluccC3dUHzW8BMFTNlh6bLkgI8bMSDhUTMaTR2jWDsFNRzAKs9RzZ11om4Ki5c9Xj92fIm685lMzUrq9Bk1QuG6y3TXwjzpc6HZVTEFv-aZfUUXt5s020g03CNeOFTD-_F8HtoWP1VEGiCAo5k4gC9o',
    rating: 4.9,
    price: '¥60',
    tags: ['国服第一', '技术流'],
    description: '我是影子猎手，专注于LOL和Valorant的高端陪玩。拥有多年的游戏经验，曾在多个比赛中获得优异成绩。我会根据你的需求，为你提供最专业的游戏指导和陪伴。',
    stats: {
      hours: '2,500+',
      orders: 523,
      rating: 98
    },
    services: [
      {
        name: '普通陪玩',
        price: '¥60/hr',
        description: '1小时起订'
      },
      {
        name: '排位上分',
        price: '¥80/hr',
        description: '保证胜率'
      },
      {
        name: '教学指导',
        price: '¥100/hr',
        description: '一对一教学'
      }
    ]
  },
  {
    id: '3',
    name: '安妮喵呜',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDI76aOeylc3VRSRNZ04zYnjdju83SPGLpYh8d2uB5bogOv5w6wJcvfx6AJMDR5RQKBUrAlNQptRHNf3XJ61WGVmFOAc3-gFksvrlt6w6F_TaBfQ6Mij2zaM_KjWfcqlVkL82KYbgijsqdy-ptNMAsnQRBVHpqk2dGVjd6UsWwcuOnY9ToQPlAZwJXaT0sdGvDFkoLuAn_IIt1cP9aJJ9LXF0dXPKQK0bAJi57JnH1pgIKL4F5lFuQICzWqRy0VNT1R6BfwuOFvKg',
    rating: 4.8,
    price: '¥55',
    tags: ['温柔语聊', '绝地求生'],
    description: '大家好，我是安妮喵呜，一名专业的游戏陪玩。我擅长绝地求生和王者荣耀，性格温柔，善于沟通，能够为你提供愉快的游戏体验。我会根据你的需求，为你提供最贴心的服务。',
    stats: {
      hours: '1,800+',
      orders: 412,
      rating: 97
    },
    services: [
      {
        name: '普通陪玩',
        price: '¥55/hr',
        description: '1小时起订'
      },
      {
        name: '排位上分',
        price: '¥70/hr',
        description: '保证胜率'
      },
      {
        name: '教学指导',
        price: '¥90/hr',
        description: '一对一教学'
      }
    ]
  },
  {
    id: '4',
    name: '星尘之影',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3B6y6QZ9Wz5X7e6Q7f8g9h0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7',
    rating: 4.9,
    price: '¥65',
    tags: ['原神', '技术流'],
    description: '大家好，我是星尘之影，一名专业的原神陪玩。我擅长各种角色的操作和团队配合，有着丰富的游戏经验。我性格开朗，善于沟通，能够为你提供愉快的游戏体验。',
    stats: {
      hours: '2,000+',
      orders: 456,
      rating: 98
    },
    services: [
      {
        name: '普通陪玩',
        price: '¥65/hr',
        description: '1小时起订'
      },
      {
        name: '副本攻略',
        price: '¥85/hr',
        description: '专业指导'
      },
      {
        name: '教学指导',
        price: '¥105/hr',
        description: '一对一教学'
      }
    ]
  },
  {
    id: '5',
    name: '电竞小天才',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7',
    rating: 4.7,
    price: '¥50',
    tags: ['LOL', 'Valorant'],
    description: '大家好，我是电竞小天才，一名专业的MOBA游戏陪玩。我擅长多种位置，有着丰富的游戏经验和教学经验。我性格开朗，善于沟通，能够为你提供愉快的游戏体验。',
    stats: {
      hours: '1,500+',
      orders: 389,
      rating: 96
    },
    services: [
      {
        name: '普通陪玩',
        price: '¥50/hr',
        description: '1小时起订'
      },
      {
        name: '排位上分',
        price: '¥70/hr',
        description: '保证胜率'
      },
      {
        name: '教学指导',
        price: '¥90/hr',
        description: '一对一教学'
      }
    ]
  },
  {
    id: '6',
    name: '王者归来',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7',
    rating: 5.0,
    price: '¥70',
    tags: ['王者荣耀', '国服', '技术流'],
    description: '大家好，我是王者归来，一名专业的王者荣耀陪玩。我擅长各种位置，有着丰富的游戏经验和教学经验。我性格开朗，善于沟通，能够为你提供愉快的游戏体验。',
    stats: {
      hours: '3,000+',
      orders: 678,
      rating: 99
    },
    services: [
      {
        name: '普通陪玩',
        price: '¥70/hr',
        description: '1小时起订'
      },
      {
        name: '排位上分',
        price: '¥90/hr',
        description: '保证胜率'
      },
      {
        name: '教学指导',
        price: '¥120/hr',
        description: '一对一教学'
      }
    ]
  },
  {
    id: '7',
    name: '绝地求生大师',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7',
    rating: 4.8,
    price: '¥60',
    tags: ['绝地求生', '吃鸡', '技术流'],
    description: '大家好，我是绝地求生大师，一名专业的绝地求生陪玩。我擅长各种战术和团队配合，有着丰富的游戏经验。我性格开朗，善于沟通，能够为你提供愉快的游戏体验。',
    stats: {
      hours: '2,200+',
      orders: 498,
      rating: 97
    },
    services: [
      {
        name: '普通陪玩',
        price: '¥60/hr',
        description: '1小时起订'
      },
      {
        name: '吃鸡教学',
        price: '¥80/hr',
        description: '专业指导'
      },
      {
        name: '团队战术',
        price: '¥100/hr',
        description: '团队配合教学'
      }
    ]
  },
  {
    id: '8',
    name: '原神冒险家',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuF7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7',
    rating: 4.7,
    price: '¥55',
    tags: ['原神', '冒险', '探索'],
    description: '大家好，我是原神冒险家，一名专业的原神陪玩。我擅长探索和解谜，有着丰富的游戏经验。我性格开朗，善于沟通，能够为你提供愉快的游戏体验。',
    stats: {
      hours: '1,800+',
      orders: 423,
      rating: 96
    },
    services: [
      {
        name: '普通陪玩',
        price: '¥55/hr',
        description: '1小时起订'
      },
      {
        name: '探索指导',
        price: '¥75/hr',
        description: '专业探索'
      },
      {
        name: '角色培养',
        price: '¥95/hr',
        description: '角色培养指导'
      }
    ]
  }
]

// 用户信息数据
export const mockUser = {
  id: '123456789',
  name: '我的账号',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoBTc_5bZuXQ8l_u2UKFazkITvVt5UY-tB83GE9qFMKnbb7Gz7DBuHH11MCcfExFpNociu2AurEP9Lt2NRc9nvSntdZ9hgcWNL_d-0yyyC7bLbO0F8qFUi1FZ_0xgHBG5ZWEfyBs3f5BMl_rBN4SHJoDd3xp76P8kx7eQBwXzcI46GuMySscFwGrnXs_YK9_ArHQEUVcsZUe0o_yRl84Nf4j3WwXor_Xd2gFFDgNuPdbSQuyQiPQkAovGTm7Cek_vM2ZGapACwBM4',
  stats: {
    following: 12,
    followers: 34,
    orders: 56,
    favorites: 78
  }
}

// 订单数据
export const mockOrders = [
  {
    id: '1001',
    playmateName: '林间小鹿',
    playmateAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWd42wRhAneFPqDBu00-X6zV_3VmT3LwRUFe1rO4eEyOa-IDEPhh1HH7x2WWdyarjgr_4WzatpsdpqaJXJlMRwo9dtnaBbaYDQBj0-oao709scndaRZifLRuzJRgNVcSzd8XsuGJ-4uBbEUbdAlWFQz_6HkFw-AT6QvtHY4sIV4zpurtJ13FIBZJw5DYnKUc0lTPGLItY507UIdcj7nBxJ2WZ7zMMYQN6FvTlEsX9vRQQ51tpjD9-9ylRac-P1jqyPFi7WtKf__I',
    service: '普通陪玩',
    price: '¥45',
    hours: 2,
    total: '¥90',
    status: '已完成',
    date: '2026-03-20'
  },
  {
    id: '1002',
    playmateName: '影子猎手',
    playmateAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAkokFDlJJU2ut7ADXOxXgokfLf-nFbve3PmdniZPK8ZjoxO1reJWexxqbxEwDy4thsHQWxI68ySeYsam7yLDI2EWIKoa7no1yZya_-OvKHcnsOU5ukziXluccC3dUHzW8BMFTNlh6bLkgI8bMSDhUTMaTR2jWDsFNRzAKs9RzZ11om4Ki5c9Xj92fIm685lMzUrq9Bk1QuG6y3TXwjzpc6HZVTEFv-aZfUUXt5s020g03CNeOFTD-_F8HtoWP1VEGiCAo5k4gC9o',
    service: '排位上分',
    price: '¥80',
    hours: 3,
    total: '¥240',
    status: '已完成',
    date: '2026-03-18'
  },
  {
    id: '1003',
    playmateName: '安妮喵呜',
    playmateAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDI76aOeylc3VRSRNZ04zYnjdju83SPGLpYh8d2uB5bogOv5w6wJcvfx6AJMDR5RQKBUrAlNQptRHNf3XJ61WGVmFOAc3-gFksvrlt6w6F_TaBfQ6Mij2zaM_KjWfcqlVkL82KYbgijsqdy-ptNMAsnQRBVHpqk2dGVjd6UsWwcuOnY9ToQPlAZwJXaT0sdGvDFkoLuAn_IIt1cP9aJJ9LXF0dXPKQK0bAJi57JnH1pgIKL4F5lFuQICzWqRy0VNT1R6BfwuOFvKg',
    service: '教学指导',
    price: '¥90',
    hours: 1,
    total: '¥90',
    status: '已完成',
    date: '2026-03-15'
  }
]

// Mock数据服务
export const mockService = {
  // 获取热门游戏
  getGames: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockGames)
      }, 300)
    })
  },
  
  // 获取陪玩列表
  getPlaymates: (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          list: mockPlaymates,
          total: mockPlaymates.length
        })
      }, 300)
    })
  },
  
  // 获取陪玩详情
  getPlaymateDetail: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const playmate = mockPlaymates.find(p => p.id === id)
        if (playmate) {
          resolve(playmate)
        } else {
          reject(new Error('陪玩不存在'))
        }
      }, 300)
    })
  },
  
  // 搜索陪玩
  searchPlaymates: (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = mockPlaymates
        if (params.keyword) {
          filtered = mockPlaymates.filter(p => 
            p.name.includes(params.keyword) || 
            p.tags.some(tag => tag.includes(params.keyword))
          )
        }
        resolve({
          list: filtered,
          total: filtered.length
        })
      }, 300)
    })
  },
  
  // 获取用户信息
  getUserInfo: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUser)
      }, 300)
    })
  },
  
  // 获取订单列表
  getOrders: (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          list: mockOrders,
          total: mockOrders.length
        })
      }, 300)
    })
  }
}

export default mockService
