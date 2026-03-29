import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('../views/Discover.vue'),
    meta: {
      title: '发现',
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: () => import('../views/SearchResults.vue'),
    meta: {
      title: '寻找队友',
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('../views/Leaderboard.vue'),
    meta: {
      title: '大神排行',
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/leaderboard/:id',
    name: 'LeaderboardDetail',
    component: () => import('../views/LeaderboardDetail.vue'),
    meta: {
      title: '排行详情',
      headerType: 'detail'
    }
  },

  {
    path: '/filter',
    name: 'Filter',
    component: () => import('../views/Filter.vue'),
    meta: {
      title: '筛选',
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/game-categories',
    name: 'GameCategories',
    component: () => import('../views/GameCategories.vue'),
    meta: {
      title: '游戏分类',
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('../views/Community.vue'),
    meta: {
      title: '社区动态',
      keepAlive: true,
      headerType: 'list'
    }
  },

  {
    path: '/topic/:id',
    name: 'TopicDetail',
    component: () => import('../views/TopicDetail.vue'),
    meta: {
      title: '话题详情',
      headerType: 'detail'
    }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('../views/PostDetail.vue'),
    meta: {
      title: '帖子详情',
      headerType: 'detail'
    }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../views/Notifications.vue'),
    meta: {
      title: '通知',
      requireAuth: true,
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../views/Messages.vue'),
    meta: {
      title: '消息',
      requireAuth: true,
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/chat/:id',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
    meta: {
      title: '聊天',
      requireAuth: true,
      noBottomNav: true,
      headerType: 'detail'
    }
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: () => import('../views/CreatePost.vue'),
    meta: {
      title: '发布动态',
      requireAuth: true,
      noBottomNav: true,
      headerType: 'detail'
    }
  },
  {
    path: '/reward',
    name: 'RewardSquare',
    component: () => import('../views/RewardSquare.vue'),
    meta: {
      title: '悬赏广场',
      requireAuth: true,
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/reward/publish',
    name: 'RewardOrderPublish',
    component: () => import('../views/RewardOrderPublish.vue'),
    meta: {
      title: '发布悬赏',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/reward/:id',
    name: 'RewardOrderDetail',
    component: () => import('../views/RewardOrderDetail.vue'),
    meta: {
      title: '悬赏详情',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/reward/:id/confirm',
    name: 'RewardOrderConfirm',
    component: () => import('../views/RewardOrderConfirm.vue'),
    meta: {
      title: '确认订单',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/reward/:id/payment',
    name: 'RewardOrderPayment',
    component: () => import('../views/RewardOrderPayment.vue'),
    meta: {
      title: '支付托管金',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/reward/:id/review',
    name: 'RewardOrderReview',
    component: () => import('../views/RewardOrderReview.vue'),
    meta: {
      title: '评价服务',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/reward/:id/status',
    name: 'RewardOrderStatus',
    component: () => import('../views/RewardOrderStatus.vue'),
    meta: {
      title: '抢单状态',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/grab-order/:id',
    name: 'GrabOrder',
    component: () => import('../views/GrabOrder.vue'),
    meta: {
      title: '抢单确认',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/grab-order/:id/success',
    name: 'GrabOrderSuccess',
    component: () => import('../views/GrabOrderSuccess.vue'),
    meta: {
      title: '抢单成功',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/grab-order/:id/detail',
    name: 'GrabOrderDetail',
    component: () => import('../views/GrabOrderDetail.vue'),
    meta: {
      title: '抢单详情',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/my-grab-orders',
    name: 'MyGrabOrders',
    component: () => import('../views/MyGrabOrders.vue'),
    meta: {
      title: '我的抢单',
      requireAuth: true,
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue'),
    meta: {
      title: '我的订单',
      requireAuth: true,
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('../views/OrderDetail.vue'),
    meta: {
      title: '订单详情',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/confirm-order',
    name: 'ConfirmOrder',
    component: () => import('../views/ConfirmOrder.vue'),
    meta: {
      title: '确认订单',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/payment-success',
    name: 'PaymentSuccess',
    component: () => import('../views/PaymentSuccess.vue'),
    meta: {
      title: '支付成功',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/review-service/:orderId',
    name: 'ReviewService',
    component: () => import('../views/ReviewService.vue'),
    meta: {
      title: '评价服务',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/expert/:id',
    name: 'ExpertDetail',
    component: () => import('../views/ExpertDetail.vue'),
    meta: {
      title: '大神详情',
      keepAlive: false,
      headerType: 'detail'
    }
  },
  {
    path: '/expert-certification',
    name: 'ExpertCertification',
    component: () => import('../views/ExpertCertification.vue'),
    meta: {
      title: '大神认证',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/expert-certification/upload',
    name: 'ExpertCertificationUpload',
    component: () => import('../views/ExpertCertificationUpload.vue'),
    meta: {
      title: '上传截图',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/expert-certification/voice',
    name: 'ExpertCertificationVoice',
    component: () => import('../views/ExpertCertificationVoice.vue'),
    meta: {
      title: '录制语音',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/expert-verification',
    name: 'ExpertVerification',
    component: () => import('../views/ExpertVerification.vue'),
    meta: {
      title: '大神认证',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      title: '个人中心',
      requireAuth: true,
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: () => import('../views/ProfileEdit.vue'),
    meta: {
      title: '编辑资料',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/level',
    name: 'ProfileLevel',
    component: () => import('../views/ProfileLevel.vue'),
    meta: {
      title: '我的段位',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/skills',
    name: 'Skills',
    component: () => import('../views/Skills.vue'),
    meta: {
      title: '我的技能',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/wallet',
    name: 'Wallet',
    component: () => import('../views/Wallet.vue'),
    meta: {
      title: '我的钱包',
      requireAuth: true,
      headerType: 'detail'
    }
  },

  {
    path: '/withdrawal',
    name: 'Withdrawal',
    component: () => import('../views/Withdrawal.vue'),
    meta: {
      title: '收益提现',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/favorites',
    name: 'Favorites',
    component: () => import('../views/Favorites.vue'),
    meta: {
      title: '我的收藏',
      requireAuth: true,
      keepAlive: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/following',
    name: 'Following',
    component: () => import('../views/Following.vue'),
    meta: {
      title: '我的关注',
      requireAuth: true,
      keepAlive: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/history',
    name: 'BrowseHistory',
    component: () => import('../views/BrowseHistory.vue'),
    meta: {
      title: '浏览历史',
      requireAuth: true,
      keepAlive: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/security',
    name: 'Security',
    component: () => import('../views/Security.vue'),
    meta: {
      title: '账号安全',
      requireAuth: true,
      keepAlive: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/security/password',
    name: 'PasswordChange',
    component: () => import('../views/PasswordChange.vue'),
    meta: {
      title: '修改密码',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/security/phone',
    name: 'PhoneBind',
    component: () => import('../views/PhoneBind.vue'),
    meta: {
      title: '手机绑定',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/security/email',
    name: 'EmailBind',
    component: () => import('../views/EmailBind.vue'),
    meta: {
      title: '邮箱绑定',
      requireAuth: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/privacy',
    name: 'Privacy',
    component: () => import('../views/Privacy.vue'),
    meta: {
      title: '隐私设置',
      requireAuth: true,
      keepAlive: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: '设置',
      requireAuth: true,
      keepAlive: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/help',
    name: 'Help',
    component: () => import('../views/Help.vue'),
    meta: {
      title: '帮助与客服',
      requireAuth: true,
      keepAlive: true,
      headerType: 'detail'
    }
  },
  {
    path: '/profile/my-published',
    name: 'MyPublished',
    component: () => import('../views/MyPublished.vue'),
    meta: {
      title: '我的发布',
      requireAuth: true,
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/profile/my-reward-orders',
    name: 'MyRewardOrders',
    component: () => import('../views/MyRewardOrders.vue'),
    meta: {
      title: '我发布的悬赏',
      requireAuth: true,
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/profile/my-posts',
    name: 'MyPosts',
    component: () => import('../views/MyPosts.vue'),
    meta: {
      title: '我的动态',
      requireAuth: true,
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/user/:id/posts',
    name: 'UserPosts',
    component: () => import('../views/UserPosts.vue'),
    meta: {
      title: '用户动态',
      keepAlive: true,
      headerType: 'list'
    }
  },
  {
    path: '/appeals',
    name: 'Appeals',
    component: () => import('../views/Appeals.vue'),
    meta: {
      title: '我的申诉',
      requireAuth: true,
      keepAlive: true,
      headerType: 'detail'
    }
  },

  {
    path: '/user-agreement',
    name: 'UserAgreement',
    component: () => import('../views/UserAgreement.vue'),
    meta: {
      title: '用户服务协议',
      headerType: 'detail'
    }
  },
  {
    path: '/about-us',
    name: 'AboutUs',
    component: () => import('../views/AboutUs.vue'),
    meta: {
      title: '关于我们',
      headerType: 'detail'
    }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('../views/Feedback.vue'),
    meta: {
      title: '意见反馈',
      headerType: 'detail'
    }
  },
  {
    path: '/api-test',
    name: 'ApiTest',
    component: () => import('../views/ApiTest.vue'),
    meta: {
      title: 'API 调试',
      headerType: 'detail'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录',
      guest: true,
      headerType: 'detail'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      title: '注册',
      guest: true,
      headerType: 'detail'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
    meta: {
      title: '忘记密码',
      guest: true,
      headerType: 'detail'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      headerType: 'detail'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 阳关陪玩` : '阳关陪玩'
  
  const isAuthenticated = checkAuth()
  const requireAuth = to.meta.requireAuth
  const guestOnly = to.meta.guest
  
  console.log('路由守卫:', {
    to: to.path,
    requireAuth,
    isAuthenticated,
    guestOnly
  })
  
  if (requireAuth && !isAuthenticated) {
    console.log('需要认证，重定向到登录页面')
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if (guestOnly && isAuthenticated) {
    console.log('已认证，重定向到首页')
    next({ name: 'Home' })
  } else {
    console.log('继续导航')
    next()
  }
})

function checkAuth() {
  const token = localStorage.getItem('token')
  console.log('检查认证状态，token:', !!token)
  return !!token
}

export default router
