<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { expertApi, orderApi, handleApiError } from '../api'
import DateTimePicker from '../components/DateTimePicker.vue'
import { useModal } from '../composables/useModal.js'
import AppHeader from '../components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const { warning: showWarning, error: showError } = useModal()

const userId = ref(route.query.userId || '1')
const skillId = ref(route.query.skillId)
const serviceTime = ref(route.query.serviceTime || '')
const quantity = ref(parseInt(route.query.quantity) || 1)

const expert = ref(null)
const loading = ref(true)
const selectedSkill = ref(null)
const isSubmitting = ref(false)

const totalPrice = computed(() => {
  const skillPrice = selectedSkill.value?.price || expert.value?.price || 0
  return skillPrice * quantity.value
})

const loadExpertDetail = async () => {
  try {
    loading.value = true
    const response = await expertApi.getExpertDetail(userId.value)
    expert.value = response.data
    if (response.data.skills && skillId.value) {
      selectedSkill.value = response.data.skills.find(s => s.id === parseInt(skillId.value))
    }
  } catch (error) {
    console.error('加载大神详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePay = async () => {
  if (!serviceTime.value) {
    showWarning('请选择预约时间')
    return
  }
  if (quantity.value < 1) {
    showWarning('数量至少为1')
    return
  }

  isSubmitting.value = true
  try {
    const response = await orderApi.createOrder({
      playmateId: expert.value.id,
      skillId: selectedSkill.value?.id,
      game: expert.value.game || expert.value.title?.split('·')[0] || '',
      skill: selectedSkill.value?.name || '技术陪练',
      serviceTime: serviceTime.value,
      amount: totalPrice.value,
      quantity: quantity.value
    })

    if (response.success || response.code === 0) {
      router.push({
        path: '/payment-success',
        query: {
          userId: userId.value,
          skillId: skillId.value,
          amount: totalPrice.value,
          orderId: response.data?.orderId,
          quantity: quantity.value
        }
      })
    } else {
      throw new Error(response.message || response.msg || '创建订单失败')
    }
  } catch (err) {
    const result = handleApiError(err)
    showError(result.error || '创建订单失败，请重试')
    console.error('创建订单失败:', err)
    isSubmitting.value = false
  }
}

const handleTimeSelect = (time) => {
  serviceTime.value = time
}

onMounted(() => {
  loadExpertDetail()
})

const handleBack = () => {
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
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <AppHeader
      title="确认订单"
      :show-back="true"
      :show-notifications="true"
      :show-search="true"
      :show-avatar="true"
      @back="handleBack"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main v-if="loading" class="page-content">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </main>

    <main v-else-if="expert" class="page-content space-y-6">
      <section class="bg-surface-container-lowest rounded-xl p-5 shadow-sm overflow-hidden relative">
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-container">
            <img :alt="expert.nickname || expert.name" class="w-full h-full object-cover" :src="expert.avatar" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold font-headline text-on-surface">{{ expert.nickname || expert.name }}</h2>
            <div class="flex gap-2 mt-1">
              <span class="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                {{ expert.game || expert.title?.split('·')[0] || '' }}
              </span>
              <span class="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-medium">
                {{ selectedSkill?.name || '技术陪练' }}
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
            <DateTimePicker
              v-model="serviceTime"
              @change="handleTimeSelect"
              class="cursor-pointer"
            >
              <template #default="{ date }">
                <span class="font-headline font-semibold text-on-surface text-sm text-primary">
                  {{ date || '待选择' }}
                </span>
              </template>
            </DateTimePicker>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-xl">payments</span>
              <span class="text-on-surface-variant font-medium">单价</span>
            </div>
            <span class="font-headline font-semibold text-on-surface text-sm">¥{{ selectedSkill?.price || expert.price }}/小时</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-xl">Q</span>
              <span class="text-on-surface-variant font-medium">数量</span>
            </div>
            <div class="flex items-center gap-3">
              <button
                @click="quantity = Math.max(1, quantity - 1)"
                class="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                -
              </button>
              <span class="font-headline font-semibold text-on-surface text-sm w-8 text-center">{{ quantity }}</span>
              <button
                @click="quantity = quantity + 1"
                class="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div class="h-[1px] bg-surface-container-high w-full"></div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-on-surface-variant">服务费</span>
            <span class="font-headline font-bold text-on-surface">¥{{ totalPrice }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-on-surface-variant">平台保障费</span>
            <span class="font-headline font-bold text-on-surface">¥5</span>
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
              <span class="text-3xl font-extrabold font-headline text-on-surface">{{ totalPrice + 5 }}</span>
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
