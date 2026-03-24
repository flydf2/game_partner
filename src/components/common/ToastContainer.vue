<template>
  <Teleport to="body">
    <div class="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      <Toast
        v-for="toast in toastQueue"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../../composables/useToast.js'
import Toast from './Toast.vue'

const { toastQueue } = useToast()

function removeToast(id) {
  const index = toastQueue.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toastQueue.value.splice(index, 1)
  }
}
</script>
