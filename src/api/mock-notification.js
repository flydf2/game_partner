export function mockMarkNotificationRead(notificationId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '标记成功'
      })
    }, 200)
  })
}

export function mockMarkAllNotificationsRead() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '全部标记成功'
      })
    }, 200)
  })
}

export function mockGetNotifications() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 1,
            type: 'order',
            title: '订单状态更新',
            content: '您的订单 #1001 已完成',
            time: '2026-03-23 14:30',
            read: false,
            orderId: '1001'
          },
          {
            id: 2,
            type: 'system',
            title: '系统通知',
            content: '您关注的"星野 Kyo"开始接单了',
            time: '2026-03-23 12:00',
            read: false
          },
          {
            id: 3,
            type: 'promotion',
            title: '优惠活动',
            content: '新人专享首单优惠，立减10元',
            time: '2026-03-22 10:00',
            read: true
          },
          {
            id: 4,
            type: 'message',
            title: '新消息',
            content: '林间小鹿 给您发送了一条消息',
            time: '2026-03-21 18:00',
            read: true
          }
        ]
      })
    }, 200)
  })
}

export function mockGetUnreadCount() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          unreadCount: 2
        }
      })
    }, 200)
  })
}
