<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  minDate: {
    type: Date,
    default: () => new Date()
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const showPicker = ref(false)
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth())
const selectedDay = ref(new Date().getDate())
const selectedHour = ref(new Date().getHours())
const selectedMinute = ref(0)

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 10 }, (_, i) => currentYear + i)
})

const months = computed(() => Array.from({ length: 12 }, (_, i) => i + 1))

const days = computed(() => {
  const daysInMonth = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
})

const hours = computed(() => Array.from({ length: 24 }, (_, i) => i))

const minutes = computed(() => Array.from({ length: 60 }, (_, i) => i))

const formattedDate = computed(() => {
  const date = new Date(selectedYear.value, selectedMonth.value - 1, selectedDay.value, selectedHour.value, selectedMinute.value)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
})

const isOpen = computed(() => showPicker.value)

const openPicker = () => {
  showPicker.value = true
}

const closePicker = () => {
  showPicker.value = false
}

const confirm = () => {
  emit('update:modelValue', formattedDate.value)
  emit('change', formattedDate.value)
  showPicker.value = false
}

const cancel = () => {
  showPicker.value = false
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const [datePart, timePart] = newVal.split(' ')
    const [y, m, d] = datePart.split('-').map(Number)
    const [h, min] = timePart.split(':').map(Number)
    selectedYear.value = y
    selectedMonth.value = m
    selectedDay.value = d
    selectedHour.value = h
    selectedMinute.value = min
  }
})
</script>

<template>
  <div class="relative">
    <div @click="openPicker" class="cursor-pointer">
      <slot :date="formattedDate" :open="openPicker">
        <span class="text-on-surface-variant">{{ formattedDate || '待选择' }}</span>
      </slot>
    </div>

    <div v-if="showPicker" class="fixed inset-0 z-[100]" @click.self="closePicker">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
      <div class="absolute bottom-0 left-0 right-0 bg-surface-container-high rounded-t-2xl p-4 animate-slide-up">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-on-surface">选择时间</h3>
          <div class="flex gap-2">
            <button @click="cancel" class="px-4 py-2 text-on-surface-variant hover:bg-surface-container-lowest rounded-full">
              取消
            </button>
            <button @click="confirm" class="px-4 py-2 bg-primary text-on-primary rounded-full font-medium">
              确定
            </button>
          </div>
        </div>

        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <select
            v-model="selectedYear"
            class="px-3 py-2 bg-surface-container-lowest rounded-lg text-on-surface text-center min-w-[80px]"
          >
            <option v-for="year in years" :key="year" :value="year">{{ year }}年</option>
          </select>

          <select
            v-model="selectedMonth"
            class="px-3 py-2 bg-surface-container-lowest rounded-lg text-on-surface text-center min-w-[80px]"
          >
            <option v-for="month in months" :key="month" :value="month">{{ month }}月</option>
          </select>

          <select
            v-model="selectedDay"
            class="px-3 py-2 bg-surface-container-lowest rounded-lg text-on-surface text-center min-w-[80px]"
          >
            <option v-for="day in days" :key="day" :value="day">{{ day }}日</option>
          </select>

          <select
            v-model="selectedHour"
            class="px-3 py-2 bg-surface-container-lowest rounded-lg text-on-surface text-center min-w-[80px]"
          >
            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}时</option>
          </select>

          <select
            v-model="selectedMinute"
            class="px-3 py-2 bg-surface-container-lowest rounded-lg text-on-surface text-center min-w-[80px]"
          >
            <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}分</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
