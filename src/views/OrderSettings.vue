<template>
  <div class="min-h-screen bg-surface text-on-surface pb-24">
    <ListPageHeader
      title="接单设置中心"
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />
    
    <main class="max-w-4xl mx-auto px-5 pt-24 space-y-8">
      <!-- Status & One-click Sleep Section (Asymmetric Bento) -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_4px_20px_0_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h2 class="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">大神状态控制</h2>
            <p class="text-on-surface-variant text-sm mb-6">当前状态：<span class="text-primary font-bold">{{ statusText }}</span></p>
          </div>
          <div class="flex items-center gap-4">
            <button 
              class="flex-1 font-bold py-4 rounded-full transition-all duration-300 shadow-sm relative overflow-hidden"
              :class="[
                status === 'online' 
                  ? 'bg-green-500 text-white ring-2 ring-green-400/50 scale-105 shadow-lg' 
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
              ]"
              @click="toggleStatus('online')"
            >
              <span class="relative z-10">保持在线</span>
              <span v-if="status === 'online'" class="absolute inset-0 bg-white/20 animate-pulse"></span>
            </button>
            <button 
              class="flex-1 font-bold py-4 rounded-full transition-all duration-300 hover:bg-surface-container-high"
              :class="[
                status === 'offline' 
                  ? 'bg-red-500 text-white ring-2 ring-red-400/50 scale-105 shadow-lg' 
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
              ]"
              @click="toggleStatus('offline')"
            >
              一键休眠
            </button>
          </div>
        </div>
        <div class="bg-primary-container p-8 rounded-[2rem] flex flex-col justify-center items-center text-center">
          <span class="material-symbols-outlined text-5xl mb-4 text-on-primary-container" style="font-variation-settings: 'FILL' 1;">bolt</span>
          <p class="text-on-primary-container font-headline font-bold text-xl leading-tight">今日已获得<br/>{{ todayRecommendations }} 次派单推荐</p>
        </div>
      </section>

      <!-- Service Price Modification -->
      <section>
        <div class="flex items-center justify-between mb-4 px-2">
          <h3 class="text-xl font-headline font-bold text-on-surface">服务项目与定价</h3>
          <span class="material-symbols-outlined text-on-surface-variant">edit_note</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ServiceCard 
            v-for="service in services" 
            :key="service.id"
            :service="service"
            @edit="handleEditService"
          />
        </div>
      </section>

      <!-- Time Slots & Auto-reply Grid -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <!-- Time Setting -->
        <div class="bg-surface-container-lowest p-8 rounded-[2rem]">
          <div class="flex items-center gap-3 mb-6">
            <span class="material-symbols-outlined text-primary">schedule</span>
            <h3 class="font-bold text-lg">接单时间段</h3>
          </div>
          <div class="space-y-4">
            <div 
              class="flex items-center justify-between p-4 bg-surface rounded-2xl cursor-pointer hover:bg-surface-container transition-colors"
              @click="openTimePicker('weekday')"
            >
              <span class="text-sm font-medium">工作日</span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-headline font-bold text-primary">{{ timeSlots.weekday.start }} - {{ timeSlots.weekday.end }}</span>
                <span class="material-symbols-outlined text-outline text-lg">chevron_right</span>
              </div>
            </div>
            <div 
              class="flex items-center justify-between p-4 bg-surface rounded-2xl cursor-pointer hover:bg-surface-container transition-colors"
              @click="openTimePicker('weekend')"
            >
              <span class="text-sm font-medium">周末/节假日</span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-headline font-bold text-primary">{{ timeSlots.weekend.start }} - {{ timeSlots.weekend.end }}</span>
                <span class="material-symbols-outlined text-outline text-lg">chevron_right</span>
              </div>
            </div>
            <button 
              class="w-full mt-2 text-xs text-primary font-bold py-2 border-2 border-primary/10 rounded-xl hover:bg-primary/5 transition-colors"
              @click="showTimePicker = true"
            >
              修改营业时间
            </button>
          </div>
        </div>

        <!-- Auto-reply Setting -->
        <div class="bg-surface-container-lowest p-8 rounded-[2rem]">
          <div class="flex items-center gap-3 mb-6">
            <span class="material-symbols-outlined text-primary">auto_awesome</span>
            <h3 class="font-bold text-lg">自动回复话术</h3>
          </div>
          <div class="relative">
            <textarea
              ref="replyTextarea"
              v-model="replyText"
              class="w-full bg-surface border-none rounded-2xl p-4 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none transition-all"
              placeholder="输入接单后的自动回复内容..."
              @input="updateCharCount"
            ></textarea>
            <div class="absolute bottom-3 right-3 flex items-center gap-2">
              <span 
                class="text-[10px] transition-colors duration-300"
                :class="charCount > 100 ? 'text-error' : 'text-outline'"
              >{{ charCount }}/100</span>
              <button 
                class="p-1.5 rounded-lg transition-all"
                :class="charCount > 0 ? 'bg-primary-container text-on-primary-container hover:bg-primary' : 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed'"
                :disabled="charCount === 0"
                @click="saveReply"
              >
                <span class="material-symbols-outlined text-base">check</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- BottomNavBar -->
    <BottomNavBar />

    <!-- Time Picker Dialog -->
    <div v-if="showTimePicker" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5 backdrop-blur-sm">
      <div class="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-md animate-in fade-in-90 slide-in-from-bottom-5">
        <h3 class="text-xl font-bold text-on-surface font-headline mb-6 text-center">设置接单时间段</h3>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-on-surface mb-3">工作日</label>
            <div class="flex items-center gap-3">
              <div class="relative flex-1">
                <select 
                  v-model="timeSlots.weekday.start"
                  class="w-full bg-surface border border-outline rounded-xl px-4 py-3 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                >
                  <option value="00:00">00:00</option>
                  <option value="01:00">01:00</option>
                  <option value="02:00">02:00</option>
                  <option value="03:00">03:00</option>
                  <option value="04:00">04:00</option>
                  <option value="05:00">05:00</option>
                  <option value="06:00">06:00</option>
                  <option value="07:00">07:00</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </select>
                <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">开始</span>
              </div>
              <span class="text-outline">-</span>
              <div class="relative flex-1">
                <select 
                  v-model="timeSlots.weekday.end"
                  class="w-full bg-surface border border-outline rounded-xl px-4 py-3 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                >
                  <option value="00:00">00:00</option>
                  <option value="01:00">01:00</option>
                  <option value="02:00">02:00</option>
                  <option value="03:00">03:00</option>
                  <option value="04:00">04:00</option>
                  <option value="05:00">05:00</option>
                  <option value="06:00">06:00</option>
                  <option value="07:00">07:00</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </select>
                <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">结束</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-on-surface mb-3">周末/节假日</label>
            <div class="flex items-center gap-3">
              <div class="relative flex-1">
                <select 
                  v-model="timeSlots.weekend.start"
                  class="w-full bg-surface border border-outline rounded-xl px-4 py-3 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                >
                  <option value="00:00">00:00</option>
                  <option value="01:00">01:00</option>
                  <option value="02:00">02:00</option>
                  <option value="03:00">03:00</option>
                  <option value="04:00">04:00</option>
                  <option value="05:00">05:00</option>
                  <option value="06:00">06:00</option>
                  <option value="07:00">07:00</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </select>
                <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">开始</span>
              </div>
              <span class="text-outline">-</span>
              <div class="relative flex-1">
                <select 
                  v-model="timeSlots.weekend.end"
                  class="w-full bg-surface border border-outline rounded-xl px-4 py-3 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                >
                  <option value="00:00">00:00</option>
                  <option value="01:00">01:00</option>
                  <option value="02:00">02:00</option>
                  <option value="03:00">03:00</option>
                  <option value="04:00">04:00</option>
                  <option value="05:00">05:00</option>
                  <option value="06:00">06:00</option>
                  <option value="07:00">07:00</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </select>
                <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">结束</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button 
            class="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-low"
            @click="showTimePicker = false"
          >
            取消
          </button>
          <button 
            class="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm transition-all active:scale-95 hover:bg-primary-dim"
            @click="saveTimeSlots"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- Service Price Edit Dialog -->
    <div v-if="showServiceDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5 backdrop-blur-sm">
      <div class="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-md animate-in fade-in-90 slide-in-from-bottom-5">
        <h3 class="text-xl font-bold text-on-surface font-headline mb-6 text-center">编辑服务价格</h3>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-on-surface mb-2">服务名称</label>
            <p class="text-sm text-on-surface-variant">{{ selectedService?.name }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-on-surface mb-2">服务描述</label>
            <p class="text-sm text-on-surface-variant">{{ selectedService?.description }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-on-surface mb-2">每小时价格（元）</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">¥</span>
              <input 
                v-model.number="priceInput"
                type="number"
                min="0"
                max="999"
                class="w-full bg-surface border border-outline rounded-xl pl-8 pr-4 py-3 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <p class="text-[10px] text-on-surface-variant mt-2">价格范围：0-999元</p>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button 
            class="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-low"
            @click="showServiceDialog = false"
          >
            取消
          </button>
          <button 
            class="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm transition-all active:scale-95 hover:bg-primary-dim"
            :disabled="!isValidPrice"
            @click="saveServicePrice"
          >
            保存价格
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast.js'
import ListPageHeader from '../components/ListPageHeader.vue'

const router = useRouter()
const TopAppBar = defineAsyncComponent(() => import('../components/TopAppBar.vue'))
const BottomNavBar = defineAsyncComponent(() => import('../components/BottomNavBar.vue'))

const { showToast } = useToast()

const status = ref('online')
const statusText = computed(() => status.value === 'online' ? '在线接单中' : '已休眠')
const todayRecommendations = ref(12)

const toggleStatus = (newStatus) => {
  status.value = newStatus
  showToast(newStatus === 'online' ? '已切换至在线接单' : '已进入休眠状态', 'success')
}

const services = ref([
  { 
    id: 1, 
    name: '王者荣耀', 
    description: '排位/匹配陪练', 
    price: 45, 
    status: 'adjusting',
    icon: 'sports_esports' 
  },
  { 
    id: 2, 
    name: '语音连麦', 
    description: '聊天/哄睡/叫醒', 
    price: 30, 
    status: 'published',
    icon: 'keyboard_voice' 
  }
])

const showServiceDialog = ref(false)
const selectedService = ref(null)
const priceInput = ref(0)

const handleEditService = (service) => {
  selectedService.value = service
  priceInput.value = service.price
  showServiceDialog.value = true
}

const isValidPrice = computed(() => {
  return priceInput.value > 0 && priceInput.value <= 999
})

const saveServicePrice = () => {
  if (selectedService.value && isValidPrice.value) {
    selectedService.value.price = priceInput.value
    showToast('服务价格已更新', 'success')
    showServiceDialog.value = false
  }
}

const timeSlots = ref({
  weekday: { start: '19:00', end: '02:00' },
  weekend: { start: '10:00', end: '03:00' }
})

const showTimePicker = ref(false)

const openTimePicker = (type) => {
  showTimePicker.value = true
}

const saveTimeSlots = () => {
  showToast('营业时间已保存', 'success')
  showTimePicker.value = false
}

const replyText = ref('你好呀！刚才正在游戏中，现在已经看到你的订单啦，马上就来找你，等我一分钟哦~ 🍊')
const charCount = computed(() => replyText.value.length)

const updateCharCount = () => {
  nextTick(() => {
    charCount.value = replyText.value.length
  })
}

const saveReply = () => {
  if (replyText.value.trim()) {
    showToast('自动回复话术已保存', 'success')
  } else {
    showToast('请输入回复内容', 'warning')
  }
}

const handleMenu = () => {
  router.push('/profile')
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
</script>
