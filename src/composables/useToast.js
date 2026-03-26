import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const showToast = (message, type = 'success', duration = 3000) => {
    const id = ++toastId
    
    toasts.value.push({
      id,
      message,
      type,
      duration
    })
    
    setTimeout(() => {
      toasts.value = toasts.value.filter(toast => toast.id !== id)
    }, duration)
  }
  
  const success = (message, duration = 3000) => {
    showToast(message, 'success', duration)
  }
  
  const error = (message, duration = 3000) => {
    showToast(message, 'error', duration)
  }
  
  const warning = (message, duration = 3000) => {
    showToast(message, 'warning', duration)
  }
  
  const info = (message, duration = 3000) => {
    showToast(message, 'info', duration)
  }
  
  return {
    showToast,
    success,
    error,
    warning,
    info,
    toasts
  }
}
