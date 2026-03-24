<template>
  <button
    class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-95"
    :class="{
      'bg-primary text-white': active,
      'bg-surface-container text-on-surface-variant hover:bg-surface-container-low': !active
    }"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
/* 组件样式 */
</style>