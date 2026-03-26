<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectedDuration = ref(1)
const selectedPaymentMethod = ref('wechat')

const playmateData = ref({
  id: 1,
  name: '沐沐酱',
  englishName: 'Mumu',
  game: '王者荣耀',
  rank: '国服核心',
  rating: 4.9,
  reviews: 1200,
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvBZJ1bNVIFN-np7subUrFxA6Bhyg7VwosCo5tIJr4ufDIjGLxMmrwxv9qeTH-ZsiY-KtYt9J49NDYUwSm8uUvp6TyqIgAczehL0SaZZp4vvZxyhCMR662q2YtVgWvel38x4CCw1MWyOQCbUlKMeU4-a9FeDJe_VyT6hz2STzfT170AB-G0TZGxWpjOukBRGDztoxZ5OVhmI71uzoxOZgEUtc5c1c74or2UPFcS92VdcDzVE6KIFBpLBG2ALcUlhQ_qhyxw2t0lY4',
  pricePerHour: 55.00
})

const durations = [1, 2, 3]

const paymentMethods = [
  { id: 'wechat', name: '微信支付', icon: 'account_balance_wallet', color: 'emerald' },
  { id: 'wallet', name: '钱包余额', icon: 'savings', color: 'yellow', balance: 0.00 }
]

const coupon = ref({
  available: true,
  discount: 10.00,
  description: '新用户立减 ¥10.00'
})

const serviceFee = ref(2.50)

const totalPrice = computed(() => {
  const basePrice = playmateData.value.pricePerHour * selectedDuration.value
  const discount = coupon.value.available ? coupon.value.discount : 0
  return basePrice + serviceFee.value - discount
})

const handleBack = () => {
  router.back()
}

const handleDurationSelect = (duration) => {
  selectedDuration.value = duration
}

const handlePaymentMethodSelect = (methodId) => {
  selectedPaymentMethod.value = methodId
}

const handleTimeSelect = () => {
  console.log('选择服务开始时间')
}

const handleCouponSelect = () => {
  console.log('选择优惠券')
}

const handlePayment = () => {
  console.log('立即支付')
  alert(`支付成功！订单金额：¥${totalPrice.value.toFixed(2)}`)
  router.push('/orders')
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-background">
    <!-- Top Navigation (Fixed) -->
    <header class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm shadow-yellow-500/5 flex justify-between items-center px-6 py-4">
      <div class="flex items-center gap-4">
        <button @click="handleBack" class="p-2 -ml-2 hover:bg-yellow-50 rounded-full transition-colors active:scale-95 duration-200">
          <span class="material-symbols-outlined text-on-surface">arrow_back_ios_new</span>
        </button>
        <h1 class="font-headline font-bold text-lg tracking-tight text-on-surface">确认订单</h1>
      </div>
      <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
        <img alt="用户头像" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuTSebVMYkB1HEV4zDNoHPN6NMXRtdFZ-I5JNQG4cYVe_lgJ7hHl9pry8X1FO-n0dPHgJGYBuBlC4q75LCGIWDaH_y2xkDOHy3O_8k6KW4g7ESyAIh97s2VaftOPKau3NG1FTAVfxBucQ4jkP-yzP9DivfWOMB1Jo6rbHUs0vIFLn7wevSviwe1O5uyg9OWtIHz0LD8ulqyxB-TU5B5oSkEM0mfJfIM6pLVdY-xVaez3_WrdP_EUwCMs-yA2myCQ0jJsbNEDwGDUc" />
      </div>
      <div class="absolute bottom-0 left-0 bg-zinc-100 h-[1px] w-full"></div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6 max-w-2xl mx-auto space-y-6">
      <!-- Service Summary Section (Asymmetric Editorial Style) -->
      <section class="bg-surface-container-lowest rounded-3xl p-6 relative overflow-hidden">
        <div class="flex gap-5 items-start relative z-10">
          <div class="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container">
            <img :alt="playmateData.name" class="w-full h-full object-cover" :src="playmateData.avatar" />
          </div>
          <div class="flex flex-col justify-between py-1">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{{ playmateData.game }}</span>
                <span class="text-secondary font-bold text-sm tracking-tight">{{ playmateData.rank }}</span>
              </div>
              <h2 class="font-headline text-2xl font-extrabold text-on-surface leading-tight">
                {{ playmateData.name }} <span class="text-primary-dim font-medium text-lg italic ml-1">{{ playmateData.englishName }}</span>
              </h2>
            </div>
            <p class="text-on-surface-variant text-sm mt-2 flex items-center gap-1">
              <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">star</span>
              {{ playmateData.rating }} ({{ playmateData.reviews }}+ 评价)
            </p>
          </div>
        </div>
        <!-- Editorial background accent -->
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl"></div>
      </section>

      <!-- Duration Selection (Bento Style) -->
      <section class="space-y-4">
        <h3 class="font-headline text-lg font-bold text-on-surface ml-1">选择服务时长</h3>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="duration in durations"
            :key="duration"
            @click="handleDurationSelect(duration)"
            :class="[
              'p-4 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform duration-200',
              selectedDuration === duration
                ? 'bg-primary-container text-on-primary-container border-2 border-transparent ring-4 ring-primary-container/20'
                : 'bg-surface-container-lowest text-on-surface border-2 border-transparent'
            ]"
          >
            <span class="font-black text-xl">{{ duration }}</span>
            <span class="text-xs font-bold opacity-80">小时</span>
          </button>
        </div>
      </section>

      <!-- Time and Coupon (Clean List Style) -->
      <section class="bg-surface-container-lowest rounded-3xl overflow-hidden">
        <div @click="handleTimeSelect" class="p-5 flex items-center justify-between hover:bg-yellow-50/50 transition-colors cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl" style="font-variation-settings: 'FILL' 1;">schedule</span>
            </div>
            <div>
              <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">服务开始时间</p>
              <p class="text-on-surface font-semibold">立即开始</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-zinc-300">chevron_right</span>
        </div>
        <div @click="handleCouponSelect" class="p-5 flex items-center justify-between hover:bg-yellow-50/50 transition-colors border-t border-surface-container-low/50 cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl" style="font-variation-settings: 'FILL' 1;">confirmation_number</span>
            </div>
            <div>
              <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">优惠券</p>
              <p class="secondary font-bold">{{ coupon.description }}</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-zinc-300">chevron_right</span>
        </div>
      </section>

      <!-- Payment Method -->
      <section class="space-y-4">
        <h3 class="font-headline text-lg font-bold text-on-surface ml-1">支付方式</h3>
        <div class="space-y-3">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            @click="handlePaymentMethodSelect(method.id)"
            :class="[
              'p-5 rounded-3xl flex items-center justify-between cursor-pointer',
              selectedPaymentMethod === method.id
                ? 'bg-surface-container-lowest border-2 border-primary ring-4 ring-primary-container/20'
                : 'bg-surface-container-lowest opacity-60'
            ]"
          >
            <div class="flex items-center gap-4">
              <div :class="`w-10 h-10 bg-${method.color}-50 text-${method.color}-600 rounded-full flex items-center justify-center`">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">{{ method.icon }}</span>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-on-surface">{{ method.name }}</span>
                <span v-if="method.id === 'wallet'" class="text-xs text-zinc-500">可用余额 ¥{{ method.balance.toFixed(2) }}</span>
              </div>
            </div>
            <div v-if="selectedPaymentMethod === method.id" class="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-sm font-bold">check</span>
            </div>
            <div v-else class="w-6 h-6 rounded-full border-2 border-zinc-200"></div>
          </div>
        </div>
      </section>

      <!-- Bill Details -->
      <section class="bg-surface-container-low/50 rounded-3xl p-6 space-y-3">
        <div class="flex justify-between items-center text-sm">
          <span class="text-on-surface-variant">服务费用 (¥{{ playmateData.pricePerHour.toFixed(2) }} × {{ selectedDuration }})</span>
          <span class="font-medium text-on-surface">¥{{ (playmateData.pricePerHour * selectedDuration).toFixed(2) }}</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-on-surface-variant">平台服务费</span>
          <span class="font-medium text-on-surface">¥{{ serviceFee.toFixed(2) }}</span>
        </div>
        <div v-if="coupon.available" class="flex justify-between items-center text-sm">
          <span class="text-on-surface-variant">优惠减免</span>
          <span class="font-bold text-error">-¥{{ coupon.discount.toFixed(2) }}</span>
        </div>
        <div class="pt-4 mt-2 border-t border-dashed border-zinc-300 flex justify-between items-end">
          <span class="font-headline font-bold text-on-surface">合计应付</span>
          <div class="flex items-baseline gap-1">
            <span class="text-sm font-bold text-primary">¥</span>
            <span class="text-3xl font-headline font-black text-on-surface">{{ totalPrice.toFixed(2) }}</span>
          </div>
        </div>
      </section>

      <!-- Bottom Action Bar (In Main) -->
      <section class="bg-surface-container-low rounded-3xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex flex-col">
            <span class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-0.5">实付款</span>
            <div class="flex items-baseline gap-1">
              <span class="text-sm font-black text-primary">¥</span>
              <span class="text-2xl font-black text-on-surface tracking-tight">{{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <button @click="handlePayment" class="w-full bg-primary-container text-on-primary-container font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 duration-200 ease-out shadow-lg shadow-yellow-500/20">
          <span>立即支付</span>
          <span class="material-symbols-outlined text-xl">flash_on</span>
        </button>
      </section>
    </main>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>