<template>
  <div class="min-h-screen bg-surface font-body text-on-surface selection:bg-primary-container">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- BottomNavBar - 除特定页面外都显示 -->
    <BottomNavBar v-if="showBottomNav" />
    
    <!-- FAB (Floating Action Button) -->

    <!-- Sidebar -->
    <Sidebar />

    <!-- Toast -->
    <Toast 
      v-for="toast in toasts" 
      :key="toast.id"
      :show="true"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      :button-text="toast.buttonText"
      :button-action="toast.buttonAction"
    />

    <!-- MessageModal -->
    <MessageModal
      v-for="modal in modals"
      :key="modal.id"
      :show="modal.visible"
      :title="modal.title"
      :message="modal.message"
      :type="modal.type"
      :confirm-text="modal.confirmText"
      :cancel-text="modal.cancelText"
      :show-cancel="modal.showCancel"
      :confirm-button-class="modal.confirmButtonClass"
      @confirm="handleModalConfirm(modal.id)"
      @cancel="handleModalCancel(modal.id)"
      @close="handleModalClose(modal.id)"
    />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addRequestInterceptor, addResponseInterceptor } from './api/index.js'
import { useUserStore } from './stores/user.js'
import { useToast } from './composables/useToast.js'
import { useModal } from './composables/useModal.js'
import Toast from './components/common/Toast.vue'
import MessageModal from './components/common/MessageModal.vue'
import BottomNavBar from './components/BottomNavBar.vue'
import Sidebar from './components/Sidebar.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { showToast, toasts } = useToast()
const { modals, handleConfirm: modalConfirm, handleCancel: modalCancel, handleClose: modalClose } = useModal()

const showBottomNav = computed(() => !route.meta.noBottomNav)

const handleModalConfirm = (id) => {
  modalConfirm(id)
}

const handleModalCancel = (id) => {
  modalCancel(id)
}

const handleModalClose = (id) => {
  modalClose(id)
}

addRequestInterceptor(async (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

addResponseInterceptor(async ({ response, data }) => {
  if (!response.ok) {
    if (response.status === 401) {
      userStore.logout()
      showToast('登录已过期，请重新登录', 'error')
      router.push('/login')
    }
    throw new Error(data.message || `请求失败: ${response.status}`)
  }
  return data
})

onMounted(() => {
  // 临时添加模拟登录，以便测试需要认证的页面
  if (!localStorage.getItem('token')) {
    userStore.mockLogin()
  }
  userStore.checkAuth()
})
</script>



<style scoped>
/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
