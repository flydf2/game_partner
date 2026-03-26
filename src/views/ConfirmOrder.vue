<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { expertApi, orderApi, handleApiError } from '../api'

const route = useRoute()
const router = useRouter()

const expertId = ref(route.query.expertId || '1')
const expert = ref(null)
const loading = ref(true)
const selectedCoupon = ref(null)
const coupons = ref([
  {
    id: 1,
    title: '新人专享',
    discount: 10,
    type: 'discount',
    description: '首次下单立减10元'
  }
])

const serviceDuration = ref(2)
const serviceDate = ref('2026-03-15')
const serviceTime = ref('20:00')
const isSubmitting = ref(false)

const serviceFee = computed(() => {
  if (!expert.value) return 0
  return expert.value.price * serviceDuration.value
})

const platformFee = computed(() => 5)

const couponDiscount = computed(() => {
  if (!selectedCoupon.value) return 0
  return selectedCoupon.value.discount
})

const totalAmount = computed(() => {
  return serviceFee.value + platformFee.value - couponDiscount.value
})

const loadExpertDetail = async () => {
  try {
    loading.value = true
    const response = await expertApi.getExpertDetail(expertId.value)
    expert.value = response.data
  } catch (error) {
    console.error('加载大神详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePay = async () => {
  isSubmitting.value = true
  try {
    const response = await orderApi.createOrder({
      expertId: expertId.value,
      serviceTime: `${serviceDate.value} ${serviceTime.value}`,
      duration: serviceDuration.value,
      couponId: selectedCoupon.value?.id,
      remarks: ''
    })
    
    if (response.success || response.code === 0) {
      router.push({
        path: '/payment-success',
        query: {
          expertId: expertId.value,
          amount: totalAmount.value,
          orderId: response.data?.orderId
        }
      })
    } else {
      throw new Error(response.message || response.msg || '创建订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    alert(result.error || '创建订单失败，请重试')
    console.error('创建订单失败:', err)
    isSubmitting.value = false
  }
}

const handleCouponClick = (coupon) => {
  selectedCoupon.value = selectedCoupon.value?.id === coupon.id ? null : coupon
}

onMounted(() => {
  loadExpertDetail()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <nav data-v-3b8a03f8="" class="bg-surface w-full top-0 sticky z-50">
      <div class="flex items-center gap-4">
        <span
          @click="router.back()"
          class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
        >
          arrow_back_ios
        </span>
        <h1 class="font-headline font-bold text-lg text-primary">确认订单</h1>
      </div>
      <div class="w-6"></div>
    </nav>

    <main v-if="loading" class="pt-20 px-5 max-w-2xl mx-auto">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </main>

    <main v-else-if="expert" class="pt-20 px-5 max-w-2xl mx-auto space-y-6">
      <section class="bg-surface-container-lowest rounded-xl p-5 shadow-sm overflow-hidden relative">
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-container">
            <img :alt="expert.nickname" class="w-full h-full object-cover" :src="expert.avatar" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold font-headline text-on-surface">{{ expert.nickname }}</h2>
            <div class="flex gap-2 mt-1">
              <span class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                {{ expert.game }}
              </span>
              <span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                技术陪练
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-surface-container-lowest rounded-xl p-6 space-y-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-xl">schedule</span>
              <span class="text-on-surface-variant font-medium">预约时间</span>
            </div>
            <span class="font-headline font-semibold text-on-surface text-sm">
              {{ serviceDate }} {{ serviceTime }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-xl">timer</span>
              <span class="text-on-surface-variant font-medium">时长</span>
            </div>
            <span class="font-headline font-semibold text-on-surface text-sm">{{ serviceDuration }}小时</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-xl">payments</span>
              <span class="text-on-surface-variant font-medium">单价</span>
            </div>
            <span class="font-headline font-semibold text-on-surface text-sm">¥{{ expert.price }}/小时</span>
          </div>
        </div>

        <div class="h-[1px] bg-surface-container-high w-full"></div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-on-surface-variant">服务费小计</span>
            <span class="font-headline font-bold text-on-surface">¥{{ serviceFee }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-on-surface-variant">平台保障费</span>
            <span class="font-headline font-bold text-on-surface">¥{{ platformFee }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-on-surface-variant">优惠券</span>
              <span v-if="selectedCoupon" class="bg-error/10 text-error text-[10px] px-1.5 py-0.5 rounded border border-error/20">
                {{ selectedCoupon.title }}
              </span>
            </div>
            <span class="font-headline font-bold text-error">-¥{{ couponDiscount }}</span>
          </div>
        </div>
      </section>

      <div class="bg-primary-container/10 p-4 rounded-xl flex gap-3 items-start">
        <span class="material-symbols-outlined text-primary text-lg">verified_user</span>
        <div class="space-y-1">
          <p class="text-xs font-bold text-on-primary-container">平台资金保障</p>
          <p class="text-[10px] text-on-primary-container/70 leading-relaxed">
            您的款项将由平台托管，确认服务完成后再支付给陪玩师。如遇违规行为，可随时发起申诉。
          </p>
        </div>
      </div>

      <div class="bg-surface-container-low rounded-xl p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex flex-col">
            <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">待支付总额</span>
            <div class="flex items-baseline gap-1">
              <span class="text-primary font-bold text-sm">¥</span>
              <span class="text-3xl font-extrabold font-headline text-on-surface">{{ totalAmount }}</span>
            </div>
          </div>
        </div>
        <button
          @click="handlePay"
          :disabled="isSubmitting"
          class="w-full py-4 rounded-full bg-primary-container text-on-primary-container font-headline font-bold shadow-lg shadow-primary-container/30 active:scale-95 transition-all duration-200"
          :class="isSubmitting ? 'opacity-50 cursor-not-allowed' : ''"
        >
          {{ isSubmitting ? '提交中...' : '立即支付' }}
        </button>
      </div>
    </main>
  </div>
</template>
