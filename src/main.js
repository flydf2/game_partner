import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useTheme } from './composables/useTheme'
import { useUserStore } from './stores/user'

// 初始化主题
const { initTheme } = useTheme()
initTheme()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// 多标签页登录状态同步
window.addEventListener('storage', (event) => {
  if (event.key === 'token' || event.key === 'gamepartner_user' || event.key === 'refresh_token') {
    const userStore = useUserStore()
    
    if (event.key === 'token' && !event.newValue) {
      // token被清除，跳转到登录页面
      if (router.currentRoute.value.meta.requireAuth) {
        router.push('/login')
      }
      // 更新store状态
      userStore.userInfo = null
      userStore.isLoggedIn = false
      userStore.tokenExpiry = null
      userStore.refreshToken = null
    } else if (event.key === 'gamepartner_user') {
      // 用户信息变化，更新store
      try {
        const userInfo = event.newValue ? JSON.parse(event.newValue) : null
        userStore.userInfo = userInfo
        userStore.isLoggedIn = !!localStorage.getItem('token')
      } catch (error) {
        console.error('Failed to parse user info from storage:', error)
      }
    } else if (event.key === 'refresh_token') {
      // 刷新token变化，更新store
      userStore.refreshToken = event.newValue
    }
  }
})
