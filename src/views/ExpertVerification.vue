<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()

const currentStep = ref(1)
const selectedGame = ref({
  id: 1,
  name: '英雄联盟 (LOL)',
  icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3aRMW0SKYz9bJRCZHdeySAm3YNW6BkLha-t04SCoPtPGNaiKk5pI_RLZm-Xx3xeTb8jaXE5utdU1Iw-C3HTzuGEZ-OT6Vd6YdJS1nJPuLjPIsuQf33z_SaWN2pKdsYlGwJ7_f4BAph1IowakAlgW1S7P5TdxVgMV6NhX54Sd9VbxJ_pqRaUbNPEfxExFQlz3aDU3vw00yIi2VB_2rwANtR8LSjZfOzoDtnnn_IYo9B4DtzOt6TVzzj6jRiMNlSyXIOBJUglCuuJk'
})

const rank = ref('')
const selectedPositions = ref(['top'])
const screenshots = ref([])
const isRecording = ref(false)

const positions = [
  { id: 'top', label: '上单' },
  { id: 'mid', label: '中单' },
  { id: 'jungle', label: '打野' },
  { id: 'adc', label: 'ADC' },
  { id: 'support', label: '辅助' }
]

const handleBack = () => {
  router.back()
}

const handleGameSelect = () => {
  console.log('选择游戏')
}

const handlePositionToggle = (positionId) => {
  const index = selectedPositions.value.indexOf(positionId)
  if (index > -1) {
    selectedPositions.value.splice(index, 1)
  } else {
    selectedPositions.value.push(positionId)
  }
}

const handleUploadScreenshot = () => {
  console.log('上传截图')
  // 这里可以实现文件上传逻辑
  screenshots.value.push('https://lh3.googleusercontent.com/aida-public/AB6AXuB-ShCe8WK-qMVPRbujcRQq43lUbbBNa0JJd4P8dB3ic8wkLkYsQN1A7xEJucccO9GJEr4-LK6aHPG2b4fwEViMkpw1-MIsoeTcS3p5r6cah9ryKmMV7sqZdIzEy14bYrtTow01e7MzyFoKUURQyaU3TDeWS_7bCxOLFfZuXiPvwih9Q17ZfSeuENZloxLoEHbsilZddlhCm_mj_eKo5y91GtOhY4hM1m6wUJph2vWdcD9MWj6RZPQnkKwP3mk4ZqI58gjh9w7CtFw')
}

const handleStartRecording = () => {
  isRecording.value = true
  console.log('开始录制')
  // 这里可以实现语音录制逻辑
  setTimeout(() => {
    isRecording.value = false
    console.log('录制完成')
  }, 3000)
}

const handleSubmit = () => {
  console.log('提交申请')
  // 这里可以实现表单提交逻辑
  alert('申请提交成功！')
  router.back()
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

    <main class="px-5 pt-16 space-y-8 max-w-2xl mx-auto">
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
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center overflow-hidden">
                  <img :alt="selectedGame.name" class="w-full h-full object-cover" :src="selectedGame.icon" />
                </div>
                <span class="font-bold text-on-surface">{{ selectedGame.name }}</span>
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
              <div
                @click="handleUploadScreenshot"
                class="aspect-video rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-container-high transition-all"
              >
                <span class="material-symbols-outlined text-outline text-3xl">add_a_photo</span>
                <span class="text-[10px] text-outline-variant font-medium">点击上传截图</span>
              </div>
              <div v-if="screenshots.length > 0" class="aspect-video rounded-xl overflow-hidden relative group">
                <img :alt="'Screenshot ' + (screenshots.length)" class="w-full h-full object-cover opacity-60 grayscale" :src="screenshots[0]" />
                <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span class="bg-black/60 text-white text-[10px] px-2 py-1 rounded-md">已上传</span>
                </div>
              </div>
              <div v-else class="aspect-video rounded-xl overflow-hidden relative group">
                <img alt="Gaming rank dashboard example" class="w-full h-full object-cover opacity-60 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-ShCe8WK-qMVPRbujcRQq43lUbbBNa0JJd4P8dB3ic8wkLkYsQN1A7xEJucccO9GJEr4-LK6aHPG2b4fwEViMkpw1-MIsoeTcS3p5r6cah9ryKmMV7sqZdIzEy14bYrtTow01e7MzyFoKUURQyaU3TDeWS_7bCxOLFfZuXiPvwih9Q17ZfSeuENZloxLoEHbsilZddlhCm_mj_eKo5y91GtOhY4hM1m6wUJph2vWdcD9MWj6RZPQnkKwP3mk4ZqI58gjh9w7CtFw" />
                <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span class="bg-black/60 text-white text-[10px] px-2 py-1 rounded-md">示例图片</span>
                </div>
              </div>
            </div>
            <p class="text-[11px] text-on-surface-variant leading-relaxed px-1">请上传包含角色ID及当前段位的游戏主页截图，确保信息清晰可见。</p>
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
            <div class="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center gap-4">
              <button
                @click="handleStartRecording"
                :disabled="isRecording"
                class="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/20 active:scale-90 transition-transform"
              >
                <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">{{ isRecording ? 'stop' : 'mic' }}</span>
              </button>
              <div class="text-center">
                <p class="text-sm font-bold text-on-surface">{{ isRecording ? '录制中...' : '点击开始录制' }}</p>
                <p class="text-[11px] text-on-surface-variant mt-1">清晰甜美的语音会大大增加接单率哦 (10-60s)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <BottomNavBar />

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
          class="w-full bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-headline font-bold py-4 rounded-full text-base shadow-lg shadow-primary-container/25 transition-all active:scale-[0.98]"
        >
          提交申请
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
</style>