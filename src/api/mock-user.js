import { mockPlaymates } from './mock-playmates.js'

export function mockGetUserInfo() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          nickname: '游戏达人',
          vipLevel: 3,
          id: '1000001',
          balance: 1280.50,
          couponCount: 5
        }
      })
    }, 200)
  })
}

export function mockGetFollowing() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockPlaymates.slice(0, 4)
      })
    }, 200)
  })
}

export function mockFollowUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '关注成功'
      })
    }, 300)
  })
}

export function mockUnfollowUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '取消关注成功'
      })
    }, 300)
  })
}

export function mockRemoveFavorite(favoriteId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '取消收藏成功'
      })
    }, 300)
  })
}

export function mockRecharge(rechargeData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '充值成功',
        data: {
          transactionId: Date.now(),
          coinsAdded: rechargeData.coins,
          balance: 1280 + rechargeData.coins
        }
      })
    }, 1000)
  })
}
