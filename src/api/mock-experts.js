import { mockPlaymates } from './mock-playmates.js'

export function mockGetExpertDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const expert = mockPlaymates.find(p => p.id === id) || mockPlaymates[0]
      resolve({
        success: true,
        data: {
          ...expert,
          level: 45,
          title: '王者荣耀 · 荣耀之巅',
          description: '5年游戏经验，擅长打野和上单，曾获多个比赛冠军。',
          stats: {
            winRate: 85,
            followers: 12000,
            rating: 4.9
          },
          skills: [
            {
              id: 1,
              name: '王者荣耀',
              price: 45,
              level: '钻石',
              description: '排位赛/巅峰赛'
            },
            {
              id: 2,
              name: '语音连麦',
              price: 30,
              level: '专业',
              description: '聊天/指导/开黑'
            }
          ],
          voiceIntroduction: {
            url: '',
            duration: '00:15'
          },
          reviews: [
            {
              id: 1,
              user: {
                name: '小明',
                avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar&size=256x256'
              },
              rating: 5,
              content: '非常专业，带我上了很多分，会继续找他。',
              date: '2026-03-20',
              images: []
            },
            {
              id: 2,
              user: {
                name: '小红',
                avatar: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar%20female&size=256x256'
              },
              rating: 4,
              content: '技术不错，人也很幽默，推荐！',
              date: '2026-03-19',
              images: []
            }
          ]
        }
      })
    }, 300)
  })
}

export function mockFollowExpert(expertId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '关注成功'
      })
    }, 300)
  })
}

export function mockUnfollowExpert(expertId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '取消关注成功'
      })
    }, 300)
  })
}

export function mockGetExpertReviews(expertId, page = 1, pageSize = 10) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          reviews: [
            {
              id: 1,
              user: {
                name: '小明',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              rating: 5,
              content: '非常专业，带我上了很多分，会继续找他。',
              date: '2026-03-20',
              images: []
            },
            {
              id: 2,
              user: {
                name: '小红',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
              },
              rating: 4,
              content: '技术不错，人也很幽默，推荐！',
              date: '2026-03-19',
              images: []
            }
          ],
          pagination: {
            currentPage: page,
            totalPages: 5,
            totalCount: 50
          }
        }
      })
    }, 400)
  })
}

export function mockGetExpertVoice(expertId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          voiceUrl: 'https://example.com/voice.mp3',
          duration: 120,
          waveform: [0.1, 0.3, 0.5, 0.7, 0.9, 0.7, 0.5, 0.3, 0.1]
        }
      })
    }, 300)
  })
}
