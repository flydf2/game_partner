<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import api from '../api/index.js'
import BottomNavBar from '../components/BottomNavBar.vue'
import Toast from '../components/common/Toast.vue'
import AppHeader from '../components/AppHeader.vue'

const DateTimePicker = defineAsyncComponent(() => import('../components/DateTimePicker.vue'))

const router = useRouter()

const toastShow = ref(false)
const toastMessage = ref('')
const toastType = ref('error')

const showToast = (message, type = 'error') => {
  toastMessage.value = message
  toastType.value = type
  toastShow.value = true
}

const hideToast = () => {
  toastShow.value = false
}

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
}

const getDefaultStartTime = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 15)
  return formatDate(now)
}

const getDefaultEndTime = () => {
  const now = new Date()
  now.setDate(now.getDate() + 7)
  return formatDate(now)
}

const games = [
  { id: 1, name: '英雄联盟', image: 'https://via.placeholder.com/96x128', active: true },
  { id: 2, name: '无畏契约', image: 'https://via.placeholder.com/96x128', active: false },
  { id: 3, name: '反恐精英2', image: 'https://via.placeholder.com/96x128', active: false },
  { id: 4, name: '王者荣耀', image: 'https://via.placeholder.com/96x128', active: false },
  { id: 5, name: '原神', image: 'https://via.placeholder.com/96x128', active: false },
  { id: 6, name: '绝地求生', image: 'https://via.placeholder.com/96x128', active: false }
]

const predefinedTags = [
  '上分', '排位', '教学', '娱乐', '语音', '高端局',
  '新手友好', '快速上分', '稳赢', '带飞', '陪练', '代打'
]

const gameRanks = [
  'unranked', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster'
]

const selectedGame = ref(null)
const content = ref('')
const rewardAmount = ref('')
const paymentMethod = ref('prepay')
const selectedTags = ref([])
const requirements = ref([''])
const loading = ref(false)
const showPrepayConfirm = ref(false)
const showPaymentWarning = ref(false)
const startTime = ref(getDefaultStartTime())
const timeLeft = ref(getDefaultEndTime())
const gameRank = ref('')
const duration = ref('')
const location = ref('')

const touched = ref({
  selectedGame: false,
  content: false,
  rewardAmount: false,
  selectedTags: false,
  requirements: false,
  timeLeft: false,
  gameRank: false,
  startTime: false,
  duration: false,
  location: false
})

const markAllTouched = () => {
  Object.keys(touched.value).forEach(key => {
    touched.value[key] = true
  })
}

const fieldHasError = (field) => {
  if (!touched.value[field]) return false
  switch (field) {
    case 'selectedGame': return !selectedGame.value
    case 'content': return !content.value.trim()
    case 'rewardAmount': return !rewardAmount.value || parseFloat(rewardAmount.value) <= 0
    case 'selectedTags': return selectedTags.value.length === 0
    case 'requirements': return !requirements.value.some(r => r.trim())
    case 'timeLeft': return !timeLeft.value
    case 'gameRank': return !gameRank.value
    case 'startTime': return !startTime.value
    case 'duration': return !duration.value || parseInt(duration.value) <= 0
    case 'location': return !location.value
    default: return false
  }
}

const getFieldError = (field) => {
  if (!fieldHasError(field)) return ''
  switch (field) {
    case 'selectedGame': return '请选择游戏'
    case 'content': return '请填写悬赏内容'
    case 'rewardAmount': return '请输入有效的赏金金额'
    case 'selectedTags': return '请至少选择一个标签'
    case 'requirements': return '请至少填写一个要求'
    case 'timeLeft': return '请选择截止时间'
    case 'gameRank': return '请选择游戏段位'
    case 'startTime': return '请选择开始时间'
    case 'duration': return '请输入有效的时长'
    case 'location': return '请填写位置信息'
    default: return ''
  }
}

const paymentMethods = [
  { value: 'prepay', label: '预付', description: '先付款后服务' },
  { value: 'postpay', label: '现付', description: '先服务后付款' }
]

const handleGameSelect = (game) => {
  selectedGame.value = game
}

const handleTagToggle = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const addRequirement = () => {
  requirements.value.push('')
}

const removeRequirement = (index) => {
  if (requirements.value.length > 1) {
    requirements.value.splice(index, 1)
  }
}

const updateRequirement = (index, value) => {
  requirements.value[index] = value
}

const isValid = computed(() => {
  return (
    selectedGame.value &&
    content.value.trim() &&
    parseFloat(rewardAmount.value) > 0 &&
    selectedTags.value.length > 0 &&
    requirements.value.some(r => r.trim()) &&
    timeLeft.value &&
    gameRank.value &&
    startTime.value &&
    duration.value &&
    location.value
  )
})

const handlePublish = async () => {
  markAllTouched()
  if (!isValid.value) {
    showToast('请检查表单中的红色提示项')
    return
  }

  showPaymentWarning.value = true
}

const handleCancel = () => {
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

const confirmPaymentMethod = () => {
  showPaymentWarning.value = false
  if (paymentMethod.value === 'prepay') {
    showPrepayConfirm.value = true
  } else {
    doPublish()
  }
}

const cancelPrepayConfirm = () => {
  showPrepayConfirm.value = false
}

const confirmPrepayAndPublish = () => {
  showPrepayConfirm.value = false
  doPublish()
}

const doPublish = async () => {
  loading.value = true
  try {
    const requestData = {
      game: selectedGame.value.name,
      content: content.value.trim(),
      reward: parseFloat(rewardAmount.value),
      paymentMethod: paymentMethod.value,
      requirements: requirements.value.filter(r => r.trim()),
      tags: selectedTags.value,
      timeLeft: timeLeft.value,
      gameRank: gameRank.value,
      startTime: startTime.value,
      duration: parseInt(duration.value),
      location: location.value
    }

    const response = await api.rewardOrder.publishReward(requestData)

    if (response.success) {
      router.push('/reward')
    }
  } catch (err) {
    console.error('发布悬赏失败:', err)
    showToast(err.message || '发布失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <AppHeader
      title="发布悬赏"
      :show-back="true"
      :show-notifications="true"
      :show-search="true"
      :show-avatar="true"
      @back="handleCancel"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content space-y-6">
      <!-- Section: Game Selection -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-on-surface font-headline font-bold text-lg">选择游戏</h2>
        </div>
        <div class="flex gap-4 overflow-x-auto hide-scrollbar py-2">
          <div
            v-for="game in games"
            :key="game.id"
            @click="handleGameSelect(game); touched.selectedGame = true"
            :class="[
              'flex-shrink-0 w-24 aspect-[3/4] rounded-xl p-0.5 relative overflow-hidden transition-all',
              selectedGame && selectedGame.id === game.id ? 'bg-primary-container ring-2 ring-primary' : fieldHasError('selectedGame') ? 'ring-2 ring-error' : 'bg-surface-container-highest'
            ]"
          >
            <img :alt="game.name" class="w-full h-full object-cover rounded-[0.6rem]" :src="game.image" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
              <span class="text-white text-[10px] font-bold">{{ game.name }}</span>
            </div>
            <div v-if="selectedGame && selectedGame.id === game.id" class="absolute top-1 right-1 bg-primary text-on-primary-container rounded-full p-0.5">
              <span class="material-symbols-outlined text-[14px] font-bold">check</span>
            </div>
          </div>
        </div>
        <p v-if="fieldHasError('selectedGame')" class="text-error text-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">error</span>
          {{ getFieldError('selectedGame') }}
        </p>
      </section>

      <!-- Section: Content -->
      <section class="space-y-3">
        <label class="block text-on-surface font-headline font-bold text-lg">悬赏内容</label>
        <textarea
          v-model="content"
          @blur="touched.content = true"
          :class="[
            'w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm placeholder:text-outline/50 resize-none',
            fieldHasError('content') ? 'ring-2 ring-error' : ''
          ]"
          placeholder="描述你的需求，例如：寻找荣耀王者陪玩，教我玩貂蝉..."
          rows="3"
        ></textarea>
        <p v-if="fieldHasError('content')" class="text-error text-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">error</span>
          {{ getFieldError('content') }}
        </p>
      </section>

      <!-- Section: Reward Amount -->
      <section class="space-y-3">
        <label class="block text-on-surface font-headline font-bold text-lg">赏金金额</label>
        <div :class="['bg-surface-container-high rounded-2xl p-4 flex items-center gap-3 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300', fieldHasError('rewardAmount') ? 'ring-2 ring-error' : '']">
          <span class="text-primary font-bold text-2xl">¥</span>
          <input
            v-model="rewardAmount"
            @blur="touched.rewardAmount = true"
            class="bg-transparent border-none focus:ring-0 text-xl font-bold w-full placeholder:text-outline/50"
            placeholder="0.00"
            type="number"
            step="0.01"
            min="0"
          />
        </div>
        <p v-if="fieldHasError('rewardAmount')" class="text-error text-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">error</span>
          {{ getFieldError('rewardAmount') }}
        </p>
      </section>

      <!-- Section: Payment Method -->
      <section class="space-y-3">
        <label class="block text-on-surface font-headline font-bold text-lg">支付方式</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="method in paymentMethods"
            :key="method.value"
            @click="paymentMethod = method.value"
            :class="[
              'p-4 rounded-2xl transition-all text-left',
              paymentMethod === method.value
                ? 'bg-primary-container ring-2 ring-primary'
                : 'bg-surface-container-high hover:bg-surface-container-highest'
            ]"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-primary">
                {{ method.value === 'prepay' ? 'payments' : 'account_balance_wallet' }}
              </span>
              <span class="font-bold text-on-surface">{{ method.label }}</span>
            </div>
            <p class="text-xs text-on-surface-variant">{{ method.description }}</p>
          </button>
        </div>
      </section>

      <!-- Section: Tags -->
      <section class="space-y-3">
        <label class="block text-on-surface font-headline font-bold text-lg">标签</label>
        <p class="text-xs text-on-surface-variant">选择标签让大神更快找到你</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in predefinedTags"
            :key="tag"
            @click="handleTagToggle(tag); touched.selectedTags = true"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              selectedTags.includes(tag)
                ? 'bg-primary-container text-on-primary-container ring-1 ring-primary'
                : fieldHasError('selectedTags') ? 'bg-error-container text-error ring-1 ring-error' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            ]"
          >
            {{ tag }}
          </button>
        </div>
        <p v-if="fieldHasError('selectedTags')" class="text-error text-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">error</span>
          {{ getFieldError('selectedTags') }}
        </p>
      </section>

      <!-- Section: Requirements -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="block text-on-surface font-headline font-bold text-lg">要求</label>
          <button
            @click="addRequirement"
            class="flex items-center gap-1 text-primary text-sm font-medium"
          >
            <span class="material-symbols-outlined text-lg">add</span>
            添加要求
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="(requirement, index) in requirements"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              :value="requirement"
              @input="updateRequirement(index, $event.target.value); touched.requirements = true"
              @blur="touched.requirements = true"
              :class="[
                'flex-1 bg-surface-container-high rounded-xl border-none px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm placeholder:text-outline/50',
                fieldHasError('requirements') && index === 0 ? 'ring-2 ring-error' : ''
              ]"
              :placeholder="`要求 ${index + 1}`"
            />
            <button
              v-if="requirements.length > 1"
              @click="removeRequirement(index)"
              class="p-2 text-error hover:bg-error-container rounded-full transition-colors"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
        <p v-if="fieldHasError('requirements')" class="text-error text-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">error</span>
          {{ getFieldError('requirements') }}
        </p>
      </section>

      <!-- Section: Time and Rank -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-on-surface font-headline font-bold text-lg">时间与段位</h2>
        </div>

        <!-- Start Time -->
        <div class="space-y-2">
          <label class="block text-on-surface font-medium text-sm">开始时间</label>
          <DateTimePicker
            v-model="startTime"
            @change="touched.startTime = true"
            :class="['w-full bg-surface-container-high rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm', fieldHasError('startTime') ? 'ring-2 ring-error' : '']"
          />
          <p v-if="fieldHasError('startTime')" class="text-error text-sm flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">error</span>
            {{ getFieldError('startTime') }}
          </p>
        </div>

        <!-- End Time -->
        <div class="space-y-2">
          <label class="block text-on-surface font-medium text-sm">截止时间</label>
          <DateTimePicker
            v-model="timeLeft"
            @change="touched.timeLeft = true"
            :class="['w-full bg-surface-container-high rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm', fieldHasError('timeLeft') ? 'ring-2 ring-error' : '']"
          />
          <p v-if="fieldHasError('timeLeft')" class="text-error text-sm flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">error</span>
            {{ getFieldError('timeLeft') }}
          </p>
        </div>

        <!-- Duration -->
        <div class="space-y-2">
          <label class="block text-on-surface font-medium text-sm">时长 (小时)</label>
          <input
            v-model="duration"
            @blur="touched.duration = true"
            :class="['w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm', fieldHasError('duration') ? 'ring-2 ring-error' : '']"
            placeholder="输入时长"
            type="number"
            min="1"
          />
          <p v-if="fieldHasError('duration')" class="text-error text-sm flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">error</span>
            {{ getFieldError('duration') }}
          </p>
        </div>

        <!-- Game Rank -->
        <div class="space-y-2">
          <label class="block text-on-surface font-medium text-sm">游戏段位</label>
          <select
            v-model="gameRank"
            @change="touched.gameRank = true"
            :class="['w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm', fieldHasError('gameRank') ? 'ring-2 ring-error' : '']"
          >
            <option value="">请选择段位</option>
            <option v-for="rank in gameRanks" :key="rank" :value="rank">
              {{ rank }}
            </option>
          </select>
          <p v-if="fieldHasError('gameRank')" class="text-error text-sm flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">error</span>
            {{ getFieldError('gameRank') }}
          </p>
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <label class="block text-on-surface font-medium text-sm">位置信息</label>
          <input
            v-model="location"
            @blur="touched.location = true"
            :class="['w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm', fieldHasError('location') ? 'ring-2 ring-error' : '']"
            placeholder="输入位置信息"
            type="text"
          />
          <p v-if="fieldHasError('location')" class="text-error text-sm flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">error</span>
            {{ getFieldError('location') }}
          </p>
        </div>
      </section>

      <!-- Info Box -->
      <div class="p-4 rounded-2xl bg-tertiary-container/10 border border-tertiary-container/20 flex items-start gap-3">
        <span class="material-symbols-outlined text-tertiary text-lg">info</span>
        <p class="text-xs text-on-tertiary-container leading-relaxed">
          发布悬赏后，大神们可以申请抢单。您可以从申请者中选择合适的大神进行服务。悬赏金将在服务完成后自动结算至对方钱包。
        </p>
      </div>
    </main>

    <BottomNavBar />

    <!-- Toast -->
    <Toast
      :show="toastShow"
      :message="toastMessage"
      :type="toastType"
      @close="hideToast"
    />

    <!-- Bottom Action Area -->
    <div class="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50">
      <div class="max-w-md mx-auto">
        <button
          @click="handlePublish"
          :disabled="loading || !isValid"
          class="w-full bg-primary-container text-on-primary-container py-4 rounded-full font-headline font-extrabold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(255,215,0,0.25)]"
          :class="(loading || !isValid) ? 'opacity-50 cursor-not-allowed' : ''"
        >
          <span v-if="loading">发布中...</span>
          <template v-else>
            立即发布
            <span class="material-symbols-outlined font-bold">rocket_launch</span>
          </template>
        </button>
      </div>
    </div>

    <!-- Payment Warning Dialog -->
    <div v-if="showPaymentWarning" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-5">
      <div class="bg-surface rounded-3xl w-full max-w-sm p-6 space-y-5">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-warning text-3xl">info</span>
          <h3 class="font-bold text-lg text-on-surface">支付方式提示</h3>
        </div>
        <p class="text-on-surface-variant text-sm leading-relaxed">
          您选择的支付方式为 <span class="font-bold text-on-surface">{{ paymentMethod === 'prepay' ? '预付' : '现付' }}</span>。
        </p>
        <div class="bg-surface-container-high rounded-xl p-4 space-y-2 text-sm">
          <p class="text-on-surface font-medium">预付说明：</p>
          <p class="text-on-surface-variant">赏金将在服务完成前预先托管，安全性高，但资金占用时间较长。</p>
          <p class="text-on-surface font-medium mt-3">现付说明：</p>
          <p class="text-on-surface-variant">服务完成后再支付，资金灵活，但存在一定交易风险。</p>
        </div>
        <p class="text-on-surface-variant text-sm">不同支付方式会产生不同的扣款时点和金额，请确认您的选择。</p>
        <div class="flex gap-3 pt-2">
          <button
            @click="showPaymentWarning = false"
            class="flex-1 py-3 rounded-full bg-surface-container-high text-on-surface font-medium"
          >
            取消
          </button>
          <button
            @click="confirmPaymentMethod"
            class="flex-1 py-3 rounded-full bg-primary text-on-primary font-medium"
          >
            确认发布
          </button>
        </div>
      </div>
    </div>

    <!-- Prepay Confirmation Dialog -->
    <div v-if="showPrepayConfirm" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-5">
      <div class="bg-surface rounded-3xl w-full max-w-sm p-6 space-y-5">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-error text-3xl">payments</span>
          <h3 class="font-bold text-lg text-on-surface">确认预付</h3>
        </div>
        <p class="text-on-surface-variant text-sm leading-relaxed">
          您选择的是预付方式，赏金 <span class="font-bold text-on-surface text-xl">¥{{ rewardAmount }}</span> 将立即从您的账户余额中扣除。
        </p>
        <p class="text-on-surface-variant text-sm">预付可以确保大神优先接单，但扣款后将无法主动撤回，请确认后再发布悬赏。</p>
        <div class="flex gap-3 pt-2">
          <button
            @click="cancelPrepayConfirm"
            class="flex-1 py-3 rounded-full bg-surface-container-high text-on-surface font-medium"
          >
            取消发布
          </button>
          <button
            @click="confirmPrepayAndPublish"
            class="flex-1 py-3 rounded-full bg-primary text-on-primary font-medium"
          >
            确认预付并发布
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
