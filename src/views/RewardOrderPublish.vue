<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'
import BottomNavBar from '../components/BottomNavBar.vue'

const router = useRouter()

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
const showPaymentWarning = ref(false)
const showPrepayConfirm = ref(false)
const timeLeft = ref('')
const gameRank = ref('')
const startTime = ref('')
const duration = ref('')
const location = ref('')

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
  if (!isValid.value) {
    if (!selectedGame.value) {
      alert('请选择游戏')
      return
    }
    if (!content.value.trim()) {
      alert('请填写悬赏内容')
      return
    }
    if (!rewardAmount.value || parseFloat(rewardAmount.value) <= 0) {
      alert('请输入有效的赏金金额')
      return
    }
    if (selectedTags.value.length === 0) {
      alert('请至少选择一个标签')
      return
    }
    if (!requirements.value.some(r => r.trim())) {
      alert('请至少填写一个要求')
      return
    }
    if (!timeLeft.value) {
      alert('请选择截止时间')
      return
    }
    if (!gameRank.value) {
      alert('请选择游戏段位')
      return
    }
    if (!startTime.value) {
      alert('请选择开始时间')
      return
    }
    if (!duration.value || parseInt(duration.value) <= 0) {
      alert('请输入有效的时长')
      return
    }
    if (!location.value) {
      alert('请填写位置信息')
      return
    }
    showPaymentWarning.value = true
    return
  }
  
  showPaymentWarning.value = true
}

const handleCancel = () => {
  router.back()
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
    alert(err.message || '发布失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-outline-variant/20">
      <div class="flex items-center gap-4">
        <button
          @click="handleCancel"
          class="active:scale-95 duration-200 transition-opacity hover:opacity-80"
        >
          <span class="material-symbols-outlined text-primary">close</span>
        </button>
        <h1 class="font-headline font-bold text-lg tracking-tight text-primary">发布悬赏</h1>
      </div>
      <div class="w-8 h-8 rounded-full overflow-hidden">
        <img alt="User Avatar" class="w-full h-full object-cover" src="https://via.placeholder.com/32" />
      </div>
    </header>

    <main class="page-content pt-20 px-5 space-y-6">
      <!-- Section: Game Selection -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-on-surface font-headline font-bold text-lg">选择游戏</h2>
        </div>
        <div class="flex gap-4 overflow-x-auto hide-scrollbar py-2">
          <div
            v-for="game in games"
            :key="game.id"
            @click="handleGameSelect(game)"
            :class="[
              'flex-shrink-0 w-24 aspect-[3/4] rounded-xl p-0.5 relative overflow-hidden transition-all',
              selectedGame && selectedGame.id === game.id ? 'bg-primary-container ring-2 ring-primary' : 'bg-surface-container-highest'
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
      </section>

      <!-- Section: Content -->
      <section class="space-y-3">
        <label class="block text-on-surface font-headline font-bold text-lg">悬赏内容</label>
        <textarea
          v-model="content"
          class="w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm placeholder:text-outline/50 resize-none"
          placeholder="描述你的需求，例如：寻找荣耀王者陪玩，教我玩貂蝉..."
          rows="3"
        ></textarea>
      </section>

      <!-- Section: Reward Amount -->
      <section class="space-y-3">
        <label class="block text-on-surface font-headline font-bold text-lg">赏金金额</label>
        <div class="bg-surface-container-high rounded-2xl p-4 flex items-center gap-3 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
          <span class="text-primary font-bold text-2xl">¥</span>
          <input
            v-model="rewardAmount"
            class="bg-transparent border-none focus:ring-0 text-xl font-bold w-full placeholder:text-outline/50"
            placeholder="0.00"
            type="number"
            step="0.01"
            min="0"
          />
        </div>
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
            @click="handleTagToggle(tag)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              selectedTags.includes(tag)
                ? 'bg-primary-container text-on-primary-container ring-1 ring-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            ]"
          >
            {{ tag }}
          </button>
        </div>
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
              @input="updateRequirement(index, $event.target.value)"
              class="flex-1 bg-surface-container-high rounded-xl border-none px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm placeholder:text-outline/50"
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
      </section>

      <!-- Section: Time and Rank -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-on-surface font-headline font-bold text-lg">时间与段位</h2>
        </div>
        
        <!-- Start Time -->
        <div class="space-y-2">
          <label class="block text-on-surface font-medium text-sm">开始时间</label>
          <input
            v-model="startTime"
            type="datetime-local"
            class="w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm"
          />
        </div>
        
        <!-- End Time -->
        <div class="space-y-2">
          <label class="block text-on-surface font-medium text-sm">截止时间</label>
          <input
            v-model="timeLeft"
            type="datetime-local"
            class="w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm"
          />
        </div>
        
        <!-- Duration -->
        <div class="space-y-2">
          <label class="block text-on-surface font-medium text-sm">时长 (小时)</label>
          <input
            v-model="duration"
            type="number"
            min="1"
            class="w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm"
            placeholder="输入时长"
          />
        </div>
        
        <!-- Game Rank -->
        <div class="space-y-2">
          <label class="block text-on-surface font-medium text-sm">游戏段位</label>
          <select
            v-model="gameRank"
            class="w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm"
          >
            <option value="">请选择段位</option>
            <option v-for="rank in gameRanks" :key="rank" :value="rank">
              {{ rank }}
            </option>
          </select>
        </div>
        
        <!-- Location -->
        <div class="space-y-2">
          <label class="block text-on-surface font-medium text-sm">位置信息</label>
          <input
            v-model="location"
            type="text"
            class="w-full bg-surface-container-high rounded-2xl border-none p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 text-sm"
            placeholder="输入位置信息"
          />
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
