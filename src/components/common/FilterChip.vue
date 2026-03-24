<template>
  <button
    :class="[
      'px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95',
      active
        ? 'bg-primary-container text-on-primary-container shadow-md'
        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
    ]"
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