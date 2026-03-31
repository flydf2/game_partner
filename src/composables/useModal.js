import { ref } from 'vue'

const modals = ref([])
let modalId = 0

const showModal = (options = {}) => {
  const {
    title = '',
    message = '',
    type = 'info',
    confirmText = '确定',
    cancelText = '取消',
    showCancel = false,
    confirmButtonClass = '',
    onConfirm = null,
    onCancel = null
  } = options

  const id = ++modalId

  const modal = {
    id,
    title,
    message,
    type,
    confirmText,
    cancelText,
    showCancel,
    confirmButtonClass,
    visible: true
  }

  modals.value.push(modal)

  return new Promise((resolve) => {
    modal.resolve = resolve
    modal.onConfirm = onConfirm
    modal.onCancel = onCancel
  })
}

const closeModal = (id) => {
  const index = modals.value.findIndex(m => m.id === id)
  if (index !== -1) {
    modals.value.splice(index, 1)
  }
}

const handleConfirm = (id) => {
  const modal = modals.value.find(m => m.id === id)
  if (modal) {
    if (modal.onConfirm) modal.onConfirm()
    modal.resolve && modal.resolve(true)
    closeModal(id)
  }
}

const handleCancel = (id) => {
  const modal = modals.value.find(m => m.id === id)
  if (modal) {
    if (modal.onCancel) modal.onCancel()
    modal.resolve && modal.resolve(false)
    closeModal(id)
  }
}

const handleClose = (id) => {
  closeModal(id)
}

const success = (message, options = {}) => {
  return showModal({ message, type: 'success', ...options })
}

const error = (message, options = {}) => {
  return showModal({ message, type: 'error', ...options })
}

const warning = (message, options = {}) => {
  return showModal({ message, type: 'warning', ...options })
}

const info = (message, options = {}) => {
  return showModal({ message, type: 'info', ...options })
}

const confirm = (message, options = {}) => {
  return showModal({ message, type: 'confirm', showCancel: true, ...options })
}

export function useModal() {
  return {
    modals,
    showModal,
    closeModal,
    handleConfirm,
    handleCancel,
    handleClose,
    success,
    error,
    warning,
    info,
    confirm
  }
}
