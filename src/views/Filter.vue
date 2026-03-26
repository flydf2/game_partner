<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectedGame = ref('')
const selectedRank = ref('')
const selectedPriceRange = ref('')
const selectedGender = ref('')
const selectedServiceType = ref('')
const selectedDuration = ref('')
const selectedRating = ref('')
const onlyOnline = ref(false)

const games = ref([
  { id: 'honor_of_kings', name: '王者荣耀' },
  { id: 'lol', name: '英雄联盟' },
  { id: 'valorant', name: 'Valorant' },
  { id: 'genshin', name: '原神' },
  { id: 'pubg', name: '绝地求生' },
  { id: 'csgo', name: 'CS:GO' }
])

const ranks = ref([
  { id: 'challenger', name: '最强王者/璀璨钻石' },
  { id: 'master', name: '傲世宗师/超凡大师' },
  { id: 'diamond', name: '钻石' },
  { id: 'platinum', name: '铂金' },
  { id: 'gold', name: '黄金' }
])

const priceRanges = ref([
  { id: '0-30', name: '¥0-30' },
  { id: '30-50', name: '¥30-50' },
  { id: '50-80', name: '¥50-80' },
  { id: '80-100', name: '¥80-100' },
  { id: '100+', name: '¥100+' }
])

const genders = ref([
  { id: 'male', name: '男' },
  { id: 'female', name: '女' }
])

const serviceTypes = ref([
  { id: 'tech', name: '技术陪玩' },
  { id: 'entertainment', name: '娱乐陪玩' },
  { id: 'voice', name: '语音陪玩' },
  { id: 'coach', name: '游戏教练' }
])

const durations = ref([
  { id: '1h', name: '1小时' },
  { id: '2h', name: '2小时' },
  { id: '3h', name: '3小时' },
  { id: 'custom', name: '自定义' }
])

const ratings = ref([
  { id: '4.5+', name: '4.5分以上' },
  { id: '4.0+', name: '4.0分以上' },
  { id: '3.5+', name: '3.5分以上' },
  { id: '3.0+', name: '3.0分以上' }
])

const handleReset = () => {
  selectedGame.value = ''
  selectedRank.value = ''
  selectedPriceRange.value = ''
  selectedGender.value = ''
  selectedServiceType.value = ''
  selectedDuration.value = ''
  selectedRating.value = ''
  onlyOnline.value = false
}

const handleApply = () => {
  const filters = {
    game: selectedGame.value || undefined,
    rank: selectedRank.value || undefined,
    priceRange: selectedPriceRange.value || undefined,
    gender: selectedGender.value || undefined,
    serviceType: selectedServiceType.value || undefined,
    duration: selectedDuration.value || undefined,
    rating: selectedRating.value || undefined,
    online: onlyOnline.value ? true : undefined
  }

  router.push({
    path: '/search',
    query: filters
  })
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <header class="flex justify-between items-center px-5 h-16 w-full fixed top-0 z-50 bg-surface-container-highest/50 backdrop-blur-xl">
      <div class="flex items-center gap-4">
        <span @click="handleBack" class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity">
          arrow_back
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">筛选</h1>
      </div>
      <button
        @click="handleReset"
        class="text-on-surface-variant text-sm font-medium hover:text-primary transition-colors"
      >
        重置
      </button>
    </header>

    <main class="pt-24 pb-32 px-6 max-w-md mx-auto min-h-screen">
      <section class="space-y-8">
        <div class="space-y-4">
          <h3 class="font-headline font-bold text-lg text-on-surface">游戏类型</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="game in games"
              :key="game.id"
              @click="selectedGame = selectedGame === game.id ? '' : game.id"
              :class="[
                'px-4 py-3 rounded-xl font-medium text-sm transition-all',
                selectedGame === game.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              ]"
            >
              {{ game.name }}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-headline font-bold text-lg text-on-surface">段位</h3>
          <div class="space-y-2">
            <button
              v-for="rank in ranks"
              :key="rank.id"
              @click="selectedRank = selectedRank === rank.id ? '' : rank.id"
              :class="[
                'w-full px-4 py-3 rounded-xl font-medium text-sm text-left transition-all flex items-center justify-between',
                selectedRank === rank.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              ]"
            >
              <span>{{ rank.name }}</span>
              <span
                v-if="selectedRank === rank.id"
                class="material-symbols-outlined text-lg"
              >
                check
              </span>
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-headline font-bold text-lg text-on-surface">价格范围</h3>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="range in priceRanges"
              :key="range.id"
              @click="selectedPriceRange = selectedPriceRange === range.id ? '' : range.id"
              :class="[
                'px-3 py-2 rounded-xl font-medium text-xs transition-all',
                selectedPriceRange === range.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              ]"
            >
              {{ range.name }}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-headline font-bold text-lg text-on-surface">性别</h3>
          <div class="flex gap-3">
            <button
              v-for="gender in genders"
              :key="gender.id"
              @click="selectedGender = selectedGender === gender.id ? '' : gender.id"
              :class="[
                'flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all',
                selectedGender === gender.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              ]"
            >
              {{ gender.name }}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-headline font-bold text-lg text-on-surface">服务类型</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="type in serviceTypes"
              :key="type.id"
              @click="selectedServiceType = selectedServiceType === type.id ? '' : type.id"
              :class="[
                'px-4 py-3 rounded-xl font-medium text-sm transition-all',
                selectedServiceType === type.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              ]"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-headline font-bold text-lg text-on-surface">服务时长</h3>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="duration in durations"
              :key="duration.id"
              @click="selectedDuration = selectedDuration === duration.id ? '' : duration.id"
              :class="[
                'px-3 py-2 rounded-xl font-medium text-xs transition-all',
                selectedDuration === duration.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              ]"
            >
              {{ duration.name }}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-headline font-bold text-lg text-on-surface">最低评分</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="rating in ratings"
              :key="rating.id"
              @click="selectedRating = selectedRating === rating.id ? '' : rating.id"
              :class="[
                'px-4 py-3 rounded-xl font-medium text-sm transition-all',
                selectedRating === rating.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              ]"
            >
              {{ rating.name }}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-headline font-bold text-lg text-on-surface">只看在线</h3>
            <button
              @click="onlyOnline = !onlyOnline"
              :class="[
                'w-12 h-7 rounded-full transition-all relative',
                onlyOnline ? 'bg-primary-container' : 'bg-surface-container-high'
              ]"
            >
              <span
                :class="[
                  'absolute top-1 w-5 h-5 rounded-full transition-all',
                  onlyOnline ? 'left-6 bg-white' : 'left-1 bg-white'
                ]"
              ></span>
            </button>
          </div>
        </div>
      </section>

      <div class="bg-surface-container-low rounded-xl p-5 shadow-sm">
        <button
          @click="handleApply"
          class="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-full shadow-lg shadow-primary-container/30 active:scale-95 transition-all duration-200"
        >
          应用筛选
        </button>
      </div>
    </main>
  </div>
</template>
