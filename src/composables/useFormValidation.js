import { ref, reactive } from 'vue'

export const validationRules = {
  required: (message = '此字段为必填项') => (value) => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    if (Array.isArray(value) && value.length === 0) {
      return message
    }
    return true
  },
  
  minLength: (length, message = `最少需要${length}个字符`) => (value) => {
    if (!value) return true
    return value.length >= length || message
  },
  
  maxLength: (length, message = `最多允许${length}个字符`) => (value) => {
    if (!value) return true
    return value.length <= length || message
  },
  
  email: (message = '请输入有效的邮箱地址') => (value) => {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) || message
  },
  
  phone: (message = '请输入有效的手机号') => (value) => {
    if (!value) return true
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(value) || message
  },
  
  number: (message = '请输入数字') => (value) => {
    if (!value) return true
    return !isNaN(value) || message
  },
  
  positive: (message = '请输入正数') => (value) => {
    if (!value) return true
    return Number(value) > 0 || message
  },
  
  integer: (message = '请输入整数') => (value) => {
    if (!value) return true
    return Number.isInteger(Number(value)) || message
  }
}

export function useFormValidation() {
  const errors = reactive({})
  
  function validateField(field, rules, value) {
    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        errors[field] = result
        return false
      }
    }
    clearFieldError(field)
    return true
  }
  
  function validateForm(formData, validationRules) {
    let isValid = true
    
    for (const [field, rules] of Object.entries(validationRules)) {
      const value = formData[field]
      if (!validateField(field, rules, value)) {
        isValid = false
      }
    }
    
    return isValid
  }
  
  function clearFieldError(field) {
    delete errors[field]
  }
  
  function clearAllErrors() {
    Object.keys(errors).forEach(field => {
      delete errors[field]
    })
  }
  
  function hasFieldError(field) {
    return !!errors[field]
  }
  
  function getFieldError(field) {
    return errors[field] || ''
  }
  
  function hasErrors() {
    return Object.keys(errors).length > 0
  }
  
  return {
    errors,
    validateField,
    validateForm,
    clearFieldError,
    clearAllErrors,
    hasFieldError,
    getFieldError,
    hasErrors
  }
}
