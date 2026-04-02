<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <AppHeader
      title="赛事详情"
      :show-back="true"
      :show-notifications="true"
      :show-search="true"
      :show-avatar="true"
      @back="handleBack"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content space-y-6">
      <section v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-on-surface-variant">加载中...</p>
      </section>

      <section v-else-if="error" class="flex flex-col items-center justify-center py-20">
        <span class="material-symbols-outlined text-4xl text-error mb-4">error_outline</span>
        <p class="text-center text-error mb-4">{{ error }}</p>
        <button
          @click="fetchTournamentDetail"
          class="px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold active:scale-95 transition-transform"
        >
          重试
        </button>
      </section>

      <template v-else-if="tournament">
        <section class="relative">
          <div class="w-full h-48 bg-gradient-to-br from-primary-container to-primary overflow-hidden relative">
            <img
              v-if="tournament.cover"
              :src="tournament.cover"
              :alt="tournament.title"
              class="w-full h-full object-cover opacity-60"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <div class="flex items-center gap-2 mb-2">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-bold',
                    getStatusClass(tournament.status)
                  ]"
                >
                  {{ getStatusText(tournament.status) }}
                </span>
                <span class="text-white/80 text-xs">{{ tournament.game }}</span>
              </div>
              <h1 class="text-2xl font-headline font-extrabold text-white">{{ tournament.title }}</h1>
            </div>
          </div>
        </section>

        <section class="px-4 space-y-4">
          <div class="bg-surface-container-lowest rounded-3xl p-5 space-y-4">
            <h3 class="font-headline font-bold text-lg">赛事信息</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-on-surface-variant text-xs">报名时间</span>
                <p class="font-medium text-sm">{{ tournament.registerTime || '2026-04-01 至 2026-04-05' }}</p>
              </div>
              <div>
                <span class="text-on-surface-variant text-xs">比赛时间</span>
                <p class="font-medium text-sm">{{ tournament.matchTime || '2026-04-10 至 2026-04-15' }}</p>
              </div>
              <div>
                <span class="text-on-surface-variant text-xs">奖金池</span>
                <p class="font-bold text-primary">{{ tournament.prize || '¥10,000' }}</p>
              </div>
              <div>
                <span class="text-on-surface-variant text-xs">参赛人数</span>
                <p class="font-medium text-sm">{{ tournament.participants || 128 }} 人</p>
              </div>
            </div>
          </div>

          <div class="bg-surface-container-lowest rounded-3xl p-5 space-y-3">
            <h3 class="font-headline font-bold text-lg">赛事简介</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">
              {{ tournament.description || '这是一个精彩的游戏赛事，邀请各位高手前来角逐。赛事分为海选赛、淘汰赛和决赛三个阶段，最终决出冠军。' }}
            </p>
          </div>

          <div class="bg-surface-container-lowest rounded-3xl p-5 space-y-3">
            <h3 class="font-headline font-bold text-lg">赛事规则</h3>
            <ul class="space-y-2 text-sm text-on-surface-variant">
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                <span>采用BO3淘汰赛制</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                <span>参赛者需达到指定段位要求</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                <span>禁止使用任何作弊手段</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                <span>最终解释权归主办方所有</span>
              </li>
            </ul>
          </div>

          <div v-if="tournament.status === 'upcoming'" class="bg-surface-container-lowest rounded-3xl p-5 space-y-3">
            <h3 class="font-headline font-bold text-lg">报名参赛</h3>
            <button
              @click="handleJoin"
              :disabled="isJoining"
              class="w-full h-12 bg-primary-container text-on-primary-container font-bold rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
            >
              <span v-if="isJoining" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              <span v-else>立即报名</span>
            </button>
          </div>

          <div v-if="teams.length > 0" class="bg-surface-container-lowest rounded-3xl p-5 space-y-3">
            <h3 class="font-headline font-bold text-lg">参赛队伍</h3>
            <div class="space-y-3">
              <div
                v-for="(team, index) in teams"
                :key="team.id"
                class="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl"
              >
                <span class="w-6 h-6 flex items-center justify-center bg-primary-container text-on-primary-container rounded-full text-xs font-bold">
                  {{ index + 1 }}
                </span>
                <img
                  :src="team.avatar"
                  :alt="team.name"
                  class="w-10 h-10 rounded-full bg-surface"
                  onerror="this.src='https://via.placeholder.com/40'"
                />
                <div class="flex-1">
                  <p class="font-bold text-sm">{{ team.name }}</p>
                  <p class="text-xs text-on-surface-variant">{{ team.members }} 名成员</p>
                </div>
                <span
                  v-if="team.rank"
                  class="px-2 py-1 bg-tertiary-container/20 text-tertiary-container rounded-full text-xs font-bold"
                >
                  {{ team.rank }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="matches.length > 0" class="bg-surface-container-lowest rounded-3xl p-5 space-y-3">
            <h3 class="font-headline font-bold text-lg">赛程安排</h3>
            <div class="space-y-3">
              <div
                v-for="match in matches"
                :key="match.id"
                class="p-3 bg-surface-container-low rounded-2xl"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-on-surface-variant">{{ match.time }}</span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-xs font-bold',
                      match.status === 'completed' ? 'bg-surface-container-high text-on-surface-variant' :
                      match.status === 'ongoing' ? 'bg-primary-container/20 text-primary' :
                      'bg-primary/10 text-primary'
                    ]"
                  >
                    {{ match.status === 'completed' ? '已结束' : match.status === 'ongoing' ? '进行中' : '未开始' }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex-1 text-center">
                    <img
                      :src="match.team1Avatar"
                      :alt="match.team1"
                      class="w-8 h-8 rounded-full mx-auto mb-1 bg-surface"
                      onerror="this.src='https://via.placeholder.com/32'"
                    />
                    <p class="text-xs font-medium">{{ match.team1 }}</p>
                  </div>
                  <div class="px-4">
                    <span class="font-headline font-black text-lg">
                      {{ match.score1 || '-' }} : {{ match.score2 || '-' }}
                    </span>
                  </div>
                  <div class="flex-1 text-center">
                    <img
                      :src="match.team2Avatar"
                      :alt="match.team2"
                      class="w-8 h-8 rounded-full mx-auto mb-1 bg-surface"
                      onerror="this.src='https://via.placeholder.com/32'"
                    />
                    <p class="text-xs font-medium">{{ match.team2 }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>

    <div v-if="toast.show" class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-bold shadow-lg z-50 animate-fade-in-out">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tournamentApi } from '@/api/tournament'
import AppHeader from '../components/AppHeader.vue'

const route = useRoute()
const router = useRouter()

const tournamentId = computed(() => route.params.id)
const loading = ref(false)
const error = ref(null)
const isJoining = ref(false)
const toast = ref({ show: false, message: '' })

const tournament = ref(null)
const teams = ref([])
const matches = ref([])

const getStatusClass = (status) => {
  switch (status) {
    case 'ongoing':
      return 'bg-primary text-on-primary'
    case 'completed':
      return 'bg-surface-container-high text-on-surface-variant'
    default:
      return 'bg-tertiary-container text-on-tertiary-container'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'ongoing':
      return '进行中'
    case 'completed':
      return '已结束'
    default:
      return '报名中'
  }
}

const showToast = (message) => {
  toast.value.message = message
  toast.value.show = true
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const handleBack = () => {
  router.back()
}

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: tournament.value?.title || '赛事详情',
      text: '来看看这个有趣的赛事',
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    showToast('链接已复制到剪贴板')
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

const handleJoin = async () => {
  isJoining.value = true
  try {
    const result = await tournamentApi.joinTournament(tournamentId.value, { teamName: '测试战队' })
    showToast(result.message || '报名成功！')
  } catch (err) {
    showToast(err.message || '报名失败，请稍后重试')
  } finally {
    isJoining.value = false
  }
}

const fetchTournamentDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const [tournamentData, teamsData, matchesData] = await Promise.all([
      tournamentApi.getTournamentDetail(tournamentId.value),
      tournamentApi.getTournamentTeams(tournamentId.value),
      tournamentApi.getTournamentMatches(tournamentId.value)
    ])

    tournament.value = tournamentData
    teams.value = teamsData
    matches.value = matchesData
  } catch (err) {
    error.value = err.message || '加载赛事详情失败'
    console.error('获取赛事详情失败:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTournamentDetail()
})
</script>

<style scoped>
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  10% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  90% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}

.animate-fade-in-out {
  animation: fadeInOut 2s ease-in-out forwards;
}
</style>
