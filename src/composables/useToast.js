import { ref } from 'vue'

const toastQueue = ref([])
let currentToast = null

export function useToast() {
  function show(message, type = 'success', duration = 3000) {
    const toast = {
      id: Date.now(),
      message,
      type,
      duration,
      visible: true
    }

    toastQueue.value.push(toast)

    setTimeout(() => {
      const index = toastQueue.value.findIndex(t => t.id === toast.id)
      if (index !== -1) {
        toastQueue.value.splice(index, 1)
      }
    }, duration)

    return toast
  }

  function success(message, duration) {
    return show(message, 'success', duration)
  }

  function error(message, duration) {
    return show(message, 'error', duration)
  }

  function warning(message, duration) {
    return show(message, 'warning', duration)
  }

  function info(message, duration) {
    return show(message, 'info', duration)
  }

  function clear() {
    toastQueue.value = []
  }

  return {
    toastQueue,
    show,
    success,
    error,
    warning,
    info,
    clear
  }
}
