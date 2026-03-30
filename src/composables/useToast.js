import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

const showToast = (message, type = 'success', duration = 3000, buttonText = null, buttonAction = null) => {
  const id = ++toastId
  
  toasts.value.push({
    id,
    message,
    type,
    duration,
    buttonText,
    buttonAction
  })
  
  setTimeout(() => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }, duration)
}

const success = (message, duration = 3000, buttonText = null, buttonAction = null) => {
  showToast(message, 'success', duration, buttonText, buttonAction)
}

const error = (message, duration = 3000, buttonText = null, buttonAction = null) => {
  showToast(message, 'error', duration, buttonText, buttonAction)
}

const warning = (message, duration = 3000, buttonText = null, buttonAction = null) => {
  showToast(message, 'warning', duration, buttonText, buttonAction)
}

const info = (message, duration = 3000, buttonText = null, buttonAction = null) => {
  showToast(message, 'info', duration, buttonText, buttonAction)
}

export function useToast() {
  return {
    showToast,
    success,
    error,
    warning,
    info,
    toasts
  }
}

export const globalToast = {
  showToast,
  success,
  error,
  warning,
  info,
  toasts
}
