<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()

const currentStep = ref(1)
const selectedGame = ref(null)

const games = ref([
  { id: 'lol', name: '英雄联盟 (LOL)', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3aRMW0SKYz9bJRCZHdeySAm3YNW6BkLha-t04SCoPtPGNaiKk5pI_RLZm-Xx3xeTb8jaXE5utdU1Iw-C3HTzuGEZ-OT6Vd6YdJS1nJPuLjPIsuQf33z_SaWN2pKdsYlGwJ7_f4BAph1IowakAlgW1S7P5TdxVgMV6NhX54Sd9VbxJ_pqRaUbNPEfxExFQlz3aDU3vw00yIi2VB_2rwANtR8LSjZfOzoDtnnn_IYo9B4DtzOt6TVzzj6jRiMNlSyXIOBJUglCuuJk' },
  { id: 'honor_of_kings', name: '王者荣耀', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Yx21l3XQH58JEjdPvp2NeoI5LIs_51ynV3rForFFjwT3Hd5AqMSy-sxYD_dlyN682W91abmSgg8KAw9tpHslBqThqBE3aE1ZVVOsHMHttJaF7wdtEpDJ2OL28yGHnfz11wPG1Jw2fXoB8C6dHlBSmulomn9y3CFDd8uDRgc2wm8DxSw67mMZ3pZTXdnJa4MLoz4Dl06hB9dHtby_V56tqiQv_vAAw9oI9xP2_AoxO74HKUfN1fVEaKcK9T4LY_KB9LY0itiXfHU' },
  { id: 'valorant', name: 'Valorant', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0dK_MZqKKAmyA4yP_BkKpGsS_W87iCSLeuAAmwt_w2J0Fv2TJ3nFinGP1J3GSQx67aimew8FhrXUj4yr1rs9GdeQQ0HoLz7PYrcmT-menQ1ggX6R3fg-gRg1AOiAechpMCNklo7nlzYm6oTif3LxCbdYzd3J-GAlZr6SEyxpjOmVPDUFE4dwfMogxpTTQg-RVyvcN33jdsEkwf8vjjX4NIE1tfsILkkmLj6dL8Mu-pfvMf__Z-Ik58KyaejQd1RAt3s-oj5nsyo8' },
  { id: 'genshin', name: '原神', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA255ssriqx239upv8-12k7zCZRVehwBMDwNbxBDVWFHTXeU9kDiEO9QDelxUR7qMzQ75J-4ro7_ZMZwik9PTEdzzd455C4MqYkMBHBgZUIIE3UUxXuZUzd9hBOzXfu3LsQIb_K1cS4c8zbYJaZXj4FIJciSMjb3OZ7mNFzGgGCjvimrN_9WQg4FONTf5MEWUNC7cIxE0HJ_2v3fuqE_KzIwg_BDneDCMgvQT--ApEg5QvmzBze7lomDKVKJDidgKcF1y0voJA1l' },
  { id: 'pubg', name: '绝地求生', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDI76aOeylc3VRSRNZ04zYnjdju83SPGLpYh8d2uB5bogOv5w6wJcvfx6AJMDR5RQKBUrAlNQptRHNf3XJ61WGVmFOAc3-gFksvrlt6w6F_TaBfQ6Mij2zaM_KjWfcqlVkL82KYbgijsqdy-ptNMAsnQRBVHpqk2dGVjd6UsWwcuOnY9ToQPlAZwJXaT0sdGvDFkoLuAn_IIt1cP9aJJ9LXF0dXPKQK0bAJi57JnH1pgIKL4F5lFuQICzWqRy0VNT1R6BfwuOFvKg' },
  { id: 'csgo', name: 'CS:GO', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAkokFDlJJU2ut7ADXOxXgokfLf-nFbve3PmdniZPK8ZjoxO1reJWexxqbxEwDy4thsHQWxI68ySeYsam7yLDI2EWIKoa7no1yZya_-OvKHcnsOU5ukziXluccC3dUHzW8BMFTNlh6bLkgI8bMSDhUTMaTR2jWDsFNRzAKs9RzZ11om4Ki5c9Xj92fIm685lMzUrq9Bk1QuG6y3TXwjzpc6HZVTEFv-aZfUUXt5s020g03CNeOFTD-_F8HtoWP1VEGiCAo5k4gC9o' }
])

const handleGameSelect = (game) => {
  selectedGame.value = game
  router.push({
    path: '/expert-certification/upload',
    query: { gameId: game.id, gameName: game.name }
  })
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
          <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">1</div>
          <span class="text-[11px] font-bold text-primary">选择游戏</span>
        </div>
        <div class="h-[2px] flex-grow:1 bg-primary-container/40 mx-2"></div>
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold text-sm">2</div>
          <span class="text-[11px] font-medium text-on-surface-variant">上传截图</span>
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
          
          <div class="space-y-2">
            <div
              v-for="game in games"
              :key="game.id"
              @click="handleGameSelect(game)"
              class="bg-surface-container-low p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center overflow-hidden">
                  <img :alt="game.name" class="w-full h-full object-cover" :src="game.icon" />
                </div>
                <span class="font-bold text-on-surface">{{ game.name }}</span>
              </div>
              <span class="material-symbols-outlined text-outline">chevron_right</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>
