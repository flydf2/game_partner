export const mockCommunityPosts = [
  {
    id: 1,
    user: {
      name: '林间风',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlkyk2DWoqAMqSUflUl265Ii7S--sjgKUnoHp_qkIK9uW4YWK4t57peM5UOx0i92fhird_hlkuwYjce1i1Ix_HS2QYkENbRjQQUHaf9k7KsxK7U_719an0BAAZY6q7T-oJ9O17vsi77mdMlksC6JbwPkj3JziYokPVUER-nDsZBSTTiMXrmSdKxN7ApaCB6R7rc1YLFHhTbIZVtrVpTZudIk6w8vA4jVA3Zusi4DRCceevuB13RK2Z6n3VYD-yhN22EmkUCuLdXxE',
      game: '英雄联盟'
    },
    time: '2小时前',
    content: '今天在峡谷遇到一个超级温柔的辅助，操作意识拉满！有人想一起组队排位吗？坐标艾欧尼亚，主玩AD。 ✨',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBU8XrMhk3VFwj3Ceer0yCVb-HelGKX5ryLoHAYthnekinYCfvHoJ83xSPEZdrL2tht2CTf_d1atj0kQiKVMY41s8kFOBgY2l5a9dPvoP6yXh3HyA9pdom7W1PkI1l7drYVsVSEeg-BnjsOK2tD_lvHVqzF3VZCAhg6pbcyZj11rhzX6V52RT4jlbNYqEKBRxP818vVewrnT3E6phVAdGXO9zQIWGaIvWWk6pXEzjpNwOh3xDn8FNjv-sGQOhsOt1srbfvB0MFCo-A',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBq4AH6Y7D9L3js3AeN_vpUSza4-PdEYsZbo6sLRP3jUY5UwegYPx3xB9NLMbxzijv13O-siVI5RljmMLqN_Gr5WevHBvslpJbeCO97PCdtgKwNIXBrfQfGanIkq-uktmkkEyoBN9MXdNEwYcjzTObAUzdyii37QkpNmj9bZP7Bcl5uaq012JA-ku0hKny8SxUd9oCA63jFafkb_YzLfo3nDoPbHw27pT7fpKdYQd2sZiXMQL7sMljpCn5eqqS3c5aJtgaLu6pHQpU'
    ],
    likes: 1200,
    comments: 348,
    isFollowing: false
  },
  {
    id: 2,
    user: {
      name: '小禾悠悠',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo3hiZMbuWCmrkmqDp0MNg-nzMlqn4AgGNgFofJ-IJJ59AeEGJZox-r1xg8drTN14GtBID78Yfm0NN6Wl-MX_ZHWaF8-LdFumF5to5bPc46yM5zIaucC3a4KP-Y2-i2tCwQd-duGHsg9F8AzLemDvG9s_6W3hw-pjjJN-PKkQI7oILcDHGkalxMkbZWOmaqIaik3owuV2Ghbrqr3MraHwibw8jkhxJWFQhPSpHM7em0RfJhdOUnqGVa3qBY2EA9DWUXnYNrTFFiM4',
      game: '原神'
    },
    time: '5小时前',
    content: '终于抽到雷电将军了！大家快来吸吸欧气，顺便问下配队方案，目前有行秋和班尼特。🌸',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDpMESPnsbi4t03wXNISsduDaneNSUQYy8CFJQ6WGwywyqmkUeGY562sFOkLCu6pFjjqqs0sbxMrg9JwqOHdCcO-aFFA3Uh2XcpKXedBl_JMAAdIZ19iCVx6GQyYCwO0zuk9xRpZOHHqzfIgD7XyQBa6MYkyr_AyukGeEUUYDV7giFJThyUVuogxAZZYyU6SgGNT62RNNxPFRg1-urZjonnT0y8Zh-OZyb_7b7dlBnbONQqjw2jCO-qEHaONKJ-0zPtkTmZXZzvCrc'
    ],
    likes: 856,
    comments: 120,
    isNew: true
  },
  {
    id: 3,
    user: {
      name: 'Ace玩家',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwJXWYv1t2M1S8jlZ3nJwEK4xXnZfwXDgO_ryYTFAAPD3NJ6pmTUhpeJsra6qrl4sekbm3zZ7874XLIqf6W__ReW-xU87woTXwpcGzN5Q3b-1FAHT-7Q9ZJvEhBpGxJwr8JPIoII8MLGmKtsx2rIr1BNvzlerT6UrU1DTTnRE1vevhiuXzR1drRXXUNZdGjDRSQmxQUYJwpOCdchivrmLpaAcpR5c8eCBholl_o0fI_vrf4Lu_oTTxHGoqzJuNdhfVVbxvwguDqZQ',
      game: '绝地求生'
    },
    time: '昨天',
    content: '"今晚吃鸡，大吉大利！" 🍗\n好久没这么酣畅淋漓地打过药包了，感谢各位队友的灵性拉枪。',
    images: [],
    likes: 233,
    comments: 42
  }
]

export function mockGetCommunityPosts(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          data: mockCommunityPosts,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: mockCommunityPosts.length
          }
        },
        msg: '获取成功'
      })
    }, 300)
  })
}

export function mockCreatePost(postData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          ...postData,
          id: Date.now(),
          time: '刚刚',
          likes: 0,
          comments: 0,
          user: {
            name: '游戏达人',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            game: '王者荣耀'
          }
        }
      })
    }, 500)
  })
}
