<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-[200] flex items-center justify-center"
        @click="handleBackdropClick"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div
          class="relative bg-surface-container-lowest rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all"
          :class="sizeClasses"
          @click.stop
        >
          <div
            v-if="showHeader"
            class="flex items-center justify-between p-5 border-b border-surface-container-high"
          >
            <h3 class="text-lg font-headline font-bold text-on-surface">{{ title }}</h3>
            <button
              v-if="closable"
              class="p-1 text-zinc-400 hover:text-on-surface transition-colors"
              @click="handleClose"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-5">
            <slot></slot>
          </div>

          <div
            v-if="showFooter"
            class="flex items-center justify-end gap-3 p-5 border-t border-surface-container-high"
          >
            <button
              v-if="showCancel"
              class="px-6 py-2.5 bg-surface-container-high text-on-surface-variant rounded-full font-bold text-sm hover:bg-surface-container transition-colors"
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="px-6 py-2.5 bg-primary-container text-on-primary-container rounded-full font-bold text-sm hover:bg-primary-dim transition-colors"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'full'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  closeOnClickBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'confirm', 'cancel'])

const sizeClasses = computed(() => {
  const classes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full'
  }
  return classes[props.size]
})

function handleClose() {
  emit('close')
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  emit('close')
}

function handleBackdropClick() {
  if (props.closeOnClickBackdrop) {
    handleClose()
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from .relative {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to .relative {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-from .absolute,
.modal-leave-to .absolute {
  opacity: 0;
}
</style>
