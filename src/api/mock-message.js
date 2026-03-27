export function mockGetMessages() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 1,
            userId: '1',
            userName: '林间小鹿',
            userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWd42wRhAneFPqDBu00-X6zV_3VmT3LwRUFe1rO4eEyOa-IDEPhh1HH7x2WWdyarjgr_4WzatpsdpqaJXJlMRwo9dtnaBbaYDQBj0-oao709scndaRZifLRuzJRgNVcSzd8XsuGJ-4uBbEUbdAlWFQz_6HkFw-AT6QvtHY4sIV4zpurtJ13FIBZJw5DYnKUc0lTPGLItY507UIdcj7nBxJ2WZ7zMMYQN6FvTlEsX9vRQQ51tpjD9-9ylRac-P1jqyPFi7WtKf__I',
            lastMessage: '好的，晚上见！',
            lastTime: '2026-03-23 15:30',
            unread: 2
          },
          {
            id: 2,
            userId: '2',
            userName: '影子猎手',
            userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAkokFDlJJU2ut7ADXOxXgokfLf-nFbve3PmdniZPK8ZjoxO1reJWexxqbxEwDy4thsHQWxI68ySeYsam7yLDI2EWIKoa7no1yZya_-OvKHcnsOU5ukziXluccC3dUHzW8BMFTNlh6bLkgI8bMSDhUTMaTR2jWDsFNRzAKs9RzZ11om4Ki5c9Xj92fIm685lMzUrq9Bk1QuG6y3TXwjzpc6HZVTEFv-aZfUUXt5s020g03CNeOFTD-_F8HtoWP1VEGiCAo5k4gC9o',
            lastMessage: '今天有空吗？',
            lastTime: '2026-03-23 10:00',
            unread: 0
          }
        ]
      })
    }, 200)
  })
}

export function mockGetChatMessages(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          messages: [
            {
              id: 1,
              from: 'other',
              content: '哈喽，刚结束一局游戏。准备好开始我们的《绝地求生》了吗？',
              time: '2026-03-27 14:30'
            },
            {
              id: 2,
              from: 'self',
              content: '好哒，我也刚上线！这次一定要带我上分哦～',
              time: '2026-03-27 14:31'
            },
            {
              id: 3,
              from: 'other',
              content: '订单已经开好啦，付完款我们就发车 🚗',
              time: '2026-03-27 14:35'
            }
          ],
          chatPartner: {
            id: userId,
            name: '星野Kyo',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0rMSxxOfIFRKLK4fBL1gncTazgYO2RQGvS4t3yEQFNX7vGdSliuaSgQmP_SvAsxLZMQDhpvheEGfD8glXv94KmOUDlVZ04JHJUwmXBw3sUiPwFQfPZcSCCu7tTQdgfMO8CbiTGGDyU8SkLKLiVfdnu6WMeHSBX1J0dxB2z5F1xhqPepxmt0Y-kBdqMHuc6tqfRU62A-ybUp1_wQu7n8i0MmwohHAW0NrGk3aXhVcMJakGyPirIDE-hGsZUgv6-dnVemmf-XVVL-E',
            game: '绝地求生',
            skill: '技术陪练'
          },
          appointment: {
            id: 1,
            gameName: '绝地求生陪玩',
            description: '时长: 2小时 / 技术陪练',
            price: 158
          }
        }
      })
    }, 200)
  })
}

export function mockGetConversations() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 1,
            userId: '1',
            userName: '林间小鹿',
            userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWd42wRhAneFPqDBu00-X6zV_3VmT3LwRUFe1rO4eEyOa-IDEPhh1HH7x2WWdyarjgr_4WzatpsdpqaJXJlMRwo9dtnaBbaYDQBj0-oao709scndaRZifLRuzJRgNVcSzd8XsuGJ-4uBbEUbdAlWFQz_6HkFw-AT6QvtHY4sIV4zpurtJ13FIBZJw5DYnKUc0lTPGLItY507UIdcj7nBxJ2WZ7zMMYQN6FvTlEsX9vRQQ51tpjD9-9ylRac-P1jqyPFi7WtKf__I',
            lastMessage: '好的，晚上见！',
            lastTime: '2026-03-23 15:30',
            unread: 2,
            game: '绝地求生'
          },
          {
            id: 2,
            userId: '2',
            userName: '影子猎手',
            userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAkokFDlJJU2ut7ADXOxXgokfLf-nFbve3PmdniZPK8ZjoxO1reJWexxqbxEwDy4thsHQWxI68ySeYsam7yLDI2EWIKoa7no1yZya_-OvKHcnsOU5ukziXluccC3dUHzW8BMFTNlh6bLkgI8bMSDhUTMaTR2jWDsFNRzAKs9RzZ11om4Ki5c9Xj92fIm685lMzUrq9Bk1QuG6y3TXwjzpc6HZVTEFv-aZfUUXt5s020g03CNeOFTD-_F8HtoWP1VEGiCAo5k4gC9o',
            lastMessage: '今天有空吗？',
            lastTime: '2026-03-23 10:00',
            unread: 0,
            game: 'LOL'
          }
        ]
      })
    }, 200)
  })
}

export function mockArchiveConversation(conversationId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '归档成功'
      })
    }, 300)
  })
}

export function mockMarkConversationAsRead(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '标记成功'
      })
    }, 300)
  })
}
