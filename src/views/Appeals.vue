<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { appealApi, handleApiError } from '../api/index.js'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()

const activeTab = ref('all')

const appeals = ref([])
const loading = ref(false)
const error = ref('')

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待处理' },
  { id: 'processing', label: '处理中' },
  { id: 'completed', label: '已完成' }
]

const loadAppeals = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await appealApi.getAppeals()
    if (response.success || response.code === 0) {
      appeals.value = response.data || []
    } else {
      throw new Error(response.message || response.msg || '获取申诉列表失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    error.value = result.error
    console.error('获取申诉列表失败:', err)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
}

const handleBack = () => {
  router.back()
}

const handleViewDetail = (appeal) => {
  console.log('查看申诉详情:', appeal.id)
}

const handleAppeal = () => {
  console.log('去申诉')
}

const filteredAppeals = ref(appeals.value)

onMounted(() => {
  loadAppeals()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="flex justify-between items-center px-5 h-16 w-full fixed top-0 z-50 bg-surface-container-highest/50 backdrop-blur-xl">
      <div class="flex items-center gap-4">
        <span @click="handleBack" class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity">
          arrow_back
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">我的申诉</h1>
      </div>
      <div class="w-6"></div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-error/10 border border-error/20 rounded-3xl p-8 text-center">
        <span class="material-symbols-outlined text-error text-4xl mb-4">error_outline</span>
        <p class="text-sm text-error mb-4">{{ error }}</p>
        <button
          @click="loadAppeals"
          class="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          重试
        </button>
      </div>

      <!-- Tabs Section -->
      <div class="flex items-center justify-between py-6 overflow-x-auto no-scrollbar gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabChange(tab.id)"
          :class="[
            'flex-none px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap shadow-sm',
            activeTab === tab.id
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high transition-colors'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Appeals List -->
      <div v-if="filteredAppeals.length > 0" class="space-y-4">
        <div
          v-for="appeal in filteredAppeals"
          :key="appeal.id"
          class="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.02)] transition-all hover:scale-[1.01]"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="space-y-1">
              <div class="text-[10px] text-on-surface-variant font-headline tracking-wider uppercase">单号: {{ appeal.id }}</div>
              <div class="text-sm font-bold text-on-surface flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs" style="font-variation-settings: 'FILL' 1;">
                  {{ appeal.status === 'processing' ? 'warning' : appeal.status === 'completed' ? 'verified_user' : 'person_off' }}
                </span>
                {{ appeal.type }}
              </div>
            </div>
            <span :class="['px-3 py-1 text-[11px] font-bold rounded-full', appeal.statusClass]">
              {{ appeal.statusText }}
            </span>
          </div>
          
          <div class="flex items-center gap-4 py-3 bg-surface-container-low/50 rounded-xl px-4">
            <img
              :alt="appeal.target.name"
              class="w-10 h-10 rounded-full object-cover border-2 border-white"
              :src="appeal.target.avatar"
            />
            <div>
              <div class="text-xs text-on-surface-variant">申诉对象</div>
              <div class="text-sm font-semibold text-on-surface">{{ appeal.target.name }}</div>
            </div>
          </div>
          
          <div class="mt-4 flex items-center justify-between">
            <div class="text-[11px] text-on-surface-variant">提交时间: {{ appeal.submitTime }}</div>
            <button @click="handleViewDetail(appeal)" class="text-sm font-bold text-primary flex items-center gap-1 active:opacity-60 transition-opacity">
              查看详情
              <span class="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-4xl text-neutral-400" style="font-variation-settings: 'FILL' 0;">history_edu</span>
        </div>
        <h3 class="text-lg font-bold text-on-surface mb-2">暂无申诉记录</h3>
        <p class="text-sm text-on-surface-variant max-w-[200px]">你还没有提交过任何申诉。如有需要请联系客服。</p>
        <button @click="handleAppeal" class="mt-8 px-8 py-3 bg-primary-container text-on-primary-container font-bold rounded-full shadow-lg active:scale-95 transition-transform">
          去申诉
        </button>
      </div>
    </main>

    <BottomNavBar />

    <nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl z-50 rounded-t-[1.5rem] shadow-[0_-4px_20px_0_rgba(0,0,0,0.04)]">
      <div @click="router.push('/')" class="flex flex-col items-center justify-center text-neutral-400 px-5 py-1.5 hover:bg-neutral-100 transition-all scale-90 duration-300 ease-out cursor-pointer">
        <span class="material-symbols-outlined mb-1">grid_view</span>
        <span class="text-[10px] font-medium font-headline">首页</span>
      </div>
      <div @click="router.push('/discover')" class="flex flex-col items-center justify-center text-neutral-400 px-5 py-1.5 hover:bg-neutral-100 transition-all scale-90 duration-300 ease-out cursor-pointer">
        <span class="material-symbols-outlined mb-1">sports_esports</span>
        <span class="text-[10px] font-medium font-headline">约玩</span>
      </div>
      <div class="flex flex-col items-center justify-center text-neutral-400 px-5 py-1.5 hover:bg-neutral-100 transition-all scale-90 duration-300 ease-out cursor-pointer">
        <span class="material-symbols-outlined mb-1">chat_bubble</span>
        <span class="text-[10px] font-medium font-headline">消息</span>
      </div>
      <div @click="router.push('/profile')" class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-2xl px-5 py-1.5 transition-all scale-90 duration-300 ease-out cursor-pointer">
        <span class="material-symbols-outlined mb-0.5" style="font-variation-settings: 'FILL' 1;">person</span>
        <span class="text-[10px] font-bold font-headline">我的</span>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>