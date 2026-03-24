<template>
  <div class="relative w-full">
    <input 
      type="text" 
      :placeholder="placeholder" 
      class="w-full px-5 py-3 bg-surface-container-low rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      v-model="modelValue"
    />
    <span class="material-symbols-outlined absolute right-5 top-1/2 transform -translate-y-1/2 text-zinc-400">search</span>
  </div>
</template>

<script setup>
const modelValue = defineModel({
  default: ''
})

defineProps({
  placeholder: {
    type: String,
    default: '搜索'
  }
})
</script>

<style scoped>
/* 组件样式 */
</style>
