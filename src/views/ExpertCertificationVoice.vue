<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const gameId = ref(route.query.gameId || '')
const gameName = ref(route.query.gameName || '')

const isRecording = ref(false)
const recordingTime = ref(0)
const recordedAudio = ref(null)
const timerInterval = ref(null)

const startRecording = () => {
  isRecording.value = true
  recordingTime.value = 0
  
  timerInterval.value = setInterval(() => {
    recordingTime.value++
  }, 1000)
}

const stopRecording = () => {
  isRecording.value = false
  clearInterval(timerInterval.value)
  
  recordedAudio.value = {
    duration: recordingTime.value,
    timestamp: Date.now()
  }
}

const resetRecording = () => {
  isRecording.value = false
  clearInterval(timerInterval.value)
  recordingTime.value = 0
  recordedAudio.value = null
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handleSubmit = () => {
  if (!recordedAudio.value) {
    alert('请录制语音介绍')
    return
  }

  console.log('提交认证:', {
    gameId: gameId.value,
    gameName: gameName.value,
    audioDuration: recordedAudio.value.duration
  })

  alert('认证申请已提交，请等待审核')
  router.push('/')
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="bg-surface docked full-width top-0 z-50 flex justify-between items-center px-6 py-4 w-full sticky">
      <div class="flex items-center gap-3">
        <span @click="handleBack" class="material-symbols-outlined text-primary cursor-pointer">arrow_back</span>
        <h1 class="font-headline font-bold text-lg text-primary">大神认证</h1>
      </div>
      <div class="flex items-center gap-4">
        <span class="material-symbols-outlined text-neutral-500 cursor-pointer">help_outline</span>
      </div>
    </header>

    <main class="px-5 pt-6 space-y-8 max-w-2xl mx-auto">
      <div class="flex items-center justify-between px-2">
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold text-sm">1</div>
          <span class="text-[11px] font-medium text-on-surface-variant">选择游戏</span>
        </div>
        <div class="h-[2px] flex-grow:1 bg-primary-container/40 mx-2"></div>
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold text-sm">2</div>
          <span class="text-[11px] font-medium text-on-surface-variant">上传截图</span>
        </div>
        <div class="h-[2px] flex-grow:1 bg-primary-container/40 mx-2"></div>
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">3</div>
          <span class="text-[11px] font-bold text-primary">录制语音</span>
        </div>
      </div>

      <div class="space-y-6">
        <div class="space-y-3">
          <label class="text-sm font-bold text-on-surface flex items-center gap-2">
            语音介绍
            <span class="text-error text-xs">*</span>
          </label>
          <p class="text-xs text-on-surface-variant">
            请录制一段{{ gameName }}的自我介绍，让用户更好地了解您
          </p>

          <div class="bg-surface-container-low rounded-2xl p-6 space-y-6">
            <div class="flex flex-col items-center gap-4">
              <div
                :class="[
                  'w-24 h-24 rounded-full flex items-center justify-center transition-all',
                  isRecording ? 'bg-error animate-pulse' : 'bg-primary-container'
                ]"
              >
                <span
                  @click="isRecording ? stopRecording() : startRecording()"
                  class="material-symbols-outlined text-5xl cursor-pointer"
                  :class="isRecording ? 'text-white' : 'text-primary'"
                >
                  {{ isRecording ? 'stop' : 'mic' }}
                </span>
              </div>
              
              <div v-if="isRecording" class="text-center">
                <p class="text-3xl font-headline font-bold text-error mb-1">
                  {{ formatTime(recordingTime) }}
                </p>
                <p class="text-xs text-on-surface-variant">录制中...</p>
              </div>

              <div v-else-if="recordedAudio" class="text-center">
                <p class="text-3xl font-headline font-bold text-primary mb-1">
                  {{ formatTime(recordedAudio.duration) }}
                </p>
                <p class="text-xs text-on-surface-variant">已录制</p>
              </div>

              <div v-else class="text-center">
                <p class="text-sm text-on-surface-variant">点击开始录制</p>
              </div>
            </div>

            <div v-if="recordedAudio" class="flex gap-3">
              <button
                @click="resetRecording"
                class="flex-1 bg-surface-container-high text-on-surface-variant font-headline font-bold py-3 rounded-xl active:scale-95 transition-all"
              >
                重新录制
              </button>
              <button
                @click="handleSubmit"
                class="flex-1 bg-primary-container text-on-primary-container font-headline font-bold py-3 rounded-xl active:scale-95 transition-all"
              >
                提交认证
              </button>
            </div>
          </div>
        </div>

        <div class="bg-primary-container/10 p-4 rounded-xl">
          <div class="flex gap-3 items-start">
            <span class="material-symbols-outlined text-primary text-lg">tips_and_updates</span>
            <div class="space-y-1">
              <p class="text-xs font-bold text-on-primary-container">录制建议</p>
              <ul class="text-[10px] text-on-primary-container/70 leading-relaxed space-y-1">
                <li>• 介绍您的游戏经验和擅长位置</li>
                <li>• 语速适中，声音清晰</li>
                <li>• 时长建议15-30秒</li>
                <li>• 可以展示您的个性特点</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
