<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeCategory = ref('moba')
const searchQuery = ref('')

const categories = [
  { id: 'moba', label: 'MOBA' },
  { id: 'shooting', label: '射击' },
  { id: 'competitive', label: '竞技' },
  { id: 'entertainment', label: '娱乐' },
  { id: 'online', label: '网游' },
  { id: 'console', label: '主机' }
]

const games = [
  { id: 1, name: '英雄联盟', category: 'moba', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwJMK-vPtlCamAbtTRphsnIFcd1mWDzm1_T7KpzrxayEqLvesNtlHnzdM4rYKM0uo9g2_54Jj3Y0EPW5FB1sDjdErswcmdN1SmvaBqTh5bJD9-J5ucaAwF12MByzHgfaBX5CqrBM321UsnOg5GpZieNcmb7SaK-iUOOlTN_jvoYnW1BDpgm3eWB-0IPh1akuOUcitl05xf5FC8iPrAgKeciCRH1Odd9DYxPNu8sE8cfOFkv7uk_HsPwBjE-FUF43lV3AZE7uLVp0I' },
  { id: 2, name: '王者荣耀', category: 'moba', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO6Fv1fyGzYvj3dZ-H2AFzfu7X6Y6_yA1taG4ZuIR2PMnd96dzALMWRYtklMtial0VLZJtSVsAP5y9m9b_xwTQoq2zVnAq5fBxhcejRsjtv0IFfLF3aOhYMHtKueVSCXz0ow78iQTjbi5HbOPPPjqeZ2tC6L9LrFZ7WoKghDYAwKmcr9P1XBCv0W5pbF7hZ5hbHCBu8G7UM2eH-_Buh3zy9Zts0inQl1gewpndP5Cqfi6i-yux-QSrRAebo6d1Z5tXpcefUZCMnE0' },
  { id: 3, name: '和平精英', category: 'shooting', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvdKZ4vBDmJiGGoIdY5uN8vk6NP2skn5qTAfHBUjn_XhnvxhinOjbExV7IZTrLvHYx_cM7mnDxDdHV7liBkAmlFCHP1FjfQXAT9JFOFL-bW7VvCpDV8ALyyZQxWzGYxF_tBHLcywbN52GPzD8b_i9EG_geNM22_Ry3-u7yFzQx5X7gOB9M-HNmDCLsJJRyWYYYTwWyDSzv_0TPVZ5LBNP67K2Q2jfbzRMqsISc8gaxeDYUD1WoAt8P6AIc0EmqW3TKxYpUBjpmciE' },
  { id: 4, name: 'Dota 2', category: 'moba', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCig4vCjf8ynERRlJw6j7E-3ZfKnw3ksy3SLjVpnw99A5bjjtVmmZlDcRGgdDBVojT-NlTqiZlBWwqSKxmKeF1aPZzRuW4w9Z8HO0THinpJiLI2TpCy_uMtiVy2l0wIIqGj2yus3EC6mUevTVsHyo2bqqvBCKW-4KtNnENw1eGB07txvjLJTGb3zpzgmAV5am0uyzCz9IJbe7zOo9HRzgvkOS5mmL2g2mZJUTenpWh05M_usWd43ahAPDLisvmnDmUP7F4FgyP5730' },
  { id: 5, name: '原神', category: 'entertainment', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdUkaUZGDBcCAcjxT3f9Z7kvGkPdT3w8bqDluc3iqSErfCGRjzL_0ZOcLQsR9kJ-B48g4oD0-LYMpVyMizWjSaGuOrv4IJuxr7Q9sM46dgvZLmFBazQNCInUgQSWWf7Ei_hTLzJ9zbHSg6XdbfMoeKpo2Kx7RdCyKulFDPeds0dbsHSSJqMoL89znPuERLPN2vXgzEH1c-UjXwpi61RYvSGU9GsNswjgAbWeq6oGsbLw6bfZC3vTxlIu_wBCAay7PeYyYLCQf_moM' },
  { id: 6, name: '永劫无间', category: 'competitive', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQJJK1QQu5hytrrQz6-9PVcDQ_U5A5aFb5aKsG3nc4hta6PDVhkEuZqbQ9-9RE4huLdPSZb7w9-d65-ormxf6PLyrtY197b3IP8--uW7vVkwsPX9FnWtiQmusWN24Rxo7GI1vm8PS0q2vE6E9wI0j_J4HhWxALc7cV3dh4g6uw7PsYJ8_JxKqOvV1NUn1P-4arJV6psl5XStZc01itaEqm7KKkKpZOaxNqQhDLMlxli0poz7fcvoEPgDynsti4DVYLwiXzLV4OEyk' },
  { id: 7, name: '决战平安京', category: 'moba', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAb-x90DK6MePE4PFHS7KgUv8Z0fWx3AAV_aSUBD9bgnPtp_DDOV0QcorEuoF9L8EEauuGUnerUPtt7UuFYcat1rXsFWECBpum8Sv-PopUh1cZh-XeVcAw6hEKnxTVcUfK3Z7KYuhWRupQw1Al_4QPLI1Izlb6ADoHV7_ZsTgLXUwExllC9KZji9o6fd9MuOBtSdM0KWdbCR473FQvnjNUZdXHCINeS8ndfvdFZZe6hvgx16OurtkhZkqYC3lTuH-fDBBYSBX7UV0' },
  { id: 8, name: '第五人格', category: 'entertainment', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLCwcS754hCh6ggV3wdNDwshCz9TOfWbVrRUuppWZhYjJ16ufic_fBkx9wwSCqYDXf_xyrEcyAnAv7CnBZ1ahLPHFRhU7W8UW_eWswyvg518Te0HFoJPrHQOVeb-Rf6EWLCZh5RvMqiqKY9VsqH_R7xy0A1uq0EZJEOU-M0CwRIPkQbDj2ZCHz1XgcZLwmQ3Mjpt58W8JiMZwGpPvksGwPNYZatlHvuDluE1FxB6Mg30HfpxovYJhQlCVua5iJMPF732KijA2z-YA' },
  { id: 9, name: '英雄联盟手游', category: 'moba', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoF3F1MQOLKt8g5tJmSwhNEBH72gw-ndT2ii2kf5h-Rx8x5--0z3McICzfZFJIy3Da3VXizRgM73JCWLAW4CFK_bWIWKQkH-I1iuMgmo19VLLkBYvCBi-a4fGhxUrWsQMC5HD2aF_48366vg4V5ccJy60tbg_b0KnU-S3BOf-TwKeEDxULpzZg8297caghuE3J3LRvIf9THvqDF59qkxwANu5YDuX5aRCnvcBa26nlCt_-0eZMSngG-FlsuGSvicmwFScS0sAzI7A' }
]

const filteredGames = ref(games.filter(game => game.category === activeCategory.value))

const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId
  filteredGames.value = games.filter(game => game.category === categoryId)
}

const handleSearch = () => {
  if (searchQuery.value) {
    filteredGames.value = games.filter(game => 
      game.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      game.category === activeCategory.value
    )
  } else {
    filteredGames.value = games.filter(game => game.category === activeCategory.value)
  }
}

const handleGameSelect = (gameId) => {
  console.log('选择游戏:', gameId)
  // 这里可以跳转到游戏详情页面或技能认证页面
  router.push('/expert-verification')
}

const handleNotifications = () => {
  console.log('通知')
}

const handleProfile = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <!-- Top Navigation Anchor -->
    <header class="bg-surface fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary">grid_view</span>
        <h1 class="text-primary font-headline font-bold text-lg">游戏分类</h1>
      </div>
      <div class="flex items-center gap-4">
        <button @click="handleNotifications" class="text-neutral-500 hover:opacity-80 transition-opacity active:scale-95 transition-transform">
          <span class="material-symbols-outlined">notifications</span>
        </button>
        <button @click="handleProfile" class="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
          <img alt="User profile avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwUt6pQRLLdeu_Bmf1d44qJCNduKIPqoONJ7qtflO4D81igagDtYxqWPFsBktIND10YcC0518JxX5wd4M2EnZL1n4pyU7CDrnAR-xTFAO588L7YCKHF0Wzs8pOXQbK3Fe8s7QI6uHzCCSeIWpV4l3Hb3EoJdtr_Y1oaL4vhBnSSwxIsQRz-7FyhYEh9Rzf6nUPVqP8LutLAckx2N6AR4lt9dWUnQXRaXmQchSR0KuRCJBPqEar-nOLIuTHBfIcqBlaBajY3D87lVQ" />
        </button>
      </div>
    </header>

    <main class="pt-20 px-6 pb-24">
      <!-- Search Bar Section -->
      <div class="mb-6 mt-4">
        <div class="relative flex items-center bg-surface-container-high rounded-full px-5 py-3.5 transition-all focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container">
          <span class="material-symbols-outlined text-on-surface-variant mr-3">search</span>
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            class="bg-transparent border-none outline-none w-full text-on-surface placeholder:text-outline p-0 focus:ring-0"
            placeholder="搜索游戏"
            type="text"
          />
        </div>
      </div>

      <div class="flex gap-6 h-[calc(100vh-220px)] overflow-hidden">
        <!-- Sidebar Navigation -->
        <aside class="w-24 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pb-4">
          <div
            v-for="category in categories"
            :key="category.id"
            @click="handleCategoryChange(category.id)"
            :class="[
              'flex flex-col items-center justify-center p-3 rounded-xl font-bold shadow-sm transition-all active:scale-95',
              activeCategory === category.id
                ? 'bg-primary-container text-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            ]"
          >
            <span class="text-sm">{{ category.label }}</span>
          </div>
        </aside>

        <!-- Content Area - Game Grid -->
        <section class="flex-grow overflow-y-auto pb-8">
          <div class="grid grid-cols-3 gap-y-6 gap-x-4">
            <!-- Game Card -->
            <div
              v-for="game in filteredGames"
              :key="game.id"
              @click="handleGameSelect(game.id)"
              class="flex flex-col items-center gap-2 group active:scale-95 transition-transform cursor-pointer"
            >
              <div class="w-full aspect-square rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden flex items-center justify-center">
                <img :alt="game.name" class="w-full h-full object-cover" :src="game.image" />
              </div>
              <span class="text-xs font-medium text-on-surface text-center">{{ game.name }}</span>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Bottom Navigation Bar Shell -->
    <nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl z-50 rounded-t-[1.5rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div @click="router.push('/')" class="flex flex-col items-center justify-center text-neutral-400 px-4 py-1.5 transition-transform active:scale-90 duration-200 cursor-pointer">
        <span class="material-symbols-outlined mb-1">home</span>
        <span class="font-headline text-[10px] font-medium">首页</span>
      </div>
      <div class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-2xl px-4 py-1.5 transition-all active:scale-90 duration-200 shadow-sm cursor-pointer">
        <span class="material-symbols-outlined mb-1">emoji_events</span>
        <span class="font-headline text-[10px] font-medium">排行榜</span>
      </div>
      <div @click="router.push('/game-categories')" class="flex flex-col items-center justify-center text-neutral-400 px-4 py-1.5 transition-transform active:scale-90 duration-200 cursor-pointer">
        <span class="material-symbols-outlined mb-1">extension</span>
        <span class="font-headline text-[10px] font-medium">技能</span>
      </div>
      <div @click="router.push('/profile/wallet')" class="flex flex-col items-center justify-center text-neutral-400 px-4 py-1.5 transition-transform active:scale-90 duration-200 cursor-pointer">
        <span class="material-symbols-outlined mb-1">account_balance_wallet</span>
        <span class="font-headline text-[10px] font-medium">钱包</span>
      </div>
      <div @click="router.push('/profile')" class="flex flex-col items-center justify-center text-neutral-400 px-4 py-1.5 transition-transform active:scale-90 duration-200 cursor-pointer">
        <span class="material-symbols-outlined mb-1">person</span>
        <span class="font-headline text-[10px] font-medium">我的</span>
      </div>
    </nav>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>