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
const selectedYear = ref('')
const selectedMonth = ref('')
const selectedDay = ref('')
const selectedHour = ref('')
const selectedMinute = ref('')

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 10 }, (_, i) => currentYear + i)
})

const months = computed(() => Array.from({ length: 12 }, (_, i) => i + 1))

const days = computed(() => {
  const year = parseInt(selectedYear.value)
  const month = parseInt(selectedMonth.value)
  if (!year || !month) return []
  return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1)
})

const hours = computed(() => Array.from({ length: 24 }, (_, i) => i))

const minutes = computed(() => Array.from({ length: 60 }, (_, i) => i))

const formatNumber = (num) => num.toString().padStart(2, '0')

const isOpen = computed(() => {
  return selectedYear.value && 
         selectedMonth.value && 
         selectedDay.value && 
         selectedHour.value && 
         selectedMinute.value
})

const confirm = () => {
  if (!selectedYear.value || !selectedMonth.value || !selectedDay.value || 
      !selectedHour.value || !selectedMinute.value) {
    return
  }
  
  const datetime = `${selectedYear.value}-${formatNumber(selectedMonth.value)}-${formatNumber(selectedDay.value)} ${formatNumber(selectedHour.value)}:${formatNumber(selectedMinute.value)}`
  emit('update:modelValue', datetime)
  emit('change', datetime)
  showPicker.value = false
}

const clear = () => {
  selectedYear.value = ''
  selectedMonth.value = ''
  selectedDay.value = ''
  selectedHour.value = ''
  selectedMinute.value = ''
  emit('update:modelValue', '')
  emit('change', '')
  showPicker.value = false
}

const parseValue = (value) => {
  if (!value) return
  const match = value.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/)
  if (match) {
    selectedYear.value = match[1]
    selectedMonth.value = match[2].replace(/^0/, '') || '1'
    selectedDay.value = match[3].replace(/^0/, '') || '1'
    selectedHour.value = match[4].replace(/^0/, '') || '0'
    selectedMinute.value = match[5].replace(/^0/, '') || '0'
  }
}

watch(() => props.modelValue, (newVal) => {
  parseValue(newVal)
})
</script>

<template>
  <div class="relative">
    <div 
      @click="showPicker = true"
      class="flex items-center justify-between w-full cursor-pointer"
    >
      <span class="text-on-surface-variant font-medium">{{ modelValue || '请选择截止时间' }}</span>
      <span class="material-symbols-outlined text-primary">chevron_right</span>
    </div>

    <div 
      v-if="showPicker"
      class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="showPicker = false"
    >
      <div class="w-full sm:max-w-md bg-surface-container-high rounded-t-2xl sm:rounded-2xl p-4 max-h-[80vh] flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold font-headline text-on-surface">选择截止时间</h3>
          <button 
            @click="showPicker = false"
            class="p-2 rounded-full hover:bg-surface-container-low transition-colors"
          >
            <span class="material-symbols-outlined text-on-surface">close</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4">
          <div class="grid grid-cols-5 gap-2">
            <div v-for="year in years" :key="year" class="space-y-2">
              <div class="text-xs text-on-surface-variant font-medium uppercase tracking-wider">年</div>
              <div 
                v-for="y in [year]" 
                :key="y"
                @click="selectedYear = y"
                class="w-full aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all"
                :class="selectedYear == y ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'"
              >
                {{ y }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div v-for="month in months" :key="month" class="space-y-2">
              <div class="text-xs text-on-surface-variant font-medium uppercase tracking-wider">月</div>
              <div 
                v-for="m in [month]" 
                :key="m"
                @click="selectedMonth = m"
                class="w-full aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all"
                :class="selectedMonth == m ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'"
              >
                {{ m }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-2">
            <div v-for="day in days" :key="day" class="space-y-2">
              <div class="text-xs text-on-surface-variant font-medium uppercase tracking-wider">日</div>
              <div 
                v-for="d in [day]" 
                :key="d"
                @click="selectedDay = d"
                class="w-full aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all"
                :class="selectedDay == d ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'"
              >
                {{ d }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-6 gap-2">
            <div v-for="hour in hours" :key="hour" class="space-y-2">
              <div class="text-xs text-on-surface-variant font-medium uppercase tracking-wider">时</div>
              <div 
                v-for="h in [hour]" 
                :key="h"
                @click="selectedHour = h"
                class="w-full aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all"
                :class="selectedHour == h ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'"
              >
                {{ formatNumber(h) }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-6 gap-2">
            <div v-for="minute in minutes" :key="minute" class="space-y-2">
              <div class="text-xs text-on-surface-variant font-medium uppercase tracking-wider">分</div>
              <div 
                v-for="mi in [minute]" 
                :key="mi"
                @click="selectedMinute = mi"
                class="w-full aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all"
                :class="selectedMinute == mi ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'"
              >
                {{ formatNumber(mi) }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-4 pt-4 border-t border-surface-container-low">
          <button
            @click="clear"
            class="flex-1 py-3 rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            清除
          </button>
          <button
            @click="confirm"
            :disabled="!isOpen"
            class="flex-1 py-3 rounded-xl font-semibold transition-colors"
            :class="isOpen ? 'bg-primary text-on-primary hover:bg-primary-container' : 'bg-surface-container text-on-surface-variant cursor-not-allowed'"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>
