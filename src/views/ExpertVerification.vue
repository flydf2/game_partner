<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import api from '../api/index.js'

const router = useRouter()

const currentStep = ref(1)
const games = ref([])
const selectedGame = ref(null)
const rank = ref('')
const selectedPositions = ref(['top'])
const screenshots = ref([])
const screenshotsUploading = ref([])
const voiceRecording = ref(null)
const voiceUploading = ref(false)
const isRecording = ref(false)
const recordingTime = ref(0)
const loading = ref(false)
const showGameSelector = ref(false)
const showImagePreview = ref(false)
const previewImageIndex = ref(0)

const positions = [
  { id: 'top', label: '上单' },
  { id: 'mid', label: '中单' },
  { id: 'jungle', label: '打野' },
  { id: 'adc', label: 'ADC' },
  { id: 'support', label: '辅助' }
]

let mediaRecorder = null
let audioChunks = []
let recordingTimer = null
let audioElement = null

const loadGames = async () => {
  loading.value = true
  try {
    const response = await api.expertVerification.getGames()
    if (response.success && response.data) {
      games.value = response.data.data??response.data
      if (games.value.length > 0 && !selectedGame.value) {
        selectedGame.value = games.value[0]
      }
    }
  } catch (err) {
    console.error('加载游戏列表失败:', err)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
}

const handleGameSelect = () => {
  showGameSelector.value = true
}

const selectGame = (game) => {
  selectedGame.value = game
  showGameSelector.value = false
}

const closeGameSelector = () => {
  showGameSelector.value = false
}

const handlePositionToggle = (positionId) => {
  const index = selectedPositions.value.indexOf(positionId)
  if (index > -1) {
    selectedPositions.value.splice(index, 1)
  } else {
    selectedPositions.value.push(positionId)
  }
}

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('图片大小不能超过10MB')
    return
  }

  const uploadIndex = screenshots.value.length
  screenshots.value.push({
    url: URL.createObjectURL(file),
    uploading: true,
    progress: 0
  })

  try {
    const response = await api.expertVerification.uploadScreenshot(file)
    if (response.success) {
      screenshots.value[uploadIndex] = {
        url: response.data.url,
        uploading: false,
        uploaded: true
      }
    } else {
      screenshots.value.splice(uploadIndex, 1)
      alert('上传失败：' + (response.message || '未知错误'))
    }
  } catch (err) {
    screenshots.value.splice(uploadIndex, 1)
    console.error('上传截图失败:', err)
    alert('上传失败，请稍后重试')
  }
}

const removeScreenshot = (index) => {
  screenshots.value.splice(index, 1)
}

const openImagePreview = (index) => {
  previewImageIndex.value = index
  showImagePreview.value = true
}

const closeImagePreview = () => {
  showImagePreview.value = false
}

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      voiceRecording.value = {
        blob: audioBlob,
        url: audioUrl,
        duration: recordingTime.value,
        uploading: false
      }
      
      stream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.start()
    isRecording.value = true
    recordingTime.value = 0
    
    recordingTimer = setInterval(() => {
      recordingTime.value++
      if (recordingTime.value >= 60) {
        stopRecording()
      }
    }, 1000)
  } catch (err) {
    console.error('无法访问麦克风:', err)
    alert('无法访问麦克风，请检查权限设置')
  }
}

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop()
    isRecording.value = false
    clearInterval(recordingTimer)
  }
}

const playVoice = () => {
  if (!voiceRecording.value) return
  
  if (!audioElement) {
    audioElement = new Audio(voiceRecording.value.url)
  }
  
  if (audioElement.paused) {
    audioElement.play()
  } else {
    audioElement.pause()
    audioElement.currentTime = 0
  }
}

const reRecord = () => {
  if (audioElement) {
    audioElement.pause()
    audioElement = null
  }
  voiceRecording.value = null
  recordingTime.value = 0
}

const uploadVoice = async () => {
  if (!voiceRecording.value || !voiceRecording.value.blob) return
  
  voiceUploading.value = true
  try {
    const response = await api.expertVerification.uploadVoice(voiceRecording.value.blob)
    if (response.success) {
      voiceRecording.value.uploaded = true
      voiceRecording.value.serverUrl = response.data.url
    } else {
      alert('语音上传失败：' + (response.message || '未知错误'))
    }
  } catch (err) {
    console.error('上传语音失败:', err)
    alert('语音上传失败，请稍后重试')
  } finally {
    voiceUploading.value = false
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handleSubmit = async () => {
  if (!selectedGame.value || !rank.value) {
    alert('请填写完整信息')
    return
  }
  
  if (screenshots.value.length === 0) {
    alert('请至少上传一张段位截图')
    return
  }
  
  if (!voiceRecording.value) {
    alert('请录制语音介绍')
    return
  }
  
  loading.value = true
  try {
    if (!voiceRecording.value.uploaded) {
      await uploadVoice()
    }
    
    const applicationData = {
      gameId: selectedGame.value.id,
      gameName: selectedGame.value.name,
      rank: rank.value,
      positions: selectedPositions.value,
      screenshots: screenshots.value.map(s => s.url),
      voiceUrl: voiceRecording.value.serverUrl || voiceRecording.value.url
    }
    
    const response = await api.expertVerification.submitApplication(applicationData)
    if (response.success) {
      alert('申请提交成功！')
      router.push('/expert-verification/list')
    } else {
      alert(response.message || '提交失败，请稍后重试')
    }
  } catch (err) {
    console.error('提交申请失败:', err)
    alert('提交失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleNotifications = () => {
  router.push('/notifications')
}

const handleSearch = () => {
  router.push('/search')
}

const handleProfile = () => {
  router.push('/profile')
}

const handleNextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const handlePrevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

onMounted(() => {
  loadGames()
})

onUnmounted(() => {
  if (recordingTimer) {
    clearInterval(recordingTimer)
  }
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop()
  }
  if (audioElement) {
    audioElement.pause()
  }
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-background pb-32">
    <AppHeader
      title="大神认证"
      :show-back="false"
      :show-menu="true"
      @menu="handleBack"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-16 space-y-8">
      <!-- Step Indicator -->
      <div class="flex items-center justify-between px-2">
        <div class="flex flex-col items-center gap-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
            currentStep >= 1 ? 'bg-primary-container text-primary' : 'bg-surface-container-highest text-on-surface-variant'
          ]">1</div>
          <span :class="[
            'text-[11px] font-bold',
            currentStep >= 1 ? 'text-primary' : 'text-on-surface-variant'
          ]">选择游戏</span>
        </div>
        <div :class="[
          'step-line flex-grow h-2 mx-2',
          currentStep >= 2 ? 'bg-primary-container/40' : 'bg-surface-container-high'
        ]"></div>
        <div class="flex flex-col items-center gap-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
            currentStep >= 2 ? 'bg-primary-container text-primary' : 'bg-surface-container-highest text-on-surface-variant'
          ]">2</div>
          <span :class="[
            'text-[11px] font-medium',
            currentStep >= 2 ? 'text-primary' : 'text-on-surface-variant'
          ]">上传截图</span>
        </div>
        <div :class="[
          'step-line flex-grow h-2 mx-2',
          currentStep >= 3 ? 'bg-primary-container/40' : 'bg-surface-container-high'
        ]"></div>
        <div class="flex flex-col items-center gap-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
            currentStep >= 3 ? 'bg-primary-container text-primary' : 'bg-surface-container-highest text-on-surface-variant'
          ]">3</div>
          <span :class="[
            'text-[11px] font-medium',
            currentStep >= 3 ? 'text-primary' : 'text-on-surface-variant'
          ]">录制语音</span>
        </div>
      </div>

      <!-- Form Section -->
      <div class="space-y-6">
        <!-- Step 1: Game Selection -->
        <div v-if="currentStep === 1" class="space-y-6">
          <!-- Game Selection -->
          <div class="space-y-3">
            <label class="text-sm font-bold text-on-surface flex items-center gap-2">
              申请游戏
              <span class="text-error text-xs">*</span>
            </label>
            <div @click="handleGameSelect" class="bg-surface-container-low p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors">
              <div v-if="loading" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span class="font-bold text-on-surface-variant">加载中...</span>
              </div>
              <div v-else-if="selectedGame" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center overflow-hidden">
                  <img :alt="selectedGame.name" class="w-full h-full object-cover" :src="selectedGame.icon" />
                </div>
                <span class="font-bold text-on-surface">{{ selectedGame.name }}</span>
              </div>
              <div v-else class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <span class="material-symbols-outlined text-on-surface-variant">sports_esports</span>
                </div>
                <span class="font-bold text-on-surface-variant">请选择游戏</span>
              </div>
              <span class="material-symbols-outlined text-outline">expand_more</span>
            </div>
          </div>

          <!-- Rank Input -->
          <div class="space-y-3">
            <label class="text-sm font-bold text-on-surface flex items-center gap-2">
              当前段位
              <span class="text-error text-xs">*</span>
            </label>
            <input
              v-model="rank"
              class="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary-container transition-all"
              placeholder="例如：至尊星耀 I"
              type="text"
            />
          </div>

          <!-- Position Selection -->
          <div class="space-y-3">
            <label class="text-sm font-bold text-on-surface flex items-center gap-2">
              擅长位置
              <span class="text-on-surface-variant text-xs font-normal">（可多选）</span>
            </label>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="position in positions"
                :key="position.id"
                @click="handlePositionToggle(position.id)"
                :class="[
                  'px-5 py-2.5 rounded-full font-bold text-sm border-none transition-all active:scale-95',
                  selectedPositions.includes(position.id)
                    ? 'bg-primary-container text-primary'
                    : 'bg-surface-container-high text-on-surface-variant font-medium'
                ]"
              >
                {{ position.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Screenshot Upload -->
        <div v-if="currentStep === 2" class="space-y-6">
          <!-- Screenshot Upload -->
          <div class="space-y-3">
            <label class="text-sm font-bold text-on-surface flex items-center gap-2">
              段位截图认证
              <span class="text-error text-xs">*</span>
            </label>
            <div class="grid grid-cols-2 gap-4">
              <!-- Upload Button -->
              <label class="aspect-video rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-container-high transition-all">
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileSelect"
                />
                <span class="material-symbols-outlined text-outline text-3xl">add_a_photo</span>
                <span class="text-[10px] text-outline-variant font-medium">点击上传截图</span>
              </label>
              
              <!-- Uploaded Images -->
              <div
                v-for="(screenshot, index) in screenshots"
                :key="index"
                class="aspect-video rounded-xl overflow-hidden relative group"
              >
                <img 
                  :alt="'Screenshot ' + (index + 1)" 
                  class="w-full h-full object-cover" 
                  :src="screenshot.url" 
                  @click="openImagePreview(index)"
                />
                <!-- Uploading Overlay -->
                <div v-if="screenshot.uploading" class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                  <div class="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-white text-xs">上传中...</span>
                </div>
                <!-- Delete Button -->
                <button
                  v-else
                  @click.stop="removeScreenshot(index)"
                  class="absolute top-2 right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
                <!-- Uploaded Badge -->
                <div v-if="screenshot.uploaded" class="absolute bottom-2 left-2 bg-success/80 text-white text-[10px] px-2 py-0.5 rounded">
                  已上传
                </div>
              </div>
            </div>
            <p class="text-[11px] text-on-surface-variant leading-relaxed px-1">
              请上传包含角色ID及当前段位的游戏主页截图，确保信息清晰可见。支持 JPG、PNG 格式，单张不超过10MB。
            </p>
          </div>
        </div>

        <!-- Step 3: Voice Introduction -->
        <div v-if="currentStep === 3" class="space-y-6">
          <!-- Voice Introduction -->
          <div class="space-y-3">
            <label class="text-sm font-bold text-on-surface flex items-center gap-2">
              语音介绍
              <span class="text-error text-xs">*</span>
            </label>
            
            <!-- Recording Interface -->
            <div v-if="!voiceRecording" class="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center gap-4">
              <button
                @click="isRecording ? stopRecording() : startRecording()"
                :class="[
                  'w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90',
                  isRecording ? 'bg-error shadow-error/20 animate-pulse' : 'bg-primary-container shadow-primary-container/20'
                ]"
              >
                <span class="material-symbols-outlined text-3xl" :class="isRecording ? 'text-white' : 'text-primary'" style="font-variation-settings: 'FILL' 1;">
                  {{ isRecording ? 'stop' : 'mic' }}
                </span>
              </button>
              <div class="text-center">
                <p class="text-lg font-bold text-on-surface">
                  {{ isRecording ? formatTime(recordingTime) : '点击开始录制' }}
                </p>
                <p class="text-[11px] text-on-surface-variant mt-1">
                  {{ isRecording ? '录制中...点击停止' : '清晰甜美的语音会大大增加接单率哦 (10-60s)' }}
                </p>
              </div>
            </div>
            
            <!-- Recorded Voice Player -->
            <div v-else class="bg-surface-container-low rounded-2xl p-4 space-y-4">
              <div class="flex items-center gap-4">
                <button
                  @click="playVoice"
                  class="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">
                    play_arrow
                  </span>
                </button>
                <div class="flex-1">
                  <p class="text-sm font-bold text-on-surface">语音介绍</p>
                  <p class="text-xs text-on-surface-variant">{{ formatTime(voiceRecording.duration) }}</p>
                </div>
                <button
                  v-if="!voiceRecording.uploaded && !voiceUploading"
                  @click="uploadVoice"
                  class="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium"
                >
                  上传
                </button>
                <div v-if="voiceUploading" class="flex items-center gap-2">
                  <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-xs text-on-surface-variant">上传中...</span>
                </div>
                <div v-if="voiceRecording.uploaded" class="flex items-center gap-1 text-success">
                  <span class="material-symbols-outlined text-sm">check_circle</span>
                  <span class="text-xs">已上传</span>
                </div>
              </div>
              <button
                @click="reRecord"
                class="w-full py-3 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-xl text-sm font-medium transition-colors"
              >
                重新录制
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <BottomNavBar />

    <!-- Game Selector Modal -->
    <div v-if="showGameSelector" class="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center" @click.self="closeGameSelector">
      <div class="bg-surface w-full max-w-md rounded-t-3xl max-h-[70vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-outline-variant/20">
          <span class="text-lg font-bold text-on-surface">选择游戏</span>
          <button @click="closeGameSelector" class="p-2 hover:bg-surface-container-high rounded-full transition-colors">
            <span class="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div v-else-if="games.length === 0" class="flex flex-col items-center justify-center py-12 gap-3">
            <span class="material-symbols-outlined text-4xl text-outline">sports_esports</span>
            <p class="text-on-surface-variant">暂无可申请的游戏</p>
          </div>
          <div v-else class="grid grid-cols-3 gap-3">
            <div
              v-for="game in games"
              :key="game.id"
              @click="selectGame(game)"
              class="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all active:scale-95 relative"
            >
              <div class="w-14 h-14 rounded-xl bg-surface-container-lowest overflow-hidden flex items-center justify-center">
                <img :alt="game.name" class="w-full h-full object-cover" :src="game.icon" />
              </div>
              <span class="text-xs font-medium text-on-surface text-center">{{ game.name }}</span>
              <div v-if="selectedGame && selectedGame.id === game.id" class="absolute top-1 right-1 bg-primary text-on-primary-container rounded-full p-0.5">
                <span class="material-symbols-outlined text-[12px] font-bold">check</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
        v-if="previewImageIndex < screenshots.length - 1"
        @click="previewImageIndex++"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-white">chevron_right</span>
      </button>
      <img
        :src="screenshots[previewImageIndex]?.url"
        class="max-w-[90%] max-h-[80vh] object-contain"
        @click.stop
      />
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
        {{ previewImageIndex + 1 }} / {{ screenshots.length }}
      </div>
    </div>

    <!-- Bottom Action Button -->
    <div class="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl z-40">
      <div class="flex gap-4">
        <button
          v-if="currentStep > 1"
          @click="handlePrevStep"
          class="flex-1 bg-surface-container-high hover:bg-surface-container transition-all active:scale-[0.98] text-on-surface font-headline font-bold py-4 rounded-full text-base"
        >
          上一步
        </button>
        <button
          v-if="currentStep < 3"
          @click="handleNextStep"
          class="flex-1 bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-headline font-bold py-4 rounded-full text-base shadow-lg shadow-primary-container/25 transition-all active:scale-[0.98]"
        >
          下一步
        </button>
        <button
          v-if="currentStep === 3"
          @click="handleSubmit"
          :disabled="loading || !voiceRecording"
          class="w-full bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-headline font-bold py-4 rounded-full text-base shadow-lg shadow-primary-container/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div v-if="loading" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>{{ loading ? '提交中...' : '提交申请' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-line {
  height: 2px;
  flex-grow: 1;
  margin: 0 8px;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>