<template>
  <header class="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-5 h-16 border-b border-outline-variant/20">
    <div class="flex items-center gap-4">
      <span
        v-if="showBack"
        @click="handleBackClick"
        class="material-symbols-outlined text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95 transition-transform"
      >
        arrow_back_ios
      </span>
      <h1 class="font-headline font-bold text-lg text-primary">{{ title }}</h1>
    </div>
    <div class="flex items-center gap-3">
      <slot name="right-actions" />
      <button
        v-if="showShare"
        class="text-zinc-500 hover:bg-black/5 p-2 rounded-full transition-colors active:scale-95"
        @click="handleShareClick"
      >
        <span class="material-symbols-outlined">share</span>
      </button>
      <button
        v-if="showMore"
        class="text-zinc-500 hover:bg-black/5 p-2 rounded-full transition-colors active:scale-95"
        @click="handleMoreClick"
      >
        <span class="material-symbols-outlined">more_horiz</span>
      </button>
      <button
        v-if="showHelp"
        class="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center active:scale-95"
        @click="handleHelpClick"
      >
        <span class="material-symbols-outlined text-on-primary-container text-sm">help</span>
      </button>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showBack: {
    type: Boolean,
    default: true
  },
  showShare: {
    type: Boolean,
    default: false
  },
  showMore: {
    type: Boolean,
    default: false
  },
  showHelp: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back', 'share', 'more', 'help'])

const handleBackClick = () => {
  emit('back')
}

const handleShareClick = () => {
  emit('share')
}

const handleMoreClick = () => {
  emit('more')
}

const handleHelpClick = () => {
  emit('help')
}
</script>

<style scoped>
</style>
