<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  confirmButtonClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'confirm', 'cancel'])

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const getTypeClasses = () => {
  switch (props.type) {
    case 'success':
      return { icon: 'check_circle', iconClass: 'text-success', bgClass: 'bg-success/10', borderClass: 'border-success/30' }
    case 'error':
      return { icon: 'error', iconClass: 'text-error', bgClass: 'bg-error/10', borderClass: 'border-error/30' }
    case 'warning':
      return { icon: 'warning', iconClass: 'text-warning', bgClass: 'bg-warning/10', borderClass: 'border-warning/30' }
    case 'info':
      return { icon: 'info', iconClass: 'text-info', bgClass: 'bg-info/10', borderClass: 'border-info/30' }
    case 'confirm':
      return { icon: 'help', iconClass: 'text-primary', bgClass: 'bg-primary/10', borderClass: 'border-primary/30' }
    default:
      return { icon: 'info', iconClass: 'text-info', bgClass: 'bg-info/10', borderClass: 'border-info/30' }
  }
}

const getConfirmButtonClass = () => {
  if (props.confirmButtonClass) return props.confirmButtonClass
  switch (props.type) {
    case 'success':
      return 'bg-success text-white hover:bg-success/90'
    case 'error':
      return 'bg-error text-white hover:bg-error/90'
    case 'warning':
      return 'bg-warning text-white hover:bg-warning/90'
    case 'confirm':
      return 'bg-primary text-white hover:bg-primary/90'
    default:
      return 'bg-primary text-white hover:bg-primary/90'
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="handleClose"></div>
        
        <div class="relative bg-surface rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
          <button @click="handleClose" class="absolute top-4 right-4 text-on-surface/50 hover:text-on-surface transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
          
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" :class="[getTypeClasses().bgClass, getTypeClasses().borderClass]">
              <span class="material-symbols-outlined text-4xl" :class="getTypeClasses().iconClass">
                {{ getTypeClasses().icon }}
              </span>
            </div>
            
            <h3 v-if="title" class="text-lg font-semibold text-on-surface mb-2">{{ title }}</h3>
            
            <p class="text-on-surface/80 text-sm leading-relaxed mb-6">{{ message }}</p>
            
            <div class="flex gap-3 w-full" :class="{ 'justify-center': !showCancel, 'justify-end': showCancel }">
              <button 
                v-if="showCancel" 
                @click="handleCancel"
                class="px-6 py-2.5 rounded-full border border-outline text-on-surface hover:bg-surface/50 transition-colors font-medium"
              >
                {{ cancelText }}
              </button>
              <button 
                @click="handleConfirm"
                class="px-6 py-2.5 rounded-full transition-colors font-medium shadow-sm"
                :class="getConfirmButtonClass()"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
