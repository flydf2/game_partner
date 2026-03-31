<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import api from '../api/index.js'

const router = useRouter()

const applications = ref([])
const loading = ref(true)
const error = ref(null)
const playingVoice = ref(null)
const showImagePreview = ref(false)
const previewImages = ref([])
const previewImageIndex = ref(0)

let audioElement = null

const loadApplications = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await api.expertVerification.getMyApplications()
    console.info('applicationsRes', response)

    if (response.success) {
      applications.value = response.data.map(app => ({
        id: app.id,
        userId: app.userId,
        gameId: app.gameId,
        gameName: app.gameName,
        gameIcon: app.gameIcon,
        rank: app.rank,
        positions: app.positions,
        screenshots: app.screenshots,
        voiceUrl: app.voiceUrl,
        status: app.status,
        reason: app.reason,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt
      }))
    } else {
      error.value = '获取申请列表失败'
    }
  } catch (err) {
    error.value = '加载失败'
    console.error('加载专家认证申请失败:', err)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
}

const handleApply = () => {
  router.push('/expert-verification')
}

const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700'
    case 'rejected':
      return 'bg-red-100 text-red-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'approved':
      return 'check_circle'
    case 'rejected':
      return 'cancel'
    case 'pending':
      return 'hourglass_empty'
    default:
      return 'help'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openImagePreview = (images, index) => {
  previewImages.value = images
  previewImageIndex.value = index
  showImagePreview.value = true
}

const closeImagePreview = () => {
  showImagePreview.value = false
}

const playVoice = (url) => {
  if (!audioElement) {
    audioElement = new Audio()
  }
  if (playingVoice.value === url && !audioElement.paused) {
    audioElement.pause()
    playingVoice.value = null
  } else {
    audioElement.src = url
    audioElement.play()
    playingVoice.value = url
    audioElement.onended = () => {
      playingVoice.value = null
    }
  }
}

const cancelApplication = async (app) => {
  if (!confirm('确定要撤销该申请吗？')) return
  
  try {
    const response = await api.expertVerification.cancelApplication(app.id)
    if (response.success) {
      await loadApplications()
    } else {
      alert(response.message || '撤销失败')
    }
  } catch (err) {
    console.error('撤销申请失败:', err)
    alert('撤销失败，请稍后重试')
  }
}

const canCancel = (status) => {
  return status === 'pending'
}

onMounted(() => {
  loadApplications()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-background pb-20">
    <AppHeader
      title="我的专家认证申请"
      :show-back="true"
      @back="handleBack"
    />

    <main class="page-content pt-16 space-y-6 px-4">
      <!-- Applications List -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-on-surface">申请记录</h2>
          <button
            @click="handleApply"
            class="flex items-center gap-1 text-primary text-sm font-medium"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            新增申请
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-3">
          <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p class="text-on-surface-variant text-sm">加载中...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-error-container rounded-xl p-4 text-center">
          <p class="text-error text-sm">{{ error }}</p>
          <button @click="loadApplications" class="mt-2 text-primary text-sm font-medium">
            点击重试
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="applications.length === 0" class="bg-surface-container-low rounded-xl p-8 flex flex-col items-center gap-3">
          <span class="material-symbols-outlined text-4xl text-outline">assignment</span>
          <p class="text-on-surface-variant text-sm">暂无申请记录</p>
          <button
            @click="handleApply"
            class="px-6 py-2 bg-primary-container text-primary rounded-full text-sm font-bold"
          >
            立即申请
          </button>
        </div>

        <!-- Applications -->
        <div v-else class="space-y-4">
          <div
            v-for="app in applications"
            :key="app.id"
            class="bg-surface-container-low rounded-xl overflow-hidden space-y-4"
          >
            <!-- Header -->
            <div class="flex items-start gap-3 p-4">
              <div class="w-14 h-14 rounded-xl bg-surface-container-highest overflow-hidden flex items-center justify-center">
                <img
                  v-if="app.gameIcon"
                  :src="app.gameIcon"
                  :alt="app.gameName"
                  class="w-full h-full object-cover"
                />
                <span v-else class="material-symbols-outlined text-on-surface-variant">sports_esports</span>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p class="font-bold text-on-surface text-lg">{{ app.gameName || '未知游戏' }}</p>
                    <p class="text-sm text-on-surface-variant">段位：{{ app.rank }}</p>
                    <p v-if="app.positions" class="text-sm text-on-surface-variant">位置：{{ app.positions }}</p>
                  </div>
                  <span :class="[
                    'px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1',
                    getStatusColor(app.status)
                  ]">
                    <span class="material-symbols-outlined text-sm">{{ getStatusIcon(app.status) }}</span>
                    {{ app.status === 'pending' ? '审核中' : app.status === 'approved' ? '已通过' : app.status === 'rejected' ? '已拒绝' : app.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Screenshots -->
            <div v-if="app.screenshots" class="px-4">
              <p class="text-xs text-on-surface-variant mb-2">段位截图</p>
              <div class="flex gap-2 overflow-x-auto pb-2">
                <img
                  v-for="(screenshot, idx) in app.screenshots.split(',')"
                  :key="idx"
                  :src="screenshot.trim()"
                  class="w-24 h-32 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80"
                  @click="openImagePreview(app.screenshots.split(',').map(s => s.trim()), idx)"
                />
              </div>
            </div>

            <!-- Voice -->
            <div v-if="app.voiceUrl" class="px-4 pb-4">
              <p class="text-xs text-on-surface-variant mb-2">语音介绍</p>
              <div
                @click="playVoice(app.voiceUrl)"
                class="flex items-center gap-3 bg-surface-container-high rounded-xl p-3 cursor-pointer hover:bg-surface-container-highest transition-colors"
              >
                <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">
                    {{ playingVoice === app.voiceUrl ? 'pause' : 'play_arrow' }}
                  </span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-on-surface">语音介绍</p>
                  <p class="text-xs text-on-surface-variant">点击播放</p>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant">volume_up</span>
              </div>
            </div>

            <!-- Reason -->
            <div v-if="app.reason" class="px-4 pb-4">
              <div class="text-xs text-error bg-error-container/30 rounded-lg p-3">
                <p class="font-medium mb-1">拒绝原因：</p>
                <p>{{ app.reason }}</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-4 py-3 bg-surface-container-highest/50 flex items-center justify-between">
              <span class="text-xs text-on-surface-variant">申请时间：{{ formatDate(app.createdAt) }}</span>
              <button
                v-if="canCancel(app.status)"
                @click.stop="cancelApplication(app)"
                class="px-3 py-1 text-xs text-error hover:bg-error-container/30 rounded-full transition-colors"
              >
                撤销申请
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <BottomNavBar />

    <!-- Image Preview Modal -->
    <div v-if="showImagePreview" class="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center" @click.self="closeImagePreview">
      <button
        @click="closeImagePreview"
        class="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-white">close</span>
      </button>
      <button
        v-if="previewImageIndex > 0"
        @click="previewImageIndex--"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-white">chevron_left</span>
      </button>
      <button
        v-if="previewImageIndex < previewImages.length - 1"
        @click="previewImageIndex++"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-white">chevron_right</span>
      </button>
      <img
        :src="previewImages[previewImageIndex]"
        class="max-w-[90%] max-h-[80vh] object-contain"
        @click.stop
      />
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
        {{ previewImageIndex + 1 }} / {{ previewImages.length }}
      </div>
    </div>
  </div>
</template>