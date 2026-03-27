<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const gameId = ref(route.query.gameId || '')
const gameName = ref(route.query.gameName || '')

const screenshots = ref([])
const maxScreenshots = 3

const handleFileUpload = (event) => {
  const files = event.target.files
  if (screenshots.value.length + files.length > maxScreenshots) {
    alert(`最多只能上传${maxScreenshots}张截图`)
    return
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      continue
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      screenshots.value.push({
        id: Date.now() + i,
        url: e.target.result,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  }
}

const handleRemoveScreenshot = (index) => {
  screenshots.value.splice(index, 1)
}

const handleNext = () => {
  if (screenshots.value.length === 0) {
    alert('请至少上传一张截图')
    return
  }

  router.push({
    path: '/expert-certification/voice',
    query: {
      gameId: gameId.value,
      gameName: gameName.value
    }
  })
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface">
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
          <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">2</div>
          <span class="text-[11px] font-bold text-primary">上传截图</span>
        </div>
        <div class="h-[2px] flex-grow:1 bg-surface-container-high mx-2"></div>
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold text-sm">3</div>
          <span class="text-[11px] font-medium text-on-surface-variant">录制语音</span>
        </div>
      </div>

      <div class="space-y-6">
        <div class="space-y-3">
          <label class="text-sm font-bold text-on-surface flex items-center gap-2">
            申请游戏
            <span class="text-error text-xs">*</span>
          </label>
          <div class="bg-surface-container-low p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center overflow-hidden">
                <img :alt="gameName" class="w-full h-full object-cover" :src="`https://lh3.googleusercontent.com/aida-public/AB6AXuD3aRMW0SKYz9bJRCZHdeySAm3YNW6BkLha-t04SCoPtPGNaiKk5pI_RLZm-Xx3xeTb8jaXE5utdU1Iw-C3HTzuGEZ-OT6Vd6YdJS1nJPuLjPIsuQf33z_SaWN2pKdsYlGwJ7_f4BAph1IowakAlgW1S7P5TdxVgMV6NhX54Sd9VbxJ_pqRaUbNPEfxExFQlz3aDU3vw00yIi2VB_2rwANtR8LSjZfOzoDtnnn_IYo9B4DtzOt6TVzzj6jRiMNlSyXIOBJUglCuuJk`" />
              </div>
              <span class="font-bold text-on-surface">{{ gameName }}</span>
            </div>
            <span class="material-symbols-outlined text-outline">expand_more</span>
          </div>
        </div>

        <div class="space-y-3">
          <label class="text-sm font-bold text-on-surface flex items-center gap-2">
            当前段位
            <span class="text-error text-xs">*</span>
          </label>
          <input
            class="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary-container transition-all"
            placeholder="例如：至尊星耀 I"
            type="text"
          />
        </div>

        <div class="space-y-3">
          <label class="text-sm font-bold text-on-surface flex items-center gap-2">
            擅长位置
            <span class="text-on-surface-variant text-xs font-normal">（可多选）</span>
          </label>
          <div class="flex flex-wrap gap-3">
            <button class="px-5 py-2.5 rounded-full bg-primary-container text-primary font-bold text-sm border-none transition-all active:scale-95">上单</button>
            <button class="px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium text-sm border-none transition-all active:scale-95">中单</button>
            <button class="px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium text-sm border-none transition-all active:scale-95">打野</button>
            <button class="px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium text-sm border-none transition-all active:scale-95">ADC</button>
            <button class="px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium text-sm border-none transition-all active:scale-95">辅助</button>
          </div>
        </div>

        <div class="space-y-3">
          <label class="text-sm font-bold text-on-surface flex items-center gap-2">
            段位截图认证
            <span class="text-error text-xs">*</span>
          </label>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(screenshot, index) in screenshots"
              :key="screenshot.id"
              class="aspect-video rounded-xl overflow-hidden relative bg-surface-container-low"
            >
              <img :alt="screenshot.name" class="w-full h-full object-cover" :src="screenshot.url" />
              <button
                @click="handleRemoveScreenshot(index)"
                class="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div
              v-if="screenshots.length < 2"
              class="aspect-video rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-container-high transition-all"
              @click="$refs.fileInput.click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="handleFileUpload"
              />
              <span class="material-symbols-outlined text-outline text-3xl">add_a_photo</span>
              <span class="text-[10px] text-outline-variant font-medium">点击上传截图</span>
            </div>

            <div class="aspect-video rounded-xl overflow-hidden relative group">
              <img class="w-full h-full object-cover opacity-60 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-ShCe8WK-qMVPRbujcRQq43lUbbBNa0JJd4P8dB3ic8wkLkYsQN1A7xEJucccO9GJEr4-LK6aHPG2b4fwEViMkpw1-MIsoeTcS3p5r6cah9ryKmMV7sqZdIzEy14bYrtTow01e7MzyFoKUURQyaU3TDeWS_7bCxOLFfZuXiPvwih9Q17ZfSeuENZloxLoEHbsilZddlhCm_mj_eKo5y91GtOhY4hM1m6wUJph2vWdcD9MWj6RZPQnkKwP3mk4ZqI58gjh9w7CtFw" />
              <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                <span class="bg-black/60 text-white text-[10px] px-2 py-1 rounded-md">示例图片</span>
              </div>
            </div>
          </div>
          <p class="text-[11px] text-on-surface-variant leading-relaxed px-1">
            请上传包含角色ID及当前段位的游戏主页截图，确保信息清晰可见。
          </p>
        </div>
      </div>

      <div class="bg-surface-container-low rounded-xl p-5 shadow-sm">
        <button
          @click="handleNext"
          class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-full shadow-lg shadow-primary-container/30 active:scale-95 transition-all duration-200"
        >
          下一步
        </button>
      </div>
    </main>
  </div>
</template>
