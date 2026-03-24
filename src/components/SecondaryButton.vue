<template>
  <button 
    class="bg-surface-container-low text-on-surface px-6 py-3 rounded-full font-bold text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="animate-spin mr-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
    </span>
    <slot></slot>
  </button>
</template>

<script setup>
import { defineEmits } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* 组件样式 */
</style>
