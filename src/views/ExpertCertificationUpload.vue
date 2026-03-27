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
            游戏截图
            <span class="text-error text-xs">*</span>
          </label>
          <p class="text-xs text-on-surface-variant">
            请上传{{ gameName }}的游戏段位截图，最多{{ maxScreenshots }}张
          </p>

          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="(screenshot, index) in screenshots"
              :key="screenshot.id"
              class="relative aspect-square rounded-xl overflow-hidden bg-surface-container-low"
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
              v-if="screenshots.length < maxScreenshots"
              class="aspect-square rounded-xl border-2 border-dashed border-surface-container-high flex flex-col items-center justify-center cursor-pointer hover:border-primary-container hover:bg-surface-container-low transition-all"
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
              <span class="material-symbols-outlined text-3xl text-outline-variant mb-1">add_photo_alternate</span>
              <span class="text-xs text-on-surface-variant">点击上传</span>
            </div>
          </div>
        </div>

        <div class="bg-primary-container/10 p-4 rounded-xl">
          <div class="flex gap-3 items-start">
            <span class="material-symbols-outlined text-primary text-lg">info</span>
            <div class="space-y-1">
              <p class="text-xs font-bold text-on-primary-container">上传要求</p>
              <ul class="text-[10px] text-on-primary-container/70 leading-relaxed space-y-1">
                <li>• 截图需清晰显示游戏段位信息</li>
                <li>• 请确保截图真实有效</li>
                <li>• 支持JPG、PNG格式，大小不超过5MB</li>
              </ul>
            </div>
          </div>
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
