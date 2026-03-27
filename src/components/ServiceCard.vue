<template>
  <div 
    class="bg-surface-container-lowest p-6 rounded-[1.5rem] flex items-center justify-between group hover:bg-primary-container/5 transition-colors duration-300 cursor-pointer"
    @click="handleClick"
  >
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 bg-secondary-container/30 rounded-2xl flex items-center justify-center">
        <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">{{ service.icon }}</span>
      </div>
      <div>
        <p class="font-bold text-on-surface">{{ service.name }}</p>
        <p class="text-xs text-on-surface-variant">{{ service.description }}</p>
      </div>
    </div>
    <div class="text-right">
      <p class="text-lg font-headline font-bold text-primary">¥{{ service.price }}<span class="text-[10px] font-normal text-on-surface-variant ml-1">/小时</span></p>
      <span 
        class="text-[10px] px-2 py-0.5 rounded-full transition-colors"
        :class="getServiceStatusClass(service.status)"
      >{{ getStatusText(service.status) }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  service: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit'])

const getStatusText = (status) => {
  const statusMap = {
    adjusting: '调整中',
    published: '已发布',
    draft: '草稿'
  }
  return statusMap[status] || status
}

const getServiceStatusClass = (status) => {
  const classMap = {
    adjusting: 'text-primary bg-primary-container/20',
    published: 'text-on-surface-variant bg-surface-container',
    draft: 'text-on-surface-variant bg-surface-container'
  }
  return classMap[status] || 'text-on-surface-variant bg-surface-container'
}

const handleClick = () => {
  emit('edit', props.service)
}
</script>
