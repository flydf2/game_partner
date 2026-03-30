<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  buttonText: {
    type: String,
    default: null
  },
  buttonAction: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)

watch(() => props.show, (newVal) => {
  visible.value = newVal
  if (newVal && props.duration > 0) {
    setTimeout(() => {
      visible.value = false
      emit('close')
    }, props.duration)
  }
})

const handleClose = () => {
  visible.value = false
  emit('close')
}

const getTypeClasses = () => {
  switch (props.type) {
    case 'success':
      return 'bg-primary_container text-on_primary_container'
    case 'error':
      return 'bg-error text-on_error'
    case 'warning':
      return 'bg-tertiary_container text-on_tertiary_container'
    case 'info':
      return 'bg-secondary_container text-on_secondary_container'
    default:
      return 'bg-primary_container text-on_primary_container'
  }
}

const getIcon = () => {
  switch (props.type) {
    case 'success':
      return 'check_circle'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'check_circle'
  }
}
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] flex items-center px-4 py-3 rounded-lg shadow-lg" :class="getTypeClasses()">
      <span class="material-symbols-outlined mr-2">{{ getIcon() }}</span>
      <span class="text-sm font-medium">{{ message }}</span>
      <button v-if="buttonText" @click="buttonAction && buttonAction()" class="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium">
        {{ buttonText }}
      </button>
      <button @click="handleClose" class="ml-3 hover:opacity-80">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
