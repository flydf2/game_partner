export function mockLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password) {
        resolve({
          success: true,
          data: {
            token: 'mock_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
            user: {
              id: '1000001',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              nickname: '游戏达人',
              vipLevel: 3
            }
          }
        })
      } else {
        reject({
          success: false,
          message: '用户名或密码错误'
        })
      }
    }, 500)
  })
}

export function mockRegister(userData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userData.username && userData.password && userData.phone) {
        resolve({
          success: true,
          data: {
            token: 'mock_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
            user: {
              id: '1000002',
              avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
              nickname: userData.username,
              vipLevel: 1
            }
          }
        })
      } else {
        reject({
          success: false,
          message: '注册信息不完整'
        })
      }
    }, 500)
  })
}

export function mockUpdateProfile(profileData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          ...profileData,
          updatedAt: new Date().toISOString()
        }
      })
    }, 300)
  })
}

export function mockUpdateSettings(settings) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: settings
      })
    }, 300)
  })
}

export function mockGetSettings() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          language: 'zh-CN',
          timezone: 'Asia/Shanghai',
          notification: {
            email: true,
            sms: true,
            push: true
          },
          privacy: {
            profileVisible: true,
            showAge: false,
            showGender: false
          }
        }
      })
    }, 200)
  })
}

export function mockLogout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '退出登录成功'
      })
    }, 300)
  })
}

export function mockRefreshToken(refreshToken) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          token: 'mock_token_refreshed_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now()
        }
      })
    }, 500)
  })
}

export function mockSendSmsCode(phone) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '验证码发送成功'
      })
    }, 500)
  })
}
